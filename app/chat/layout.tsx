'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { Sidebar } from '@/components/chat/sidebar'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { setCurrentUser, setConversations } = useChatStore()
  const supabase = createClient()

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get current user from auth
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          router.push('/auth/login')
          return
        }

        // Fetch user profile from users table
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (userError) {
          console.error('Error fetching user:', userError)
          return
        }

        if (userProfile) {
          setCurrentUser({
            id: userProfile.id,
            username: userProfile.username,
            email: userProfile.email,
            avatar_url: userProfile.avatar_url,
          })
        }

        // Fetch conversations with better structure
        const { data: participants, error: convError } = await supabase
          .from('conversation_participants')
          .select(`
            conversation_id,
            conversations (
              id,
              conversation_type,
              group_name,
              group_avatar_url,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })

        if (convError) {
          console.error('Error fetching conversations:', convError)
          return
        }

        if (participants && Array.isArray(participants)) {
          const conversations = participants
            .filter((p: any) => p.conversations)
            .map((p: any) => ({
              ...p.conversations,
              participants: [],
            }))
          setConversations(conversations)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }

    initializeChat()
  }, [setCurrentUser, setConversations, router, supabase])

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      {children}
    </div>
  )
}
