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

    const page = await browser.newPage();
    const iPhone = KnownDevices['iPhone 12 Pro'];
    await page.emulate(iPhone);

    const searchUrl = `https://www.lazada.co.th/catalog/?q=${encodeURIComponent(keyword)}&sort=priceasc`; // เรียงราคาถูกสุด

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    try {
      await page.waitForSelector('div[data-qa-locator="product-item"]', { timeout: 10000 });
    } catch (e) {
      console.log("⚠️ หา Selector ไม่เจอ");
    }

    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('div[data-qa-locator="product-item"]');
      const results = [];

      for (let i = 0; i < Math.min(items.length, 10); i++) { // ลองดึงมาเผื่อ 10 อัน แล้วค่อยคัด
        const el = items[i];
        const linkEl = el.querySelector('a');
        const imgEl = el.querySelector('img');

        // หา Title
        let title = '';
        if (imgEl && imgEl.getAttribute('alt')) title = imgEl.getAttribute('alt') || '';

        // หาราคา (Mobile Class)
        let price = 0;
        // Mobile uses 'product-card__price-current' or 'product-card__price'
        const priceEl = el.querySelector('.product-card__price-current') || el.querySelector('.product-card__price') || el.querySelector('span.ooOxS');
        const priceText = priceEl ? priceEl.textContent || '' : el.textContent || '';

        const priceMatch = priceText.match(/([0-9,]+(\.[0-9]+)?)/);
        if (priceMatch) {
          price = parseFloat(priceMatch[1].replace(/,/g, ''));
        }

        // หาจำนวนที่ขายแล้ว (Mobile Class)
        let soldCount = 0;
        // Mobile uses 'product-card__itemsold'
        const soldEl = el.querySelector('.product-card__itemsold') || el.querySelector('span._1cEkb');
        if (soldEl) {
          let soldText = soldEl.textContent || '';
          // Mobile format: "·4.1K ชิ้น" -> Remove "·"
          soldText = soldText.replace(/·/g, '').trim();

          // แปลง "1.2พัน ชิ้น" -> 1200, "500 ชิ้น" -> 500
          let multiplier = 1;
          if (soldText.includes('พัน') || soldText.toLowerCase().includes('k')) multiplier = 1000;
          if (soldText.includes('หมื่น')) multiplier = 10000;

          const soldMatch = soldText.match(/([0-9,]+(\.[0-9]+)?)/);
          if (soldMatch) {
            soldCount = parseFloat(soldMatch[1].replace(/,/g, '')) * multiplier;
          }
        }

        // 🔥 Logic กรองรูปภาพใหม่ (ให้ชัวร์ที่สุด)
        let image = '';
        if (imgEl) {
          // Lazada มักใช้ data-original หรือ data-src สำหรับรูปจริง (Lazy Load)
          const candidates = [
            imgEl.getAttribute('data-original'),
            imgEl.getAttribute('data-src'),
            imgEl.getAttribute('src')
          ];

          for (let src of candidates) {
            if (!src) continue;

            // กรองรูปที่ไม่ใช่รูปสินค้า
            if (src.includes('base64') || src.includes('.gif') || src.includes('placeholder') || src.includes('assets/')) {
              continue;
            }

            // จัดการ URL
            if (src.startsWith('//')) {
              src = `https:${src}`;
            }

            // ถ้าเป็น URL เต็มรูปแบบแล้ว ให้ใช้เลย
            if (src.startsWith('http')) {
              image = src;
              break;
            }
          }
        }

        // ถ้าไม่มีรูป ให้ใช้รูป Placeholder ชัวร์ๆ
        if (!image) {
          image = 'https://placehold.co/400x400.png?text=Product+Image';
        }

        // กรองสินค้า: ต้องมีราคา, มีรูป, และมียอดขาย (เพื่อความน่าเชื่อถือ)
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

    // คัดมา 10 อันแรก (เผื่อไว้ให้ route.ts ไป sort รวมกับ Shopee)
    console.log(`✅ เจอสินค้าทั้งหมด ${products.length} ชิ้น (ส่งกลับ 10)`);
    return products.slice(0, 10);

  } catch (error) {
    if (browser) await browser.close();
    console.error("Search Error:", error);
    return [];
  }
}