import axios from 'axios';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

const LAZADA_API_URL = 'https://api.lazada.co.th/rest';
// const LAZADA_API_URL = 'https://api.lazada.com/rest';

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
    // Logic from Python SDK (lazop/base.py):
    // parameters_str = "%s%s" % (api, str().join('%s%s' % (key, parameters[key]) for key in sort_dict))
    // So it MUST start with apiPath
    
    let strToSign = apiPath;
    
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

        // DOCUMENTATION VERIFICATION:
        // The user docs DO NOT list a '/marketing/product/search' endpoint.
        // They only list '/marketing/product/feed'.
        // We will test this endpoint to verify Authentication & Signature logic works.
        // If this works, it proves we have access, but Lazada simply doesn't offer Search API for affiliates.
        const endpoint = '/marketing/product/feed'; 
        
        // Python SDK behavior: str(int(round(time.time()))) + '000'
        const timestamp = (Math.floor(Date.now() / 1000)).toString() + '000';

        const params: Record<string, any> = {
            app_key: appKey,
            timestamp: timestamp,
            sign_method: 'sha256',
            offerType: '1', // Required by Feed API: 1 - Regular offer
            // keywords: keyword, // Feed API does NOT support keyword search according to docs
            // Lazada specific pagination
            page: '1', // Feed uses 'page' not 'page_no'
            limit: limit.toString(),
        };
        
        if (accessToken) {
            params['access_token'] = accessToken;
        }

        // Generate Signature
        params['sign'] = signRequest(appSecret, endpoint, params);

        try {
            const finalUrl = `${LAZADA_API_URL}${endpoint}`;
            console.log(`[Lazada] Requesting (POST): ${finalUrl}`);
            
            // Lazada API typically expects parameters in the Query String even for POST requests
            const response = await axios.post(finalUrl, null, { params });

            // Normalize response
            const data = response.data;
            
            if (data.code !== '0') {
                 console.error('Lazada API Error:', JSON.stringify(data));
                 // If 'InvalidApiPath', it means search is not supported or path is wrong.
                 return [];
            }

            const productsRaw = data.data || []; // Feed API returns data as a list directly? Or data.data? Docs say Response Fields directly. Usually data:{ ... } or data: [...]
            // Sample response structure based on docs: { data: [ { productId, productName, ... } ] }
            // Let's assume data.data is the array or data is the array.
            
            const list = Array.isArray(data.data) ? data.data : (data.data?.products || []);

            return list.map((item: any) => ({
                itemId: item.itemId || item.productId, 
                name: item.productName || item.title,
                price: parseFloat(item.price || item.origPrice || item.discountPrice || '0'), 
                imageUrl: item.pictures?.[0] || item.imageUrl || item.mainImage, 
                productLink: item.productUrl || item.itemUrl || `https://www.lazada.co.th/products/-i${item.productId}.html`, // Construct URL if missing
                sold: 0
            }));

        } catch (error: any) {
             console.error('Lazada Search API Error:', error.message);
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
            console.log(`[Lazada] Generating Link (POST): ${LAZADA_API_URL}${endpoint}`);
            const response = await axios.post(`${LAZADA_API_URL}${endpoint}`, null, { params });
            const data = response.data;

            if (data.code === '0' && data.data) {
                // Response format for /marketing/getlink (url input)
                // data: { urlBatchGetLinkInfoList: [ { originalUrl, regularPromotionLink, ... } ] }
                // OR might be simpler. Let's check structure.
                // The doc says: "urlBatchGetLinkInfoList": ...
                
                const list = data.data?.urlBatchGetLinkInfoList;
                if (list && list.length > 0) {
                    return list[0].regularPromotionLink || originalUrl;
                }
                
                // Fallback for other response types
                return data.data.shortLink || data.data.weblink || originalUrl;
            } else {
                 console.error('Lazada Link Gen Error:', JSON.stringify(data));
            }
        } catch (e: any) {
            console.error('Lazada Link Gen Failed:', e.message);
        }

        return originalUrl;
    }
}
