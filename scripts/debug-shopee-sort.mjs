
import axios from 'axios';
import crypto from 'crypto';

const APP_ID = process.env.SHOPEE_APP_ID || '';
const API_SECRET = process.env.SHOPEE_API_SECRET || '';
const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.co.th/graphql';

if (!APP_ID || !API_SECRET) {
    console.error('Please set SHOPEE_APP_ID and SHOPEE_API_SECRET env vars');
    process.exit(1);
}

async function testSort(sortType) {
    const timestamp = Math.floor(Date.now() / 1000);
    const queryPayload = `
    query {
        productOfferV2(
            keyword: "iphone",
            limit: 3,
            sortType: ${sortType}
        ) {
            nodes {
                productName
                sales
                price
            }
        }
    }
    `;

    const requestBody = { query: queryPayload };
    const payloadString = JSON.stringify(requestBody);

    const signature = crypto.createHash('sha256')
        .update(APP_ID + timestamp + payloadString + API_SECRET)
        .digest('hex');

    try {
        const response = await axios.post(SHOPEE_API_URL, payloadString, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SHA256 Credential=${APP_ID}, Timestamp=${timestamp}, Signature=${signature}`
            },
            timeout: 10000
        });

        const nodes = response.data.data?.productOfferV2?.nodes || [];
        console.log(`\n--- SortType: ${sortType} ---`);
        nodes.forEach(n => {
            console.log(`[Sold: ${n.sales}] ${n.productName.substring(0, 30)}...`);
        });

    } catch (e) {
        console.log(`SortType ${sortType} Error:`, e.response?.data || e.message);
    }
}

async function run() {
    // Test common sort types
    // 1: Relevance?
    // 2: Latest?
    // 3: Price Asc?
    // 4: Price Desc?
    // 5: Top Sales?
    await testSort(1);
    await testSort(2);
    await testSort(3);
    await testSort(4);
    await testSort(5);
}

run();
