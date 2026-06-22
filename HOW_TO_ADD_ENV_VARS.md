# How to Add Environment Variables - Step by Step Guide

## Video Instructions (What to Do)

Follow these exact steps to add new environment variables to your app.

---

## Method 1: Using v0 UI (Recommended)

### Step 1: Open Settings

```
Location: Top right corner of v0
Look for: Gear icon (⚙️) or "Settings" button
Click it
```

**Screenshot Path**: Settings button in top right

### Step 2: Click "Vars" Tab

```
In the settings panel that opens:
Look for tabs: "Design", "Rules", "Vars", "Settings"
Click: "Vars"
```

### Step 3: View Current Variables

```
You'll see a list of all current environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SECRET_KEY
- POSTGRES_URL
- ... and more
```

### Step 4: Add New Variable

```
Look for: "Add Variable" button or "+" icon
Click it
```

### Step 5: Fill in the Variable

```
You'll see two fields:

Field 1: Variable Name (Key)
Example: NEXT_PUBLIC_STRIPE_KEY

Field 2: Variable Value
Example: pk_live_123456789

Leave the "Vars" dropdown as is (or select appropriate environment)
```

### Step 6: Save

```
Click: "Save" or "Add" button
Wait for confirmation
```

### Step 7: Restart Dev Server

```
Stop your dev server:
Press: Ctrl + C in terminal

Restart it:
Run: pnpm dev

Wait for: "✓ Ready in X.XXs"
```

### Step 8: Test

```
Your new variable is now available!
Restart the browser or reload the page
```

---

## Method 2: Edit .env.development.local File

### Step 1: Open File

```
File location: /vercel/share/v0-project/.env.development.local
```

### Step 2: Add Your Variable

```
Scroll to the bottom of the file
Add a new line:
VARIABLE_NAME=variable_value

Example:
STRIPE_PUBLIC_KEY=pk_live_123456789
MY_API_URL=https://api.example.com
MY_SECRET=secretvalue123
```

### Step 3: Save File

```
Press: Ctrl + S (or Cmd + S on Mac)
Wait for file to save
```

### Step 4: Restart Dev Server

```
In terminal:
Stop: Ctrl + C
Restart: pnpm dev
```

### Step 5: Verify

```
Your new variable is now active
Test in browser
```

---

## Important Rules

### Rule 1: Public vs Private

```
Public Variables (visible in frontend code):
NEXT_PUBLIC_STRIPE_KEY=pk_live_123

Private Variables (server-only):
STRIPE_SECRET_KEY=sk_live_123
```

### Rule 2: Naming Convention

```
✓ Correct:
MY_VAR=value
NEXT_PUBLIC_API_KEY=key

✗ Wrong:
my-var=value (use underscore, not dash)
MY VAR=value (no spaces)
MY.VAR=value (no dots)
```

### Rule 3: Format

```
✓ Correct:
VAR_NAME=value
NEXT_PUBLIC_KEY=pk_live_abc123

✗ Wrong:
VAR_NAME = value (spaces around =)
VAR_NAME="value" (quotes)
VAR_NAME=https://example.com (spaces in URL ok, value ok)
```

### Rule 4: Restart Required

```
Always restart dev server after adding variables:
Stop: Ctrl + C
Start: pnpm dev
```

---

## Common Variables to Add

### Stripe (Payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Google OAuth
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Facebook OAuth
```
NEXT_PUBLIC_FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
```

### Custom API
```
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_TOKEN=secret123
DATABASE_URL=postgresql://...
```

---

## Verification Checklist

After adding a variable, verify it worked:

- [ ] Variable added in Settings → Vars (or in .env file)
- [ ] Dev server restarted (pnpm dev)
- [ ] Browser reloaded or cache cleared
- [ ] Try to use the variable in your code
- [ ] Check browser console for errors

---

## Troubleshooting

### Variable Not Working?

**Problem**: "Variable is undefined"
```
Solution:
1. Check spelling (case sensitive)
2. Restart dev server
3. Clear browser cache
4. Reload page
```

**Problem**: "Cannot read property of undefined"
```
Solution:
1. Make sure variable is defined
2. Check format: NEXT_PUBLIC_ prefix for public vars
3. Restart dev server
```

**Problem**: "Variable shows in code but not working"
```
Solution:
1. Stop dev server: Ctrl + C
2. Restart: pnpm dev
3. Clear browser cache
4. Hard refresh: Ctrl + Shift + R (Cmd + Shift + R on Mac)
```

### Can't Find Settings?

```
Settings button location: Top right corner
Look for: Gear icon (⚙️)
If not visible: Try clicking the three-dot menu (⋮) icon
```

### Variable List Not Showing?

```
1. Make sure you're in v0 chat
2. Click Settings → Vars tab
3. Wait for variables to load
4. If still blank, try refreshing page
```

---

## For Deployment to Vercel

When you deploy to Vercel, add the same environment variables:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable for:
   - Production
   - Preview
   - Development

Then deploy and variables will be available.

---

## Quick Reference Commands

### Restart Dev Server
```bash
# Stop
Ctrl + C

# Start
pnpm dev
```

### View Current Environment Variables
```bash
# Show all vars from env file
cat .env.development.local
```

### Clear Browser Cache
```
Chrome: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
Safari: Cmd + Option + E
```

---

## Summary

**To add environment variables:**

1. ✅ Click Settings (⚙️) in top right
2. ✅ Click "Vars" tab
3. ✅ Click "Add Variable"
4. ✅ Enter name and value
5. ✅ Save
6. ✅ Restart dev server: `pnpm dev`
7. ✅ Done!

**Your app now has the new environment variable!**
