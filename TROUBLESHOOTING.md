# Troubleshooting Guide

## Email Rate Limit Exceeded

### Problem
When signing up, you get: `"email rate limit exceeded"`

### Why This Happens
Supabase implements rate limiting to prevent abuse:
- Multiple signup attempts on the same email within a short time
- Multiple password reset attempts
- Brute force protection

### Solutions

#### Solution 1: Wait and Retry (Quickest)
- Wait 5-10 minutes
- Try signing up again with the same email
- The rate limiter will reset

#### Solution 2: Use a Different Email (For Testing)
- Change the test email temporarily
- Use: `admin-test@example.com` instead of `sangamkunwar48@gmail.com`
- Update these files:
  - `/app/auth/sign-up/page.tsx` (line 69)
  - Database trigger (SQL)
  - `/app/api/auth/sync-user/route.ts`

#### Solution 3: Delete User from Supabase (Complete Reset)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication → Users**
4. Find `sangamkunwar48@gmail.com`
5. Click the **...** menu
6. Select **Delete User**
7. Wait 5 minutes
8. Try signing up again

#### Solution 4: Use OAuth Instead (Bypasses Email)
- Click **Google** or **Facebook** button
- Completes signup without email verification
- Works for both admin and regular users
- No rate limiting issues

### Prevention
- Don't try signup multiple times rapidly
- Clear browser cache between attempts
- Use different emails for testing
- Use OAuth for faster testing

---

## Email Verification Issues

### Problem
Verification email not received

### Solutions
1. **Check Spam Folder**
   - Look in Gmail spam, Outlook junk, etc.
   - Add no-reply@mail.supabase.io to contacts

2. **Check Email Address**
   - Make sure email is typed correctly
   - Emails are case-insensitive (test@gmail.com = TEST@GMAIL.COM)

3. **Resend Verification**
   - Return to login page
   - Click "Forgot password?" or similar option
   - Request new verification link

4. **Use OAuth Instead**
   - Click Google or Facebook button
   - No verification email needed
   - Instant access

### Email Configuration
Supabase uses default email sending. For production, configure:
- Custom email templates
- SMTP settings
- Email domain verification

---

## Admin Dashboard Not Loading

### Problem
Admin dashboard shows blank or redirects to login

### Troubleshooting Steps

#### Step 1: Check You're Logged In
1. Open browser console (F12)
2. Check if there are auth errors
3. Try logging in again
4. Verify email if needed

#### Step 2: Verify Admin Status
1. Open browser console (F12)
2. Run: `localStorage.getItem('sb-auth')`
3. Check if session token is present
4. If not, log out and log back in

#### Step 3: Check Database
In Supabase SQL Editor, run:
```sql
SELECT id, email, is_admin FROM public.profiles 
WHERE email = 'sangamkunwar48@gmail.com' LIMIT 1;
```

Should return: `is_admin = TRUE`

If `is_admin = FALSE` or no row exists:
```sql
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE email = 'sangamkunwar48@gmail.com';
```

#### Step 4: Clear Cache and Try Again
1. Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Clear all cookies and cache
3. Close browser completely
4. Reopen and try again

### If Still Not Working
Check browser console for specific errors:
- Network errors → Check Supabase URL
- Auth errors → Check API keys
- Database errors → Check RLS policies

---

## Stuck on Success Page

### Problem
After signup, stuck on success page and not redirecting

### Solutions

#### Solution 1: Manual Redirect
- Click the **"Go to Admin Panel Now"** button
- Or navigate to `/admin` directly

#### Solution 2: Wait a Bit Longer
- The page waits up to 3 seconds for session
- Some networks are slower
- After 3 seconds, you should auto-redirect
- If not, try manual redirect above

#### Solution 3: Check Session
1. Open browser console
2. Run: `sessionStorage.getItem('sb-auth-token')`
3. If empty, you need to log in again

#### Solution 4: Refresh Browser
- Press F5 or Cmd+R
- Sometimes helps with stuck redirects

---

## OAuth Not Working

### Problem
Google or Facebook signup doesn't work

### Solutions

#### Check 1: Verify OAuth is Configured
1. Go to Supabase Dashboard
2. Go to **Authentication → Providers**
3. Check if Google and Facebook are enabled
4. Verify credentials are entered

#### Check 2: Check Redirect URL
- Should be: `http://localhost:3000/auth/callback` (for development)
- In production: `https://yourdomain.com/auth/callback`
- Must be registered in Google/Facebook app settings

