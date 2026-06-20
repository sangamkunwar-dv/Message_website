'use client'

import { Conversation } from '@/lib/store/chat-store'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ConversationItemProps {
  conversation: Conversation
  onClick: () => void
}

export function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  const [otherUser, setOtherUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    if (conversation.conversation_type === 'direct') {
      loadOtherUser()
    }
  }, [conversation])

  const loadOtherUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id, users(username, avatar_url)')
        .eq('conversation_id', conversation.id)

      const other = participants?.find(p => p.user_id !== user.id)
      if (other) {
        setOtherUser(other.users)
      }
    } catch (error) {
      console.error('Error loading other user:', error)
    }
  }

  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          {conversation.conversation_type === 'direct'
            ? otherUser?.username?.[0]?.toUpperCase() || '?'
            : conversation.group_name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {conversation.conversation_type === 'direct'
              ? otherUser?.username || 'Loading...'
              : conversation.group_name}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {conversation.last_message?.content || 'No messages yet'}
          </p>
        </div>
      </div>
    </button>
  )
}
