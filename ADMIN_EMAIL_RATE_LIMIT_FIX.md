# Admin Email Rate Limit Fix Guide

## Problem
When signing up with the admin email (`sangamkunwar48@gmail.com`), you may get "email rate limit exceeded" error. This happens when:
1. The email has already been used to attempt signup
2. Supabase's rate limiter is blocking additional signup attempts on that email
3. Multiple rapid signup attempts on the same email

## Solution

### Option 1: Use a Different Admin Email (Recommended for Testing)
Update the admin email to something different in your tests:

**File**: `/vercel/share/v0-project/app/auth/sign-up/page.tsx`
```tsx
const isAdmin = email === 'your-admin-email@gmail.com'  // Change this
```

**File**: `/vercel/share/v0-project/components/admin/admin-dashboard.tsx`
Update the admin check similarly

**Database Trigger**: Execute this SQL in Supabase SQL Editor:
```sql
-- Update the trigger to use your new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new.email = 'your-admin-email@gmail.com' THEN
    UPDATE auth.users
    SET email_confirmed_at = NOW()
    WHERE id = new.id;
  END IF;

  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (
    new.id,
    new.email,
    CASE WHEN new.email = 'your-admin-email@gmail.com' THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (id) DO UPDATE SET
    is_admin = CASE WHEN new.email = 'your-admin-email@gmail.com' THEN TRUE ELSE excluded.is_admin END;
  
  RETURN new;
END;
$$;
```

### Option 2: Reset the Admin Email in Supabase
Go to your Supabase Dashboard:
1. Navigate to Authentication → Users
2. Find the `sangamkunwar48@gmail.com` user
3. Delete or disable that user
4. Wait 5 minutes for Supabase rate limiter to reset
5. Try signup again

### Option 3: Programmatic Admin Assignment
Instead of auto-confirming at signup, manually assign admin status after signup:

Create an API route: `/app/api/admin/assign/route.ts`
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  const supabase = await createClient()

  // Only allow if user is already logged in as admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return NextResponse.json({ error: 'Not admin' }, { status: 403 })
  }

  // Assign admin status to new user
  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('email', email)

  if (error) throw error
  return NextResponse.json({ success: true })
}
```

## How It Works Now

### Admin Signup Flow:
1. Admin user signs up with their email
2. Database trigger auto-confirms email (no verification needed)
3. Admin redirected to `/auth/admin-signup-success`
4. After 3 seconds, automatically redirected to `/admin`
5. Admin dashboard loads with full access

### Regular User Signup Flow:
1. Regular user signs up with their email
2. Verification email sent to their inbox
3. User redirected to `/auth/sign-up-success` 
4. User clicks verification link in email
5. After verification, can log in normally

## Testing the Flow

### For Admin Users:
```
Email: your-admin-email@example.com
Password: anySecurePassword123!
Username: AdminUser

After signup → Auto-redirects to admin panel (no email verification needed)
```

### For Regular Users:
```
Email: user@example.com
Password: anySecurePassword123!
Username: RegularUser

After signup → Check email for verification link
Click link → Can then login
```

## Features:
✅ Admin gets instant access (no email verification)
✅ Admin auto-assigned admin role
✅ Regular users still need email verification
✅ Rate limit respected for security
✅ Retry mechanism in admin dashboard (up to 3 retries with 500ms delays)
✅ Clear UI feedback for admin vs regular users

## Environment Variables
Make sure these are set in your `.env.development.local`:
- `NEXT_PUBLIC_SUPABASE_URL` 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Both should be automatically configured via Supabase integration.
