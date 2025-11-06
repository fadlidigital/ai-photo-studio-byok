# 🚀 Deployment Guide - AI Photo Studio BYOK

Panduan lengkap deploy aplikasi ke Netlify (GRATIS!)

---

## 📋 Prerequisites

- GitHub account (gratis)
- Netlify account (gratis)
- Git installed di komputer

---

## 🎯 METHOD 1: DEPLOY VIA GITHUB (RECOMMENDED)

### **Step 1: Create GitHub Repository**

1. **Buka GitHub:**
   - Go to: https://github.com/new
   - Login dengan akun GitHub Anda

2. **Isi Form Repository:**
   ```
   Repository name: ai-photo-studio-byok
   Description: AI Photo Studio for UMKM - Bring Your Own API Key
   Visibility: Public atau Private (terserah Anda)

   ❌ JANGAN centang:
      - Add a README file
      - Add .gitignore
      - Choose a license
   ```

3. **Klik "Create repository"**

4. **Copy URL Repository** (akan muncul di halaman setelah create)
   ```
   Format: https://github.com/USERNAME/ai-photo-studio-byok.git
   ```

---

### **Step 2: Push Code ke GitHub**

**Buka Terminal/Command Prompt:**

```bash
# 1. Masuk ke folder project
cd C:\Users\fadli\ai-photo-studio-byok
# atau kalau di Linux/Mac:
cd /home/user/ai-photo-studio-byok

# 2. Add remote GitHub repository
# GANTI dengan URL repository Anda!
git remote add origin https://github.com/USERNAME/ai-photo-studio-byok.git

# 3. Push ke GitHub
git branch -M main
git push -u origin main
```

**Jika diminta username & password:**
- Username: [GitHub username Anda]
- Password: [GitHub Personal Access Token - bukan password biasa!]

**Cara buat Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Pilih scope: `repo` (centang semua)
4. Generate token
5. **COPY token tersebut** (hanya muncul sekali!)
6. Pakai token ini sebagai password

---

### **Step 3: Connect Netlify ke GitHub**

1. **Buka Netlify:**
   - Go to: https://app.netlify.com
   - Login/Sign up (pakai akun GitHub untuk lebih mudah)

2. **Import Project:**
   - Klik **"Add new site"** → **"Import an existing project"**
   - Pilih **"Deploy with GitHub"**
   - Authorize Netlify ke GitHub (klik Allow)

3. **Pilih Repository:**
   - Cari repository **"ai-photo-studio-byok"**
   - Klik repository tersebut

4. **Configure Build Settings:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```
   (Seharusnya sudah otomatis terisi dari netlify.toml)

5. **Klik "Deploy site"**

6. **Tunggu 2-3 menit** sampai deployment selesai

7. **DONE!** Aplikasi Anda sudah LIVE! 🎉

---

## 🎯 METHOD 2: DEPLOY VIA DRAG & DROP (SUPER MUDAH!)

Kalau mau lebih cepat tanpa GitHub:

### **Step 1: Build Aplikasi**

```bash
cd C:\Users\fadli\ai-photo-studio-byok
npm install
npm run build
```

Folder `dist` akan terbuat.

### **Step 2: Deploy ke Netlify**

1. **Buka Netlify:**
   - Go to: https://app.netlify.com
   - Login

2. **Drag & Drop:**
   - Scroll ke bawah, cari area **"Want to deploy a new site without connecting to Git?"**
   - **DRAG folder `dist`** ke area tersebut
   - Atau klik "Browse to upload" → pilih folder `dist`

3. **Tunggu Upload Selesai**

4. **DONE! Aplikasi LIVE!** 🎉

**Note:** Method ini tidak auto-deploy saat ada update code. Harus manual build & upload lagi.

---

## 🎨 CUSTOM DOMAIN (OPTIONAL)

Setelah deploy, Netlify kasih domain random seperti:
```
https://random-name-123.netlify.app
```

**Cara Ganti Domain:**

### **Option 1: Netlify Subdomain (Gratis)**
1. Di Netlify dashboard → Site settings → Domain management
2. Klik "Edit site name"
3. Ganti jadi: `ai-photo-studio-umkm.netlify.app`

### **Option 2: Custom Domain (Bayar Domain)**
1. Beli domain (misal: `aiphotostudio.com` di Niagahoster/Hostinger)
2. Di Netlify → Add custom domain
3. Update DNS di provider domain Anda
4. Netlify auto-enable HTTPS (gratis!)

---

## 📊 MONITORING

**Check Deployment Status:**
- Netlify Dashboard → Deploys
- Lihat log jika ada error

**Auto Deploy on Git Push:**
- Setiap kali `git push` ke GitHub
- Netlify otomatis rebuild & deploy!
- Super convenient! 🚀

---

## 🔧 TROUBLESHOOTING

### **Error: Build Failed**
```bash
# Check log di Netlify
# Biasanya karena:
1. npm install failed → Check package.json
2. Build command salah → Check netlify.toml
```

**Fix:**
```bash
# Test build locally dulu
npm run build
# Kalau berhasil local, push lagi
git push
```

### **Error: 404 Not Found (halaman reload)**
- Sudah handled by netlify.toml
- Jika masih error, check `[[redirects]]` config

### **Error: API Key Not Working**
- Normal! User harus input API key sendiri
- Ini by design (BYOK model)

---

## 💡 TIPS

1. **Enable Netlify Analytics (Optional - $9/month)**
   - Track visitors
   - See popular pages

2. **Setup Environment Variables (If Needed)**
   - Netlify → Site settings → Environment variables
   - Tapi untuk BYOK app ini, **TIDAK PERLU!**

3. **Setup Continuous Deployment**
   - Sudah auto-enabled kalau deploy via GitHub
   - Every push = auto deploy!

---

## 📈 SCALING

**Netlify Free Tier Limits:**
- ✅ 100GB bandwidth/month (cukup untuk 1000+ users)
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ CDN global

**Kalau traffic tinggi:**
- Upgrade ke Netlify Pro ($19/month)
- Atau tetap free, karena ini static site!

---

## 🎁 BONUS: AUTO DEPLOYMENT

**Setup Branch Deploy:**
```bash
# Development branch
git checkout -b development
git push origin development

# Di Netlify: Deploy Previews enabled by default
# Every branch = unique preview URL!
```

---

## 🚀 QUICK COMMANDS REFERENCE

```bash
# Build locally
npm run build

# Test build locally
npm run preview

# Deploy (if using GitHub)
git add .
git commit -m "your message"
git push

# Netlify auto-deploy in 2-3 minutes!
```

---

## ✅ CHECKLIST DEPLOYMENT

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify account created
- [ ] Site connected to GitHub repo
- [ ] Build settings configured
- [ ] Deployment successful
- [ ] Site accessible via URL
- [ ] Test API key validation
- [ ] Test image generation
- [ ] Custom domain setup (optional)

---

**🎉 SELESAI! Aplikasi Anda sudah LIVE di Internet!**

Share URL ke client/user dan mulai jual! 💰

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://answers.netlify.com
