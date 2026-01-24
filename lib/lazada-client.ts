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

        // Endpoint for Affiliate Search
        const endpoint = '/affiliate/product/search'; 
        const timestamp = Date.now().toString(); 

        const params: Record<string, any> = {
            app_key: appKey,
            timestamp: timestamp,
            sign_method: 'sha256',
            keywords: keyword,   
            page_no: '1',        
            page_size: limit.toString(),
        };

        // Create Signature
        params['sign'] = signRequest(appSecret, endpoint, params);

        try {
            console.log(`[Lazada] Searching: ${keyword}`);
            
            // Log the request for debugging
            console.log(`[Lazada] Request URL: ${LAZADA_API_URL}${endpoint}`);
            
            const response = await axios.get(`${LAZADA_API_URL}${endpoint}`, { params });

            const data = response.data;
            
            if (data.code !== '0') {
                 console.error('Lazada API Error:', JSON.stringify(data));
                 return [];
            }

            const products = data.data?.products || [];

            return products.map((item: any) => ({
                itemId: item.itemId || item.productId, 
                name: item.productName || item.title,
                price: parseFloat(item.price || item.origPrice || '0'), 
                imageUrl: item.imageUrl || item.image_url || (item.images ? item.images[0] : ''), 
                productLink: item.productUrl || item.url, 
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

        const endpoint = '/affiliate/link/generate';
        const timestamp = Date.now().toString();

        const params: Record<string, any> = {
            app_key: appKey,
            timestamp: timestamp,
            sign_method: 'sha256',
            sourceUrl: originalUrl, 
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
