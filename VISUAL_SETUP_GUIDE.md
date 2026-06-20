# 👁️ Visual Setup Guide - Where Everything Is Located

## 📍 Supabase Dashboard Navigation Map

```
┌─────────────────────────────────────────────────────────┐
│           SUPABASE DASHBOARD HOME                        │
│          https://app.supabase.com                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Left Sidebar:                 Main Area:                │
│  ├─ Home                      ├─ Your Projects           │
│  ├─ Projects                  ├─ Create New Project      │
│  │  └─ Your "chat-app" → ⭐   │  └─ [Choose Your Project]│
│  ├─ Documentation                                        │
│  └─ Account Settings                                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Step 1: Click Your Project
```
Home Screen:
┌────────────────────────────────────────┐
│  Projects                              │
├────────────────────────────────────────┤
│                                        │
│  📦 chat-app                    ← CLICK │
│  (or your project name)                │
│                                        │
│  Created on: Dec 20, 2024              │
│  Region: us-east-1                     │
│                                        │
└────────────────────────────────────────┘
```

### Step 2: Inside Project - Find Settings
```
Inside Your Project:
┌──────────────────────────────────────────┐
│  Left Sidebar:                           │
│  ├─ Overview                             │
│  ├─ Editor                               │
│  ├─ Database                             │
│  ├─ Authentication                       │
│  ├─ Storage                              │
│  ├─ SQL Editor                           │
│  ├─ Webhooks                             │
│  ├─ Replication                          │
│  └─ Settings ⚙️  ← CLICK HERE!          │
│                                          │
└──────────────────────────────────────────┘
```

### Step 3: Inside Settings - Find API
```
Settings Page:
┌──────────────────────────────────────────┐
│  Tabs at top:                            │
│  ├─ General                              │
│  ├─ API  ← CLICK HERE!                  │
│  ├─ Database                             │
│  ├─ Auth                                 │
│  └─ Other tabs...                        │
│                                          │
└──────────────────────────────────────────┘
```

### Step 4: In API Tab - Find Your Values
```
API Tab Content:
┌──────────────────────────────────────────┐
│  API Reference                           │
├──────────────────────────────────────────┤
│                                          │
│  📍 Project URL:                         │
│  ├─ Label: "Project URL"                 │
│  ├─ Value: https://abcd.supabase.co  ← COPY THIS |
│  ├─ Copy button: [📋]                    │
│  └─ Note: Use this for NEXT_PUBLIC_...   │
│                                          │
│  📍 Anon Key (Public):                   │
│  ├─ Label: "Anon" or "Public Key"        │
│  ├─ Value: eyJhbGciOiJIUzI1NiI... ← COPY THIS |
│  ├─ Copy button: [📋]                    │
│  └─ Note: Safe to share                  │
│                                          │
│  📍 Service Role Key (Secret):           │
│  ├─ Label: "Service Role"                │
│  ├─ Value: eyJhbGciOiJIUzI1Ni... ← DON'T USE! |
│  ├─ Copy button: [📋]                    │
│  └─ Note: Keep secret!                   │
│                                          │
└──────────────────────────────────────────┘
```

---

## 💻 Creating .env.local File on Your Computer

### Windows (Using File Explorer):
```
Step 1: Open File Explorer
├─ Navigate to your project folder
└─ Example: C:\Users\YourName\chat-app

Step 2: Create File
├─ Right-click in empty space
├─ Select: New → Text Document
├─ Name it: .env.local
└─ Press Enter

Step 3: Open File
├─ Right-click .env.local
├─ Open with → Notepad (or VS Code)
└─ Ready to edit!

Step 4: Add Variables (see below)

Step 5: Save
├─ Press Ctrl+S
└─ File saved!
```

### Mac (Using Finder):
```
Step 1: Open Terminal
├─ Applications → Utilities → Terminal
└─ (Or use Spotlight: Cmd+Space, type "Terminal")

Step 2: Navigate to Project
├─ Type: cd ~/path/to/chat-app
├─ Press Enter
└─ You're now in project folder

Step 3: Create File
├─ Type: touch .env.local
├─ Press Enter
└─ File created!

Step 4: Open File
├─ In Finder: Cmd+Shift+. (to show hidden files)
├─ Right-click .env.local
├─ Open with → VS Code
└─ Ready to edit!

Step 5: Add Variables (see below)

Step 6: Save
├─ Press Cmd+S
└─ File saved!
```

### VS Code (All Platforms - Easiest):
```
Step 1: Open Project in VS Code
├─ VS Code → Open Folder
├─ Select your chat-app folder
└─ Click Open

