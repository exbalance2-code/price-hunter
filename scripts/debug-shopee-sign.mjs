
import axios from 'axios';
import crypto from 'crypto';

const APP_ID = '15346260001';
const SECRET = '4UOLKH6W65OP4MN5U5XWLX5XAWALBIUI';
const URL_TH = 'https://open-api.affiliate.shopee.co.th/graphql';
const URL_COM = 'https://open-api.affiliate.shopee.com/graphql';

async function testVariant(name, url, payload, sigGenerator) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = sigGenerator(payload, timestamp);

    console.log(`\n--- Testing ${name} ---`);
    console.log(`URL: ${url}`);
    console.log(`Sig: ${signature}`);

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SHA256 Credential=${APP_ID}, Timestamp=${timestamp}, Signature=${signature}`
            },
            timeout: 5000
        });
        console.log('✅ RESPONSE:', JSON.stringify(response.data).substring(0, 100));
        return true;
    } catch (e) {
        console.log('❌ ERROR:', e.response?.data || e.message);
        return false;
    }
}

async function run() {
    const query = `query { productOfferV2(keyword: "iphone", limit: 1) { nodes { itemId } } }`;
    const bodyObj = { query };
    const bodyStr = JSON.stringify(bodyObj);

    // Variation 1 from Standard
    await testVariant('V1: Standard (TH)', URL_TH, bodyStr, (p, t) => {
        return crypto.createHash('sha256').update(APP_ID + t + p + SECRET).digest('hex');
    });

    // Variation 9: Uppercase
    await testVariant('V9: Uppercase (TH)', URL_TH, bodyStr, (p, t) => {
        return crypto.createHash('sha256').update(APP_ID + t + p + SECRET).digest('hex').toUpperCase();
    });

    // Variation 10: Base64
    await testVariant('V10: Base64 (TH)', URL_TH, bodyStr, (p, t) => {
        return crypto.createHash('sha256').update(APP_ID + t + p + SECRET).digest('base64');
    });
}

run();
