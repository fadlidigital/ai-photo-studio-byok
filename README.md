# 🎨 AI Foto Estetik BYOK

**Bring Your Own API Key** - Studio Foto AI Lengkap dengan Authentication untuk UMKM Indonesia!

## ✨ Features

### 🔐 Authentication & Security
- ✅ **User Authentication** - Secure login with email verification (Supabase)
- ✅ **Email Verification Required** - Only verified users can access the app
- ✅ **Protected Routes** - All features behind authentication wall
- ✅ **User Profile** - Display user info with logout functionality

### 📸 6 Fitur Foto AI Lengkap
- ✅ **Photoshoot Produk** - 6 preset background profesional untuk foto produk
- ✅ **Foto Model AI** - Buat model baru atau ubah pose dengan 5 style
- ✅ **Gabungkan Gambar** - Kombinasi 2 gambar jadi 1
- ✅ **Edit Foto** - Enhance & fix foto (quality, color, lighting, dll)
- ✅ **Generate Prompt** - AI analisis foto jadi prompt (3 style)
- ✅ **Banner Iklan** - Buat banner iklan dengan 5 size & 5 style

### 🚀 Technical Features
- ✅ **No Backend Required** - Pure frontend application
- ✅ **Use Your Own API Key** - No subscription, just your Gemini API
- ✅ **100% Local Storage** - API keys stored locally, never sent to any server
- ✅ **Multiple Images** - Generate 1-4 images per request
- ✅ **Download All** - Easy batch download
- ✅ **Usage Statistics** - Track your generations locally

## 🚀 Quick Start

### 1. Setup Supabase (Authentication)

1. **Create Supabase Project**
   - Visit [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Fill in project details

2. **Enable Email Authentication**
   - Go to Authentication > Providers
   - Enable "Email" provider
   - ✅ Enable "Confirm email"

3. **Get Your Supabase Credentials**
   - Go to Project Settings > API
   - Copy `Project URL` and `anon/public` key

4. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

5. **Fill in `.env` file**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Register & Login

1. Click "Daftar di sini"
2. Enter email & password (min 6 characters)
3. Check your email for verification link
4. Click verification link
5. Return to app and click "Saya Sudah Verifikasi Email"

### 5. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Paste it in the app and validate

### 6. Start Generating!

1. Choose a feature from the menu
2. Upload an image (if required)
3. Write a prompt or configure settings
4. Select number of images (1-4)
5. Click Generate!

## 🔐 Authentication Flow

```
User → Register → Email Sent → Verify Email → Login → Access App
```

**Important:**
- Email verification is **REQUIRED**
- Unverified users will see verification page
- All app features are protected behind authentication
- User can logout anytime from profile dropdown

## 📦 Build for Production

```bash
npm run build
```

The `dist` folder will contain your production-ready app.

## 🌐 Deploy

### Deploy to Netlify (Free)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 💰 Monetization Options

### Option 1: Freemium Model

- Free: 20 generations/day (rate limited)
- Pro: Unlimited ($29/month or $299/lifetime)

### Option 2: White Label Sale

- Sell the source code with customization
- Recommended price: $500 - $2,000 one-time

### Option 3: SaaS for Agencies

- Enterprise white label
- Recommended price: $5,000 - $20,000

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **AI API:** Google Gemini 2.5 Flash Image
- **Storage:** LocalStorage (API keys & usage stats)

## 📝 How It Works

1. **User uploads image** → Converted to base64
2. **User enters prompt** → Combined with image
3. **Direct API call** → Sent to Gemini API with user's key
4. **Images generated** → Returned as base64 PNG
5. **Download** → User can download individually or all at once

**No backend, no database, no server costs!**

## 🔒 Security

- **Authentication:** Email verification required via Supabase
- **Protected Routes:** All features behind authentication wall
- **API Keys:** Encrypted (simple obfuscation) in localStorage
- **Privacy:** Keys never leave the browser, no telemetry
- **Client-Side:** All processing is client-side
- **No Backend:** No server to hack or maintain

## 📊 API Cost Estimation

Using Gemini 2.5 Flash Image:
- ~$0.05 per 4 images (very cheap!)
- User pays Google directly
- You pay nothing!

## 🎯 Target Market

Perfect for:
- UMKM (Small Business Owners)
- Photographers
- Content Creators
- E-commerce Sellers
- Social Media Managers

## 📄 License

MIT License - Feel free to customize and sell!

## 🤝 Support

For support, contact: [your-email@example.com]

---

**Built with ❤️ for Indonesian UMKM**
