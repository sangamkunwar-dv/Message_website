# OAuth Setup Guide - Google and Facebook

## Overview

This guide shows how to configure Google and Facebook OAuth providers in your Supabase project.

## Prerequisites

- Supabase project created and dashboard access
- Deployment URL (for development: `http://localhost:3000`)
- Google Cloud Console account
- Facebook Developer account

## Step 1: Configure Google OAuth

### 1.1 Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth Client ID"
5. Choose "Web application"
6. Add Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - Your production domain
7. Add Authorized redirect URIs:
   - `https://ljynbvrvohbrocqsvtaj.supabase.co/auth/v1/callback` (replace with your Supabase URL)
8. Copy Client ID and Client Secret

### 1.2 Add to Supabase

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable "Google"
3. Paste Google Client ID and Client Secret
4. Click "Save"
5. Copy the Redirect URL shown:
   - Format: `https://[YOUR_PROJECT].supabase.co/auth/v1/callback`
   - Add this to Google Cloud Console Authorized redirect URIs

## Step 2: Configure Facebook OAuth

### 2.1 Create Facebook OAuth Application

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing
3. Add "Facebook Login" product
4. Go to Settings > Basic
5. Copy App ID and App Secret
6. Go to Facebook Login > Settings
7. Add Valid OAuth Redirect URIs:
   - `https://ljynbvrvohbrocqsvtaj.supabase.co/auth/v1/callback` (replace with your Supabase URL)
8. Save changes

### 2.2 Add to Supabase

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable "Facebook"
3. Paste Facebook App ID and App Secret
4. Click "Save"

## Step 3: Test OAuth Flows

### Test Google Login
1. Go to `http://localhost:3000/auth/login`
2. Click "Google" button
3. Sign in with Google account
4. Should redirect to `/auth/callback` then to chat
5. Check database - new profile should be created

### Test Facebook Login
1. Go to `http://localhost:3000/auth/login`
2. Click "Facebook" button
3. Sign in with Facebook account
4. Should redirect to `/auth/callback` then to chat
5. Check database - new profile should be created

### Test Google Sign-up
1. Go to `http://localhost:3000/auth/sign-up`
2. Click "Google" button
3. Complete OAuth flow
4. New account created and logged in

### Test Facebook Sign-up
1. Go to `http://localhost:3000/auth/sign-up`
2. Click "Facebook" button
3. Complete OAuth flow
4. New account created and logged in

## Step 4: Admin Access Setup

### Make Admin User
1. Go to `http://localhost:3000/auth/sign-up`
2. Sign up with email: `sangamkunwar48@gmail.com`
3. Verify email through email service
4. Log in with this account
5. Navigate to `/admin` to access admin panel
6. Profile is auto-marked as admin by database trigger

## Redirect URL Configuration

### For Development
- Application: `http://localhost:3000`
- OAuth Redirect: `https://ljynbvrvohbrocqsvtaj.supabase.co/auth/v1/callback`

### For Production
- Application: `https://yourdomain.com`
- OAuth Redirect: `https://ljynbvrvohbrocqsvtaj.supabase.co/auth/v1/callback` (same for all providers)

## Environment Variables

These are already configured in `.env.development.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://ljynbvrvohbrocqsvtaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://v0.app/chat/api/supabase/redirect/tKgjGGO5AGC
```

## Troubleshooting

### OAuth Button Doesn't Work
- Check browser console for errors
- Verify provider is enabled in Supabase > Authentication > Providers
- Make sure OAuth app credentials are correctly pasted in Supabase

### Redirect Loop
- Verify redirect URL is correct in Supabase AND provider app settings
- Check that `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` is set if needed
- Clear browser cookies and try again

### User Not Created After OAuth
- Check that sync-user API is being called
- Verify profile table has RLS policies allowing insert
- Check Supabase project logs for trigger errors

### Admin Not Assigned
- Verify email is exactly: `sangamkunwar48@gmail.com`
- Check database trigger in Supabase > SQL Editor
- View profiles table to confirm is_admin field

## Callback Flow Explanation

When user clicks OAuth button:
1. Redirected to OAuth provider (Google/Facebook)
2. User signs in and authorizes app
3. Provider redirects to: `https://ljynbvrvohbrocqsvtaj.supabase.co/auth/v1/callback?code=...`
4. Supabase exchanges code for session
5. Session stored in cookies
6. Redirects to: `/auth/callback`
7. `/auth/callback` route exchanges session and redirects to `/chat`
8. New profile created via trigger (if first login)

## Security Considerations

- Never share Client ID or Client Secret
- Redirect URLs must use HTTPS in production
- Keep API keys secure in environment variables
- Enable RLS policies on all tables
- Admin users should use strong passwords

## Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
