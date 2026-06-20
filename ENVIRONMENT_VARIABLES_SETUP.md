# 🔑 Environment Variables Complete Setup Guide

## 📋 Table of Contents
1. What are environment variables?
2. All required variables
3. Where to find each one (with website links)
4. How to create .env.local file
5. Step-by-step for each service
6. Testing & verification

---

## 🎓 What are Environment Variables?

Environment variables are **secret settings** that your app uses but doesn't show in code.

Think of it like:
- **Bad:** `const API_KEY = "sk_test_123456"` in code (DANGEROUS!)
- **Good:** Use environment variable: `.env.local` file (SAFE!)

Why? Because:- Won't accidentally commit secrets to GitHub
- Easy to change for dev vs production
- Different values for different computers

---

## ✅ All Required Environment Variables

Your chat app needs **3 main variables** from Supabase:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
```

Let me explain each one:

| Variable | What It Is | Example | Where to Find |
|----------|-----------|---------|---------------|
| **NEXT_PUBLIC_SUPABASE_URL** | Your database server address | `https://abcdefgh.supabase.co` | Supabase Dashboard → Settings → API |
| **NEXT_PUBLIC_SUPABASE_ANON_KEY** | Public key to access your database | `eyJhbGciOiJIUzI1NiIsInR5...` | Supabase Dashboard → Settings → API |
| **NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL** | Where to redirect after login | `http://localhost:3000/auth/callback` | You create this (for local dev) |

---

## 🌐 Where to Get Each Variable

### Variable 1: NEXT_PUBLIC_SUPABASE_URL

**Website:** https://supabase.com

**Step-by-step to find it:**

