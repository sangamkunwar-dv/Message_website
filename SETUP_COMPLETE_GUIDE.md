# Complete Setup Guide - Real-Time Chat Application

This guide provides **step-by-step instructions** to set up and deploy the entire chat application. Follow every step to ensure everything works correctly.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development Setup](#local-development-setup)
4. [Email Configuration](#email-configuration)
5. [Database Verification](#database-verification)
6. [Testing the Application](#testing-the-application)
7. [Deployment to Vercel](#deployment-to-vercel)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **A code editor** - [VS Code recommended](https://code.visualstudio.com/)
- **A GitHub account** - [Create here](https://github.com/signup)
- **An email address** for Supabase

---

## Supabase Setup

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Sign Up"** in the top right
3. Choose **"Sign up with GitHub"** (easiest method)
4. Authorize Supabase to access your GitHub account
5. You'll be redirected to the Supabase dashboard

### Step 2: Create a New Project

1. In the Supabase dashboard, click **"New project"**
2. **Project name**: `chat-app`
3. **Database password**: Create a strong password (save this!)
4. **Region**: Choose closest to you (e.g., `us-east-1` for USA)
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to initialize

### Step 3: Get Your Supabase Credentials

1. In the Supabase dashboard, go to **Settings** → **API**
2. You'll see two URLs and keys:
   - **Project URL** (copy this)
   - **Anon Key** (copy this)
3. Save these values - you'll need them next

**Example:**
```
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Find **Email** in the list
3. Make sure the **Email** provider is **enabled** (toggle ON)
4. Go to **Authentication** → **Email Templates**
5. Leave default settings (Supabase will send emails)

### Step 5: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"Create a new bucket"**
3. Bucket name: `chat-attachments`
4. **Uncheck** "Private bucket" (make it public)
5. Click **"Create bucket"**

**Your bucket is now ready for file uploads!**

### Step 6: Enable Realtime

1. Go to **Database** → **Replication**
2. Under **Supabase realtimes**, enable (toggle ON):
   - `public.messages` - for real-time messaging
   - `public.users` - for user presence
   - `public.conversation_participants` - for status updates
3. Click **Save**

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
# Navigate to where you want the project
cd ~/projects

# Clone the repository (or download the ZIP)
git clone https://github.com/YOUR_USERNAME/chat-app.git
cd chat-app
```

### Step 2: Create Environment File

1. In the project root, create a file named `.env.local`
2. Add these variables:

```env
# Get these from Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Optional: For production
SUPABASE_JWT_SECRET=your_jwt_secret_from_supabase
```

**Where to find these values:**
- Go to [https://supabase.com](https://supabase.com)
- Select your project
- Settings → API
- Copy the URL and Anon Key

### Step 3: Install Dependencies

```bash
# Install all packages
npm install
# OR if you use pnpm
pnpm install
# OR if you use yarn
yarn install
```

### Step 4: Start Development Server

```bash
# Start the app
npm run dev
# OR
pnpm dev
# OR
yarn dev
```

The app should now be running at **http://localhost:3000**

---

## Email Configuration

### For Development (Supabase Default)

By default, Supabase will send emails from a development address. To use your own domain:

#### Option 1: Use Supabase Email Service (Recommended for Testing)

1. Go to **Authentication** → **Email Templates**
2. The default sender is `noreply@mail.supabase.io`
3. Emails will have a link to confirm signup

#### Option 2: Custom Email Provider (For Production)

1. Go to **Authentication** → **Email Templates**
2. Click **"Add a custom SMTP provider"**
3. Enter your email service details:
   - **SMTP Host**: `smtp.your-provider.com`
   - **SMTP Port**: `587`
   - **SMTP Username**: Your email
   - **SMTP Password**: Your email password
   - **From Address**: `noreply@yourdomain.com`

**Recommended Email Services:**
- [SendGrid](https://sendgrid.com) - Free tier available
- [Mailgun](https://www.mailgun.com/) - Free tier available
- [AWS SES](https://aws.amazon.com/ses/) - Very cheap
- Gmail - Limited to 500 emails/day

---

## Database Verification

### Check if Tables Exist

1. Go to Supabase dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**You should see these tables:**
- `users`
- `conversations`
- `conversation_participants`
- `messages`
- `attachments`
- `call_sessions`

### If Tables Don't Exist

1. Run all the SQL from `SETUP_COMPLETE_GUIDE.md` in the SQL Editor
2. Click **"Run"** to execute
3. You should see "Success!" message

---

## Testing the Application

### Test Signup

1. Open [http://localhost:3000](http://localhost:3000)
2. Click **"Sign Up"**
3. Enter:
   - **Username**: `testuser1`
   - **Email**: `test1@example.com`
   - **Password**: `Test@12345`
4. Click **"Sign Up"**
5. You should see "Check your email" message
6. Go to **Supabase Dashboard** → **Authentication** → **Users**
7. You should see your new user listed

### Test Email Verification

1. In Supabase, go to **Authentication** → **Users**
2. Click on your user
3. Check the **Email Confirmed** status
4. For development, you can manually confirm by:
   - Click the **•••** menu next to the user
   - Select **"Confirm user"**

### Test Login

1. Go to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Enter your credentials
3. Click **"Log In"**
4. You should be redirected to the chat page

### Test Chat (Two Users)

1. **Open two browser windows** (or private windows)
2. **Window 1**: Sign up as `user1` with email `user1@example.com`
3. **Window 2**: Sign up as `user2` with email `user2@example.com`
4. Confirm both emails in Supabase dashboard
5. Both login
6. In Window 1, search for `user2`
7. Click to start conversation
8. Send a message
9. Check Window 2 - message appears in real-time!

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Chat application"

# Create a new repository on GitHub
# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/chat-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** and choose **"GitHub"**
3. Authorize Vercel to access GitHub
4. Click **"New Project"**
5. Find your `chat-app` repository
6. Click **"Import"**
7. In **Environment Variables**, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-vercel-domain.vercel.app/auth/callback
   ```
8. Click **"Deploy"**
9. Wait for deployment to complete

Your app is now live! 🎉

---

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution:**
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Issue: "Environment variables not found"

**Solution:**
1. Check `.env.local` file exists in root directory
2. Verify the variable names are exactly correct
3. Restart dev server: `npm run dev`

### Issue: "Email signup not working"

**Solution:**
1. Go to Supabase → Authentication → Email Templates
2. Verify Email provider is **enabled**
3. Check your email spam folder
4. Verify credentials in `.env.local`

### Issue: "Messages not appearing in real-time"

**Solution:**
1. Go to Supabase → Database → Replication
2. Enable realtime for `public.messages` table
3. Restart dev server

### Issue: "File upload fails"

**Solution:**
1. Go to Supabase → Storage
2. Verify bucket `chat-attachments` exists
3. Verify bucket is **public** (not private)
4. Check bucket policies allow uploads

### Issue: "Login redirects to blank page"

**Solution:**
1. Make sure `.env.local` has correct values
2. Check that Supabase project is active
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try in private/incognito window

### Issue: "Supabase connection error"

**Solution:**
1. Go to [https://status.supabase.com](https://status.supabase.com)
2. Check if Supabase is having issues
3. Verify internet connection
4. Try again after 5 minutes

---

## Next Steps

✅ **You're All Set!**

Now you can:

1. **Customize** the app:
   - Change colors in `app/globals.css`
   - Modify landing page in `app/page.tsx`
   - Add your logo to storage

2. **Add Features**:
   - Voice calling (requires Twilio API key)
   - Group chats (database ready)
   - User profiles
   - Message reactions

3. **Invite Users**:
   - Share your app URL
   - Users can sign up themselves
   - Start chatting!

4. **Monitor**:
   - Check Supabase dashboard for usage
   - Review authentication logs
   - Monitor storage usage

---

## Support Resources

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **React Docs**: [https://react.dev](https://react.dev)

---

## Verification Checklist

Before considering setup complete:

- [ ] Supabase account created
- [ ] Project created and initialized
- [ ] Storage bucket created
- [ ] Credentials added to `.env.local`
- [ ] Dependencies installed
- [ ] Dev server running without errors
- [ ] Can sign up with new account
- [ ] Email verification working
- [ ] Can log in successfully
- [ ] Can search for users
- [ ] Can send messages in real-time
- [ ] File uploads working
- [ ] App deployed to Vercel

✅ **All items checked? You're ready to go!**

---

**Last Updated**: 2024
**Version**: 1.0
