'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import { CallHandler } from './call-handler'

export function ChatWindow() {
  const { currentConversation, currentUser, messages, setMessages, addMessage } = useChatStore()
  const [otherUser, setOtherUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadMessages()
      loadOtherUser()
      subscribeToMessages()
    }
  }, [currentConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    if (!currentConversation) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`*, profiles:sender_id(id, full_name, avatar_url)`)
        .eq('conversation_id', currentConversation.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      const formattedMessages = (data || []).map((msg: any) => ({
        ...msg,
        sender: msg.profiles
      }))
      
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
      setMessages([])
    }
  }

  const loadOtherUser = async () => {
    if (currentConversation?.conversation_type !== 'direct') return

    try {
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id, profiles:user_id(id, full_name, avatar_url, email)')
        .eq('conversation_id', currentConversation.id)

      const other = participants?.find((p: any) => p.user_id !== currentUser?.id)
      if (other) {
        setOtherUser(other.profiles)
      }
    } catch (error) {
      console.error('Error loading other user:', error)
    }
  }

  const subscribeToMessages = () => {
    if (!currentConversation) return

    const subscription = supabase
      .channel(`messages:${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${currentConversation.id}`,
        },
        (payload) => {
          addMessage(payload.new as any)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  if (!currentConversation) {
    return (
      <div className="hidden sm:flex flex-1 items-center justify-center bg-background">
        <div className="text-center">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-muted-foreground text-lg">Select a conversation to start</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background pt-16 sm:pt-0">
      {/* Chat Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card sticky top-16 sm:top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
            {otherUser?.full_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold truncate">
              {currentConversation.conversation_type === 'direct'
                ? otherUser?.full_name || currentConversation.title || 'User'
                : currentConversation.group_name || currentConversation.title}
            </h2>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <CallHandler otherUser={otherUser} conversationId={currentConversation.id} isVideo={false} />
          <CallHandler otherUser={otherUser} conversationId={currentConversation.id} isVideo={true} />
          <button className="hidden sm:block p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Info">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender_id === currentUser?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput conversationId={currentConversation.id} />
    </div>
  )
}
