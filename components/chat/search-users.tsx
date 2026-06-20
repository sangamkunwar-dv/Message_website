'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'

export function SearchUsers() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
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

      setResults(data || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = async (selectedUser: any) => {
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
          participants: [currentUser, selectedUser],
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
        placeholder="Search by username or email..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
      />

      {loading && (
        <div className="text-sm text-gray-500 text-center py-2">Searching...</div>
      )}

      <div className="max-h-64 overflow-y-auto">
        {results.map((user) => (
          <button
            key={user.id}
            onClick={() => handleSelectUser(user)}
            className="w-full text-left p-3 hover:bg-indigo-50 rounded transition"
          >
            <p className="font-medium text-sm text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
