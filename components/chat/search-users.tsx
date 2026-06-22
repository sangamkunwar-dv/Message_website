'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { MessageCircle, Plus, Check } from 'lucide-react'

interface SearchResult {
  id: string
  username: string
  email: string
  avatar_url?: string
  isFollowing?: boolean
}

export function SearchUsers() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const supabase = createClient()
  const { currentUser, addConversation } = useChatStore()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      // Search users from users table
      const { data: searchResults } = await supabase
        .from('users')
        .select('id, username, email, avatar_url')
        .or(`username.ilike.%${value}%,email.ilike.%${value}%`)
        .limit(10)

      if (!searchResults) {
        setResults([])
        setLoading(false)
        return
      }

      // Filter out current user
      const filtered = (searchResults || []).filter(user => user.id !== currentUser?.id)

      // Check follow status for each user
      if (currentUser) {
        const followStates: Record<string, boolean> = {}
        for (const user of filtered) {
          const { data: followData } = await supabase
            .from('follows')
            .select('*', { count: 'exact' })
            .eq('follower_id', currentUser.id)
            .eq('following_id', user.id)
            .single()

          followStates[user.id] = !!followData
        }
        setFollowingStates(followStates)
      }

      setResults(filtered.map(user => ({
        ...user,
        isFollowing: followingStates[user.id] || false,
      })))
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = (userId: string) => {
    router.push(`/user/${userId}`)
    setQuery('')
    setResults([])
  }

  const handleToggleFollow = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUser) return

    const isCurrentlyFollowing = followingStates[userId]

    try {
      if (isCurrentlyFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId)
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUser.id,
            following_id: userId,
          })
      }

      setFollowingStates(prev => ({
        ...prev,
        [userId]: !isCurrentlyFollowing,
      }))

      setResults(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, isFollowing: !isCurrentlyFollowing }
            : user
        )
      )
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  const handleMessage = async (selectedUser: any, e: React.MouseEvent) => {
    e.stopPropagation()
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
      router.push('/chat')
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
            onClick={() => handleViewProfile(user.id)}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={(e) => handleToggleFollow(user.id, e)}
                className={`p-2 rounded-lg transition-colors ${
                  followingStates[user.id]
                    ? 'hover:bg-muted/80'
                    : 'hover:bg-primary/10'
                }`}
                title={followingStates[user.id] ? 'Following' : 'Follow'}
              >
                {followingStates[user.id] ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Plus className="w-4 h-4 text-primary" />
                )}
              </button>
              <button
                onClick={(e) => handleMessage(user, e)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                title="Message"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
