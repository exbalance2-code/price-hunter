const LazadaAPI = require('lazada-api');

const appKey = '105827';
const appSecret = 'r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF';
const accessToken = 'a1bd172c769a4e2c8e78e148a9193181';

const client = new LazadaAPI(appKey, appSecret, 'THAILAND');
client.accessToken = accessToken;

console.log('Type of client.getProducts:', typeof client.getProducts);

try {
    // We expect this to fail with an API error (e.g. signature mismatch or network) 
    // BUT NOT "appKey must be a string" if the proxy works.
    // If the proxy works, it will call the inner function with injected credentials.
    console.log('Calling client.getProducts...');
    client.getProducts({
        filter: 'live',
        search: 'test'
    }).then(res => {
        console.log('Success:', res);
    }).catch(err => {
        console.log('Error:', err.message);
        // If error is about network or API response, then the call signature was correct.
    });
} catch (e) {
    console.log('Exception:', e);
}
