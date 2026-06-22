# Where to Click in v0 - Visual Guide

## Your Question
"where to add form where i have to add there"

---

## Answer: Settings → Vars Tab

### Step-by-Step Visual Guide

#### STEP 1: Find the Settings Button
```
Look at: TOP RIGHT CORNER of v0 screen
You'll see: Gear icon (⚙️)
Click it
```

**Location on screen:**
```
┌─────────────────────────────────────┐
│  v0 Chat Interface                  │
│                                     │ 
│                          ⚙️ ← Click here
│                                     │
│  Chat messages here...              │
│                                     │
└─────────────────────────────────────┘
```

---

#### STEP 2: Settings Panel Opens
```
A panel appears with tabs:
- Design
- Rules  
- Vars ← Click this one!
- Settings
```

**What you'll see:**
```
┌─────────────────────────────┐
│ [Design] [Rules] [Vars] [Settings] │
├─────────────────────────────┤
│                             │
│  Your environment variables │
│  listed here...             │
│                             │
└─────────────────────────────┘
```

---

#### STEP 3: Click "Vars" Tab
```
In the panel, click: "Vars"
You'll now see all environment variables
```

**What you see now:**
```
┌─────────────────────────────────────────┐
│ Current Environment Variables:          │
├─────────────────────────────────────────┤
│ □ NEXT_PUBLIC_SUPABASE_URL              │
│ □ NEXT_PUBLIC_SUPABASE_ANON_KEY         │
│ □ SUPABASE_SECRET_KEY                   │
│ □ POSTGRES_URL                          │
│ □ And 10 more...                        │
│                                         │
│ [Add Variable] button                   │
└─────────────────────────────────────────┘
```

---

#### STEP 4: Click "Add Variable"
```
Look for: "Add Variable" button
Click it
A form appears
```

**Form that appears:**
```
┌──────────────────────────────────────┐
│ Add Environment Variable             │
├──────────────────────────────────────┤
│                                      │
│ Variable Name: [_________________]   │
│ (e.g., STRIPE_KEY)                   │
│                                      │
│ Variable Value: [_________________]  │
│ (e.g., pk_live_123)                  │
│                                      │
│ Environment: [All] (dropdown)        │
│                                      │
│ [Cancel] [Save]                      │
│                                      │
└──────────────────────────────────────┘
```

---

#### STEP 5: Fill in the Form
```
Field 1: Variable Name
→ Type the name (e.g., STRIPE_KEY)

Field 2: Variable Value
→ Type the value (e.g., pk_live_123)

Leave Environment as: "All"
```

**Example filled form:**
```
┌──────────────────────────────────────┐
│ Add Environment Variable             │
├──────────────────────────────────────┤
│                                      │
│ Variable Name: STRIPE_KEY            │
│                                      │
│ Variable Value: pk_live_123456       │
│                                      │
│ Environment: All ▼                   │
│                                      │
│ [Cancel] [Save] ← Click Save         │
│                                      │
└──────────────────────────────────────┘
```

---

#### STEP 6: Click Save
```
Click: [Save] button
Variable is now saved
```

**Success message appears:**
```
✓ Variable saved successfully!
```

---

#### STEP 7: Restart Dev Server
```
In terminal:
Stop: Ctrl + C
Start: pnpm dev

Wait for: "✓ Ready" message
```

**Terminal:**
```
$ pnpm dev
- Event: compiled successfully
- Event: EVELOPMENT_READY

✓ Ready in 3.2s
```

---

#### STEP 8: Done!
```
Your new variable is now active
Reload browser page
Use the variable in your code
```

---

## Alternative: Edit File Directly

### If You Want to Edit the File Directly

#### Location of File
```
/vercel/share/v0-project/.env.development.local
```

#### How to Edit
```
1. Open the file
2. Go to bottom
3. Add new line: VARIABLE_NAME=value
4. Save file
5. Restart dev server: pnpm dev
```

**Example file:**
```env
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Your new variable
STRIPE_KEY=pk_live_123456 ← Add here
```

---

## Complete Picture

### Where Everything Is Located

```
v0 Interface (Browser)
├── TOP RIGHT
│   └── ⚙️ Settings Button
│       └── Vars Tab
│           ├── View all variables
│           ├── Add Variable button
│           └── Edit/Delete buttons
│
└── Files (on disk)
    └── .env.development.local
        ├── Contains all variables
        └── Edit directly if needed
```

---

## Quick Checklist

- [ ] Find gear icon (⚙️) top right
- [ ] Click it
- [ ] Click "Vars" tab
- [ ] See all variables
- [ ] Click "Add Variable"
- [ ] Fill form
- [ ] Click Save
- [ ] Restart dev server
- [ ] Done!

---

## If You Can't Find It

### "I don't see the Settings button"
```
1. Refresh the page (F5)
2. Look for gear icon (⚙️) in top right
3. If still missing, click three-dot menu (⋮)
4. Select Settings
```

### "I don't see the Vars tab"
```
1. Make sure Settings panel is open
2. Look for tabs: Design, Rules, Vars, Settings
3. Click "Vars" tab
4. If no tabs appear, refresh page
```

### "I can't find the Add Variable button"
```
1. Make sure you're in "Vars" tab
2. Scroll down in the panel
3. Look for "Add Variable" button
4. Or "+" icon
```

---

## Common Variable Examples

### Stripe (Payments)
```
Variable Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Variable Value: pk_live_123456789
```

### Custom API
```
Variable Name: NEXT_PUBLIC_API_URL
Variable Value: https://api.example.com
```

### Secret Key
```
Variable Name: API_SECRET
Variable Value: secret_key_123
```

### Database
```
Variable Name: DATABASE_URL
Variable Value: postgresql://user:password@host/db
```

---

## Important Rules

### Format
```
✓ Correct:  VARIABLE_NAME=value
✗ Wrong:    VARIABLE_NAME = value (spaces)
✗ Wrong:    VARIABLE_NAME="value" (quotes)
```

### Naming
```
✓ Correct:  MY_VARIABLE
✓ Correct:  NEXT_PUBLIC_KEY
✗ Wrong:    My-Variable (use underscore)
✗ Wrong:    my_variable (use UPPERCASE)
```

### Public vs Private
```
Public (browser sees):    NEXT_PUBLIC_KEY=value
Private (server only):    SECRET_KEY=value
```

---

## After Adding Variables

### Restart Dev Server

**Terminal:**
```bash
# Stop current server
Ctrl + C

# Start new server
pnpm dev

# Wait for message:
✓ Ready in X.Xs
```

### Test It Works

1. Reload browser (F5)
2. Open browser console (F12)
3. Run: `console.log(process.env.VARIABLE_NAME)`
4. You should see your value printed

---

## Summary

**To add environment variables in v0:**

1. ⚙️ Settings (top right)
2. Vars tab
3. Add Variable button
4. Fill form
5. Save
6. Restart: `pnpm dev`
7. Done! ✓

**That's it!**
