export async function register() {
    // รันเฉพาะบน server side และ production
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const PING_INTERVAL = 10 * 60 * 1000; // 10 นาที
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://price-hunter-bot.onrender.com';

        console.log(`[Keep-Alive] Starting keep-alive service, will ping every 10 minutes`);

        // รอให้ server พร้อมก่อน 30 วินาที
        setTimeout(() => {
            const ping = async () => {
                try {
                    const res = await fetch(`${baseUrl}/api/health`, {
                        method: 'GET',
                        cache: 'no-store',
                    });
                    if (res.ok) {
                        console.log(`[Keep-Alive] Ping successful at ${new Date().toISOString()}`);
                    } else {
                        console.warn(`[Keep-Alive] Ping returned status ${res.status}`);
                    }
                } catch (err) {
                    console.error(`[Keep-Alive] Ping failed:`, err);
                }
            };

            // Ping ทันทีครั้งแรก
            ping();

            // Ping ทุก 10 นาที
            setInterval(ping, PING_INTERVAL);
        }, 30_000);
    }
}
