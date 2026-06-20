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

        // Set mock user
        const mockUser = {
          id: user.id,
          username: user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar_url: ''
        }
        setCurrentUser(mockUser)

        // Set mock conversations
        const mockConversations = [
          {
            id: 'conv-1',
            conversation_type: 'direct' as const,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            participants: [
              { id: '2', username: 'Alice', email: 'alice@example.com', avatar_url: '' }
            ]
          },
          {
            id: 'conv-2',
            conversation_type: 'direct' as const,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            participants: [
              { id: '3', username: 'Bob', email: 'bob@example.com', avatar_url: '' }
            ]
          }
        ]
        setConversations(mockConversations)
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
