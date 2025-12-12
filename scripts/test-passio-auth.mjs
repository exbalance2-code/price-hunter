// Native fetch in Node 18+

const PRIVATE_TOKEN = 'fBYLtGLAKigEjNArjqDAO'; // From user chat
const PUBLIC_TOKEN = 'YEHpTOyiEVrujBupvUZEL'; // From user chat (VN)

const BASE_URL = 'https://ga.passio.eco/api/v3/products';

async function testAuth() {
    console.log("🔍 Testing Passio Private Token Auth...");

    const configs = [
        { name: 'Query Param (Standard)', params: { token: PRIVATE_TOKEN } },
        { name: 'Header: Authorization: Bearer', headers: { 'Authorization': `Bearer ${PRIVATE_TOKEN}` } },
        { name: 'Header: Authorization: Token', headers: { 'Authorization': `Token ${PRIVATE_TOKEN}` } },
        { name: 'Header: x-api-key', headers: { 'x-api-key': PRIVATE_TOKEN } },
        { name: 'Header: token', headers: { 'token': PRIVATE_TOKEN } },
    ];

    for (const config of configs) {
        console.log(`\n➡️ Testing Method: ${config.name}`);
        try {
            const url = new URL(BASE_URL);
            if (config.params) {
                Object.keys(config.params).forEach(key => url.searchParams.append(key, config.params[key]));
            }
            url.searchParams.append('keyword', 'ถุงแกงร้อน');
            url.searchParams.append('country_code', 'TH');

            const response = await fetch(url.toString(), {
                headers: config.headers || {}
            });

            console.log(`Status: ${response.status}`);
            if (response.ok) {
                const data = await response.json();
                console.log("✅ Success!");
                const items = data.data || [];
                if (items.length > 0) {
                    console.log("Sample Item Advertiser:", items[0].advertiser_id);
                    console.log("Sample Item Domain:", items[0].domain);
                } else {
                    console.log("Returned 0 items.");
                }
                return;
            } else {
                console.log(`Failed: ${response.statusText}`);
                const text = await response.text();
                console.log("Response:", text.substring(0, 100));
            }

        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}

testAuth();
