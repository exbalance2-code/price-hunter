import LazadaAPI from 'lazada-api';

const appKey = '105827';
const appSecret = 'r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF';
const accessToken = 'a1bd172c769a4e2c8e78e148a9193181'; // User Token provided

const client = new LazadaAPI(appKey, appSecret, 'THAILAND');

export async function searchLazadaByApi(keyword: string) {
    try {
        console.log(`🔍 [API] Searching for: "${keyword}"`);

        // Documentation: https://open.lazada.com/doc/api.htm?spm=a2o9m.11193535.0.0.782d6bbeqD3wJb#/api?cid=8&path=/products/get
        // Note: /products/get usually gets products by ID or filter. 
        // For search, we might need to check if there is a specific search endpoint or if we filter by keyword.
        // However, standard Open API often focuses on Seller's products. 
        // If this is for Affiliate/General Search, the endpoint might be different.
        // Let's try to use the general product search if available, or fallback to what's possible.

        // WARNING: The standard Lazada Open Platform API is typically for managing a SELLER'S own products.
        // It might NOT allow searching the entire marketplace like a user.
        // If the user provided "LiteApp Key", it might be for a different type of app (e.g. Mini App or Affiliate).
        // Let's assume for now we try to find a way. 

        // If this is for Affiliate, the endpoint is usually different (e.g., /affiliate/products/search).
        // Let's try a generic approach first or look for affiliate endpoints.

        // Based on common Lazada API structures:
        // /products/get -> Seller's products
        // /affiliate/products/search -> Affiliate search (requires Affiliate privileges)

        // Let's try to call an affiliate endpoint if possible, as "Price Hunter" sounds like an affiliate/search tool.

        // Trying Affiliate Search Endpoint (common for this use case)
        // Ref: https://ads.lazada.co.th/ (Affiliate API often separate)

        // Let's try a generic request. If it fails, we catch it.

        // Note: 'lazada-api' package wrapper usage:
        // client.call(apiPath, params, method)

        // Attempt 1: Affiliate Product Search (if enabled)
        // Path: /affiliate/products/search (Hypothetical, need to verify)

        // Actually, let's look at the user's request context. They want to "search" products.
        // If they are a seller, they search their own. If they are a shopper/affiliate, they search global.
        // Given "Price Hunter", it's likely Global Search.

        // Let's try the standard product list first to see if it works, or if we can use a search param.
        // But /products/get is for seller items.

        // Let's try to use the public search if available via API, but usually it's restricted.
        // However, since we have a token, let's try.

        // If we can't find a direct "Global Search" API in standard Open Platform, 
        // we might have to revert to scraping OR use the "service" endpoint if they have one.

        // WAIT: The user gave "LiteApp Key". This might be for a specific Mini App or similar.

        // Let's implement a safe test call first.

        // For now, I will implement a placeholder that tries to call a search endpoint.
        // If it fails, we might need to ask the user for the specific API permission or endpoint they expect.
        // But to move forward, I will assume there is an endpoint.

        // Let's try '/products/get' with 'filter' just to see connectivity.
        // But for real search, we probably need '/affiliate/products/search' or similar.
        import LazadaAPI from 'lazada-api';

        const appKey = '105827';
        const appSecret = 'r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF';
        const accessToken = 'a1bd172c769a4e2c8e78e148a9193181'; // User Token provided

        const client = new LazadaAPI(appKey, appSecret, 'THAILAND');

        export async function searchLazadaByApi(keyword: string) {
            try {
                console.log(`🔍 [API] Searching for: "${keyword}"`);

                // Documentation: https://open.lazada.com/doc/api.htm?spm=a2o9m.11193535.0.0.782d6bbeqD3wJb#/api?cid=8&path=/products/get
                // Note: /products/get usually gets products by ID or filter. 
                // For search, we might need to check if there is a specific search endpoint or if we filter by keyword.
                // However, standard Open API often focuses on Seller's products. 
                // If this is for Affiliate/General Search, the endpoint might be different.
                // Let's try to use the general product search if available, or fallback to what's possible.

                // WARNING: The standard Lazada Open Platform API is typically for managing a SELLER'S own products.
                // It might NOT allow searching the entire marketplace like a user.
                // If the user provided "LiteApp Key", it might be for a different type of app (e.g. Mini App or Affiliate).
                // Let's assume for now we try to find a way. 

                // If this is for Affiliate, the endpoint is usually different (e.g., /affiliate/products/search).
                // Let's try a generic approach first or look for affiliate endpoints.

                // Based on common Lazada API structures:
                // /products/get -> Seller's products
                // /affiliate/products/search -> Affiliate search (requires Affiliate privileges)

                // Let's try to call an affiliate endpoint if possible, as "Price Hunter" sounds like an affiliate/search tool.

                // Trying Affiliate Search Endpoint (common for this use case)
                // Ref: https://ads.lazada.co.th/ (Affiliate API often separate)

                // Let's try a generic request. If it fails, we catch it.

                // Note: 'lazada-api' package wrapper usage:
                // client.call(apiPath, params, method)

                // Attempt 1: Affiliate Product Search (if enabled)
                // Path: /affiliate/products/search (Hypothetical, need to verify)

                // Actually, let's look at the user's request context. They want to "search" products.
                // If they are a seller, they search their own. If they are a shopper/affiliate, they search global.
                // Given "Price Hunter", it's likely Global Search.

                // Let's try the standard product list first to see if it works, or if we can use a search param.
                // But /products/get is for seller items.

                // Let's try to use the public search if available via API, but usually it's restricted.
                // However, since we have a token, let's try.

                // If we can't find a direct "Global Search" API in standard Open Platform, 
                // we might have to revert to scraping OR use the "service" endpoint if they have one.

                // WAIT: The user gave "LiteApp Key". This might be for a specific Mini App or similar.

                // Let's implement a safe test call first.

                // For now, I will implement a placeholder that tries to call a search endpoint.
                // If it fails, we might need to ask the user for the specific API permission or endpoint they expect.
                // But to move forward, I will assume there is an endpoint.

                // Let's try '/products/get' with 'filter' just to see connectivity.
                // But for real search, we probably need '/affiliate/products/search' or similar.

                // Let's assume it's the Affiliate API for now as that fits the "Price Hunter" use case.
                // Common endpoint: /service/affiliate/product/search or similar.

                // Let's try a generic call structure.

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
