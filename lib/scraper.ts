import puppeteer from 'puppeteer-extra';
import puppeteerCore from 'puppeteer-core';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { KnownDevices } from 'puppeteer';
import chromium from '@sparticuz/chromium';

puppeteer.use(StealthPlugin());

// ==========================================
// 1. ฟังก์ชันค้นหาสินค้า (สำหรับ LINE Bot)
// ==========================================
export async function searchLazadaByPuppeteer(keyword: string) {
  let browser;
  try {
    console.log(`🔍 [Search] บอทกำลังค้นหา: "${keyword}"`);

    // กำหนด options สำหรับ Puppeteer
    const launchOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--single-process',
        '--no-zygote',
        '--window-size=375,812',
        '--disable-blink-features=AutomationControlled'
      ]
    };

    // ถ้าเป็น Production (Render/Serverless) ให้ใช้ Chromium จาก @sparticuz/chromium
    if (process.env.NODE_ENV === 'production') {
      launchOptions.executablePath = await chromium.executablePath();
      launchOptions.args = chromium.args;
      browser = await puppeteerCore.launch(launchOptions);
    } else {
      // Development: ใช้ Puppeteer ปกติ
      browser = await puppeteer.launch(launchOptions);
    }

    'div.Bm3ON',
      '[class*="product"]'
    ];

    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`✅ พบ Selector: ${selector}`);
        selectorFound = true;
        break;
      } catch (e) {
        console.log(`⚠️ ไม่พบ Selector: ${selector}`);
      }
    }

    if (!selectorFound) {
      console.log("❌ ไม่พบ Selector ใดๆ เลย - อาจถูก block หรือหน้าเว็บเปลี่ยน");
    }

    const products = await page.evaluate(() => {
      // ลอง selector หลายแบบ
      let items = document.querySelectorAll('div[data-qa-locator="product-item"]');

      // ถ้าไม่เจอ ลองหา product links แทน
      if (items.length === 0) {
        console.log('⚠️ ไม่เจอ data-qa-locator, ลองหา product links');
        const productLinks = document.querySelectorAll('a[href*="/products/"]');
        // แปลง NodeList เป็น Array และหา parent ที่เป็น product card
        const productCards = Array.from(productLinks).map(link => {
          let parent = link.parentElement;
          while (parent && !parent.className.includes('Bm3ON') && parent.tagName !== 'BODY') {
            parent = parent.parentElement;
          }
          return parent || link.parentElement;
        });
        items = productCards.filter((card, index, self) =>
          card && self.indexOf(card) === index
        ) as any;
      }

      const results = [];

      for (let i = 0; i < Math.min(items.length, 10); i++) {
        const el = items[i];
        const linkEl = el.querySelector('a[href*="/products/"]') || el.querySelector('a');
        const imgEl = el.querySelector('img');

        // หา Title
        let title = '';
        if (imgEl && imgEl.getAttribute('alt')) title = imgEl.getAttribute('alt') || '';

        // หาราคา (Mobile Class)
        let price = 0;
        const priceEl = el.querySelector('.product-card__price-current') || el.querySelector('.product-card__price') || el.querySelector('span.ooOxS');
        const priceText = priceEl ? priceEl.textContent || '' : el.textContent || '';

        const priceMatch = priceText.match(/([0-9,]+(\.[0-9]+)?)/);
        if (priceMatch) {
          price = parseFloat(priceMatch[1].replace(/,/g, ''));
        }

        // หาจำนวนที่ขายแล้ว (Mobile Class)
        let soldCount = 0;
        const soldEl = el.querySelector('.product-card__itemsold') || el.querySelector('span._1cEkb');
        if (soldEl) {
          let soldText = soldEl.textContent || '';
          soldText = soldText.replace(/·/g, '').trim();

          let multiplier = 1;
          if (soldText.includes('พัน') || soldText.toLowerCase().includes('k')) multiplier = 1000;
          if (soldText.includes('หมื่น')) multiplier = 10000;

          const soldMatch = soldText.match(/([0-9,]+(\.[0-9]+)?)/);
          if (soldMatch) {
            soldCount = parseFloat(soldMatch[1].replace(/,/g, '')) * multiplier;
          }
        }

        // Logic กรองรูปภาพ
        let image = '';
        if (imgEl) {
          const candidates = [
            imgEl.getAttribute('data-original'),
            imgEl.getAttribute('data-src'),
            imgEl.getAttribute('src')
          ];

          for (let src of candidates) {
            if (!src) continue;

            if (src.includes('base64') || src.includes('.gif') || src.includes('placeholder') || src.includes('assets/')) {
              continue;
            }

            if (src.startsWith('//')) {
              src = `https:${src}`;
            }

            if (src.startsWith('http')) {
              image = src;
              break;
            }
          }
        }

        if (!image) {
          image = 'https://placehold.co/400x400.png?text=Product+Image';
        }

        // กรองสินค้า: ต้องมีราคา มีรูป และมียอดขาย
        if (title && linkEl && price > 0 && soldCount > 0) {
          let link = linkEl.getAttribute('href') || '';
          if (!link.startsWith('http')) link = `https://www.lazada.co.th${link}`;

          results.push({
            title: title,
            price: price,
            image: image,
            link: link,
            sold: soldCount
          });
        }
      }
      return results;
    });

    await browser.close();

    console.log(`✅ เจอสินค้าทั้งหมด ${products.length} ชิ้น (ส่งกลับ 10)`);
    return products.slice(0, 10);

  } catch (error) {
    if (browser) await browser.close();
    console.error("Search Error:", error);
    return [];
  }
}