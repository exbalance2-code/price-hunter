
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
let hasGoogle = false;

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('GOOGLE_API_KEY') && envContent.includes('GOOGLE_SEARCH_ENGINE_ID')) {
        hasGoogle = true;
    }
} catch (e) {
    console.log('No .env.local');
}

console.log(`Has Google Keys: ${hasGoogle}`);
