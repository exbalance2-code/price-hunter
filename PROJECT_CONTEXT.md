# Project Context: Lazada Affiliate LINE Bot (Next.js)

## 1. Project Overview
This project is a **LINE Chatbot** built with **Next.js (App Router)**. The bot functions as a product search tool where users input a keyword, and the bot returns a carousel of Lazada products containing **Affiliate Links** (Deep Links).

## 2. Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript / Node.js
- **Platform:** LINE Messaging API (Webhook)
- **External API:** Lazada Open Platform (Affiliate API)
- **Deployment:** Self-hosted (CloudPanel/VPS)

## 3. System Workflow

### Step 1: User Trigger
- **Actor:** User via LINE App.
- **Action:** Sends a text message (keyword) e.g., "รองเท้าวิ่ง".
- **Endpoint:** LINE Platform POSTs data to our Webhook: `/api/webhook/line`.

### Step 2: Webhook Handling (Next.js)
- **File:** `app/api/webhook/line/route.ts`
- **Process:**
  1. Verify `x-line-signature` header using Channel Secret.
  2. Parse the request body to extract the `events` array.
  3. Filter only `message` events with type `text`.

### Step 3: Lazada Product Search
- **Action:** Call Lazada Open API `lazada.affiliate.product.search`.
- **Logic:**
  - Generate the Request Signature using `app_key` and `app_secret` (HMAC-SHA256).
  - Query parameters: `keywords` (from user), `page_size` (limit to 5-10 items).
- **Output:** A list of products (Image URL, Title, Price, Original Product URL).

### Step 4: Affiliate Link Generation
- **Action:** Call Lazada Open API `lazada.affiliate.link.generate`.
- **Logic:**
  - Iterate through the products found in Step 3.
  - Pass the original `productUrl` to this API.
  - **Goal:** Get the `weblink` or `shortLink` (e.g., `https://s.lazada.co.th/s.xxxx`) which supports Universal Links (Deep Linking to App).

### Step 5: Construct Response (Flex Message)
- **Format:** LINE Flex Message (Carousel/Bubble).
- **Content:**
  - **Hero:** Product Image.
  - **Body:** Product Title (truncated if too long), Price (formatted with commas).
  - **Footer:** "Buy Now" button.
- **Action:** The button `uri` must be the **Affiliate Link** generated in Step 4.
  - *Optional:* Append `?openExternalBrowser=1` if needed to force browser/app switch.

### Step 6: Reply to User
- **Action:** Use LINE Messaging API `replyMessage` with the `replyToken`.
- **Result:** User sees a carousel of products. Clicking a product opens the Lazada App (or Web) via the Affiliate Link.

## 4. Key Implementation Details

### Lazada API Signature Algorithm (Node.js)
The wrapper function for Lazada API calls must implement the signature calculation:
1. Sort all system and application parameters by key (string order).
2. Concatenate keys and values: `key1value1key2value2...`.
3. Add `app_secret` at the beginning and end of the string (depending on the specific API specs, usually HMAC-SHA256).
4. Convert to Upper Case Hex.

### Data Privacy & Security
- Never hardcode `app_secret` or `channel_secret` in the code.
- Use environment variables (`.env`):
  - `LINE_CHANNEL_ACCESS_TOKEN`
  - `LINE_CHANNEL_SECRET`
  - `LAZADA_APP_KEY`
  - `LAZADA_APP_SECRET`

## 5. Objectives for AI Assistant
- Generate code for the `route.ts` webhook handler.
- Create a reusable `LazadaService` class/function to handle API calls and Signatures.
- Design the JSON schema for the LINE Flex Message.