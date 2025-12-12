
const TOKEN = 'YEHpTOyiEVrujBupvUZEL'; // Normal Token
const URLS = [
    'http://api.ecotrackings.com/api/v3/advertisers',
    'https://ga.passio.eco/api/v3/advertisers'
];

async function listAdvertisers() {
    console.log("🔍 Checking available advertisers...");

    for (const baseUrl of URLS) {
        try {
            const url = new URL(baseUrl);
            url.searchParams.append('token', TOKEN);
            url.searchParams.append('limit', '100');

            console.log(`\n➡️ Querying: ${url.toString()}`);
            const response = await fetch(url.toString());

            console.log(`Status: ${response.status}`);
            if (response.ok) {
                const data = await response.json();
                const ads = data.data || [];
                console.log(`✅ Found ${ads.length} advertisers.`);

                // Filter for Lazada or Thai ones
                const thaiAds = ads.filter(a => a.country === 'TH' || a.name.toLowerCase().includes('thailand') || a.id.includes('.th'));
                const lazadaAds = ads.filter(a => a.name.toLowerCase().includes('lazada') || a.id.includes('lazada'));

                console.log("🇹🇭 Thai Advertisers:", thaiAds.map(a => `${a.name} (${a.id})`));
                console.log("🛍️ Lazada Advertisers:", lazadaAds.map(a => `${a.name} (${a.id})`));

                if (lazadaAds.length > 0) {
                    console.log("!!! FOUND LAZADA !!! Use this ID:", lazadaAds[0].id);
                }
                return;
            } else {
                console.log("Failed:", await response.text());
            }
        } catch (e) {
            console.log("Error:", e.message);
        }
    }
}

listAdvertisers();
