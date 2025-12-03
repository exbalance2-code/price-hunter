import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_SEARCH_ENGINE_ID;

export async function searchLazadaByGoogle(keyword: string) {
    try {
        console.log(`🔍 [Google] Searching for: "${keyword}"`);

        if (!GOOGLE_API_KEY || !GOOGLE_CX) {
            console.error("❌ Missing Google API Key or CX");
            return [];
        }

        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: GOOGLE_API_KEY,
                cx: GOOGLE_CX,
                q: `site:lazada.co.th ${keyword}`,
                num: 10
            }
        });

        if (response.data && response.data.items) {
            return response.data.items.map((item: any) => {
                // Try to find an image in the pagemap
                let image = 'https://via.placeholder.com/300?text=No+Image';
                if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0) {
                    image = item.pagemap.cse_image[0].src;
                }

                // Extract price if possible (sometimes in snippet or pagemap)
                // Google results might not always have price, so we default to 0 or try to parse snippet
                let price = 0;
                const priceMatch = item.snippet?.match(/฿([0-9,]+)/);
                if (priceMatch) {
                    price = parseFloat(priceMatch[1].replace(/,/g, ''));
                }

                return {
                    title: item.title.replace(' | Lazada.co.th', '').replace(' - Lazada', ''),
                    price: price, // Google search might not always give price
                    image: image,
                    link: item.link,
                    sold: 0 // Google doesn't show sold count
                };
            });
        }

        return [];

    } catch (error: any) {
        console.error("Google Search Error:", error.response?.data || error.message);
        return [];
    }
}
