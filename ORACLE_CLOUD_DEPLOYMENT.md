# 🚀 Deploy Price Hunter บน Oracle Cloud Free Tier

## ✨ ข้อดีของ Oracle Cloud Free Tier

- ✅ **ฟรีตลอดชีพ** (Always Free)
- ✅ VPS 1 GB RAM, 1 vCPU
- ✅ 200 GB Bandwidth/เดือน
- ✅ รัน Puppeteer ได้
- ✅ ไม่ต้องใส่บัตรเครดิต (แต่แนะนำให้ใส่)

---

## 📋 ขั้นตอนการ Deploy

### Phase 1: สร้าง Oracle Cloud Account

#### 1.1 สมัครบัญชี
1. ไปที่ [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)
2. กด **"Start for free"**
3. กรอกข้อมูล:
   - Email
   - ชื่อ-นามสกุล
   - เบอร์โทร (ต้องรับ SMS)
   - ที่อยู่
4. เลือก **Home Region**: **Japan Central (Osaka)** (ใกล้ไทยที่สุด)
5. ใส่บัตรเครดิต/เดบิต (ไม่หักเงิน แต่ต้องมี)

#### 1.2 ยืนยันตัวตน
- รอรับ SMS ยืนยัน
- ยืนยันอีเมล
- รอ Oracle อนุมัติ (1-24 ชั่วโมง)

---

### Phase 2: สร้าง VPS (Compute Instance)

