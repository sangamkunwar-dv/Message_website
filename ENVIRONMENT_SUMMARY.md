# 📋 Environment Variables - Complete Summary

## ⚡ TL;DR (Too Long; Didn't Read) - Just Give Me The Steps!

### 3 Steps to Setup:

**Step 1: Get Credentials from Supabase**
```
1. Go to https://app.supabase.com
2. Click your "chat-app" project
3. Settings ⚙️ → API tab
4. Copy: Project URL
5. Copy: Anon Key
```

**Step 2: Create .env.local File**
```
1. In project root, create file: .env.local
2. Paste:
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_URL.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
3. Replace YOUR_URL and YOUR_KEY with actual values
4. Save file
```

**Step 3: Run App**
```
npm install
npm run dev
```

✅ **Done!**

---

## 📝 Complete Reference

### What Are Environment Variables?

They're **secret settings** your app needs but shouldn't be in code.

**Bad:** Putting secrets in code
```javascript
// ❌ WRONG - NEVER DO THIS!
const API_KEY = "sk_live_abc123xyz"
```

**Good:** Using environment variables
```javascript
// ✅ RIGHT - USE THIS!
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Why Use .env.local?

- 🔒 Keeps secrets off GitHub
- 🔧 Easy to change values
- 👥 Different for each developer
- ⚡ Different for dev vs production

---

## 🔑 Your 3 Required Variables

### 1. NEXT_PUBLIC_SUPABASE_URL
**What:** Your database server address
**Example:** `https://abcdefgh123456.supabase.co`
**Where to Find:**
- Website: https://app.supabase.com
- Click your project → Settings ⚙️ → API
- Look for: "Project URL"
- Click the copy button

**In .env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh123456.supabase.co
```

---

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
**What:** Public key to access database
**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
**Where to Find:**
- Website: https://app.supabase.com
- Click your project → Settings ⚙️ → API
- Look for: "Anon" or "Anon Key"
- ⚠️ NOT "Service Role Key"!
- Click the copy button

**In .env.local:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3. NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
**What:** Where to redirect after login (for development)
**Example:** `http://localhost:3000/auth/callback`
**Where to Find:** You create this! No copying needed.

**In .env.local:**
```env
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

**For Production (when you deploy):**
Replace with your actual domain:
```env
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://yourdomain.com/auth/callback
```

---

## 📍 Complete Navigation Guide

### Finding Supabase Project URL & Anon Key

```
Website: https://app.supabase.com
    ↓
Click your project name (e.g., "chat-app")
    ↓
Left sidebar: Settings ⚙️
    ↓
Top tabs: API
    ↓
Look for:
  • Project URL (copy this)
  • Anon Key (copy this - not Service Role!)
```

### Visual Guide in Supabase

```
┌─────────────────────────────────────────┐
│  API Settings                           │
├─────────────────────────────────────────┤
│                                         │
│  Project URL:                           │
│  ┌─────────────────────────────┐        │
│  │ https://abcd.supabase.co    │ [📋] │ ← COPY
│  └─────────────────────────────┘        │
│                                         │
│  Anon Key (Public):                     │
│  ┌─────────────────────────────┐        │
│  │ eyJhbGciOiJIUzI1NiI...      │ [📋] │ ← COPY
│  └─────────────────────────────┘        │
│                                         │
│  Service Role Key (Secret):             │
│  ┌─────────────────────────────┐        │
│  │ eyJhbGciOiJIUzI1NiI...      │ [📋] │ ← DON'T COPY!
│  └─────────────────────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📝 Creating .env.local File

### Location:
```
chat-app/
  .env.local  ← Put file here (project root)
```

### File Name:
Exactly: `.env.local` (with the dot at the start)

### Content:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_URL_HERE.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Replace These:
- `YOUR_URL_HERE` → Your actual Supabase URL (from Step 1 above)
- `YOUR_ANON_KEY_HERE` → Your actual Anon Key (from Step 1 above)

### Example (Filled In):
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoMTIzNDU2Iiwicm9sZSI6ImFub24ifQ.ABC123XYZ789
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

---

## ✅ Checklist Before Running App

