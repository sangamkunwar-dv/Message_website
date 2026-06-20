# Real-Time Chat Application - Facebook Messenger Clone

A fully functional real-time chat application built with Next.js 16, Supabase, and WebSocket technology. This project demonstrates modern full-stack development with authentication, real-time messaging, file uploads, and video calling capabilities.

## Features

### ✅ Implemented
- **User Authentication**: Email/password signup and login with Supabase Auth
- **Real-Time Messaging**: Instant message delivery with Supabase Realtime subscriptions
- **Direct Conversations**: Create 1-on-1 chats with user search
- **Message History**: Full message history with timestamps
- **File Sharing**: Upload and share images, videos, and documents
- **Media Preview**: Inline image/video viewing
- **Responsive Design**: Mobile-friendly Messenger-style UI
- **User Profiles**: Username and email system
- **Secure Database**: Row Level Security (RLS) policies on all tables

### 🚧 TODO
- Voice & Video Calling (Twilio integration ready)
- Typing Indicators
- Message Read Receipts
- Group Chats
- Message Reactions
- User Online Status
- Call History

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS |
| **Backend** | Next.js API Routes, Supabase |
| **Database** | PostgreSQL (via Supabase) |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Real-Time** | Supabase Realtime (PostgreSQL LISTEN/NOTIFY) |
| **State Management** | Zustand |
| **UI Components** | shadcn/ui |

## Project Structure

```
app/
├── auth/                      # Authentication pages
│   ├── callback/route.ts     # OAuth callback
│   ├── login/page.tsx        # Login form
│   ├── sign-up/page.tsx      # Registration form
│   └── sign-up-success/page.tsx
├── api/
│   └── auth/sync-user/       # User creation endpoint
├── chat/
│   ├── layout.tsx            # Chat layout with sidebar
│   └── page.tsx              # Main chat page
└── page.tsx                  # Redirect to /chat

components/
└── chat/
    ├── sidebar.tsx           # Conversations list
    ├── search-users.tsx      # User search
    ├── conversation-item.tsx # Conversation item
    ├── chat-window.tsx       # Main chat area
    ├── message-bubble.tsx    # Individual message
    └── message-input.tsx     # Message input & uploads

lib/
├── supabase/
│   ├── client.ts            # Browser client
│   ├── server.ts            # Server client
│   └── proxy.ts             # Session management
├── store/
│   └── chat-store.ts        # Zustand store
└── db/
    └── queries.ts           # Database queries

ARCHITECTURE.md              # Detailed architecture guide
```

## Quick Start

### 1. Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase account

### 2. Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Create .env.local with your Supabase credentials
cp .env.example .env.local
```

### 3. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

Get these from your Supabase project settings.

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 5. Create Test Account

1. Go to http://localhost:3000/auth/sign-up
2. Create an account with your email
3. Check your email for confirmation link
4. Log in and start chatting!

## Database Schema

The application uses 6 main tables:

### users
- Stores user profile information
- Links to Supabase auth users

### conversations
- Stores conversation metadata
- Supports direct and group chats

### conversation_participants
- Junction table linking users to conversations
- Tracks last read message

### messages
- Stores message content and metadata
- Supports text, image, video, file, and call types

### attachments
- Stores file metadata and URLs
- References messages

### call_sessions
- Tracks voice/video call history
- Stores call duration and status

All tables have Row Level Security (RLS) policies to ensure users can only access their own data.

## Key Features Explained

### Real-Time Messaging
The app uses Supabase Realtime (PostgreSQL subscriptions) to deliver messages instantly:

```typescript
// Subscribe to new messages in a conversation
supabase
  .channel(`messages:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    addMessage(payload.new)
  })
  .subscribe()
```

### File Uploads
Files are uploaded to Supabase Storage with secure public URLs:

1. Create message record in `messages` table
2. Upload file to `chat-attachments` bucket
3. Create attachment record linking file to message
4. Broadcast message with attachment via realtime

### User Search
Search for users by username or email to start conversations:

```typescript
const { data } = await supabase
  .from('users')
  .select('*')
  .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
  .limit(10)
```

### State Management
Zustand store manages global chat state without prop drilling:

```typescript
const { 
  currentUser,
  conversations,
  messages,
  addMessage,
  setCurrentConversation
} = useChatStore()
```

## Security

✅ Row Level Security (RLS) on all tables
✅ Secure authentication with Supabase Auth
✅ File upload validation
✅ CSRF protection built-in
✅ User data isolation
✅ Secure session management

## Performance

- ⚡ Optimistic UI updates
- 📦 Code splitting and lazy loading
- 🖼️ Next.js Image optimization
- 🚀 Turbopack for fast builds
- 💾 SWR for data caching

## API Routes

### POST /api/auth/sync-user
Creates a user record after signup.

**Request**: Authenticated (JWT token)
**Response**: `{ success: true }`

## Deployment

Deploy to Vercel with one click:

1. Push code to GitHub
2. Import project in Vercel
3. Add Supabase environment variables
4. Deploy!

Environment variables are automatically synced from your Vercel project settings.

## Troubleshooting

### Messages not appearing
- Check Supabase Realtime is enabled
- Verify user has `conversation_participants` record
- Check RLS policies in database

### File uploads failing
- Verify `chat-attachments` bucket exists
- Check bucket permissions are public
- Confirm file size limits

### Auth issues
- Ensure email is confirmed
- Check `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
- Verify `/auth/callback` route exists

### Blank pages
- Clear browser cache
- Check browser console for errors
- Verify Supabase credentials

## Next Steps

1. **Add Twilio Integration** for voice/video calls
2. **Implement Typing Indicators** for better UX
3. **Add Group Chats** for multi-user conversations
4. **Message Reactions** for engagement
5. **User Presence** (online/offline status)
6. **Push Notifications** for new messages
7. **Message Search** across conversations
8. **Call History** and analytics

## Contributing

This is a complete project scaffold. Feel free to:
- Extend features
- Add new components
- Optimize performance
- Customize styling

## License

MIT

## Support

For issues and questions:
1. Check `ARCHITECTURE.md` for detailed setup
2. Review Supabase docs: https://supabase.com/docs
3. Check Next.js docs: https://nextjs.org/docs

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [shadcn/ui](https://ui.shadcn.com)

---

**Built with ❤️ using modern web technologies**