#### 2.1 เข้าสู่ Console
1. Login ที่ [https://cloud.oracle.com/](https://cloud.oracle.com/)
2. ไปที่ **Compute** → **Instances**
3. กด **"Create Instance"**

#### 2.2 ตั้งค่า Instance
**Name:** `price-hunter-bot`

**Image and shape:**
- Image: **Ubuntu 22.04** (Canonical)
- Shape: **VM.Standard.E2.1.Micro** (Always Free)
  - 1 vCPU, 1 GB RAM

**Networking:**
- VCN: สร้างใหม่ (Default)
- Subnet: Public Subnet
- ✅ เลือก **"Assign a public IPv4 address"**

**Add SSH keys:**
- เลือก **"Generate a key pair for me"**
- กด **"Save Private Key"** (เก็บไฟล์ `.key` ไว้ดีๆ)
- กด **"Save Public Key"**

**Boot volume:**
- ใช้ค่า Default (50 GB)

#### 2.3 สร้าง Instance
- กด **"Create"**
- รอ 2-3 นาที จนสถานะเป็น **"Running"** (สีเขียว)
- จดค่า **Public IP Address** ไว้

---

### Phase 3: เปิด Port สำหรับ Web Server

#### 3.1 เปิด Port ใน Security List
1. ไปที่ **Networking** → **Virtual Cloud Networks**
2. คลิกที่ VCN ที่สร้างไว้
3. คลิก **Security Lists** → **Default Security List**
4. กด **"Add Ingress Rules"**

**เพิ่ม Rule สำหรับ HTTP:**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `80`
- กด **"Add Ingress Rules"**

**เพิ่ม Rule สำหรับ HTTPS:**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `443`
- กด **"Add Ingress Rules"**

**เพิ่ม Rule สำหรับ Next.js (3000):**
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `3000`
- กด **"Add Ingress Rules"**

---

### Phase 4: เชื่อมต่อ SSH และติดตั้ง

#### 4.1 เชื่อมต่อ SSH (Windows)

**ใช้ PowerShell:**
```powershell
# เปลี่ยน path ให้ตรงกับที่เก็บไฟล์ .key
ssh -i "C:\path\to\your-key.key" ubuntu@YOUR_PUBLIC_IP
```

**หรือใช้ PuTTY:**
1. ดาวน์โหลด PuTTY: [https://www.putty.org/](https://www.putty.org/)
2. แปลง `.key` เป็น `.ppk` ด้วย PuTTYgen
3. เชื่อมต่อด้วย PuTTY

#### 4.2 อัปเดตระบบ
```bash
sudo apt update && sudo apt upgrade -y
```

#### 4.3 ติดตั้ง Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # ตรวจสอบเวอร์ชัน
npm -v
```

#### 4.4 ติดตั้ง Dependencies สำหรับ Puppeteer
```bash
sudo apt install -y \
  chromium-browser \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils
```

#### 4.5 ติดตั้ง PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

#### 4.6 เปิด Port ใน Ubuntu Firewall
```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw enable
```

---

### Phase 5: Deploy โปรเจ็ค

#### 5.1 Clone โปรเจ็คจาก GitHub

**ถ้ายังไม่มี GitHub Repo:**
```bash
# บนเครื่อง Windows
cd f:\price-hunter
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/price-hunter.git
git push -u origin main
```

**บน VPS:**
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/price-hunter.git
cd price-hunter
```

#### 5.2 ติดตั้ง Dependencies
```bash
npm install
```

#### 5.3 สร้างไฟล์ `.env`
```bash
nano .env
```

**ใส่ค่าต่อไปนี้:**
```env
LINE_ACCESS_TOKEN=your_line_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret
ACCESSTRADE_KEY=your_accesstrade_key
INVOLVE_API_KEY=your_involve_api_key
INVOLVE_API_SECRET=your_involve_api_secret
PASSIO_API_KEY=your_passio_api_key
```

กด `Ctrl+X` → `Y` → `Enter` เพื่อบันทึก

#### 5.4 Build โปรเจ็ค
```bash
npm run build
```

#### 5.5 รันด้วย PM2
```bash
pm2 start npm --name "price-hunter" -- start
pm2 save
pm2 startup
```

**คัดลอกคำสั่งที่ PM2 แสดง แล้วรันอีกครั้ง** (เพื่อให้ auto-start เมื่อ reboot)

---

### Phase 6: ตั้งค่า Nginx (Reverse Proxy)

#### 6.1 ติดตั้ง Nginx
```bash
sudo apt install -y nginx
```

#### 6.2 สร้าง Config
```bash
sudo nano /etc/nginx/sites-available/price-hunter
```

**ใส่ค่าต่อไปนี้:**
```nginx
server {
    listen 80;
    server_name YOUR_PUBLIC_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

แทนที่ `YOUR_PUBLIC_IP` ด้วย IP จริง

#### 6.3 เปิดใช้งาน Config
```bash
sudo ln -s /etc/nginx/sites-available/price-hunter /etc/nginx/sites-enabled/
sudo nginx -t  # ตรวจสอบ syntax
sudo systemctl restart nginx
```

---

### Phase 7: ตั้งค่า LINE Webhook

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. เลือก Channel ของคุณ
3. ไปที่ **Messaging API**
4. ตั้งค่า **Webhook URL:**
   ```
   http://YOUR_PUBLIC_IP/api/line-webhook
   ```
5. กด **"Verify"** → ต้องได้ Success
6. เปิด **"Use webhook"**

---

### Phase 8: ตั้งค่า HTTPS (Optional แต่แนะนำ)

#### 8.1 ใช้ Cloudflare Tunnel (ฟรี)

**ข้อดี:**
- ฟรี
- ได้ HTTPS ทันที
- ไม่ต้องซื้อโดเมน (ใช้ `.trycloudflare.com`)

**วิธีทำ:**
```bash
# ติดตั้ง Cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# รัน Tunnel
cloudflared tunnel --url http://localhost:3000
```

จะได้ URL แบบ: `https://random-name.trycloudflare.com`

**ทำให้รันตลอด:**
```bash
pm2 start cloudflared --name "tunnel" -- tunnel --url http://localhost:3000
pm2 save
```

---

## 🎯 ตรวจสอบการทำงาน

1. **เปิดเว็บ:** `http://YOUR_PUBLIC_IP` หรือ Cloudflare URL
2. **ทดสอบ LINE Bot:** ส่งข้อความในไลน์
3. **ดู Logs:**
   ```bash
   pm2 logs price-hunter
   ```

---

## 🔧 คำสั่งที่ใช้บ่อย

```bash
# ดูสถานะ
pm2 status

# รีสตาร์ท
pm2 restart price-hunter

# ดู Logs
pm2 logs price-hunter

# หยุด
pm2 stop price-hunter

# อัปเดตโค้ด
cd ~/price-hunter
git pull
npm install
npm run build
pm2 restart price-hunter
```

---

## ⚠️ ข้อควรระวัง

1. **RAM จำกัด (1 GB):**
   - Puppeteer กิน RAM เยอะ
   - ถ้าช้า ให้ลด `--max-old-space-size=512`

2. **Bandwidth จำกัด (200 GB/เดือน):**
   - ถ้าใช้เกิน อาจโดนปิด
   - ติดตามที่ Oracle Console

3. **Instance อาจถูกลบ:**
   - ถ้าไม่ใช้งานนาน (3 เดือน)
   - Login เข้า Console เป็นระยะ

---

## 🚀 Next Steps

- ✅ ตั้งค่า Domain Name (ถ้ามี)
- ✅ ใช้ Cloudflare Tunnel สำหรับ HTTPS
- ✅ ติดตั้ง Monitoring (PM2 Plus)
- ✅ ตั้งค่า Auto-backup

---

**หมายเหตุ:** ถ้าติดปัญหาตรงไหน บอกผมได้เลยครับ! 💪
