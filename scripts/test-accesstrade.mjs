
import fs from 'fs';
import path from 'path';

// Load Env manually
const envPath = path.resolve('.env');
let ACCESSTRADE_KEY = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/ACCESSTRADE_ACCESS_KEY=(.*)/) || envContent.match(/ACCESSTRADE_KEY=(.*)/);
    if (match) {
        ACCESSTRADE_KEY = match[1].trim().replace(/"/g, '');
    }
} catch (e) {
    console.log('Could not read .env.local');
}

if (!ACCESSTRADE_KEY) {
    console.error("❌ No ACCESSTRADE_KEY found in .env.local");
    // Fallback: check process.env if run with env vars
    if (process.env.ACCESSTRADE_KEY) ACCESSTRADE_KEY = process.env.ACCESSTRADE_KEY;
}

if (!ACCESSTRADE_KEY) {
    console.error("Giving up: No Key found.");
    process.exit(1);
}

// Possible endpoints to test
const ENDPOINTS = [
    'https://api.accesstrade.in.th/v1/products?keyword=iphone',
    'https://api.accesstrade.in.th/v1/product_search?keyword=iphone',
    'https://api.accesstrade.in.th/v1/open/products?keyword=iphone'
];

async function testAccessTrade() {
    console.log(`🔑 Testing AccessTrade with Key: ${ACCESSTRADE_KEY.substring(0, 5)}...`);

    for (const url of ENDPOINTS) {
        try {
            console.log(`\n📡 Testing endpoint: ${url}`);
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Key ${ACCESSTRADE_KEY}`,
                    'Access-Key': ACCESSTRADE_KEY
                }
            });

            console.log(`Status: ${response.status}`);
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Success!`);
                console.log('Sample Data:', JSON.stringify(data).substring(0, 200));
                return;
            } else {
                const text = await response.text();
                console.log(`❌ Failed: ${text.substring(0, 100)}`);
            }
        } catch (error) {
            console.log(`❌ Network Error: ${error.message}`);
        }
    }
}

testAccessTrade();
