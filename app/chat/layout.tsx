'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { Sidebar } from '@/components/chat/sidebar'
import { redirect } from 'next/navigation'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setCurrentUser, setConversations } = useChatStore()
  const supabase = createClient()

  useEffect(() => {
    const initializeChat = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        redirect('/auth/login')
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
        const conversations = participants.map((p: any) => p.conversations)
        setConversations(conversations)
      }

      // Subscribe to conversation changes
      const subscription = supabase
        .channel('user_conversations')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversation_participants',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Refetch conversations on changes
            initializeChat()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }

    initializeChat()
  }, [supabase, setCurrentUser, setConversations])

  return (
    <div className="flex h-screen">
      <Sidebar />
      {children}
    </div>
  )
}
