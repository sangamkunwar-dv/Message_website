# ⚡ Environment Variables - Quick Reference Card

## 📋 Copy-Paste Template

Create file: `.env.local` in your project root and paste this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

---

## 🌐 Where to Find Each Value

### Step 1: Go to Supabase Dashboard
```
Website: https://app.supabase.com
```

### Step 2: Find Your Project
```
Click on your "chat-app" project
```

### Step 3: Click Settings
```
Left sidebar → Settings ⚙️
```

### Step 4: Click API Tab
```
Top tabs → API
```

### Step 5: Copy Values

```
PROJECT URL:
├─ Label: "Project URL"
├─ Value: https://xxxxx.supabase.co
└─ Action: COPY THIS → NEXT_PUBLIC_SUPABASE_URL

ANON KEY:
├─ Label: "Anon" or "Public Key"
├─ Value: eyJhbGciOiJIUzI1NiIs...
└─ Action: COPY THIS → NEXT_PUBLIC_SUPABASE_ANON_KEY

REDIRECT URL:
├─ You create this
├─ Value (dev): http://localhost:3000/auth/callback
└─ Add to: NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
```

---

## 📝 Example (Filled In)

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlzcyI6InN1cGFiYXNlIiwicmVmIjoiYWJjZGVmZ2giLCJyb2xlIjoiYW5vbiJ9.ABC123XYZ789DEF456GHI789
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

---

## ✅ Verification Checklist

- [ ] File name is exactly `.env.local` (with dot)
- [ ] File location: project root folder
- [ ] Has 3 variables (not 2, not 4)
- [ ] NEXT_PUBLIC_SUPABASE_URL starts with `https://`
- [ ] NEXT_PUBLIC_SUPABASE_URL ends with `.supabase.co`
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is a long string
- [ ] NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL is exactly `http://localhost:3000/auth/callback`
- [ ] No extra spaces
- [ ] No quotes around values
- [ ] File is saved
- [ ] Dev server restarted (`npm run dev`)

---

## 🚀 After Setup

1. Restart dev server
2. Open http://localhost:3000
3. Try to sign up
4. Should work! ✅

---

## ⚠️ Important Notes

### DO:
- ✅ Keep .env.local on your computer only
- ✅ Add .env.local to .gitignore (already done)
- ✅ Copy full URL and key (no truncating!)
- ✅ Use Anon key (not Secret key)

### DON'T:
- ❌ Commit .env.local to GitHub
- ❌ Share .env.local with anyone
- ❌ Paste in Slack, Discord, etc.
- ❌ Use wrong key type (Secret instead of Anon)
- ❌ Forget http:// in redirect URL

---

## 🎯 Website Links

| What | Website |
|------|---------|
| Supabase Dashboard | https://app.supabase.com |
| Create Account | https://supabase.com |
| Supabase Docs | https://supabase.com/docs |
| Vercel (for deployment) | https://vercel.com |

---

## 📞 Need More Details?

See: **ENVIRONMENT_VARIABLES_SETUP.md** for full step-by-step guide
