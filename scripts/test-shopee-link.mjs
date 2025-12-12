
import axios from 'axios';
import crypto from 'crypto';

const APP_ID = process.env.SHOPEE_APP_ID || '';
const API_SECRET = process.env.SHOPEE_API_SECRET || '';
const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.co.th/graphql';

if (!APP_ID || !API_SECRET) {
    console.error('Please set SHOPEE_APP_ID and SHOPEE_API_SECRET env vars');
    process.exit(1);
}

async function generateLink(url) {
    const timestamp = Math.floor(Date.now() / 1000);
    const mutation = `
    mutation {
        generateShortLink(
            input: {
                originUrl: "${url}"
            }
        ) {
            shortLink
        }
    }
    `;

    const payload = { query: mutation };
    const payloadString = JSON.stringify(payload);

    // Capitalized headers as verified previously
    const signature = crypto.createHash('sha256')
        .update(APP_ID + timestamp + payloadString + API_SECRET)
        .digest('hex');

    console.log(`Generating link for: ${url}`);

    try {
        const response = await axios.post(SHOPEE_API_URL, payloadString, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SHA256 Credential=${APP_ID}, Timestamp=${timestamp}, Signature=${signature}`
            },
            timeout: 10000
        });

        if (response.data.errors) {
            console.error('GraphQLErrors:', JSON.stringify(response.data.errors, null, 2));
        } else {
            console.log('✅ Short Link:', response.data.data.generateShortLink.shortLink);
        }
    } catch (e) {
        console.error('API Error:', e.response?.data || e.message);
    }
}

// Test with a sample Shopee product URL
generateLink('https://shopee.co.th/product/1228683233/47502457907');
