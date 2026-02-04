
// Run this script to verify your Lazada Access Token locally
// Usage: npx tsx scripts/verify-lazada-token.ts

import axios from 'axios';
import crypto from 'crypto';

// --- CONFIGURATION ---
// --- CONFIGURATION ---
const APP_KEY = '105827';
const APP_SECRET = 'r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF';
const ACCESS_TOKEN = 'b872976cbf2a49b9b3c2579399aa96ac'; 
// ---------------------

const GATEWAYS = [
    { region: 'TH', url: 'https://api.lazada.co.th/rest' },
    { region: 'SG', url: 'https://api.lazada.sg/rest' },
    { region: 'MY', url: 'https://api.lazada.com.my/rest' },
    { region: 'VN', url: 'https://api.lazada.vn/rest' },
    { region: 'PH', url: 'https://api.lazada.com.ph/rest' },
    { region: 'ID', url: 'https://api.lazada.co.id/rest' },
    { region: 'Global', url: 'https://api.lazada.com/rest' },
];

function signRequest(secret: string, apiPath: string, params: Record<string, any>): string {
    const keys = Object.keys(params).sort();
    let strToSign = apiPath;
    for (const key of keys) {
        strToSign += key + params[key];
    }
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(strToSign);
    return hmac.digest('hex').toUpperCase();
}

async function testToken() {
    console.log('--- Testing Lazada Access Token on ALL Gateways ---');
    console.log(`App Key: ${APP_KEY}`);
    console.log(`Token: ${ACCESS_TOKEN.substring(0, 10)}...`);

    const endpoint = '/marketing/product/feed'; 
    const timestamp = (Math.floor(Date.now() / 1000)).toString() + '000';

    const params: Record<string, any> = {
        app_key: APP_KEY,
        timestamp: timestamp,
        sign_method: 'sha256',
        offerType: '1', 
        page: '1',      
        limit: '1', // Just need 1 item to prove success
        userToken: ACCESS_TOKEN,
        access_token: ACCESS_TOKEN
    };

    // Note: Signature *might* be different if endpoint URL changes? 
    // No, signature uses apiPath (e.g. /marketing/product/feed) not the full domain.
    // So we can reuse the same signature for all gateways if the parameters are the same.
    const signature = signRequest(APP_SECRET, endpoint, params);
    params['sign'] = signature;

    for (const gateway of GATEWAYS) {
        try {
            console.log(`\nTesting Region [${gateway.region}]: ${gateway.url}`);
            const response = await axios.post(`${gateway.url}${endpoint}`, null, { params });
            
            if (response.data.code === '0') {
                console.log(`✅ SUCCESS! Token is valid for Region: ${gateway.region}`);
                console.log('Use this URL in your .env or code!');
                return; // Stop after finding the working one
            } else {
                console.log(`❌ Failed (${response.data.code}): ${response.data.message}`);
                if (response.data.code === 'IllegalAccessToken') {
                     // specific error, confirmed gateway is reachable but token invalid for it
                }
            }

        } catch (error: any) {
            console.error(`❌ Error connecting to ${gateway.region}:`, error.message);
        }
    }
    
    console.log('\n❌ Token failed on ALL gateways. Please regenerate token or check App Key/Secret compatibility.');
}

testToken();
