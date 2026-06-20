# Complete Setup Checklist

Use this checklist to ensure every step is completed before launching your chat application.

---

## Phase 1: Prerequisites (5 minutes)

- [ ] **Node.js Installed**
  - Download: https://nodejs.org/
  - Verify: `node --version` (should be 18+)
  - Verify: `npm --version`

- [ ] **Git Installed**
  - Download: https://git-scm.com/
  - Verify: `git --version`

- [ ] **Code Editor**
  - Recommended: https://code.visualstudio.com/
  - Alternative: WebStorm, Sublime Text

- [ ] **Browser**
  - Chrome, Firefox, Safari, or Edge
  - Dev Tools available (F12)

- [ ] **GitHub Account**
  - Create: https://github.com/signup
  - Email verified

---

## Phase 2: Supabase Setup (15 minutes)

### Create Supabase Account

- [ ] Go to https://supabase.com
- [ ] Click "Sign Up"
- [ ] Sign up with GitHub account
- [ ] Authorize Supabase

### Create Project

- [ ] Click "New Project"
- [ ] Project name: `chat-app`
- [ ] Create secure password (save this!)
- [ ] Select region (closest to you)
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for initialization

### Get Credentials

- [ ] In dashboard, go to **Settings** → **API**
- [ ] Copy **Project URL**
  - Format: `https://xxxxx.supabase.co`
  - Save in safe location
- [ ] Copy **Anon Key**
  - Format: `eyJhbGciOiJIUzI1NiIsIn...`
  - Save in safe location

### Enable Email Authentication

- [ ] Go to **Authentication** → **Providers**
- [ ] Find **Email** provider
- [ ] Toggle ON to enable
- [ ] Go to **Authentication** → **Email Templates**
- [ ] Verify default templates exist

### Create Storage Bucket

- [ ] Go to **Storage** in left sidebar
- [ ] Click "New bucket"
- [ ] Bucket name: `chat-attachments`
- [ ] UNCHECK "Private bucket" (make public)
- [ ] Click "Create bucket"
- [ ] Bucket appears in list

### Enable Realtime

- [ ] Go to **Database** → **Replication**
- [ ] Find **Realtime Publications**
- [ ] Toggle ON for:
  - [ ] `public.messages`
  - [ ] `public.users`
  - [ ] `public.conversation_participants`
- [ ] Click Save

### Verify Database Schema

- [ ] Go to **SQL Editor**
- [ ] Run query:
  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
  ```
- [ ] Should see 6 tables:
  - [ ] `users`
  - [ ] `conversations`
  - [ ] `conversation_participants`
  - [ ] `messages`
  - [ ] `attachments`
  - [ ] `call_sessions`

---

## Phase 3: Local Development Setup (10 minutes)

### Clone Repository

- [ ] Choose folder for project
- [ ] Open terminal/command prompt
- [ ] Run:
  ```bash
  git clone https://github.com/YOUR_USERNAME/chat-app.git
  cd chat-app
  ```
- [ ] Or download ZIP and extract

### Create Environment File

- [ ] In project root, create file: `.env.local`
- [ ] Add these variables:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
  NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
  ```
- [ ] Replace values from Supabase
- [ ] Save file
- [ ] DO NOT commit this file to Git

### Install Dependencies

- [ ] Open terminal in project folder
- [ ] Run:
  ```bash
  npm install
  # OR
  pnpm install
  # OR
  yarn install
  ```
- [ ] Wait for installation (2-5 minutes)
- [ ] No errors should appear

### Start Development Server

- [ ] Run:
  ```bash
  npm run dev
  # OR
  pnpm dev
  # OR
  yarn dev
  ```
- [ ] Should see: `ready - started server on 0.0.0.0:3000`
- [ ] Open http://localhost:3000 in browser
- [ ] Page should load

---

## Phase 4: Test Authentication (10 minutes)

### Test Signup

- [ ] Go to http://localhost:3000/auth/sign-up
- [ ] Page loads without errors
- [ ] Form fields visible:
  - [ ] Username
  - [ ] Email
  - [ ] Password
  - [ ] Confirm Password
  - [ ] Terms & Conditions checkbox
- [ ] Fill form:
  - Username: `testuser1`
  - Email: `test1@example.com`
  - Password: `Test@12345`
  - Confirm: `Test@12345`
  - Check Terms & Conditions
- [ ] Click "Sign Up"
- [ ] Should redirect to success page

### Verify Email in Supabase

- [ ] Go to Supabase dashboard
- [ ] Click **Authentication** → **Users**
- [ ] Should see your new user
- [ ] Email: `test1@example.com`
- [ ] Status: Unconfirmed (likely)

