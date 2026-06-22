'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import { CallDialog } from './call-dialog'

export function ChatWindow() {
  const { currentConversation, currentUser, messages, setMessages, addMessage } = useChatStore()
  const [otherUser, setOtherUser] = useState<any>(null)
  const [callDialogOpen, setCallDialogOpen] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadMessages()
      loadOtherUser()
      const unsubscribe = subscribeToMessages()
      return () => {
        unsubscribe?.()
      }
    }
  }, [currentConversation?.id])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    if (!currentConversation) return

    setMessagesLoading(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          content,
          message_type,
          created_at,
          deleted_at,
          users!sender_id(id, username, email, avatar_url),
          attachments(*)
        `)
        .eq('conversation_id', currentConversation.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading messages:', error)
        setMessages([])
        return
      }
      
      const formattedMessages = (data || []).map((msg: any) => ({
        ...msg,
        sender: msg.users,
      }))
      
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }

  const loadOtherUser = async () => {
    if (currentConversation?.conversation_type !== 'direct') return

    try {
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id, users(id, username, avatar_url, email)')
        .eq('conversation_id', currentConversation.id)

      const other = participants?.find((p: any) => p.user_id !== currentUser?.id)
      if (other) {
        setOtherUser(other.users)
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
        async (payload) => {
          // Fetch the message with full details
          const { data: messageData } = await supabase
            .from('messages')
            .select(`
              id,
              conversation_id,
              sender_id,
              content,
              message_type,
              created_at,
              deleted_at,
              users!sender_id(id, username, email, avatar_url),
              attachments(*)
            `)
            .eq('id', payload.new.id)
            .single()

          if (messageData) {
            addMessage({
              ...messageData,
              sender: messageData.users,
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const handleStartCall = async (callType: 'audio' | 'video') => {
    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversation?.id,
          callType,
        }),
      })

      if (!response.ok) throw new Error('Failed to start call')

      const { roomId } = await response.json()

      // For now, we'll show an alert since real WebRTC/calling service isn't integrated
      alert(`${callType.charAt(0).toUpperCase() + callType.slice(1)} call started! Room ID: ${roomId}`)
    } catch (error) {
      console.error('Error starting call:', error)
      alert('Failed to start call')
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
            {otherUser?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold truncate">
              {currentConversation.conversation_type === 'direct'
                ? otherUser?.username || 'Loading...'
                : currentConversation.group_name}
            </h2>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => handleStartCall('audio')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Audio Call"
            title="Start audio call"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button
            onClick={() => handleStartCall('video')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Video Call"
            title="Start video call"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="hidden sm:block p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Info">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === currentUser?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput conversationId={currentConversation.id} />
    </div>
  )
}
