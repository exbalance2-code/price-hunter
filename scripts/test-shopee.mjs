
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// --- Env Loader ---
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return;
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
                }
            });
            console.log("Loaded .env file");
        } else {
            console.log("No .env file found");
        }
    } catch (e) {
        console.error("Failed to load .env:", e.message);
    }
}
loadEnv();

// --- Shopee Logic ---
const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.co.th/graphql';
const APP_ID = process.env.SHOPEE_APP_ID;
const API_SECRET = process.env.SHOPEE_API_SECRET;

async function testShopee() {
    if (!APP_ID || !API_SECRET) {
        console.error("❌ Missing SHOPEE_APP_ID or SHOPEE_API_SECRET in .env");
        return;
    }

    const keyword = process.argv[2] || "iphone";
    const timestamp = Math.floor(Date.now() / 1000);

    // Minimal query
    const queryPayload = `
    query {
        productOfferV2(
            keyword: "${keyword}",
            limit: 5,
            sortType: 1
        ) {
            nodes {
                itemId
                productName
                price
                productLink
            }
        }
    }
    `;

    const requestBody = { query: queryPayload };
    const payloadString = JSON.stringify(requestBody);

    const signature = crypto.createHash('sha256')
        .update(APP_ID + timestamp + payloadString + API_SECRET)
        .digest('hex');

    console.log(`🔍 Testing Shopee for: "${keyword}"`);
    console.log(`URL: ${SHOPEE_API_URL}`);
    console.log(`App ID: ${APP_ID}`);
    // console.log(`Secret: ${API_SECRET}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Signature: ${signature}`);

    try {
        const response = await axios.post(SHOPEE_API_URL, payloadString, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SHA256 Credential=${APP_ID}, Timestamp=${timestamp}, Signature=${signature}`
            },
            timeout: 10000
        });

        const data = response.data;
        if (data.errors) {
            console.error('❌ API Error (GraphQL):', JSON.stringify(data.errors, null, 2));
        } else {
            const nodes = data.data?.productOfferV2?.nodes || [];
            console.log(`✅ Success! Found ${nodes.length} items.`);
            if (nodes.length > 0) {
                console.log('Sample Item:', nodes[0]);
            }
        }

    } catch (error) {
        console.error('❌ Request Failed:', error.response?.data || error.message);
    }
}

testShopee();
