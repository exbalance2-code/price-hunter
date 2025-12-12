import { searchPassioProducts } from './passio-client';
import { searchAccessTradeProducts } from './accesstrade-client';

export interface LazadaProduct {
    itemId: string;
    name: string;
    price: number;
    imageUrl: string;
    productLink: string;
    salePrice?: number;
    discount?: string;
    sold?: number;
}

export async function searchLazadaProducts(keyword: string, limit: number = 5): Promise<LazadaProduct[]> {
    // TEMPORARILY DISABLED (User Request)
    return [];

    /*
    try {
        // 1. Try Passio First
        console.log(`[Lazada] Searching via Passio for: ${keyword}`);
        const passioItems = await searchPassioProducts(keyword, 50);
        const lazadaItems = passioItems.filter(p => p.platform === 'lazada');

        if (lazadaItems.length > 0) {
            console.log(`[Lazada] Found ${lazadaItems.length} items from Passio.`);
            return lazadaItems.slice(0, limit).map(p => ({
                itemId: p.id,
                name: p.name,
                price: p.salePrice || p.price,
                imageUrl: p.imageUrl,
                productLink: p.affiliateLink,
                salePrice: p.salePrice,
                discount: p.discountDetails,
                sold: 0
            }));
        }

        console.log(`[Lazada] Passio returned 0 Lazada items. Trying AccessTrade fallback...`);

        // 2. AccessTrade Fallback
        const atItems = await searchAccessTradeProducts(keyword, 20);
        if (atItems.length > 0) {
            console.log(`[Lazada] Found ${atItems.length} items from AccessTrade.`);
            return atItems.slice(0, limit).map(p => ({
                itemId: p.id,
                name: p.title,
                price: p.sale_price || p.price,
                imageUrl: p.image_url,
                productLink: p.link,
                salePrice: p.sale_price,
                sold: 0
            }));
        }

    } catch (error: any) {
        console.error('Lazada Search Error:', error.message);
    }

    return [];
    */
}
