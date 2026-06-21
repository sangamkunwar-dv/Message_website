# Complete Setup Guide - Chat Application with Admin Panel

## Overview

Your chat application has been successfully configured with:
- **Supabase Authentication** (Email/Password + Google + Facebook OAuth)
- **Admin Panel** with full-featured user management dashboard
- **Database Schema** with users, profiles, conversations, messages, followers, and calls
- **Automatic Admin Assignment** for email: `sangamkunwar48@gmail.com`
- **Row Level Security (RLS)** policies for data protection

## Database Schema

### Tables Created

1. **profiles** - User profile information
   - `id` (UUID) - References auth.users(id)
   - `email` (TEXT) - User email
   - `full_name` (TEXT) - User's display name
   - `avatar_url` (TEXT) - Profile picture URL
   - `bio` (TEXT) - User bio
   - `is_admin` (BOOLEAN) - Admin flag (auto-set for designated email)
   - `created_at` - Registration timestamp
   - `updated_at` - Last update timestamp

2. **followers** - Follow relationships
   - `id` (UUID) - Primary key
   - `follower_id` (UUID) - User who is following
   - `following_id` (UUID) - User being followed
   - `created_at` - Follow timestamp
   - Unique constraint on (follower_id, following_id)

3. **conversations** - Chat conversations/groups
   - `id` (UUID) - Primary key
   - `created_by` (UUID) - Creator user ID
   - `title` (TEXT) - Conversation name
   - `is_group` (BOOLEAN) - Group flag
   - `created_at`, `updated_at` - Timestamps

4. **conversation_members** - Members in conversations
   - `id` (UUID) - Primary key
   - `conversation_id` (UUID) - Conversation reference
   - `user_id` (UUID) - Member user ID
   - `joined_at` - Join timestamp
   - Unique constraint on (conversation_id, user_id)

5. **messages** - Chat messages
   - `id` (UUID) - Primary key
   - `conversation_id` (UUID) - Conversation reference
   - `sender_id` (UUID) - Message sender
   - `content` (TEXT) - Message text
   - `created_at`, `updated_at` - Timestamps

6. **calls** - Voice/Video calls
   - `id` (UUID) - Primary key
   - `caller_id` (UUID) - Initiator
   - `receiver_id` (UUID) - Recipient
   - `conversation_id` (UUID) - Related conversation (optional)
   - `call_type` (TEXT) - 'audio' or 'video'
   - `status` (TEXT) - 'pending', 'active', 'completed', 'missed'
   - `started_at`, `ended_at` - Call timing
   - `created_at` - Timestamp

## Authentication Configuration

### Email + Password Authentication
- Users register with email and password
- Minimum password: 8 characters
- Email verification required before accessing chat features

### OAuth Providers
- **Google OAuth** - Added to login/sign-up pages
- **Facebook OAuth** - Added to login/sign-up pages
- Both providers integrated with Supabase OAuth flow

### Automatic Admin Assignment
Users signing up with email `sangamkunwar48@gmail.com` automatically get admin role via:
- Database trigger `handle_new_user()` on auth.users insert
- Sets `is_admin = TRUE` in profiles table

## Admin Panel Features

Access the admin panel at `/admin` (requires admin role):

### Dashboard Statistics
- **Total Users** - Count of all registered users
- **Total Messages** - Count of all messages sent
- **Total Conversations** - Count of all conversations/groups
- **Active Users (7d)** - Users who sent messages in last 7 days
- **Total Followers** - Count of all follower relationships
- **Total Calls** - Count of all audio/video calls

### User Management Table
Shows all registered users with:
- **Name** - User's full name
- **Email** - User email address
- **Followers** - Number of followers for each user
- **Following** - Number of users they follow
- **Conversations** - Number of conversations they're in
- **Role** - Admin or User badge
- **Joined** - Registration date

## File Structure

### Authentication Files
- `/lib/supabase/client.ts` - Browser Supabase client
- `/lib/supabase/server.ts` - Server Supabase client
- `/lib/supabase/proxy.ts` - Session proxy/refresh logic

