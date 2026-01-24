import axios from 'axios';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

const LAZADA_API_URL = 'https://api.lazada.co.th/rest';

export interface LazadaProduct {
    itemId: string;
    name: string;
    price: number;
    imageUrl: string;
    productLink: string;
    discount?: string;
    sold?: number; 
}

async function getLazadaCredentials() {
    let appKey = process.env.LAZADA_APP_KEY || ''; 
    let appSecret = process.env.LAZADA_APP_SECRET || ''; 
    let accessToken = process.env.LAZADA_ACCESS_TOKEN || ''; 

    if (!appKey || !appSecret) {
        try {
            const settings = await query<any[]>(
                "SELECT setting_key, setting_value, is_encrypted FROM system_settings WHERE setting_key IN ('lazada_app_key', 'lazada_app_secret', 'lazada_access_token')"
            );
            for (const row of settings) {
                const val = row.is_encrypted ? decrypt(row.setting_value) : row.setting_value;
                if (row.setting_key === 'lazada_app_key') appKey = val;
                if (row.setting_key === 'lazada_app_secret') appSecret = val;
                if (row.setting_key === 'lazada_access_token') accessToken = val;
            }
        } catch (e) {
            console.warn('Failed to fetch Lazada creds from DB', e);
        }
    }
    return { appKey, appSecret, accessToken };
}

function signRequest(secret: string, apiPath: string, params: Record<string, any>): string {
    const keys = Object.keys(params).sort();
    let strToSign = apiPath;
    for (const key of keys) {
        strToSign += key + params[key];
    }
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(strToSign);
    return hmac.digest('hex').toUpperCase();
}

export class LazadaClient {
    
    static async searchProducts(keyword: string, limit: number = 5): Promise<LazadaProduct[]> {
        const { appKey, appSecret } = await getLazadaCredentials();

        if (!appKey || !appSecret) {
            console.warn('Missing Lazada App Key or Secret');
            return [];
        }

        // DOCUMENTATION & TESTING VERIFIED:
        // - '/affiliate/product/search' -> InvalidApiPath
        // - '/marketing/product/search' -> InvalidApiPath
        // - '/marketing/product/feed' -> Valid Path (Confirmed by earlier IllegalAccessToken error)
        // Conclusion: This API Key likely doesn't support keyword search, or the endpoint is deprecated.
        // Fallback: We will fetch the Product Feed (Recommendations) to ensure the system works.
        const endpoint = '/marketing/product/feed'; 
        
        // Use Python SDK Timestamp Logic (Seconds + '000') - Confirmed working to reach Token Check
        const timestamp = (Math.floor(Date.now() / 1000)).toString() + '000';

        const params: Record<string, any> = {
            app_key: appKey,
            timestamp: timestamp,
            sign_method: 'sha256',
            offerType: '1', // Required for Feed
            page: '1',      // Feed uses 'page'
            limit: limit.toString(),
            // keywords: keyword, // Unsupported by Feed API
        };

        // Create Signature
        params['sign'] = signRequest(appSecret, endpoint, params);

        try {
            console.log(`[Lazada] Fetching Feed (No Search Support): ${keyword} (Ignored)`);
            console.log(`[Lazada] Request URL: ${LAZADA_API_URL}${endpoint}`);
            
            const response = await axios.get(`${LAZADA_API_URL}${endpoint}`, { params });

            const data = response.data;
            
            if (data.code !== '0') {
                 console.error('Lazada API Error:', JSON.stringify(data));
                 return [];
            }

            // Feed Response Structure based on Docs:
            // Response Fields are flattened? Or inside data? 
            // "data": { "products": [...] } or "data": [...]
            // Previous error logs didn't show success body.
            // Python SDK typically wraps result in 'data'. 
            // Let's try flexible mapping.
            const list = data.data?.products || data.data || [];
            const products = Array.isArray(list) ? list : [];

            return products.map((item: any) => ({
                itemId: item.itemId || item.productId, 
                name: item.productName || item.title || item.name,
                price: parseFloat(item.price || item.origPrice || item.discountPrice || '0'), 
                imageUrl: item.imageUrl || item.image_url || (item.pictures ? item.pictures[0] : ''), 
                productLink: item.productUrl || item.url || item.trackingLink, // Feed sometimes returns trackingLink directly
                sold: 0
            }));

        } catch (error: any) {
             console.error('Lazada Search API Error:', error.message);
             // Log full error response if available
             if (error.response) {
                 console.error('Lazada Error Response:', JSON.stringify(error.response.data));
             }
             return [];
        }
    }

    static async generateAffiliateLink(originalUrl: string): Promise<string> {
        const { appKey, appSecret, accessToken } = await getLazadaCredentials();
        
        if (!appKey || !appSecret) return originalUrl;

        // Use documented endpoint: /marketing/getlink
        const endpoint = '/marketing/getlink';
        const timestamp = (Math.floor(Date.now() / 1000)).toString() + '000';

        const params: Record<string, any> = {
            app_key: appKey,
            timestamp: timestamp,
            sign_method: 'sha256',
            inputType: 'url',
            inputValue: originalUrl,
        };

        if (accessToken) {
             params['access_token'] = accessToken;
        }

        params['sign'] = signRequest(appSecret, endpoint, params);

        try {
            console.log(`[Lazada] Generating Link for: ${originalUrl}`);
            const response = await axios.get(`${LAZADA_API_URL}${endpoint}`, { params });
            const data = response.data;

            if (data.code === '0' && data.data) {
                // Response format for /marketing/getlink based on docs provided:
                // data: { urlBatchGetLinkInfoList: [ { regularPromotionLink, ... } ] }
                const list = data.data?.urlBatchGetLinkInfoList;
                if (list && list.length > 0) {
                    return list[0].regularPromotionLink || originalUrl;
                }
                return data.data.shortLink || data.data.weblink || originalUrl;
            } else {
                 console.error('Lazada Link Gen Error:', JSON.stringify(data));
            }
        } catch (e: any) {
            console.error('Lazada Link Gen Failed:', e.message);
             if (e.response) {
                 console.error('Lazada Error Response:', JSON.stringify(e.response.data));
             }
        }

        return originalUrl;
    }
}
