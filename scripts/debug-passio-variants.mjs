
const TOKEN = 'YEHpTOyiEVrujBupvUZEL';
const KEYWORD = 'iphone';

const VARIANTS = [
    { id: 'cpuv.lazada.co.th', name: 'Lazada TH KOL' },
    { id: 'shopee.co.th', name: 'Shopee TH (Control)' },
    { id: 'lazada.co.th', name: 'Lazada TH (With Country)', params: { country_code: 'TH' } }
];

async function testVariants() {
    console.log(`🔍 Testing Passio Variants...`);

    for (const v of VARIANTS) {
        try {
            const url = new URL('https://ga.passio.eco/api/v3/products');
            url.searchParams.append('token', TOKEN);
            url.searchParams.append('keyword', KEYWORD);
            url.searchParams.append('advertiser_id', v.id);
            url.searchParams.append('limit', '5');

            if (v.params) {
                Object.keys(v.params).forEach(k => url.searchParams.append(k, v.params[k]));
            }

            console.log(`\n➡️ Testing: ${v.name} (${v.id})`);
            // console.log(url.toString()); // debug

            const response = await fetch(url.toString());
            if (response.ok) {
                const data = await response.json();
                const items = data.data || [];
                console.log(`✅ Items: ${items.length}`);
                if (items.length > 0) {
                    console.log(`SAMPLE: ${items[0].product_name}`);
                }
            } else {
                console.log(`❌ Failed: ${response.status}`);
            }

        } catch (e) {
            console.log("Error:", e.message);
        }
    }
}

testVariants();
