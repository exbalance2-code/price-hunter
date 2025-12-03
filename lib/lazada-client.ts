import LazadaAPI from 'lazada-api';

const appKey = '105827';
const appSecret = 'r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF';
const accessToken = 'a1bd172c769a4e2c8e78e148a9193181'; // User Token provided

const client = new LazadaAPI(appKey, appSecret, 'THAILAND');

export async function searchLazadaByApi(keyword: string) {
    try {
        console.log(`🔍 [API] Searching for: "${keyword}"`);

        // Use the inner client which has the methods
        const api = (client as any).client;

        // Call getProducts
        // We pass access_token explicitly just in case
        const response = await api.getProducts({
            filter: 'live',
            search: keyword,
            access_token: accessToken
        });

        console.log('API Response:', JSON.stringify(response, null, 2));

        // Parse response
        // Response structure from this SDK usually is { data: { products: [...] } } or similar
        if (response && response.data && response.data.products) {
            return response.data.products.map((p: any) => ({
                title: p.attributes.name,
                price: p.skus && p.skus[0] ? p.skus[0].price : 0,
                image: p.images && p.images[0] ? p.images[0] : '',
                link: p.skus && p.skus[0] && p.skus[0].Url ? p.skus[0].Url : `https://www.lazada.co.th/products/-i${p.item_id}.html`,
                sold: 0 // API might not return sold count easily
            }));
        }

        return [];

    } catch (error) {
        console.error("API Search Error:", error);
        return [];
    }
}
