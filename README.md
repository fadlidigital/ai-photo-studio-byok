# 🎨 AI Photo Studio for UMKM (BYOK Version)

**Bring Your Own API Key** - Generate professional AI photos using your own Google Gemini API key!

## ✨ Features

- ✅ **No Backend Required** - Pure frontend application
- ✅ **Use Your Own API Key** - No subscription, no credits, just your Gemini API
- ✅ **100% Local Storage** - API keys stored locally, never sent to any server
- ✅ **Fast & Simple** - Clean, minimal UI inspired by Gemini Canvas
- ✅ **Multiple Images** - Generate 1-4 images per request
- ✅ **Download All** - Easy batch download
- ✅ **Usage Statistics** - Track your generations locally

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Paste it in the app

### 4. Start Generating!

1. Upload an image
2. Write a prompt
3. Select number of images (1-4)
4. Click Generate!

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

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API

## 📝 How It Works

1. **User uploads image** → Converted to base64
2. **User enters prompt** → Combined with image
3. **Direct API call** → Sent to Gemini API with user's key
4. **Images generated** → Returned as base64 PNG
5. **Download** → User can download individually or all at once

**No backend, no database, no server costs!**

## 🔒 Security

- API keys are encrypted (simple obfuscation) in localStorage
- Keys never leave the browser
- No telemetry or tracking
- All processing is client-side

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
