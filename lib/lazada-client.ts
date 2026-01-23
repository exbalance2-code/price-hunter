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
    sold?: number; // Lazada API might treat this differently, often "review" count or similar if sold not available
}

async function getLazadaCredentials() {
    let appKey = process.env.LAZADA_APP_KEY || ''; // LiteApp Key
    let appSecret = process.env.LAZADA_APP_SECRET || ''; // LiteApp Secret
    let accessToken = process.env.LAZADA_ACCESS_TOKEN || ''; // User Token

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
    // 1. Sort all parameters (system + application)
    const keys = Object.keys(params).sort();

    // 2. Concatenate keys and values
    let strToSign = apiPath; // In some Lazada SDKs, path is included? Let's check standard Open Platform.
    // Standard V2: concatenated string of Path + key + value...
    // But double check if path is needed. Most docs say:
    // "concatenating the keys and values of all request parameters"
    // Usually: key + value + key + value... 
    // Wait, typical Lazada signature:
    // sort params.
    // string = apiName + key + value + key + value...
    
    // Let's assume standard pattern: API Path + sorted params (key+value).
    
    for (const key of keys) {
        strToSign += key + params[key];
    }

    // 3. HMAC-SHA256
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(strToSign);
    return hmac.digest('hex').toUpperCase();
}

export class LazadaClient {
    
    static async searchProducts(keyword: string, limit: number = 5): Promise<LazadaProduct[]> {
        const { appKey, appSecret, accessToken } = await getLazadaCredentials();

        if (!appKey || !appSecret) {
            console.warn('Missing Lazada App Key or Secret');
            return [];
        }

        const endpoint = '/affiliate/product/search';
        const timestamp = Date.now().toString();

        const params: Record<string, any> = {
            app_key: appKey,
            timestamp: timestamp,
            sign_method: 'sha256',
            keywords: keyword,
            // Lazada specific pagination
            page_no: '1',
            page_size: limit.toString(),
            // Optional: integration with access token if required for specific affiliate context?
            // Usually search is public-ish but needs affiliate privileges.
        };
        
        if (accessToken) {
            // Some endpoints require access_token, some don't. Affiliate usually uses it.
            params['access_token'] = accessToken;
        }

        // Generate Signature
        params['sign'] = signRequest(appSecret, endpoint, params);

        try {
            console.log(`[Lazada] Searching for: ${keyword}`);
            // Note: Axios params serializer might encode differently, so we should build query string manually or be careful if API expects strict encoding.
            // Lazada usually accepts standard query params.
            
            const response = await axios.get(`${LAZADA_API_URL}${endpoint}`, { params });

            // Normalize response
            const data = response.data;
            
            if (data.code !== '0') {
                 console.error('Lazada API Error Code:', data.code, data.message);
                 return [];
            }

            const productsRaw = data.data?.result?.products || []; // Adjust based on actual JSON structure

            return productsRaw.map((item: any) => ({
                itemId: item.itemId || item.product_id, // varies
                name: item.productTitle || item.title,
                price: parseFloat(item.price || item.origPrice || '0'), 
                // Note: item.price might be string.
                imageUrl: item.imageUrl || item.mainImage,
                productLink: item.productUrl || item.itemUrl, 
                // Lazada search might return affiliate link directly?
                // Usually it returns 'itemUrl' (original).
                sold: 0 // Search API rarely returns sold count accurately, maybe 'review' count?
            }));

        } catch (error: any) {
             console.error('Lazada Search API Error:', error.message);
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
            originUrl: originalUrl
        };

        if (accessToken) {
             params['access_token'] = accessToken;
        }

        params['sign'] = signRequest(appSecret, endpoint, params);

        try {
            const response = await axios.get(`${LAZADA_API_URL}${endpoint}`, { params });
            const data = response.data;

            if (data.code === '0' && data.data) {
                // Usually returns 'weblink' (long) and 'shortLink' (short)
                return data.data.shortLink || data.data.weblink || originalUrl;
            } else {
                 console.error('Lazada Link Gen Error:', data.message);
            }
        } catch (e: any) {
            console.error('Lazada Link Gen Failed:', e.message);
        }

        return originalUrl;
    }
}
