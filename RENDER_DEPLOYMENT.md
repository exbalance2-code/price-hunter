# 🚀 Deploy Price Hunter บน Render (ฟรี!)

## ✨ ข้อดีของ Render Free Tier

- ✅ **ฟรี 100%** ไม่ต้องใส่บัตรเครดิต
- ✅ รัน Puppeteer ได้
- ✅ Deploy ง่าย (เชื่อม GitHub)
- ✅ Auto-deploy เมื่อ push code
- ⚠️ **ข้อจำกัด:** Sleep หลังไม่ใช้งาน 15 นาที, ตื่นช้า 30 วินาที - 1 นาที

---

## 📋 ขั้นตอนการ Deploy

### Phase 1: เตรียม GitHub Repository

#### 1.1 สร้าง GitHub Account (ถ้ายังไม่มี)

1. ไปที่ [github.com](https://github.com)
2. สมัครบัญชีฟรี

#### 1.2 สร้าง Repository

1. กด **"New repository"**
2. ตั้งชื่อ: `price-hunter`
3. เลือก **Public** (ฟรี)
4. กด **"Create repository"**

#### 1.3 Push โค้ดขึ้น GitHub

**เปิด PowerShell ที่โฟลเดอร์โปรเจ็ค:**

```powershell
cd f:\price-hunter

# ติดตั้ง Git (ถ้ายังไม่มี)
# ดาวน์โหลดที่: https://git-scm.com/download/win

# เริ่มต้น Git
git init
git add .
git commit -m "Initial commit"
git branch -M main

# เชื่อมกับ GitHub (แทนที่ YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/price-hunter.git
git push -u origin main
```

---

### Phase 1.5: เตรียม Database (สำคัญ!)

โปรเจ็คนี้ต้องใช้ **MySQL Database** สำหรับเก็บประวัติการค้นหาและคลิก

**1. สมัคร TiDB Cloud (แนะนำสำหรับ Free Tier):**

1. ไปที่ [tidbcloud.com](https://tidbcloud.com/)
2. สมัครบัญชีและสร้าง Cluster ฟรี (Serverless)
3. เมื่อสร้างเสร็จ ให้กด **"Connect"** เพื่อดูรายละเอียดการเชื่อมต่อ
   - **Host:** (เช่น gateway01.ap-southeast-1.prod.aws.tidbcloud.com)
   - **User:** (เช่น 3Kn...root)
   - **Password:**
   - **Port:** 4000

**2. สร้างตารางใน Database (Run บนคอมของคุณ):**
กลับมาที่ PowerShell ในโปรเจ็ค รันคำสั่งนี้เพื่อสร้างตารางบน Cloud:

```powershell
# ตั้งค่า Connection string (แทนที่ข้อมูลจริง)
$env:DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/test?sslaccept=strict"

# สร้างตาราง
npx prisma db push
```

---

### Phase 2: Deploy บน Render

#### 2.1 สร้าง Render Account

1. ไปที่ [render.com](https://render.com)
2. กด **"Get Started for Free"**
3. เลือก **"Sign up with GitHub"**
4. อนุญาตให้ Render เข้าถึง GitHub

#### 2.2 สร้าง Web Service

1. กด **"New +"** → **"Web Service"**
2. เลือก Repository: **price-hunter**
3. กด **"Connect"**

#### 2.3 ตั้งค่า Web Service

**Name:** `price-hunter-bot`

**Region:** `Singapore` (ใกล้ไทยที่สุด)

**Branch:** `main`

**Runtime:** `Node`

**Build Command:**

```bash
npm install && npm run build
```

**Start Command:**

```bash
npm start
```

**Instance Type:** `Free`

#### 2.4 เพิ่ม Environment Variables

กด **"Advanced"** → **"Add Environment Variable"**

เพิ่มตัวแปรต่อไปนี้:

| Key                   | Value                                          |
| --------------------- | ---------------------------------------------- |
| `LINE_ACCESS_TOKEN`   | `your_line_access_token`                       |
| `LINE_CHANNEL_SECRET` | `your_line_channel_secret`                     |
| `ACCESSTRADE_KEY`     | `your_accesstrade_key`                         |
| `INVOLVE_API_KEY`     | `your_involve_api_key`                         |
| `INVOLVE_API_SECRET`  | `your_involve_api_secret`                      |
| `PASSIO_API_KEY`      | `your_passio_api_key`                          |
| `NODE_ENV`            | `production`                                   |
| `MYSQL_HOST`          | `Host ของ MySQL Database` (เช่นจาก TiDB Cloud) |
| `MYSQL_USER`          | `Username`                                     |
| `MYSQL_PASSWORD`      | `Password`                                     |
| `MYSQL_DATABASE`      | `ชื่อ Database`                                |
| `MYSQL_PORT`          | `4000` (สำหรับ TiDB) หรือ `3306`               |
| `ADMIN_PASSWORD`      | `รหัสผ่านเข้าหลังบ้าน` (ตั้งเองได้เลย)         |

#### 2.5 Deploy!

- กด **"Create Web Service"**
- รอ 3-5 นาที (ดู Logs ได้)
- เมื่อเสร็จจะได้ URL: `https://price-hunter-bot.onrender.com`

---

### Phase 3: ตั้งค่า LINE Webhook

#### 3.1 อัปเดต Webhook URL

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. เลือก Channel ของคุณ
3. ไปที่ **Messaging API**
4. ตั้งค่า **Webhook URL:**
   ```
   https://price-hunter-bot.onrender.com/api/line-webhook
   ```
   (แทนที่ `price-hunter-bot` ด้วยชื่อจริงของคุณ)
5. กด **"Verify"** → ต้องได้ Success
6. เปิด **"Use webhook"**

---

### Phase 4: แก้ปัญหา Sleep Mode

#### 4.1 ปัญหา: Service Sleep หลัง 15 นาที

**อาการ:**

- ส่งข้อความใน LINE ครั้งแรกหลังจากไม่ใช้งานนาน
- บอทไม่ตอบ หรือตอบช้า 30 วินาที - 1 นาที

#### 4.2 วิธีแก้: ใช้ Cron Job Ping (ฟรี!)

**ใช้ GitHub Actions (แนะนำ! ทำให้อัตโนมัติแล้ว):**
ผมได้สร้างไฟล์ `.github/workflows/keep_alive.yml` ให้แล้ว ไฟล์นี้จะทำงาน:

1. ทุกๆ 10 นาที GitHub จะส่งคำสั่งไปปลุกเว็บของคุณ
2. ไม่ต้องสมัครเว็บภายนอก
3. แค่ Push โค้ดขึ้น GitHub ก็ทำงานทันที!

**หรือใช้ cron-job.org (วิธีเดิม):**

1. ไปที่ [cron-job.org](https://cron-job.org)
2. สมัครฟรี
3. สร้าง Cron Job ใหม่:
   - **Title:** `Keep Render Awake`
   - **URL:** `https://price-hunter-bot.onrender.com/`
   - **Schedule:** ทุก 10 นาที
4. เปิดใช้งาน

**หรือใช้ UptimeRobot:**

1. ไปที่ [uptimerobot.com](https://uptimerobot.com)
2. สมัครฟรี
3. กด **"Add New Monitor"**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** `Price Hunter`
   - **URL:** `https://price-hunter-bot.onrender.com/`
   - **Monitoring Interval:** 5 minutes
4. กด **"Create Monitor"**

---

### Phase 5: อัปเดตโค้ด (ในอนาคต)

#### 5.1 แก้โค้ดบนเครื่อง

```powershell
cd f:\price-hunter
# แก้ไขโค้ด...
```

#### 5.2 Push ขึ้น GitHub

```powershell
git add .
git commit -m "Update: ..."
git push
```

#### 5.3 Auto-deploy

- Render จะ Deploy อัตโนมัติ (รอ 2-3 นาที)
- ดูสถานะที่ Dashboard

---

## 🎯 ตรวจสอบการทำงาน

### 1. เช็คว่า Deploy สำเร็จ

- ไปที่ Render Dashboard
- ดู **Logs** → ต้องไม่มี Error
- สถานะเป็น **"Live"** (สีเขียว)

### 2. ทดสอบเว็บ

- เปิด `https://price-hunter-bot.onrender.com`
- ต้องเห็นหน้าเว็บ Landing Page

### 3. ทดสอบ LINE Bot

- เปิดแชท LINE กับบอท
- ส่งข้อความ: `หารองเท้า Nike`
- ต้องได้รับผลลัพธ์ภายใน 3-5 วินาที

---

## 🔧 แก้ปัญหาที่พบบ่อย

### 1. Build Failed

**สาเหตุ:** Dependencies ติดตั้งไม่สำเร็จ

**วิธีแก้:**

- เช็ค `package.json` ว่าครบถ้วน
- ลองรันบนเครื่อง: `npm install && npm run build`

### 2. LINE Bot ไม่ตอบ

**สาเหตุ:** Webhook URL ผิด หรือ Environment Variables ไม่ครบ

**วิธีแก้:**

- เช็ค Webhook URL ใน LINE Console
- เช็ค Environment Variables ใน Render
- ดู Logs ใน Render Dashboard

### 3. Puppeteer Error

**สาเหตุ:** Dependencies ของ Chromium ไม่ครบ

**วิธีแก้:**

- Render ติดตั้งให้อัตโนมัติแล้ว
- ถ้ายังมีปัญหา ดู Logs

### 4. Service Sleep บ่อย

**วิธีแก้:**

- ตั้ง Cron Job (ตาม Phase 4)
- หรืออัปเกรดเป็น Paid Plan ($7/เดือน)

### 5. เชื่อมต่อ Database ไม่ได้

**อาการ:** บอททำงานแต่ไม่เก็บสถิติ หรือ Error 500
**วิธีแก้:**

- เช็คค่า `MYSQL_...` ใน Environment Variables
- ตรวจสอบว่า Database เปิดให้ Public Access (หรือ Allow IP ของ Render)
- TiDB Cloud ใช้งานได้เลยไม่ต้องตั้งค่า IP Whitelist เพิ่มเติม

---

## 💡 Tips & Tricks

### 1. ดู Logs แบบ Real-time

- ไปที่ Render Dashboard
- เลือก Service
- กด **"Logs"**

### 2. Restart Service

- ไปที่ Render Dashboard
- เลือก Service
- กด **"Manual Deploy"** → **"Deploy latest commit"**

### 3. เปลี่ยน Environment Variables

- ไปที่ Render Dashboard
- เลือก Service
- กด **"Environment"**
- แก้ไขค่า → กด **"Save Changes"**
- Service จะ Restart อัตโนมัติ

---

## 📊 ข้อจำกัดของ Free Tier

| Feature       | Free Tier      | Paid ($7/เดือน) |
| ------------- | -------------- | --------------- |
| Sleep         | หลัง 15 นาที   | ไม่ Sleep       |
| RAM           | 512 MB         | 1 GB            |
| Bandwidth     | 100 GB/เดือน   | 100 GB/เดือน    |
| Build Minutes | 500 นาที/เดือน | 500 นาที/เดือน  |

---

## 🚀 Next Steps

- ✅ Deploy สำเร็จแล้ว
- ✅ ตั้ง Cron Job เพื่อป้องกัน Sleep
- ✅ ทดสอบการทำงานกับผู้ใช้จริง
- ✅ เก็บสถิติการใช้งาน
- ✅ พัฒนา v2.0 ตาม Roadmap

---

**หมายเหตุ:** ถ้าติดปัญหาตรงไหน บอกผมได้เลยครับ! 💪