### Manually Confirm User

- [ ] In Supabase Users list
- [ ] Click the **•••** menu next to your user
- [ ] Select **"Confirm user"**
- [ ] Status changes to Confirmed

### Test Login

- [ ] Go to http://localhost:3000/auth/login
- [ ] Form fields visible:
  - [ ] Email
  - [ ] Password
  - [ ] "Forgot password?" link
  - [ ] "Sign up" link
- [ ] Enter credentials:
  - Email: `test1@example.com`
  - Password: `Test@12345`
- [ ] Click "Log In"
- [ ] Should redirect to chat page

---

## Phase 5: Test Forgot Password (5 minutes)

### Request Password Reset

- [ ] Go to http://localhost:3000/auth/forgot-password
- [ ] Page loads
- [ ] Enter email: `test1@example.com`
- [ ] Click "Send Reset Link"
- [ ] Should show success message

### Verify in Supabase

- [ ] Go to Supabase dashboard
- [ ] Click **Authentication** → **Logs**
- [ ] Look for "reset password email" entry
- [ ] Email should be queued/sent

---

## Phase 6: Test Chat Interface (10 minutes)

### Create Second User

- [ ] Sign out (log out)
- [ ] Open second browser window (private window)
- [ ] Go to http://localhost:3000/auth/sign-up
- [ ] Create second user:
  - Username: `testuser2`
  - Email: `test2@example.com`
  - Password: `Test@12345`
  - Confirm: `Test@12345`
- [ ] Click "Sign Up"
- [ ] Manually confirm in Supabase dashboard

### Login Both Users

- [ ] **Window 1**: Login as test1@example.com
- [ ] Should see chat page/sidebar
- [ ] **Window 2**: Login as test2@example.com
- [ ] Should see chat page/sidebar

### Test Search

- [ ] **Window 1**: Look for search box
- [ ] Search for: `testuser2`
- [ ] Should see user in results
- [ ] Click to create conversation

### Test Messaging

- [ ] **Window 1**: Type a message: "Hello from user 1"
- [ ] Send message
- [ ] **Window 2**: Should see message appear in real-time
- [ ] **Window 2**: Type: "Hello back!"
- [ ] Send message
- [ ] **Window 1**: Should see message appear

### Test Message History

- [ ] Refresh one window
- [ ] Previous messages should still be there
- [ ] Verify messages persist

---

## Phase 7: Test File Upload (5 minutes)

### Upload a File

- [ ] In chat, find attachment button
- [ ] Click to upload file
- [ ] Choose a small image or document
- [ ] Click Open/Upload
- [ ] File should appear as message

### Verify in Supabase

- [ ] Go to Supabase dashboard
- [ ] Click **Storage**
- [ ] Find `chat-attachments` bucket
- [ ] Should see your uploaded file

---

## Phase 8: Documentation Review (10 minutes)

- [ ] Read `README.md`
- [ ] Read `QUICK_START.md`
- [ ] Read `SETUP_COMPLETE_GUIDE.md`
- [ ] Read `EMAIL_VERIFICATION_GUIDE.md`
- [ ] Read `TERMS_AND_CONDITIONS.md`
- [ ] Read `PRIVACY_POLICY.md`
- [ ] Review `ARCHITECTURE.md`

---

## Phase 9: Before Production (Optional)

### Custom Email Configuration

- [ ] Choose email service (SendGrid, Gmail, AWS SES)
- [ ] Create account with service
- [ ] Get SMTP credentials
- [ ] Add to Supabase Email Templates
- [ ] Test email sending
- [ ] Customize email templates with branding

### Custom Domain (Optional)

- [ ] Purchase domain (if not already)
- [ ] Point to Vercel DNS records
- [ ] Add to Vercel project settings
- [ ] Configure SSL certificate
- [ ] Test domain access

---

## Phase 10: Deployment to Vercel (15 minutes)

### Push to GitHub

- [ ] Make sure `.env.local` is in `.gitignore`
- [ ] Run:
  ```bash
  git add .
  git commit -m "Initial commit"
  git push -u origin main
  ```
- [ ] Verify push succeeded

### Deploy to Vercel

- [ ] Go to https://vercel.com
- [ ] Click "Sign Up" (or login)
- [ ] Sign up with GitHub
- [ ] Authorize Vercel
- [ ] Click "New Project"
- [ ] Select `chat-app` repository
- [ ] Click "Import"
- [ ] Leave settings as default
- [ ] Go to **Environment Variables**
- [ ] Add:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (use Vercel URL)
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)

### Verify Deployment

