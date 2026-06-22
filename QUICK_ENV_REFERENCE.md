# Quick Environment Variables Reference

## TL;DR - Everything is Already Set Up!

✅ All environment variables are **already configured**
✅ You don't need to add anything right now
✅ The app is ready to use as-is

---

## Where Are Environment Variables?

### File Location
```
.env.development.local
```

### Access in v0 UI
```
Settings (gear icon) → "Vars" tab → Add/Edit variables
```

---

## What Variables Exist?

### Required Variables (Already Set ✓)

#### Supabase Access
```
NEXT_PUBLIC_SUPABASE_URL=https://ljynbvrvohbrocqsvtaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SECRET_KEY=sb_secret__Fh2vwcm-VD7KrJRylUAJQ...
```

#### Database Access
```
POSTGRES_URL=postgres://postgres.ljynbvrvohbrocqsvtaj:Agv35IMykHLiEClR@...
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Agv35IMykHLiEClR
```

---

## How to Add New Variables?

### Method 1: v0 UI (Easiest)
```
1. Click Settings (⚙️) top right
2. Click "Vars" tab
3. Click "Add Variable"
4. Enter Name and Value
5. Save
6. Restart dev server
```

### Method 2: Edit File Directly
```
1. Open .env.development.local
2. Add line at bottom: KEY=value
3. Save file
4. Restart dev server
```

---

## Variable Name Rules

### Public Variables (Browser Can See)
```
Use prefix: NEXT_PUBLIC_
Example: NEXT_PUBLIC_API_URL=https://api.example.com
```

### Private Variables (Server Only)
```
No prefix needed
Example: API_SECRET_KEY=secret123
```

---

## Common Variables You Might Add

### API Keys
```
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=your_secret_key_here
```

### OAuth (Optional - Works Without These)
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id_here
NEXT_PUBLIC_FACEBOOK_APP_ID=your_id_here
```

### Database
```
DATABASE_URL=postgresql://user:password@host/db
```

### External Services
```
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## Quick Checklist

- [ ] Need to add a new API key? → Use Settings → Vars
- [ ] Adding a secret? → Don't use NEXT_PUBLIC_ prefix
- [ ] Adding a public value? → Use NEXT_PUBLIC_ prefix
- [ ] Made changes? → Restart dev server (`pnpm dev`)
- [ ] Variables not loading? → Clear cache, restart server

---

## If Something Isn't Working

### Check #1: Variable Name
- Variable names are **CASE SENSITIVE**
- Must match exactly in code

### Check #2: Dev Server Restarted
- Stop dev server (Ctrl+C)
- Restart: `pnpm dev`

### Check #3: Browser Cache
- Clear browser cache or open in Incognito

### Check #4: File Syntax
- Format must be: `NAME=value`
- No quotes needed
- No spaces around `=`

---

## Current Setup Summary

| Category | Status | Count |
|----------|--------|-------|
| Supabase Vars | ✓ Configured | 5 |
| Database Vars | ✓ Configured | 5 |
| Security Vars | ✓ Configured | 3 |
| Analytics Vars | ✓ Configured | 1 |
| OAuth Vars | Optional | - |

**Total Configured: 14 variables**
**Needed for app to work: 0 additional variables**

---

## Next Steps

1. **Test the app** - Everything is ready
2. **Add custom variables** if needed via Settings → Vars
3. **Deploy to Vercel** - Copy vars to Vercel dashboard
4. **Enable OAuth** (optional) - Configure in Supabase dashboard

---

## Support

For more details, see:
- `ENV_SETUP_GUIDE.md` - Detailed env setup
- `.env.development.local` - Current variables
- Supabase Dashboard - For OAuth setup
