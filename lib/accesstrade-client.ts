import crypto from 'crypto';
import axios from 'axios';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

interface AccessTradeProduct {
    id: string;
    title: string;
    price: number;
    image: string;
    link: string;
    merchant: string;
    sold?: number;
}

interface AccessTradeSettings {
    apiUrl: string;
    accessKey: string;
    secretKey: string;
}

interface AccessTradeAuthResponse {
    userUid: string;
    secretKey: string;
    accountId: number;
}

export async function fetchAccessTradeKeys(username: string, password: string): Promise<AccessTradeAuthResponse> {
    try {
        // 1. MD5 Hash Password
        const md5Password = crypto.createHash('md5').update(password).digest('hex');

        // 2. Format: USERNAME + ':' + MD5(PASSWORD)
        const rawSignature = `${username}:${md5Password}`;

        // 3. SHA256 Hash the signature
        const signature = crypto.createHash('sha256').update(rawSignature).digest('hex');

        // 4. Call API
        // Correct Endpoint for Thailand: https://gurkha.accesstrade.in.th/publishers/auth/{username}
        const authUrl = `https://gurkha.accesstrade.in.th/publishers/auth/${username}`;

        console.log(`Authenticating AccessTrade User: ${username} at ${authUrl}`);

        const response = await axios.get(authUrl, {
            headers: {
                'Authorization': signature
            }
        });

        if (response.data) {
            return {
                userUid: response.data.userUid,
                secretKey: response.data.secretKey,
                accountId: response.data.accountId
            };
        }

        throw new Error('No data received from Auth API');

    } catch (error: any) {
        console.error('AccessTrade Auth Failed:', error.message);
        if (error.response) {
            console.error('Auth Response:', error.response.data);
            if (error.response.status === 401) {
                throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        }
        throw error;
    }
}

async function getAccessTradeSettings(): Promise<AccessTradeSettings> {
    let apiUrl = process.env.ACCESSTRADE_API_URL || '';
    let accessKey = process.env.ACCESSTRADE_ACCESS_KEY || '';
    let secretKey = process.env.ACCESSTRADE_SECRET_KEY || '';

    try {
        const settings = await query<any[]>(
            `SELECT setting_key, setting_value, is_encrypted 
             FROM system_settings 
             WHERE setting_key IN ('accesstrade_api_url', 'accesstrade_access_key', 'accesstrade_secret_key')`
        );

        for (const s of settings) {
            const val = s.is_encrypted ? decrypt(s.setting_value) : s.setting_value;
            if (s.setting_key === 'accesstrade_api_url') apiUrl = val;
            if (s.setting_key === 'accesstrade_access_key') accessKey = val;
            if (s.setting_key === 'accesstrade_secret_key') secretKey = val;
        }
    } catch (e) {
        console.warn('Failed to load AccessTrade settings from DB, using env/defaults');
    }

    return { apiUrl, accessKey, secretKey };
}

function base64UrlEncode(str: string): string {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function generateToken(accessKey: string, secretKey: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        sub: accessKey, // "userUid"
        iat: Math.floor(Date.now() / 1000)
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(signatureInput)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function searchAccessTradeProducts(keyword: string, limit: number = 10): Promise<AccessTradeProduct[]> {
    const { apiUrl, accessKey, secretKey } = await getAccessTradeSettings();

    if (!apiUrl || !accessKey) {
        // Only warn if we have a query
        if (keyword) console.warn('AccessTrade settings missing (API URL or Access Key)');
        return [];
    }

    try {
        let headers: Record<string, string> = {
            'X-Accesstrade-User-Type': 'publisher'
        };

        if (secretKey) {
            // Option A: JWT Auth (Requires Secret Key)
            const token = generateToken(accessKey, secretKey);
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Option B: Simple Token Auth (Access Key only)
            // Common for AccessTrade Datafeed/Product API
            headers['Authorization'] = `Token ${accessKey}`;
        }

        const response = await axios.get(apiUrl, {
            headers: headers,
            params: {
                keyword: keyword,
                limit: 50
            }
        });

        const data = response.data;
        const productsRaw = data.data || data.products || (Array.isArray(data) ? data : []);

        const products: AccessTradeProduct[] = [];

        for (const item of productsRaw) {
            // Shopee Exclusion Logic
            const merchant = (item.merchant || item.campaign_name || '').toLowerCase();
            if (merchant.includes('shopee')) {
                continue;
            }

            products.push({
                id: item.id || item.product_id,
                title: item.title || item.name,
                price: parseFloat(item.price || '0'),
                image: item.image || item.image_url,
                link: item.link || item.click_url || item.affiliate_link,
                merchant: merchant
            });

            if (products.length >= limit) break;
        }

        return products;

    } catch (error: any) {
        console.error('AccessTrade Search Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        return [];
    }
}
