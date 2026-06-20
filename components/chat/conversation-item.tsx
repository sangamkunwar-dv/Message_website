'use client'

import { Conversation } from '@/lib/store/chat-store'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ConversationItemProps {
  conversation: Conversation
  onClick: () => void
}

export function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  // Get other user from conversation participants
  const otherUser = conversation.participants?.[0]

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