#### Check 3: Check Browser Console
- Look for popup or redirect errors
- Check network tab for failed requests
- Look for CORS errors

#### Check 4: Try Different Browser
- Try Chrome, Firefox, Safari
- Clear cache and cookies
- Try incognito/private window

### OAuth Setup
See `OAUTH_SETUP.md` for detailed configuration

---

## Database Connection Issues

### Problem
Admin dashboard shows database errors

### Troubleshooting

#### Step 1: Check Environment Variables
Verify in your project's env vars:
- `NEXT_PUBLIC_SUPABASE_URL` is set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Both are not empty

Run in browser console:
```js
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

#### Step 2: Check Network Connection
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try admin action again
4. Check for failed API calls to supabase

#### Step 3: Check Supabase Status
- Visit [Supabase Status](https://status.supabase.com)
- Check if services are operational
- May need to wait if there's an outage

#### Step 4: Check RLS Policies
Admin dashboard queries may fail if RLS policies are too restrictive.

View current policies in Supabase:
```
Authentication → Policies
```

---

## Performance Issues

### Problem
Admin dashboard loads slowly

### Solutions

#### 1. Check Network Tab
- Open DevTools (F12)
- Go to Network tab
- Look for slow requests
- Check response sizes

#### 2. Optimize Queries
The admin dashboard runs several queries:
- Count users
- Count messages
- Count conversations
- Count followers
- Count calls
- List all users with details

For large datasets, these may be slow.

Optimize by:
- Adding database indexes
- Limiting user list to first 100
- Using pagination
- Caching statistics

#### 3. Check Supabase Performance
In Supabase Dashboard:
- Go to **Database → Performance**
- Look for slow queries
- Check for missing indexes

---

## Session Timeout

### Problem
Session expires and you're logged out

### Solutions

#### Automatic Re-login
1. Refresh page (F5)
2. Should auto-redirect to login
3. Log in again

#### Extend Session
Edit `/lib/supabase/client.ts`:
```ts
const sessionDuration = 24 * 60 * 60  // 24 hours
```

---

## Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| `email rate limit exceeded` | Too many attempts | Wait 5-10 minutes |
| `Invalid email` | Email format wrong | Check email syntax |
| `email already in use` | Email registered | Use different email or login |
| `User already registered` | Account exists | Go to login page |
| `Session not found` | Not logged in | Log in first |
| `CORS error` | Domain not authorized | Check OAuth settings |
| `Invalid credentials` | Wrong password | Check password |
| `Email not confirmed` | Need to verify | Check email, click link |

---

## Getting Help

If you can't solve the issue:

1. **Check the Console**
   - Open DevTools (F12)
   - Look for error messages
   - Take a screenshot

2. **Check Supabase Logs**
   - Go to Supabase Dashboard
   - Check **Logs** section
   - Look for auth errors

3. **Verify Setup**
   - Review `OAUTH_SETUP.md`
   - Check `COMPLETE_SETUP_GUIDE.md`
   - Verify all files are updated

4. **Test with Different Email**
   - Create account with different email
   - Verify it works
   - If it does, issue is specific to that email

---

## Useful Debug Commands

### Browser Console
```js
// Check if user is logged in
supabase.auth.getUser().then(u => console.log(u))

// Check session
supabase.auth.getSession().then(s => console.log(s))

// Check stored auth data
localStorage.getItem('sb-auth')

// Get current user metadata
supabase.auth.user()?.user_metadata
```

### Supabase SQL Editor
```sql
-- Check if admin email exists
SELECT * FROM public.profiles 
WHERE email = 'sangamkunwar48@gmail.com';

-- Check all users
SELECT id, email, is_admin, created_at 
FROM public.profiles 
ORDER BY created_at DESC LIMIT 10;

-- Check user's profiles
SELECT COUNT(*) as total_users FROM public.profiles;

-- Check followers
SELECT * FROM public.followers LIMIT 5;
```

---

## Prevention Tips

1. **Use OAuth for testing** - Faster and no email issues
2. **Wait between retries** - Don't rapid-fire signup attempts
3. **Clear cache regularly** - Fresh state helps troubleshoot
4. **Monitor logs** - Check console and Supabase logs early
5. **Test in incognito** - Avoids cached issues
6. **Keep backups** - Export important data regularly
