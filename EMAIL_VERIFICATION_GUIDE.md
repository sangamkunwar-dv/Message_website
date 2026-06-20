# Email Verification & Authentication Guide

This guide explains how email verification works in the chat application and how to configure it for production.

---

## Overview

The chat application uses **Supabase Authentication** with email verification. Here's the flow:

```
User Signs Up → Email Sent → User Clicks Link → Email Verified → Can Use App
```

---

## How Email Verification Works

### 1. User Signup Process

When a user signs up:

1. **User enters:**
   - Username
   - Email address
   - Password (8+ characters)
   - Agrees to Terms & Conditions

2. **System creates account** and sends verification email

3. **Email contains:**
   - Verification link
   - Link expires in 24 hours
   - User must click to confirm email

4. **User clicks link**
   - Account becomes verified
   - Can now log in and chat

---

## Development Setup (Testing)

### Step 1: Configure Supabase Email

1. Go to [https://supabase.com](https://supabase.com)
2. Select your project
3. Go to **Authentication** → **Email Templates**
4. You'll see email templates for:
   - Signup confirmation
   - Password reset
   - Magic links

### Step 2: Test Email in Development

**Option A: Check Supabase Dashboard (Recommended for Testing)**

1. In Supabase, go to **Authentication** → **Users**
2. Create a test user with signup form
3. You'll see the user listed with:
   - Email
   - Status: "Not confirmed" or "Confirmed"
4. To manually verify:
   - Click the **•••** menu next to user
   - Click **"Confirm user"**
   - User is now verified

**Option B: Use Real Email (Gmail/Outlook)**

For development, Supabase sends from `noreply@mail.supabase.io`:

1. Sign up with a real email
2. Check your email inbox
3. Look for "Confirm your email"
4. Click the confirmation link
5. Email is now verified

### Step 3: Test Password Reset

1. Go to `/auth/forgot-password`
2. Enter your email
3. Click "Send Reset Link"
4. In Supabase dashboard, find the password reset link in logs:
   - Go to **Authentication** → **Logs**
   - Look for "reset password email"
5. Copy the link and paste in browser
6. Enter new password
7. Redirect to login

---

## Production Setup

### Step 1: Use Custom Email Service

For production, use a dedicated email service:

#### Option A: SendGrid (Recommended)

1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Create free account
3. Get API key from Settings
4. In Supabase:
   - Go to **Authentication** → **Email Templates**
   - Click **"Add custom SMTP provider"**
   - Enter SendGrid settings:
     ```
     SMTP Host: smtp.sendgrid.net
     SMTP Port: 587
     SMTP Username: apikey
     SMTP Password: (your SendGrid API key)
     From Address: noreply@yourdomain.com
     ```

#### Option B: Gmail

1. Create a Gmail account
2. Generate an App Password:
   - Go to [https://myaccount.google.com](https://myaccount.google.com)
   - Security → App Passwords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. In Supabase:
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP Username: your-email@gmail.com
   SMTP Password: (app password from step 2)
   From Address: noreply@yourdomain.com
   ```

#### Option C: AWS SES

1. Go to [https://aws.amazon.com/ses](https://aws.amazon.com/ses)
2. Create account and verify sender email
3. Get SMTP credentials
4. Add to Supabase custom SMTP

### Step 2: Customize Email Templates

1. In Supabase, go to **Authentication** → **Email Templates**
2. Edit email templates for:
   - **Confirmation Email** - sent at signup
   - **Password Reset Email** - sent when user resets password
3. Customize with:
   - Your branding
   - Company name
   - Custom colors
   - Unsubscribe links

Example confirmation email template:

```html
<html>
  <body>
    <h2>Welcome to Chat App!</h2>
    <p>Thank you for signing up. Click below to confirm your email:</p>
    <a href="{{ .ConfirmationURL }}">
      Confirm Email
    </a>
    <p>This link expires in 24 hours.</p>
    <p>If you didn't sign up, ignore this email.</p>
  </body>
</html>
```

### Step 3: Set Redirect URLs

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add:
   ```
   Authorized redirect URLs:
   https://your-domain.com/auth/callback
   https://your-domain.com
   ```

---

## Email Verification Code Flow

### Signup Email Verification

```
┌─────────────────────────────────────────┐
│ User Signs Up with Email & Password     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ System Validates:                       │
│ - Email format correct                  │
│ - Email not already used                │
│ - Password min 8 characters             │
│ - Username min 3 characters             │
│ - Terms agreed                          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ System Creates Account                  │
│ Status: Unconfirmed                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Verification Email Sent                 │
│ Contains: Confirmation Link             │
│ Link expires: 24 hours                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ User Clicks Link in Email               │
│ Redirects to /auth/callback             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Email Confirmed in Database             │
│ Status: Confirmed ✓                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ User Can Now Login & Chat               │
└─────────────────────────────────────────┘
```

### Password Reset Flow

```
┌─────────────────────────────────────────┐
│ User Goes to /auth/forgot-password      │
│ Enters Email Address                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ System Validates Email Exists           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Password Reset Email Sent               │
│ Contains: Reset Link                    │
│ Link expires: 1 hour                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ User Clicks Link in Email               │
│ Redirects to /auth/reset-password       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ User Enters New Password                │
│ Min 8 characters                        │
│ Must confirm password                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Password Updated in Database            │
│ Old password no longer works            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Redirect to Login                       │
│ User Logs In with New Password          │
└─────────────────────────────────────────┘
```

---

## Email Verification Best Practices

### Security

1. **Enable HTTPS** - All email links must use HTTPS
2. **Rate Limiting** - Limit verification email sends to prevent abuse
3. **Expiration** - Links expire after 24 hours
4. **One-Time Links** - Each link can only be used once

### User Experience

1. **Clear Instructions** - Tell users to check email
2. **Resend Option** - Let users resend verification if needed
3. **Timeout Messages** - Show helpful error if link expires
4. **Mobile Friendly** - Emails must work on mobile devices

### Compliance

1. **Privacy Policy** - Explain data handling in signup
2. **Unsubscribe** - Include unsubscribe link in emails
3. **GDPR** - Comply with email regulations
4. **CAN-SPAM** - Include physical address in emails

---

## Testing Checklist

- [ ] User can sign up with valid email
- [ ] Verification email arrives in inbox
- [ ] Link in email works and confirms email
- [ ] Unconfirmed users cannot chat
- [ ] Confirmed users can log in
- [ ] Password reset email works
- [ ] Password reset link expires
- [ ] Invalid passwords rejected
- [ ] Terms & Conditions checkbox required
- [ ] All error messages clear

---

## Troubleshooting

### Email Not Arriving

**Problem:** User signs up but doesn't receive email

**Solutions:**
1. Check Supabase Logs:
   - Go to Authentication → Logs
   - Search for the email address
   - See if email was sent
2. Check Spam Folder:
   - Email might be marked as spam
   - Add to contacts
3. Verify Email in Supabase Settings:
   - Go to Email Templates
   - Check if email provider is enabled
4. Check Email Service:
   - If using custom SMTP, verify credentials
   - Check SMTP logs for errors

### Verification Link Expired

**Problem:** User gets "Link expired" error

**Solutions:**
1. Click "Resend" button
2. Or sign up again with same email
3. Or contact support to manually verify

### Can't Reset Password

**Problem:** Password reset not working

**Solutions:**
1. Check email address is correct
2. Check email arrived
3. Check link hasn't expired
4. Try resending reset email
5. Contact support

### Email Address Already In Use

**Problem:** Can't sign up with email

**Solutions:**
1. Email is already registered
2. Try logging in instead
3. Use different email
4. Contact support to delete old account

---

## Verifying Setup is Working

### Quick Test

```bash
# 1. Sign up with real email
# Visit http://localhost:3000/auth/sign-up
# Enter your email address
# Click Sign Up

# 2. Check email
# Open your inbox
# Find "Confirm your email" email
# Click the link

# 3. Verify it worked
# Should be redirected to success page
# In Supabase dashboard:
# - Go to Authentication → Users
# - Find your email
# - Status should show "Confirmed"

# 4. Test login
# Go to http://localhost:3000/auth/login
# Enter credentials
# Should log in successfully
```

---

## Production Checklist

Before deploying to production:

- [ ] Custom email provider configured (SendGrid/Gmail/AWS SES)
- [ ] Email templates customized with branding
- [ ] Test email sent and received
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Redirect URLs added in Supabase
- [ ] Environment variables set in Vercel
- [ ] Privacy policy created
- [ ] Terms & Conditions reviewed
- [ ] Test account created and verified
- [ ] Password reset tested end-to-end

---

## Support

- **Supabase Docs**: [https://supabase.com/docs/guides/auth/auth-email](https://supabase.com/docs/guides/auth/auth-email)
- **SendGrid**: [https://sendgrid.com/docs](https://sendgrid.com/docs)
- **Gmail SMTP**: [https://support.google.com/mail](https://support.google.com/mail)
- **AWS SES**: [https://docs.aws.amazon.com/ses](https://docs.aws.amazon.com/ses)

---

**Last Updated**: 2024
**Version**: 1.0
