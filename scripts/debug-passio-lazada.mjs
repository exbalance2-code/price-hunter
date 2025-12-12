
const TOKEN = 'YEHpTOyiEVrujBupvUZEL';
const ADVERTISER_ID = 'lazada.co.th';
const KEYWORD = 'iphone'; // Generic keyword

const URLS = [
    'https://ga.passio.eco/api/v3/products',
    'http://api.ecotrackings.com/api/v3/products'
];

async function testLazadaSearch() {
    console.log(`🔍 Testing Lazada Search with ID: ${ADVERTISER_ID}`);

    for (const baseUrl of URLS) {
        try {
            const url = new URL(baseUrl);
            url.searchParams.append('token', TOKEN);
            url.searchParams.append('keyword', KEYWORD);
            url.searchParams.append('advertiser_id', ADVERTISER_ID); // The magic key
            url.searchParams.append('limit', '5');

            console.log(`\n➡️ Querying: ${baseUrl}`);
            const response = await fetch(url.toString());

            console.log(`Status: ${response.status}`);
            if (response.ok) {
                const data = await response.json();
                const items = data.data || [];
                console.log(`✅ Found ${items.length} items.`);

                if (items.length > 0) {
                    const first = items[0];
                    console.log("Sample:", {
                        name: first.product_name,
                        link: first.product_link,
                        advertiser: first.advertiser_id
                    });
                }
                // No return, check all endpoints
            } else {
                console.log("Failed:", await response.text());
            }
        } catch (e) {
            console.log("Error:", e.message);
        }
    }
}

testLazadaSearch();
