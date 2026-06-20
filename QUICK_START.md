# Quick Start Guide - Chat Application

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Get Supabase Credentials
1. Go to https://supabase.com and create a project
2. Copy your project URL and anon key
3. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### Step 3: Start Development Server
```bash
pnpm dev
```

### Step 4: Create Storage Bucket
1. Go to Supabase dashboard → Storage
2. Create new bucket named `chat-attachments`
3. Set policies to allow authenticated uploads

### Step 5: Test the App
1. Open http://localhost:3000
2. Click "Sign up"
3. Create account with test email
4. Check email for confirmation link
5. Log in
6. Search for another user's username to start chatting

## File Organization Quick Reference

### Modify Authentication
- Login: `app/auth/login/page.tsx`
- Sign Up: `app/auth/sign-up/page.tsx`

### Modify Chat UI
- Sidebar: `components/chat/sidebar.tsx`
- Messages: `components/chat/message-bubble.tsx`
- Input: `components/chat/message-input.tsx`

### Modify Styling
- Colors: `app/globals.css` (Tailwind theme)
- Components: Each `.tsx` file has inline Tailwind classes

### Modify State
- Store: `lib/store/chat-store.ts`

### Modify Database
- Queries: `lib/db/queries.ts`

## Common Tasks

### Add a New Feature
1. Create component in `components/chat/`
2. Import in relevant parent component
3. Update store if needed
4. Test with `pnpm dev`

### Query the Database
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(10)
```

### Add Real-Time Subscription
```typescript
supabase
  .channel('my-channel')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    console.log(payload)
  })
  .subscribe()
```

### Update Global State
```typescript
import { useChatStore } from '@/lib/store/chat-store'

const { currentUser, setCurrentUser } = useChatStore()
```

### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('chat-attachments')
  .upload('path/to/file', file)
```

## Debugging

### Check Console Errors
Open browser DevTools (F12) and check Console tab

### Check Server Logs
Terminal where you ran `pnpm dev`

### Check Supabase Logs
1. Go to Supabase dashboard
2. Click "Logs" in sidebar
3. Filter by database queries

### Check Real-Time
```typescript
// Add to component
useEffect(() => {
  console.log("[v0] Subscribed to messages")
}, [])
```

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select GitHub repo
5. Add environment variables
6. Click "Deploy"

### Set Environment Variables on Vercel
1. Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing with Multiple Users

### Create Multiple Test Accounts
1. Open separate browser windows
2. Sign up in each with different emails
3. Search for other users
4. Message between accounts

### Use Browser Sessions
1. Use private window for second user
2. Or use Firefox for one, Chrome for other

## Common Issues & Fixes

### "Cannot find module" error
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Messages not appearing
1. Check Supabase project is active
2. Go to Supabase dashboard → Realtime
3. Ensure "realtime" is enabled

### Files not uploading
1. Check `chat-attachments` bucket exists in Supabase
2. Verify bucket is public
3. Check file size < 100MB

### Login not working
1. Verify email confirmation
2. Check `.env.local` has correct credentials
3. Check `/auth/callback` route exists

### Blank pages
1. Press F5 to refresh
2. Clear browser cache
3. Check browser console for errors

## Performance Tips

### Optimize Images
- Use Next.js Image component
- Images auto-resize
- PNG/JPG optimal for most cases

### Reduce Bundle Size
- Import only what you use
- Use dynamic imports for large components
- Code splitting happens automatically

### Database Performance
- Indexes are already created
- RLS policies are optimized
- Message pagination ready

## Next Steps

1. **Add Twilio** - Follow `ARCHITECTURE.md` for voice/video calling setup
2. **Customize Theme** - Edit `app/globals.css`
3. **Add Features** - See `IMPLEMENTATION_SUMMARY.md` for ideas
4. **Deploy** - Push to GitHub and deploy to Vercel

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

## Support

See `README.md` for full documentation
See `ARCHITECTURE.md` for technical details
See `IMPLEMENTATION_SUMMARY.md` for what was built

---

**Happy Coding! 🚀**
