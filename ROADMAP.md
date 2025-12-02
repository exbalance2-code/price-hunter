# 🗺️ Price Hunter - Roadmap Version 2.0

## 📋 สรุปเวอร์ชันปัจจุบัน (v1.0)

**ฟีเจอร์ที่มีอยู่:**
- ✅ LINE Bot ค้นหาสินค้าจาก Lazada
- ✅ เรียงราคาจากถูกไปแพง (Top 5)
- ✅ กรองเฉพาะร้านน่าเชื่อถือ (มียอดขาย)
- ✅ Affiliate Link (Passio, AccessTrade, Involve Asia)
- ✅ Landing Page พร้อม SEO
- ✅ GSAP Animations
- ✅ Responsive Design

---

## 🎯 Version 2.0 - Price Alert & Analytics (Q1 2025)

### Phase 1: Price Tracking System (2-3 สัปดาห์)

#### 1.1 Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  lineId    String   @unique
  createdAt DateTime @default(now())
  alerts    PriceAlert[]
}

model PriceAlert {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  productUrl    String
  productTitle  String
  productImage  String
  currentPrice  Float
  targetPrice   Float
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([userId])
  @@index([isActive])
}

model PriceHistory {
  id         String   @id @default(cuid())
  productUrl String
  price      Float
  recordedAt DateTime @default(now())
  
  @@index([productUrl])
}
```

#### 1.2 LINE Bot Commands
- `/track [URL]` - ติดตามสินค้า
- `/list` - ดูรายการที่ติดตาม
- `/remove [ID]` - ลบการติดตาม
- `/set [ID] [ราคา]` - ตั้งราคาเป้าหมาย

#### 1.3 Cron Job (Price Checker)
- รันทุก 6 ชั่วโมง
- เช็คราคาสินค้าที่ติดตามทั้งหมด
- แจ้งเตือนผ่าน LINE Push Message เมื่อ:
  - ราคาลดลง 10% ขึ้นไป
  - ราคาต่ำกว่าเป้าหมาย

#### 1.4 API Endpoints
- `POST /api/alerts` - สร้างการติดตาม
- `GET /api/alerts/:userId` - ดูรายการ
- `DELETE /api/alerts/:id` - ลบการติดตาม
- `PATCH /api/alerts/:id` - อัปเดตราคาเป้าหมาย

---

### Phase 2: Admin Dashboard (1-2 สัปดาห์)

#### 2.1 Analytics Dashboard
**หน้า Overview:**
- จำนวนผู้ใช้ทั้งหมด
- จำนวนการค้นหาต่อวัน
- Top 10 สินค้าที่ค้นหามากที่สุด
- อัตราการคลิก Affiliate Link (CTR)
- รายได้โดยประมาณ (จาก Affiliate)

**หน้า Users:**
- รายชื่อผู้ใช้
- จำนวนการค้นหาต่อคน
- สินค้าที่ติดตาม

**หน้า Products:**
- สินค้าที่มีคนติดตามมากที่สุด
- ประวัติราคา (กราฟ)
- แนวโน้มราคา

#### 2.2 Tech Stack
- **Frontend:** Next.js + Recharts (กราฟ)
- **Auth:** NextAuth.js (Google Login)
- **Database:** Prisma + PostgreSQL

#### 2.3 Routes
- `/admin` - Dashboard หลัก
- `/admin/users` - จัดการผู้ใช้
- `/admin/products` - สินค้าที่ติดตาม
- `/admin/analytics` - สถิติโดยละเอียด

---

### Phase 3: Flash Sale Alert (1 สัปดาห์)

#### 3.1 Flash Sale Scraper
- Scrape หน้า Flash Sale ของ Lazada ทุก 30 นาที
- เก็บข้อมูล:
  - ชื่อสินค้า
  - ราคาปกติ vs ราคาโปร
  - เวลาเริ่ม-สิ้นสุด
  - จำนวนสต็อกคงเหลือ

#### 3.2 LINE Bot Feature
- `/flash` - ดู Flash Sale ที่กำลังจะมา
- `/subscribe flash` - รับแจ้งเตือน Flash Sale
- Push Message ก่อนเริ่ม 15 นาที

---

## 🚀 Version 3.0 - Multi-Platform (Q2 2025)

### Phase 1: Shopee Integration
- แก้ปัญหา Anti-bot (Residential Proxy / CAPTCHA Solver)
- Scrape ข้อมูลสินค้า
- รวมผลลัพธ์ Lazada + Shopee
- เรียงราคาจากทุกแพลตฟอร์ม

### Phase 2: JD Central
- เพิ่ม Scraper สำหรับ JD Central
- รองรับ Affiliate Link (ถ้ามี)

---

## 💎 Version 4.0 - Premium Features (Q3 2025)

### 1. AI Product Recommendation
- วิเคราะห์ประวัติการค้นหา
- แนะนำสินค้าที่เหมาะสม
- เปรียบเทียบสเปค

### 2. Wishlist & Shopping List
- สร้างรายการสินค้า
- แชร์กับเพื่อน
- คำนวณงบประมาณ

### 3. Cashback System
- สะสมแต้มจากการซื้อ
- แลกของรางวัล
- Referral Program

---

## 📊 Success Metrics

**Version 2.0 Goals:**
- 1,000+ Active Users
- 10,000+ Searches/Month
- 500+ Price Alerts Created
- 5% CTR on Affiliate Links

**Version 3.0 Goals:**
- 5,000+ Active Users
- 50,000+ Searches/Month
- Multi-platform coverage

**Version 4.0 Goals:**
- 10,000+ Active Users
- Premium Subscription Model
- Sustainable Revenue

---

## 🛠️ Technical Debt & Improvements

### Infrastructure
- [ ] Migrate to PostgreSQL (from SQLite if using)
- [ ] Add Redis for caching
- [ ] Implement Rate Limiting
- [ ] Add Monitoring (Sentry)
- [ ] CI/CD Pipeline

### Code Quality
- [ ] Unit Tests (Jest)
- [ ] E2E Tests (Playwright)
- [ ] TypeScript Strict Mode
- [ ] Code Documentation

### Performance
- [ ] Optimize Puppeteer (Headless Chrome)
- [ ] Add CDN for images
- [ ] Implement ISR (Incremental Static Regeneration)

---

## 💰 Monetization Strategy

1. **Affiliate Commission** (Current)
   - Lazada, Shopee, JD Central

2. **Premium Subscription** (v4.0)
   - ฿99/month
   - Unlimited Price Alerts
   - Priority Flash Sale Notifications
   - Ad-free Experience

3. **Sponsored Products** (v3.0+)
   - แสดงสินค้าโปรโมทในผลลัพธ์
   - ค่าโฆษณาจากร้านค้า

---

## 📅 Timeline Summary

| Version | Timeline | Key Features |
|---------|----------|--------------|
| v2.0 | Q1 2025 (3 เดือน) | Price Alert, Dashboard, Flash Sale |
| v3.0 | Q2 2025 (3 เดือน) | Multi-Platform (Shopee, JD) |
| v4.0 | Q3 2025 (3 เดือน) | AI, Wishlist, Premium |

---

## 🎯 Next Steps (เริ่มเลย!)

1. ✅ Deploy v1.0 to Production
2. ⏳ Set up PostgreSQL Database
3. ⏳ Implement Price Alert Schema
4. ⏳ Build LINE Bot Commands
5. ⏳ Create Cron Job for Price Checking

---

**หมายเหตุ:** แผนนี้สามารถปรับเปลี่ยนได้ตามสถานการณ์และ Feedback จากผู้ใช้จริง 🚀
