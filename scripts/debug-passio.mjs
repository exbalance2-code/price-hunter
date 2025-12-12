
import axios from 'axios';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        console.log("Checking .env at:", envPath);
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            console.log("File content length:", content.length);

            content.split('\n').forEach(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return;

                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    let value = match[2].trim();
                    // Remove quotes
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    process.env[key] = value;
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

const API_TOKEN = process.env.PASSIO_API_TOKEN;
const API_URL = process.env.PASSIO_API_URL || 'https://ga.passio.eco/api/v3';

async function test() {
    console.log(`Token: ${API_TOKEN ? 'Found' : 'Missing'}`);

    if (!API_TOKEN) {
        console.error("ABORTING: No token available.");
        // Try to print keys found to debug
        console.log("Keys in process.env:", Object.keys(process.env).filter(k => k.startsWith('PASSIO')));
        return;
    }

    const testKeyword = "iphone";
    console.log(`Searching for "${testKeyword}"...`);

    const paramNames = ['keyword', 'q', 'query', 'search'];

    for (const paramName of paramNames) {
        console.log(`\n--- Testing param: ${paramName} ---`);
        try {
            const params = {
                token: API_TOKEN,
                limit: 5
            };
            params[paramName] = testKeyword;

            const response = await axios.get(`${API_URL}/products`, { params });
            const items = response.data.data || [];
            console.log(`Items found with '${paramName}': ${items.length}`);

            if (items.length > 0) {
                console.log('SUCCESS! Sample:', JSON.stringify({
                    name: items[0].product_name,
                    link: items[0].product_link
                }, null, 2));
                return; // Found it!
            } else {
                console.log('Full Response:', JSON.stringify(response.data));
            }
        } catch (e) {
            console.log(`Failed with ${paramName}: ${e.response ? e.response.status : e.message}`);
        }
    }
}

test();