- [ ] Get Vercel URL (shown after deploy)
- [ ] Open URL in browser
- [ ] Signup and login should work
- [ ] Chat should function
- [ ] Files should upload

---

## Phase 11: Post-Deployment Tasks (Optional)

### Monitor Performance

- [ ] Check Vercel dashboard for:
  - [ ] Deployment status: Success ✓
  - [ ] Build logs: No errors
  - [ ] Function logs: No errors
  - [ ] Database connections: Successful

### Setup Monitoring

- [ ] Add Vercel Analytics
- [ ] Enable error tracking
- [ ] Setup uptime monitoring
- [ ] Configure alerts

### Invite Users

- [ ] Share Vercel URL with users
- [ ] Users can sign up
- [ ] Verify email confirmation works
- [ ] Test messaging between real users

---

## Phase 12: Customization (Optional)

### Branding

- [ ] Update app title in `layout.tsx`
- [ ] Change colors in `globals.css`
- [ ] Upload logo to Supabase Storage
- [ ] Update logo in `page.tsx`
- [ ] Change email templates branding

### Features

- [ ] Add group chats (database ready)
- [ ] Add user profiles
- [ ] Add message reactions
- [ ] Add typing indicators
- [ ] Add voice/video calling (Twilio)

### Legal

- [ ] Customize Terms & Conditions
- [ ] Customize Privacy Policy
- [ ] Get legal review
- [ ] Add to website

---

## Troubleshooting Checklist

### If Dependencies Won't Install

- [ ] Delete `node_modules` folder
- [ ] Delete `package-lock.json` (or `pnpm-lock.yaml`)
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Run install again: `npm install`

### If Dev Server Won't Start

- [ ] Check `.env.local` exists
- [ ] Verify all variables correct
- [ ] Check port 3000 not in use
- [ ] Restart computer
- [ ] Check Node.js version (18+)

### If Signup Fails

- [ ] Check Supabase project is active
- [ ] Verify credentials in `.env.local`
- [ ] Check Supabase Authentication enabled
- [ ] Check internet connection
- [ ] Check browser console (F12) for errors

### If Messages Don't Appear

- [ ] Check Supabase Realtime enabled
- [ ] Verify both users in same conversation
- [ ] Try refreshing page
- [ ] Check browser console for errors
- [ ] Check Supabase database in dashboard

### If File Upload Fails

- [ ] Check storage bucket exists
- [ ] Verify bucket is public (not private)
- [ ] Check file size (under 5MB recommended)
- [ ] Try different file type
- [ ] Check browser console for errors

---

## Final Verification

Before considering setup complete, verify:

### Core Features
- [ ] Sign up works
- [ ] Email verification works
- [ ] Login works
- [ ] Forgot password works
- [ ] User search works
- [ ] Can create conversation
- [ ] Can send messages in real-time
- [ ] Can upload files
- [ ] Messages persist
- [ ] Can see profile info

### Security
- [ ] Passwords are encrypted
- [ ] HTTPS is enabled
- [ ] Database is secure (RLS enabled)
- [ ] No sensitive data in logs
- [ ] No API keys in code

### Performance
- [ ] Pages load quickly
- [ ] Messages sent/received instantly
- [ ] File uploads are fast
- [ ] No console errors
- [ ] No browser warnings

### Documentation
- [ ] All docs reviewed
- [ ] Terms & Conditions available
- [ ] Privacy Policy available
- [ ] Setup guide complete
- [ ] Email verification explained

---

## Success Checklist

✅ **Setup is Complete When:**

- [ ] Supabase project active with data
- [ ] Local dev server running
- [ ] Authentication working (signup/login)
- [ ] Email verification working
- [ ] Chat messaging working
- [ ] File uploads working
- [ ] Deployed to Vercel successfully
- [ ] Production app accessible
- [ ] All documentation reviewed
- [ ] No errors in console/logs

**Congratulations! Your chat app is ready to use! 🎉**

---

## Next Steps

1. **Invite Users**
   - Share Vercel URL
   - Users sign up
   - Start chatting

2. **Monitor**
   - Check Vercel dashboard daily
   - Review error logs weekly
   - Monitor performance

3. **Improve**
   - Gather user feedback
   - Plan feature additions
   - Optimize performance

4. **Scale**
   - Monitor database usage
   - Increase storage as needed
   - Add more regions if needed

---

## Support

If anything doesn't work:

1. Check the troubleshooting section above
2. Review relevant documentation files
3. Check browser console (F12) for errors
4. Check Supabase dashboard for database errors
5. Check Vercel dashboard for deployment issues

**Need help?**
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Contact support via docs

---

**Last Updated:** June 2024
**Version:** 1.0