### Auth Routes
- `/app/auth/login/page.tsx` - Login page (Email + Google + Facebook)
- `/app/auth/sign-up/page.tsx` - Sign-up page (Email + Google + Facebook)
- `/app/auth/callback/route.ts` - OAuth callback handler

### Admin Routes
- `/app/admin/page.tsx` - Admin dashboard page
- `/app/admin/layout.tsx` - Admin layout
- `/components/admin/admin-dashboard.tsx` - Admin dashboard component

### API Routes
- `/app/api/auth/sync-user/route.ts` - Sync user to profiles table

## Key Changes Made

### 1. Database Schema
Created complete PostgreSQL schema with 6 tables, RLS policies, and auto-create profile trigger

### 2. Authentication Pages
- Added Google OAuth button to login page
- Added Facebook OAuth button to login page
- Added Google OAuth button to sign-up page
- Added Facebook OAuth button to sign-up page
- Fixed redirect URLs for OAuth callback

### 3. Admin Dashboard
- Updated to query `profiles` table instead of non-existent `users` table
- Added followers, following, and conversation counts for each user
- Enhanced statistics with followers and calls metrics
- Fixed admin check to use profiles table

### 4. User Profile Sync
- Updated `/app/api/auth/sync-user/route.ts` to work with profiles table
- Added automatic admin flag assignment for sangamkunwar48@gmail.com
- Stores full_name from OAuth metadata

## Environment Variables

All required Supabase environment variables are already configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Usage Instructions

### For Testing

1. **Email/Password Sign-up**
   - Go to `/auth/sign-up`
   - Enter username (min 3 chars), email, password (min 8 chars)
   - Agree to Terms & Conditions
   - Click "Sign Up"
   - Verify email link (check configured email service)

2. **Email/Password Login**
   - Go to `/auth/login`
   - Enter email and password
   - Click "Log In"

3. **Google OAuth**
   - Click "Google" button on login/sign-up
   - Follow Google OAuth flow
   - Auto-creates profile with OAuth data

4. **Facebook OAuth**
   - Click "Facebook" button on login/sign-up
   - Follow Facebook OAuth flow
   - Auto-creates profile with OAuth data

### Admin Panel Access

1. **Create Admin User**
   - Sign up with email: `sangamkunwar48@gmail.com`
   - Verify email
   - Admin flag automatically assigned

2. **Access Admin Dashboard**
   - Log in as the admin user
   - Navigate to `/admin`
   - View all statistics and user information

3. **User Management**
   - See all registered users
   - View follower/following counts
   - See conversation participation
   - View admin status and registration date

## Security Features

### Row Level Security (RLS)
- All tables have RLS policies enabled
- Users can only see/modify their own data by default
- Profiles are viewable by everyone (followers list, etc.)
- Messages protected to conversation members
- Calls protected to participants only

### Authentication
- Passwords hashed by Supabase Auth
- Session tokens secure and HTTP-only
- OAuth tokens handled securely by Supabase
- Admin check on every admin panel access

## Next Steps (Not Implemented)

Consider implementing:
1. **Chat UI** - Message display, real-time updates with WebSockets
2. **User Profiles** - Profile pages, edit profile functionality
3. **Search** - Find users, search conversations
4. **Call Feature** - WebRTC video/audio calls (infrastructure needed)
5. **Notifications** - Real-time notifications for new messages
6. **File Upload** - Share images/files in chat
7. **Moderation Tools** - Admin tools to manage user content
8. **Analytics** - More detailed user activity metrics

## Troubleshooting

### OAuth Not Working
- Verify Supabase OAuth apps are configured in Supabase dashboard
- Ensure redirect URLs match your domain
- Check that social provider apps are created (Google Cloud, Facebook Developer)

### Admin Dashboard Not Loading
- Ensure user is logged in with admin role
- Check browser console for errors
- Verify Supabase connection in Network tab

### Messages Not Showing
- Check that RLS policies allow message queries
- Verify user is member of conversation
- Check conversation_members table

### Profile Not Created
- Verify sync-user API is called after sign-up
- Check trigger created successfully in Supabase
- Look at Database > Triggers in Supabase dashboard

## Support

For issues:
1. Check Supabase project logs in dashboard
2. Review RLS policies for data access
3. Check browser console for client errors
4. Verify API routes are returning correct data
