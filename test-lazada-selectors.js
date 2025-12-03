const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--window-size=375,812']
    });

    const page = await browser.newPage();

    // Emulate iPhone
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    await page.setViewport({ width: 375, height: 812 });

    console.log('🔍 Navigating to Lazada...');
    await page.goto('https://www.lazada.co.th/catalog/?q=น้ำปลา&sort=priceasc', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    // Wait a bit for content to load
    await page.waitForTimeout(3000);

    console.log('\n📋 Checking for old selector...');
    const oldSelector = await page.$$('div[data-qa-locator="product-item"]');
    console.log(`Old selector found: ${oldSelector.length} items`);

    console.log('\n🔍 Looking for product links...');
    const productLinks = await page.$$('a[href*="/products/"]');
    console.log(`Product links found: ${productLinks.length} items`);

    if (productLinks.length > 0) {
        console.log('\n📦 Analyzing first product structure...');
        const firstProduct = await page.evaluate(() => {
            const link = document.querySelector('a[href*="/products/"]');
            if (!link) return null;

            const img = link.querySelector('img');
            const parent = link.closest('div');

            return {
                html: link.outerHTML.substring(0, 500),
                parentClasses: parent ? parent.className : 'no parent',
                imgSrc: img ? img.src : 'no image',
                imgAlt: img ? img.alt : 'no alt'
            };
        });
        console.log(JSON.stringify(firstProduct, null, 2));
    }

    console.log('\n🔍 Trying different selectors...');
    const selectors = [
        'div[data-qa-locator="product-item"]',
        'a[href*="/products/"]',
        '.product-card',
        '[class*="product"]',
        'div.Bm3ON'
    ];

    for (const selector of selectors) {
        const elements = await page.$$(selector);
        console.log(`${selector}: ${elements.length} items`);
    }

    console.log('\n✅ Done! Check the browser window.');
    // Keep browser open for manual inspection
    // await browser.close();
})();
