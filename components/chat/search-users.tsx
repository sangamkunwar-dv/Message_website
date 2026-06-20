'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { MessageCircle, User } from 'lucide-react'

export function SearchUsers() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { currentUser, addConversation, setCurrentConversation } = useChatStore()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .or(`username.ilike.%${value}%,email.ilike.%${value}%`)
        .limit(10)

      // Filter out current user
      setResults((data || []).filter(user => user.id !== currentUser?.id))
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = (userId: string) => {
    router.push(`/user/${userId}`)
    setQuery('')
    setResults([])
  }

  const handleMessage = async (selectedUser: any) => {
    if (!currentUser) return

    try {
      // Get or create direct conversation
      const { data: existingConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUser.id)

      let conversationId = null
      for (const { conversation_id } of existingConversations || []) {
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conversation_id)

        if (participants?.length === 2 && participants.some(p => p.user_id === selectedUser.id)) {
          conversationId = conversation_id
          break
        }
      }

      if (!conversationId) {
        // Create new conversation
        const { data: conversation } = await supabase
          .from('conversations')
          .insert({ conversation_type: 'direct' })
          .select()
          .single()

        conversationId = conversation?.id

        // Add participants
        await supabase.from('conversation_participants').insert([
          { conversation_id: conversationId, user_id: currentUser.id },
          { conversation_id: conversationId, user_id: selectedUser.id },
        ])

        const newConversation = {
          id: conversationId,
          conversation_type: 'direct' as const,
          created_at: new Date().toISOString(),
          participants: [selectedUser],
        }
        addConversation(newConversation)
      }

      setQuery('')
      setResults([])
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by name or email..."
        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
      />

      {loading && (
        <div className="text-sm text-muted-foreground text-center py-2">Searching...</div>
      )}

      <div className="max-h-64 overflow-y-auto space-y-1">
        {results.length === 0 && query.length >= 2 && !loading && (
          <div className="text-sm text-muted-foreground text-center py-3">
            No users found
          </div>
        )}
        {results.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
          >
            <button
              onClick={() => handleViewProfile(user.id)}
              className="flex-1 text-left"
            >
              <p className="font-medium text-sm">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </button>
            <button
              onClick={() => handleMessage(user)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Message"
            >
              <MessageCircle className="w-4 h-4 text-primary" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
