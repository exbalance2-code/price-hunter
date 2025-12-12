
import axios from 'axios';
import crypto from 'crypto';
import { query } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.co.th/graphql';

// Interface for Product result
export interface ShopeeProduct {
    itemId: string;
    name: string;
    price: number;
    imageUrl: string;
    productLink: string;
    salePrice?: number;
    discount?: string;
    sold?: number;
}

async function getShopeeCredentials() {
    let appId = process.env.SHOPEE_APP_ID || '';
    let apiSecret = process.env.SHOPEE_API_SECRET || '';

    if (!appId || !apiSecret) {
        try {
            const settings = await query<any[]>(
                "SELECT setting_key, setting_value, is_encrypted FROM system_settings WHERE setting_key IN ('shopee_app_id', 'shopee_api_secret')"
            );
            for (const row of settings) {
                const val = row.is_encrypted ? decrypt(row.setting_value) : row.setting_value;
                if (row.setting_key === 'shopee_app_id') appId = val;
                if (row.setting_key === 'shopee_api_secret') apiSecret = val;
            }
        } catch (e) {
            console.warn('Failed to fetch Shopee creds from DB', e);
        }
    }
    return { appId, apiSecret };
}

async function callShopeeApi(payloadObj: any, appId: string, apiSecret: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const payloadString = JSON.stringify(payloadObj);

    // Signature Generation: SHA256(appId + timestamp + payload + secret)
    const signature = crypto.createHash('sha256')
        .update(appId + timestamp + payloadString + apiSecret)
        .digest('hex');

    const response = await axios.post(SHOPEE_API_URL, payloadString, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`
        },
        timeout: 10000
    });

    return response.data;
}

export async function generateShopeeLink(originalUrl: string): Promise<string> {
    const { appId, apiSecret } = await getShopeeCredentials();
    if (!appId || !apiSecret) return originalUrl;

    const mutation = `
    mutation {
        generateShortLink(
            input: {
                originUrl: "${originalUrl}"
            }
        ) {
            shortLink
        }
    }
    `;

    try {
        const data = await callShopeeApi({ query: mutation }, appId, apiSecret);
        if (data.data?.generateShortLink?.shortLink) {
            return data.data.generateShortLink.shortLink;
        }
    } catch (e) {
        console.error('Failed to generate Shopee link:', e);
    }

    return originalUrl;
}

export async function searchShopeeProducts(keyword: string, limit: number = 5): Promise<ShopeeProduct[]> {
    const { appId, apiSecret } = await getShopeeCredentials();

    if (!appId || !apiSecret) {
        console.warn('Missing Shopee App ID or Secret');
        return [];
    }

    // GraphQL Query for searching products
    const queryPayload = `
    query {
        productOfferV2(
            keyword: "${keyword}",
            limit: ${limit},
            sortType: 2 // 1=Relevance, 2=Top Sales (based on testing)
        ) {
            nodes {
                itemId
                productName
                price
                imageUrl
                productLink
                priceMin
                priceMax
                sales
                commissionRate
            }
        }
    }
    `;

    try {
        console.log(`[Shopee] Searching for: ${keyword}`);
        const data = await callShopeeApi({ query: queryPayload }, appId, apiSecret);

        if (data.errors) {
            console.error('Shopee API GraphQLErrors:', data.errors);
            return [];
        }

        const nodes = data.data?.productOfferV2?.nodes || [];

        // Map initial results
        const products = nodes.map((item: any) => ({
            itemId: item.itemId,
            name: item.productName,
            price: item.price || item.priceMin || 0,
            imageUrl: item.imageUrl,
            productLink: item.productLink,
            sold: item.sales || 0
        }));

        // Convert to Affiliate Links (Parallel)
        const productsWithAffiliateLinks = await Promise.all(products.map(async (p: any) => {
            const affiliateLink = await generateShopeeLink(p.productLink);
            return { ...p, productLink: affiliateLink };
        }));

        return productsWithAffiliateLinks;

    } catch (error: any) {
        console.error('Shopee API Error:', error.response?.data || error.message);
        return [];
    }
}
