import { query } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import axios from 'axios';

// Configuration
// Default URL from documentation: https://ga.passio.eco/api/v3
const DEFAULT_API_URL = 'https://ga.passio.eco/api/v3';
const API_TOKEN = process.env.PASSIO_API_TOKEN || '';

export interface PassioProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    affiliateLink: string;
    platform: 'shopee' | 'lazada' | 'tiktok' | 'other';
    salePrice?: number;
    discountDetails?: string;
}

export async function searchPassioProducts(keyword: string, limit: number = 5): Promise<PassioProduct[]> {
    // 1. Try fetching from ENV first
    let token = API_TOKEN;
    let baseUrl = process.env.PASSIO_API_URL || DEFAULT_API_URL;

    // 2. If missing, try fetching from Database (Admin Settings)
    if (!token) {
        try {
            const settings = await query<any[]>(
                "SELECT setting_key, setting_value, is_encrypted FROM system_settings WHERE setting_key IN ('passio_api_token', 'passio_api_url')"
            );

            for (const row of settings) {
                const value = row.is_encrypted ? decrypt(row.setting_value) : row.setting_value;
                if (row.setting_key === 'passio_api_token') token = value;
                if (row.setting_key === 'passio_api_url' && value) baseUrl = value;
            }
        } catch (dbError) {
            console.warn('Failed to fetch Passio settings from DB:', dbError);
        }
    }

    // Sanitize Base URL (Remove trailing slash and /products if present)
    baseUrl = baseUrl.replace(/\/$/, '').replace(/\/products$/, '');

    if (!token) {
        console.warn('⚠️ Passio API Token is missing (checked ENV and DB).');
        return [];
    }

    // Mask token for logging
    const maskedToken = token.substring(0, 5) + '...' + token.substring(token.length - 5);
    console.log(`🔍 [Passio] Searching for: "${keyword}" with token: ${maskedToken} at ${baseUrl}/products`);

    console.log(`🔍 [Passio] Searching for: "${keyword}"`);

    try {
        // Doc: GET https://ga.passio.eco/api/v3/products?token={token}&keyword={keyword}&limit={limit}
        const response = await axios.get(`${baseUrl}/products`, {
            params: {
                token: token,
                limit: 50,
                country_code: 'TH',
                // Try forcing advertiser_id for Lazada TH
            }
        });

        // Response structure: { meta: {...}, data: [...] }
        const items = response.data.data || [];

        if (items.length === 0) {
            console.log('[Passio Debug] API returned 0 items. Full Response:', JSON.stringify(response.data));
        }

        if (!Array.isArray(items)) {
            console.warn('Passio response data is not an array:', items);
            return [];
        }

        // Debug: Log platforms found and why we might filter them
        console.log('[Passio Debug] Raw items count:', items.length);
        if (items.length > 0) {
            const advertisers = [...new Set(items.map((i: any) => i.advertiser_id))];
            console.log('[Passio Debug] Advertisers found:', advertisers.join(', '));

            console.log('[Passio Debug] First item sample:', JSON.stringify({
                advertiser_id: items[0].advertiser_id,
                domain: items[0].domain,
                link: items[0].product_link
            }));
        }

        return items.map((item: any) => ({
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.product_price || '0'),
            imageUrl: item.product_picture || item.product_other_pictures || '',
            // Use tracking_link directly if available, else product_link
            affiliateLink: item.tracking_link || item.product_link,
            platform: identifyPlatform(item.advertiser_id || item.domain || item.product_link || ''),
            salePrice: item.product_discounted ? parseFloat(item.product_discounted) : undefined,
            discountDetails: item.product_discounted_percentage ? `-${item.product_discounted_percentage}%` : undefined
        })).filter(p => p.platform === 'shopee' || p.platform === 'lazada');

    } catch (error: any) {
        console.error('Passio API Error Details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return [];
    }
}

function identifyPlatform(source: string): 'shopee' | 'lazada' | 'tiktok' | 'other' {
    const s = source.toLowerCase();

    // Strict check for Thailand domains
    if (s.includes('shopee.co.th') || (s.includes('shopee') && !s.includes('.vn') && !s.includes('.ph') && !s.includes('.sg') && !s.includes('.my'))) return 'shopee';
    if (s.includes('lazada.co.th') || (s.includes('lazada') && !s.includes('.vn') && !s.includes('.ph') && !s.includes('.sg') && !s.includes('.my'))) return 'lazada';

    // TikTok usually doesn't have country domain in link easily, but accept it if needed (user only asked for Shopee/Lazada)
    // if (s.includes('tiktok')) return 'tiktok';

    return 'other';
}