Step 2: Create File
├─ Click Explorer icon (top left)
├─ Right-click in file list
├─ Select: New File
└─ Name: .env.local

Step 3: Add Variables
├─ File opens automatically
├─ Paste 3 variables (see below)
└─ (with your actual values)

Step 4: Save
├─ Press Ctrl+S (Windows/Linux)
├─ Or Cmd+S (Mac)
└─ File saved!
```

---

## 📝 What to Put in .env.local File

### Template (Copy-Paste):
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### With Real Example:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoMTIzNDU2Iiwicm9sZSI6ImFub24ifQ.ABC123XYZ789
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Variable Breakdown:

| Variable | Where to Find | What It Looks Like |
|----------|---------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → Anon Key | `eyJhbGc...` (long string) |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | You create this (for dev) | `http://localhost:3000/auth/callback` |

---

## 🔍 Finding API Values - Step by Step Visual

### In Supabase Dashboard:

```
1. FIND PROJECT URL:
   
   Settings ⚙️ → API Tab
   ↓
   ┌─────────────────────────────────┐
   │ API Reference                   │
   ├─────────────────────────────────┤
   │                                 │
   │ Project URL:                    │
   │ https://abcd1234.supabase.co    │ ← This one!
   │ [Copy button]                   │
   │                                 │
   └─────────────────────────────────┘


2. FIND ANON KEY:
   
   Same page, scroll down
   ↓
   ┌─────────────────────────────────┐
   │ Anon Key (Public Key):          │
   │ eyJhbGciOiJIUzI1NiIsInR...      │ ← This one!
   │ [Copy button]                   │
   │                                 │
   │ ⚠️ NOT the "Secret Role Key"!  │
   └─────────────────────────────────┘


3. REDIRECT URL:
   
   You create this - no copying needed
   ↓
   Just type: http://localhost:3000/auth/callback
```

---

## 📋 File Structure After Setup

Your project folder should look like:

```
chat-app/
├─ .env.local  ← Your secret file (never commit!)
├─ node_modules/
├─ app/
│  ├─ auth/
│  ├─ chat/
│  └─ layout.tsx
├─ components/
├─ lib/
├─ package.json
├─ tsconfig.json
└─ ... other files

✅ .env.local file exists!
✅ Has 3 variables!
✅ Values filled in!
```

---

## ✅ Verification Steps

### Step 1: File Exists
```
Windows: File Explorer
├─ Open project folder
└─ Look for .env.local

Mac: Finder
├─ Open project folder
├─ Press Cmd+Shift+. (to show hidden files)
└─ Look for .env.local

VS Code:
├─ Open Explorer (Ctrl+Shift+E)
└─ Look for .env.local in file list
```

### Step 2: Values Are Correct
```
Open .env.local file and check:

✅ NEXT_PUBLIC_SUPABASE_URL
   ├─ Starts with: https://
   └─ Ends with: .supabase.co

✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
   ├─ Is a long string
   └─ Starts with: eyJ...

✅ NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
   ├─ Exactly: http://localhost:3000/auth/callback
   └─ No typos!
```

### Step 3: Test It Works
```
1. Save .env.local
2. Stop dev server (Ctrl+C)
3. Restart: npm run dev
4. Open: http://localhost:3000/auth/sign-up
5. Try to sign up
6. If works → ✅ Variables correct!
7. If error → Check values again
```

---

## 🎯 Production Setup (Vercel)

When you deploy to Vercel, add same variables:

```
1. Go to: https://vercel.com
2. Select your project
3. Settings ⚙️
4. Environment Variables
5. Add each variable:

   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your.supabase.co
   [Add]
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGc...
   [Add]
   
   Name: NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
   Value: https://yourdomain.com/auth/callback
   [Add]

6. Click Redeploy
```

⚠️ **Important:** Change redirect URL to your actual domain for production!

---

## 📞 Quick Links

| What | Link |
|------|------|
| Supabase Dashboard | https://app.supabase.com |
| Supabase Settings → API | https://app.supabase.com/project/YOUR_PROJECT/settings/api |
| Vercel Dashboard | https://vercel.com/dashboard |
| Vercel Project Settings | https://vercel.com/dashboard/YOUR_PROJECT/settings/environment-variables |

---

## 🆘 If Lost

Go to: **ENVIRONMENT_VARIABLES_SETUP.md** for detailed explanations
Go to: **ENV_QUICK_REFERENCE.md** for quick copy-paste