1. Go to https://app.supabase.com
2. Sign in with your account
3. Click on your project name (e.g., "chat-app")
4. Go to **Settings** (⚙️ icon in left menu)
5. Click **API** tab
6. Look for **"Project URL"**
7. Copy the entire URL (starts with https://)
8. Example: `https://abcdefgh.supabase.co`

```
Screenshot Path in Dashboard:
Settings ⚙️ → API → Project URL ✓
```

---

### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

**Website:** https://supabase.com

**Step-by-step to find it:**

1. Same as above: https://app.supabase.com
2. Go to **Settings** ⚙️
3. Click **API** tab
4. Find the **"Anon"** section (or "Anon Key")
5. Click the **copy button** next to it (or just copy the long text)
6. It looks like a long random string: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...`

```
Screenshot Path in Dashboard:
Settings ⚙️ → API → "Anon" Key → Copy Button ✓
```

⚠️ **IMPORTANT:**
- This key is **safe to share** (it's public)
- Don't accidentally use the "Secret" key instead!
- Look for "**Anon**" or "**Public**" not "**Secret**"

---

### Variable 3: NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL

**Website:** You create this! (no external website)

**What it means:**
- After user logs in, where should they go?
- For **development** (local): `http://localhost:3000/auth/callback`
- For **production** (deployed): `https://yourapp.com/auth/callback`

**For Development (What You Need Now):**
```
http://localhost:3000/auth/callback
```

**For Production (When You Deploy):**
Replace with your actual website:
```
https://yourdomain.com/auth/callback
```

---

## 📝 How to Create .env.local File

### Location: 
Your project root directory

### File Name:
`.env.local` (exactly like this, with the dot at the start)

### Step 1: Open Your Project Folder
```
Windows: Open File Explorer
Mac: Open Finder
Linux: Open file manager
Navigate to your project folder
```

### Step 2: Create New File
**Windows:**
1. Right-click in empty space
2. Select **New** → **Text Document**
3. Name it: `.env.local`
4. Click OK (ignore warning about dot)

**Mac/Linux:**
1. Open Terminal in project folder
2. Run: `touch .env.local`

**VS Code (Easiest):**
1. Open your project in VS Code
2. Click **Explorer** (top left)
3. Right-click in empty space
4. Select **New File**
5. Type: `.env.local`
6. Press Enter

### Step 3: Add Your Variables
Open `.env.local` in a text editor and paste:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_URL_HERE.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Step 4: Replace the Values
Replace:
- `YOUR_URL_HERE` → Your actual Supabase URL
- `YOUR_ANON_KEY_HERE` → Your actual Anon Key

**Example (filled in):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlzcyI6InN1cGFiYXNlIiwicmVmIjoiYWJjZGVmZ2giLCJyb2xlIjoiYW5vbiJ9.ABC123XYZ789
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Step 5: Save File
Press **Ctrl+S** (Windows/Linux) or **Cmd+S** (Mac)

✅ **Done!** Your environment variables are now set up!

---

## 🔄 Step-by-Step: Get Supabase Credentials

### Step 1: Create Supabase Account
**Website:** https://supabase.com

1. Go to https://supabase.com
2. Click **"Start your project"** or **"Sign Up"**
3. Choose **Sign up with GitHub**
4. Authorize Supabase access
5. ✅ Account created!

### Step 2: Create a Project
1. You're now in Supabase dashboard
2. Click **"New Project"** button
3. Fill in form:
   - **Name:** `chat-app` (or your name)
   - **Password:** Create a strong password
   - **Region:** Pick closest to you (e.g., us-east-1 for USA)
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize...
6. ✅ Project created!

### Step 3: Get Your Credentials
1. In your project, go to **Settings** ⚙️ (left sidebar)
2. Click **API** tab
3. You'll see:
   ```
   Project URL:  https://abcdefgh.supabase.co
   Anon Key:     eyJhbGciOiJIUzI1NiIsInR5...
   ```
4. **Copy both values**

### Step 4: Create .env.local
1. In your project folder, create file: `.env.local`
2. Add the three variables (from section above)
3. Save the file

### Step 5: Restart Your Dev Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

✅ **Done!** Variables are loaded!

---

## 🔍 How to Find in Supabase Dashboard

### Dashboard URL
```
https://app.supabase.com
```

### Navigation Map
```
Dashboard (home page)
├─ Projects (list of your projects)
│  └─ Your Project (click your "chat-app" project)
│     ├─ Settings ⚙️
│     │  ├─ API (THIS ONE! 👈)
│     │  ├─ Database
│     │  └─ Other settings
│     ├─ Storage
│     ├─ Authentication
│     └─ Database
```

### In API Settings Tab
You'll see:

```
API Reference
├─ Project URL: https://abcdefgh.supabase.co  ← Copy this!
├─ Anon Key: eyJhbGciOiJIUzI1NiIsInR5...      ← Copy this!
└─ Service Role Key: (DON'T USE THIS!)
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Mistake 1: Using Wrong Key
```
WRONG:
NEXT_PUBLIC_SUPABASE_SECRET_KEY=eyJhbGc... (Secret key - DON'T USE!)

RIGHT:
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (Anon key - USE THIS!)
```

### ❌ Mistake 2: Wrong File Name
```
WRONG:
.env (missing "local")
env.local (missing dot)
.ENV.LOCAL (wrong case)

RIGHT:
.env.local (exactly like this!)
```

### ❌ Mistake 3: Missing http:// in Redirect URL
```
WRONG:
localhost:3000/auth/callback (missing http://)

RIGHT:
http://localhost:3000/auth/callback
```

### ❌ Mistake 4: Sharing .env.local
```
NEVER: Commit .env.local to GitHub!
       Push it to a public server!
       Share it in chat/email!

WHY: Anyone with these values can access your database!

SAFE: Keep it on your computer only!
      Add to .gitignore (already done!)
```

---

## ✅ How to Verify Variables Are Loaded

### Option 1: Check in VS Code Terminal
```bash
# If on Mac/Linux:
cat .env.local

# If on Windows PowerShell:
Get-Content .env.local

# If on Windows CMD:
type .env.local
```

You should see:
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://...
```

### Option 2: Check in Browser Console
1. Go to http://localhost:3000
2. Press **F12** (open Developer Tools)
3. Go to **Console** tab
4. Type: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
5. Should show your URL (not undefined)

### Option 3: Check if App Works
1. Go to http://localhost:3000/auth/sign-up
2. Try to sign up
3. If it works → Variables are correct! ✅
4. If error → Check variables again

---

## 📱 Form/Input Locations in Code

If you want to know where these variables are **used** in your code:

### File: `/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Uses variable 1
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Uses variable 2
  )
}
```

### File: `/app/auth/sign-up/page.tsx`
```typescript
options: {
  emailRedirectTo: 
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? // Uses variable 3
    `${window.location.origin}/auth/callback`
}
```

---

## 🔐 Production Environment Variables

When you deploy to **Vercel** (production):

### Where to Add Them:
1. Go to https://vercel.com
2. Go to your project settings
3. Click **Environment Variables**
4. Add the same 3 variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL = https://yourdomain.com/auth/callback
   ```
5. Click **Save**
6. Redeploy your app

### Important for Production:
- Update redirect URL to your **actual domain**:
  ```
  BEFORE: http://localhost:3000/auth/callback
  AFTER: https://yourdomain.com/auth/callback
  ```
- Update Supabase **Auth** settings too:
  1. Supabase dashboard → Settings → Auth
  2. Add redirect URL: `https://yourdomain.com/auth/callback`
  3. Save

---

## 📚 Related Documentation

For more help:
- **START_HERE.md** - Overview and quick start
- **SETUP_COMPLETE_GUIDE.md** - Full setup guide
- **SETUP_CHECKLIST.md** - Phase-by-phase checklist
- **ARCHITECTURE.md** - Technical architecture

---

## 🆘 Troubleshooting

### Problem: "Cannot find module" error

**Cause:** Variables not loaded

**Solution:**
1. Check .env.local file exists
2. Check file name is exactly `.env.local`
3. Restart dev server: `npm run dev`

### Problem: Signup doesn't work

**Cause:** Wrong credentials

**Solution:**
1. Check you copied full URL (with https://)
2. Check you copied full Anon key (long string)
3. Check no extra spaces or quotes
4. Restart dev server

### Problem: Redirect not working

**Cause:** Wrong redirect URL

**Solution:**
1. Check URL is exactly: `http://localhost:3000/auth/callback`
2. Not: `localhost:3000/...` (missing http://)
3. Not: `http://localhost:8000/...` (wrong port)

### Problem: Can't find API settings in Supabase

**Cause:** Looking in wrong place

**Solution:**
1. Go to https://app.supabase.com
2. Click your project
3. Left sidebar → **Settings** ⚙️
4. Tab → **API**
5. You should see Project URL and Anon Key

---

## ✨ Summary

### What You Need:
- 3 environment variables from Supabase
- 1 file (.env.local) in your project root
- 5 minutes to set up

### Where to Go:
- Supabase: https://supabase.com
- Your .env.local file (local computer)
- Later: Vercel for production

### How to Verify:
- App loads without errors
- Signup works
- You can create account

### Keep Safe:
- NEVER commit .env.local to GitHub
- NEVER share these values
- Keep them on your computer only

---

## 🎯 Quick Checklist

- [ ] Create Supabase account (https://supabase.com)
- [ ] Create Supabase project named "chat-app"
- [ ] Go to Settings → API
- [ ] Copy Project URL
- [ ] Copy Anon Key
- [ ] Create .env.local file in project root
- [ ] Add 3 variables with correct values
- [ ] Save .env.local
- [ ] Restart dev server (`npm run dev`)
- [ ] Test: Go to http://localhost:3000/auth/sign-up
- [ ] Try to sign up
- [ ] ✅ Works! You're done!

---

**Questions?** Check SETUP_COMPLETE_GUIDE.md or START_HERE.md!
