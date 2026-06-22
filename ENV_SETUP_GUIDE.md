# Environment Variables Setup Guide

## What Environment Variables Do You Need?

All the environment variables you need are **ALREADY CONFIGURED** in your `.env.development.local` file. You don't need to add anything manually!

---

## Current Environment Variables (Already Set)

Your app has the following environment variables already configured:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://ljynbvrvohbrocqsvtaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SECRET_KEY=sb_secret__Fh2vwcm-VD7KrJRylUAJQ...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://ljynbvrvohbrocqsvtaj.supabase.co
```

### Database Configuration
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Agv35IMykHLiEClR
POSTGRES_HOST=db.ljynbvrvohbrocqsvtaj.supabase.co
POSTGRES_DATABASE=postgres
POSTGRES_URL=postgres://postgres.ljynbvrvohbrocqsvtaj:Agv35IMykHLiEClR@...
POSTGRES_URL_NON_POOLING=postgres://postgres.ljynbvrvohbrocqsvtaj:Agv35IMykHLiEClR@...
```

### JWT & Security
```
SUPABASE_JWT_SECRET=ykJpQK/wyg8zkA6xlekJkWQOut7Z4J+ycST+PG8BEOqwaFTdM...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercel Analytics
```
VERCEL_WEB_ANALYTICS_ID=C0JJt3dED6aUZShKUGhOnbAZS
```

### Other
```
AI_GATEWAY_API_KEY=vck_5M4tDYXtfumhN4GwRuNrYWHxHFXvnDZSLYAbm3ZjWWX...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://v0.app/chat/api/supabase/redirect/tKgjGGO5AGC
```

---

## Where Are These Environment Variables?

### File Location
```
/vercel/share/v0-project/.env.development.local
```

### How to Access

**Option 1: In v0 UI**
1. Click the **Settings** button (gear icon) in the top right
2. Go to **"Vars"** tab
3. You'll see all environment variables listed there
4. You can add new ones if needed

**Option 2: Edit the File Directly**
1. Open the `.env.development.local` file
2. Add new variables at the bottom
3. Format: `KEY=value`

---

## Do I Need to Add Google/Facebook OAuth Keys?

### Currently: NO

Google and Facebook OAuth are **configured at the Supabase level**, not in environment variables.

### If You Want to Add OAuth Keys:

Only add these if you want to customize OAuth behavior:

```env
# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Facebook OAuth (optional) 
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
```

But they're **not required** - OAuth works through Supabase's built-in OAuth providers.

---

## How to Set Up New Environment Variables

### Step 1: Go to v0 Settings
1. Click **Settings** (gear icon) in top right
2. Click **"Vars"** tab

### Step 2: Add New Variable
1. Click **"Add Variable"** button
2. Enter the variable name
3. Enter the variable value
4. Click **Save**

### Step 3: Choose Variable Type

#### Public Variables (visible in browser)
```
Use NEXT_PUBLIC_ prefix
Example: NEXT_PUBLIC_MY_VAR=value
```

#### Private Variables (server-only)
```
No prefix needed
Example: MY_SECRET_KEY=value
```

---

## Quick Reference: Variable Types

| Variable | Type | Location | Purpose |
|----------|------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Browser & Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Browser & Server | Supabase anonymous key |
| `SUPABASE_SECRET_KEY` | Private | Server only | Supabase admin operations |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | Server only | Supabase service role |
| `POSTGRES_URL` | Private | Server only | Database connection string |
| `AI_GATEWAY_API_KEY` | Private | Server only | AI Gateway API access |

---

## Testing Environment Variables

### Check if Variables Are Loaded

1. Go to any page in your app
2. Open browser console (F12 → Console)
3. Run this command:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```
4. You should see your Supabase URL printed

### If Variables Are Missing

1. Check `.env.development.local` file
2. Make sure the variable is spelled correctly
3. Restart the dev server: `pnpm dev`
4. Clear browser cache

---

## Common Issues & Solutions

### Issue: "SUPABASE_URL is undefined"
**Solution**: 
- Restart dev server
- Check `.env.development.local` has correct values
- Make sure variable name matches exactly (case-sensitive)

### Issue: "Cannot connect to Supabase"
**Solution**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase project is active

### Issue: "Database connection failed"
**Solution**:
- Verify `POSTGRES_URL` is correct
- Check database is running
- Verify credentials in connection string

### Issue: "OAuth not working"
**Solution**:
- OAuth is configured in Supabase dashboard, not env vars
- Go to Supabase → Authentication → Providers
- Enable Google/Facebook
- Add your OAuth app credentials in Supabase

---

## How to Add Variables in v0

### Using the Vars Panel

1. **Open v0 Settings**
   - Click gear icon (Settings) in top right corner

2. **Navigate to Vars Tab**
   - Click the "Vars" tab

3. **Add New Variable**
   ```
   Variable Name: NEXT_PUBLIC_MY_CUSTOM_VAR
   Variable Value: my_custom_value
   ```

4. **Save**
   - Click "Save" button

5. **Restart Dev Server**
   - Stop and restart `pnpm dev`

### Using Environment Files

Create or edit `.env.development.local`:

```env
# Add your variables here
NEXT_PUBLIC_MY_VAR=value
MY_SECRET_VAR=secret_value
```

Then restart: `pnpm dev`

---

## For Production Deployment

When deploying to Vercel, add environment variables:

1. Go to **Vercel Dashboard**
2. Select your **project**
3. Go to **Settings**
4. Click **Environment Variables**
5. Add all variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SECRET_KEY`
   - Any other needed variables

---

## Summary

✅ **All Required Variables**: Already set in `.env.development.local`

✅ **Add New Variables**: Go to Settings → Vars tab in v0

✅ **Public Variables**: Use `NEXT_PUBLIC_` prefix

✅ **Private Variables**: No prefix (server-only)

✅ **Restart After Changes**: Always restart dev server

✅ **OAuth**: Configured in Supabase, not env vars

Your app is **fully configured** and ready to use!
