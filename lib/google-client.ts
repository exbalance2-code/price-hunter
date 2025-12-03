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
            const results = response.data.items.map((item: any) => {
                // Try to find an image in the pagemap
                let image = 'https://via.placeholder.com/300?text=No+Image';
                if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0) {
                    image = item.pagemap.cse_image[0].src;
                }

                // Extract price
                let price = 0;
                // Try to find price in snippet or title
                const textToSearch = (item.title + " " + item.snippet).toLowerCase();
                const priceMatch = textToSearch.match(/(?:฿|ราคา|price)\s*[:\s]?\s*([0-9,]+(\.[0-9]+)?)/);
                if (priceMatch) {
                    price = parseFloat(priceMatch[1].replace(/,/g, ''));
                }

                // Extract sold count
                let sold = 0;
                const soldMatch = textToSearch.match(/ขายแล้ว\s*([0-9,.]+[kK]?)|([0-9,.]+[kK]?)\s*sold/);
                if (soldMatch) {
                    let soldStr = soldMatch[1] || soldMatch[2];
                    soldStr = soldStr.toLowerCase().replace(/,/g, '');
                    if (soldStr.includes('k')) {
                        sold = parseFloat(soldStr.replace('k', '')) * 1000;
                    } else {
                        sold = parseFloat(soldStr);
                    }
                }

                return {
                    title: item.title.replace(' | Lazada.co.th', '').replace(' - Lazada', '').trim(),
                    price: price,
                    image: image,
                    link: item.link,
                    sold: sold
                };
            });

            // Filter out items with no price
            return results.filter((item: any) => item.price > 0);
        }

        return [];

    } catch (error: any) {
        console.error("Google Search Error:", error.response?.data || error.message);
        return [];
    }
}
