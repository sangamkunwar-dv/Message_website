# Real-Time Chat Application - Architecture & Implementation Guide

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Backend**: Next.js API Routes + Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (Email + Password)
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (PostgreSQL subscriptions)
- **State Management**: Zustand
- **UI Components**: shadcn/ui + Tailwind CSS

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY (references auth.users)
  username TEXT UNIQUE NOT NULL
  email TEXT UNIQUE NOT NULL
  avatar_url TEXT
  created_at TIMESTAMP
  updated_at TIMESTAMP
)
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY
  conversation_type TEXT ('direct' | 'group')
  group_name TEXT (for group chats)
  group_avatar_url TEXT
  created_at TIMESTAMP
  updated_at TIMESTAMP
)
```

### Conversation Participants Table
```sql
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY
  conversation_id UUID (references conversations)
  user_id UUID (references users)
  joined_at TIMESTAMP
  last_read_at TIMESTAMP
  UNIQUE(conversation_id, user_id)
)
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY
  conversation_id UUID (references conversations)
  sender_id UUID (references users)
  content TEXT
  message_type TEXT ('text' | 'image' | 'video' | 'file' | 'call')
  created_at TIMESTAMP
  updated_at TIMESTAMP
  deleted_at TIMESTAMP (soft delete)
)
```

### Attachments Table
```sql
CREATE TABLE attachments (
  id UUID PRIMARY KEY
  message_id UUID (references messages)
  file_url TEXT
  file_name TEXT
  file_type TEXT
  file_size INTEGER
  created_at TIMESTAMP
)
```

### Call Sessions Table
```sql
CREATE TABLE call_sessions (
  id UUID PRIMARY KEY
  conversation_id UUID (references conversations)
  caller_id UUID (references users)
  call_type TEXT ('audio' | 'video')
  status TEXT ('initiated' | 'ringing' | 'active' | 'ended' | 'missed')
  started_at TIMESTAMP
  ended_at TIMESTAMP
  duration_seconds INTEGER
)
```

## Project Structure

```
/app
  /auth
    /callback          - OAuth callback handler
    /error            - Auth error page
    /login            - Login page
    /sign-up          - Sign up page
    /sign-up-success  - Confirmation page
  /chat
    /layout.tsx       - Chat layout with sidebar
    /page.tsx         - Chat main page
  /api
    /auth
      /sync-user/route.ts  - User creation on auth

/components
  /chat
    /sidebar.tsx           - Conversation list
    /search-users.tsx      - User search
    /conversation-item.tsx - Conversation item
    /chat-window.tsx       - Main chat area
    /message-bubble.tsx    - Individual message
    /message-input.tsx     - Message input & file upload

/lib
  /supabase
    /client.ts         - Supabase client
    /server.ts         - Supabase server client
    /proxy.ts          - Session management
  /store
    /chat-store.ts     - Zustand store
  /db
    /queries.ts        - Database queries

