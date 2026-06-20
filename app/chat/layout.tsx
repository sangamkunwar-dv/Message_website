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
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Fetch user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userProfile) {
          setCurrentUser(userProfile)
        }

        // Fetch conversations
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select('conversation_id, conversations(*)')
          .eq('user_id', user.id)
          .order('joined_at', { ascending: false })

        if (participants) {
          const conversations = participants.map((p: any) => ({
            ...p.conversations,
            participants: [] // Will be loaded per conversation
          }))
          setConversations(conversations)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }

    initializeChat()
  }, [setCurrentUser, setConversations, router])

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      {children}
    </div>
  )
}
