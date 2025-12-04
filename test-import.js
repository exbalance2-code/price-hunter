const LazadaAPI = require('lazada-api');
console.log('Type of LazadaAPI:', typeof LazadaAPI);
console.log('LazadaAPI exports:', LazadaAPI);

try {
    const client = new LazadaAPI('test', 'test', 'THAILAND');
    console.log('Client created successfully');
    console.log('Client methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
    console.log('Client properties:', Object.keys(client));
    console.log('Type of client.call:', typeof client.call);

    if (client.client) {
        console.log('client.client type:', typeof client.client);
        console.log('client.client properties:', Object.keys(client.client));
        console.log('client.client prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(client.client)));
    }

    if (client.gateway) {
        console.log('client.gateway type:', typeof client.gateway);
        console.log('client.gateway properties:', Object.keys(client.gateway));
        console.log('client.gateway prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(client.gateway)));
    }

    // Test setting access token
    if (typeof client.accessToken === 'function') {
        try {
            client.accessToken('test-token');
            console.log('Access token set via function');
        } catch (e) {
            console.log('Error setting access token:', e.message);
        }
    }
} catch (e) {
    console.error('Instantiation error:', e);
}