/middleware.ts         - Auth middleware
```

## Implementation Steps

### 1. Authentication Flow (COMPLETED)
- [x] Database schema created
- [x] Supabase client setup (client.ts, server.ts, proxy.ts)
- [x] Authentication pages (login, signup, callback)
- [x] Middleware for route protection
- [x] User sync on signup

### 2. Real-Time Messaging (COMPLETED)
- [x] Chat UI components
- [x] Message storage in Supabase
- [x] Real-time subscriptions for new messages
- [x] Message history loading
- [x] Conversation management

### 3. File Uploads (COMPLETED)
- [x] File attachment components
- [x] Supabase Storage integration
- [x] Image/video preview
- [x] Document download links

### 4. User Search & Conversations (COMPLETED)
- [x] User search functionality
- [x] Conversation creation
- [x] Conversation listing

### 5. Voice & Video Calls (TODO)
- [ ] Twilio SDK integration
- [ ] Call initiation API
- [ ] Call UI components
- [ ] In-call features (mute, camera toggle, end call)

### 6. Additional Features (TODO)
- [ ] Typing indicators
- [ ] Message read receipts
- [ ] User online status
- [ ] Group chats
- [ ] Message reactions
- [ ] Message search
- [ ] Call history

## Key Features Implemented

### 1. **User Authentication**
- Email/password signup and login
- Email confirmation required
- Secure session management with Supabase Auth

### 2. **Real-Time Messaging**
- Instant message delivery
- Message history
- Automatic scrolling to latest messages
- Message timestamps

### 3. **File Sharing**
- Image uploads with preview
- Video uploads with playback
- Document uploads (PDF, DOC, DOCX)
- File size tracking
- Secure public URLs for downloads

### 4. **User Management**
- User profiles with usernames and emails
- User avatars (placeholder support)
- User search by username or email
- Direct conversation creation

### 5. **Conversation Management**
- Direct message conversations
- Conversation history
- Last read tracking
- Conversation participants

### 6. **Row Level Security**
- Users can only view conversations they're part of
- Users can only read messages in their conversations
- Users can only insert messages in conversations they're part of
- Secure attachment access

## Real-Time Features

### Supabase Realtime Subscriptions
The app uses Supabase Realtime (PostgreSQL LISTEN/NOTIFY) for real-time updates:

1. **New Messages**: Subscribe to `messages` table for new inserts in a conversation
2. **Conversation Updates**: Subscribe to `conversations` table for participant changes
3. **User Status**: (TODO) Subscribe to user online status changes

Example subscription in `chat-window.tsx`:
```typescript
const subscription = supabase
  .channel(`messages:${conversationId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      addMessage(payload.new)
    }
  )
  .subscribe()
```

## State Management (Zustand)

The `useChatStore` hook manages:
- Current user
- Conversations list
- Current conversation
- Messages
- Users list
- Loading states
- Errors

This allows components to access and update state without prop drilling.

## Security Best Practices

1. **Row Level Security (RLS)**: All tables have RLS policies
2. **Authentication**: Supabase Auth handles secure authentication
3. **File Upload Validation**: File type and size checks
4. **CSRF Protection**: Built-in with Next.js and Supabase
5. **Session Management**: Secure JWT tokens with HTTP-only cookies

## API Routes

### POST /api/auth/sync-user
Creates a user record in the public.users table after Supabase auth signup.

Request: Authenticated request (JWT token)
Response: `{ success: true }`

## TODO: Twilio Integration

For voice and video calling, integrate Twilio:

1. Create Twilio account and get API credentials
2. Add environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `NEXT_PUBLIC_TWILIO_API_KEY` (if using Programmable Voice)

3. Create API route for generating access tokens:
```typescript
// app/api/twilio/token/route.ts
import twilio from 'twilio'

export async function POST(request: Request) {
  const { identity } = await request.json()
  
  const token = twilio.jwt.AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  )

  // Add required grants (Video, Audio)
  token.addVideoGrant({ room: 'room-name' })
  
  return Response.json({ token: token.toJwt() })
}
```

4. Add video call component using Twilio SDK
5. Implement call initiation logic
6. Add call history tracking in database

## Running the Application

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set environment variables** (in Vercel project settings):
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`: For local development

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Access the application**:
   - Open http://localhost:3000
   - Sign up or log in
   - Start chatting!

## Performance Optimizations

1. **Message Pagination**: Load messages in batches (50 at a time)
2. **Lazy Loading**: Conversations load on scroll
3. **Caching**: SWR for data caching and deduplication
4. **Image Optimization**: Next.js Image component for responsive images
5. **Code Splitting**: Dynamic imports for heavy components

## Deployment

Deploy to Vercel:
1. Connect your GitHub repository
2. Add Supabase environment variables
3. Deploy with `vercel deploy`

The application will automatically:
- Build optimized bundles
- Deploy edge functions if needed
- Set up environment variables
- Enable analytics

## Troubleshooting

### Messages not appearing
- Check Supabase Real-time is enabled
- Verify user has conversation_participants record
- Check RLS policies are correct

### File uploads failing
- Verify Supabase Storage bucket `chat-attachments` exists
- Check bucket permissions are public
- Confirm file size limits

### Authentication issues
- Ensure email confirmation is bypassed in development or emails are confirmed
- Check `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set
- Verify callback route is `/auth/callback`

## Next Steps

1. Integrate Twilio for voice/video calls
2. Add typing indicators
3. Implement group chats
4. Add message reactions and emojis
5. Create call history and analytics
6. Implement push notifications
7. Add user presence (online/offline status)
8. Performance testing and optimization
