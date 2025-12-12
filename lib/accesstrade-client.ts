
import { query } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import axios from 'axios';

const DEFAULT_API_URL = 'https://api.accesstrade.in.th/v1/products';
// Note: Official endpoint might be different, commonly /v1/product_search or /products
// We will try multiple if one fails? No, keep simple.

export interface AccessTradeProduct {
    id: string;
    title: string;
    price: number;
    image_url: string;
    link: string;
    merchant: string;
    sale_price?: number;
    discount?: string;
}

export async function searchAccessTradeProducts(keyword: string, limit: number = 5): Promise<AccessTradeProduct[]> {
    let accessKey = process.env.ACCESSTRADE_ACCESS_KEY || process.env.ACCESSTRADE_KEY || '';
    let apiUrl = process.env.ACCESSTRADE_API_URL || DEFAULT_API_URL;

    // Debug: Check which source has the key
    // console.log(`[AT Debug] ENV Key found: ${!!accessKey}`);

    // Fetch from DB
    if (!accessKey) {
        try {
            const settings = await query<any[]>(
                "SELECT setting_key, setting_value, is_encrypted FROM system_settings WHERE setting_key IN ('accesstrade_access_key', 'accesstrade_api_url')"
            );
            for (const row of settings) {
                const value = row.is_encrypted ? decrypt(row.setting_value) : row.setting_value;
                if (row.setting_key === 'accesstrade_access_key') accessKey = value;
                if (row.setting_key === 'accesstrade_api_url' && value) apiUrl = value;
            }
        } catch (e) {
            console.warn('DB Error fetching AccessTrade settings:', e);
        }
    }

    if (!accessKey) {
        console.warn('⚠️ AccessTrade Key missing.');
        return [];
    }

    try {
        console.log(`[AccessTrade] Searching for: "${keyword}" at ${apiUrl}`);

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Key ${accessKey.trim()}`,
                'Access-Key': accessKey.trim() // Try both convention
            },
            params: {
                keyword: keyword,
                limit: 20 // Fetch more to filter
            },
            timeout: 8000
        });

        // Debug Log
        // console.log('[AccessTrade Debug] Response:', JSON.stringify(response.data).substring(0, 200));

        const data = response.data;
        const items = data.data || data.products || []; // Adjust based on actual response

        if (!Array.isArray(items)) {
            console.warn('[AccessTrade] Unexpected response format (items not array).');
            return [];
        }

        console.log(`[AccessTrade] Found ${items.length} raw items.`);

        return items.map((item: any) => ({
            id: item.id || item.product_id,
            title: item.title || item.name,
            price: parseFloat(item.price || '0'),
            image_url: item.image || item.image_url,
            link: item.link || item.url || item.click_url,
            merchant: (item.merchant || item.campaign_name || '').toLowerCase(),
            sale_price: item.sale_price ? parseFloat(item.sale_price) : undefined
        })).filter((p: any) => p.merchant.includes('lazada')); // Filter Lazada only

    } catch (error: any) {
        console.error('AccessTrade Search Error:', error.response?.status, error.message);
        return [];
    }
}