- [ ] .env.local file created in project root
- [ ] File name is exactly `.env.local` (with dot)
- [ ] NEXT_PUBLIC_SUPABASE_URL starts with `https://`
- [ ] NEXT_PUBLIC_SUPABASE_URL ends with `.supabase.co`
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is filled in (long string)
- [ ] NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL is exactly `http://localhost:3000/auth/callback`
- [ ] No extra spaces around = signs
- [ ] No quotes around values
- [ ] File is saved

---

## 🚀 Running Your App

### First Time Setup:
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### Every Other Time:
```bash
# Just start dev server (dependencies already installed)
npm run dev
```

### Access Your App:
```
Open browser: http://localhost:3000
```

---

## 🧪 How to Verify It Works

### Test 1: Check Variables Are Loaded
1. Open http://localhost:3000
2. Press **F12** (open Developer Tools)
3. Go to **Console** tab
4. Type: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
5. Should show your URL (not undefined)

### Test 2: Try Signup
1. Go to http://localhost:3000/auth/sign-up
2. Enter: Username, Email, Password
3. Check Terms & Conditions
4. Click Sign Up
5. Should work! ✅

### Test 3: Check Supabase Received It
1. Go to https://app.supabase.com
2. Your project → Authentication → Users
3. Should see your test user ✅

---

## 🔐 Security Rules

### DO ✅
- Keep .env.local on your computer only
- Add .env.local to .gitignore (already done)
- Copy full URL and key (no truncating)
- Use Anon key (not Secret key)
- Change redirect URL for production

### DON'T ❌
- Commit .env.local to GitHub
- Share .env.local with anyone
- Post in Slack/Discord/Email
- Use wrong key type (Secret instead of Anon)
- Forget http:// in redirect URL

---

## 📱 Production Setup (Vercel Deployment)

When you deploy to Vercel, add the same variables:

### Website: https://vercel.com

### Steps:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings ⚙️
4. Click Environment Variables
5. Add these 3 variables:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your.supabase.co
[Add]

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc...
[Add]

Name: NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
Value: https://yourdomain.com/auth/callback
[Add]
```

6. Click Redeploy

### Important: Update Redirect URL
For production, use your actual domain:
```
WRONG: http://localhost:3000/auth/callback
RIGHT: https://yourdomain.com/auth/callback
```

---

## 🎯 Where Everything Is

| What | Where | Website |
|------|-------|---------|
| Supabase Dashboard | Settings → API | https://app.supabase.com |
| Your API Keys | Supabase → Settings → API | https://app.supabase.com |
| .env.local File | Project root folder | Your computer |
| Vercel Settings | Environment Variables | https://vercel.com |
| Deployment | Vercel Deployment | https://vercel.com/deployments |

---

## 📚 Need More Help?

### For Quick Reference:
→ See **ENV_QUICK_REFERENCE.md**

### For Visual Maps:
→ See **VISUAL_SETUP_GUIDE.md**

### For Complete Details:
→ See **ENVIRONMENT_VARIABLES_SETUP.md** (495 lines!)

### For Quick Start:
→ See **START_HERE.md**

---

## 🆘 Troubleshooting

### Error: "Cannot find Supabase URL"
**Cause:** .env.local not found
**Fix:**
1. Check .env.local exists
2. Check file name is `.env.local` (with dot)
3. Restart dev server

### Error: Signup doesn't work
**Cause:** Wrong credentials
**Fix:**
1. Go to https://app.supabase.com
2. Check Settings → API
3. Copy exact URL and key again
4. Update .env.local
5. Restart dev server

### Error: "Page blank/not loading"
**Cause:** Variables not loaded
**Fix:**
1. Save .env.local
2. Stop dev server (Ctrl+C)
3. Restart: `npm run dev`
4. Wait 5 seconds for rebuild

---

## ✨ Success!

Once you've completed this, you should have:

✅ .env.local file with 3 variables
✅ Variables filled with actual Supabase values
✅ Dev server running
✅ App working at http://localhost:3000
✅ Ready to sign up and test!

---

**Next Step:** Go to **START_HERE.md** for full overview!

**Or:** Go to **ENVIRONMENT_VARIABLES_SETUP.md** for complete detailed guide!
