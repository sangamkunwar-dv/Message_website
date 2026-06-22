'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { MessageCircle, UserPlus, UserCheck } from 'lucide-react'

export function SearchUsers() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set())
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
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${value}%,email.ilike.%${value}%`)
        .limit(10)

      // Filter out current user
      const filteredResults = (data || []).filter(user => user.id !== currentUser?.id)
      setResults(filteredResults)

      // Fetch follow status for all results
      if (filteredResults.length > 0 && currentUser) {
        const { data: followers } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', currentUser.id)

        const followingSet = new Set(followers?.map(f => f.following_id) || [])
        setFollowingUsers(followingSet)
      }
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

  const handleFollowToggle = async (userId: string) => {
    if (!currentUser) return

    try {
      const isFollowing = followingUsers.has(userId)

      if (isFollowing) {
        // Unfollow
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId)

        setFollowingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
      } else {
        // Follow
        await supabase
          .from('followers')
          .insert({ follower_id: currentUser.id, following_id: userId })

        setFollowingUsers(prev => new Set(prev).add(userId))
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
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

      {query.length >= 2 && (
        <div className="max-h-64 overflow-y-auto space-y-1 border border-border rounded-lg bg-card p-2">
          {results.length === 0 && !loading && (
            <div className="text-sm text-muted-foreground text-center py-3">
              No users found
            </div>
          )}
          {results.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <button
                onClick={() => handleViewProfile(user.id)}
                className="flex-1 text-left"
              >
                <p className="font-medium text-sm">{user.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </button>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => handleFollowToggle(user.id)}
                  className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors flex-shrink-0"
                  title={followingUsers.has(user.id) ? 'Unfollow' : 'Follow'}
                >
                  {followingUsers.has(user.id) ? (
                    <UserCheck className="w-4 h-4 text-blue-600" />
                  ) : (
                    <UserPlus className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => handleMessage(user)}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
                  title="Message"
                >
                  <MessageCircle className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
