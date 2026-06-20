'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/providers/theme-provider'
import { MessageCircle, Plus, Check, LogOut, Sun, Moon } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  username: string
  email: string
  avatar_url: string | null
}

interface UserStats {
  followers: number
  following: number
  messages: number
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const supabase = createClient()
  const [themeContext, setThemeContext] = useState<any>(null)

  useEffect(() => {
    try {
      const context = useTheme()
      setThemeContext(context)
    } catch (e) {
      // Theme not available
    }
  }, [])

  const theme = themeContext?.theme
  const toggleTheme = themeContext?.toggleTheme

  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats>({ followers: 0, following: 0, messages: 0 })
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    try {
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }

      const { data: currentUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      setCurrentUser(currentUserData)

      // Get profile user
      const { data: profileUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!profileUser) {
        router.push('/chat')
        return
      }

      setUser(profileUser)

      // Get followers count
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact' })
        .eq('following_id', userId)

      // Get following count
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact' })
        .eq('follower_id', userId)

      // Check if current user follows this user
      const { data: followData } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', authUser.id)
        .eq('following_id', userId)

      setIsFollowing(followData && followData.length > 0)
      setStats({
        followers: followersCount || 0,
        following: followingCount || 0,
        messages: 0,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!currentUser) return

    try {
      if (isFollowing) {
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

      setIsFollowing(!isFollowing)
      setStats(prev => ({
        ...prev,
        followers: prev.followers + (isFollowing ? -1 : 1),
      }))
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  const handleMessage = async () => {
    if (!currentUser || !user) return

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

        if (participants?.length === 2 && participants.some(p => p.user_id === userId)) {
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
          { conversation_id: conversationId, user_id: userId },
        ])
      }

      router.push('/chat')
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">User not found</p>
          <Link href="/chat" className="text-primary hover:underline mt-2 inline-block">
            Back to chat
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/chat" className="text-primary hover:text-primary/80 font-medium">
            ← Back
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-lg bg-primary/10 flex items-center justify-center border-4 border-card text-4xl font-bold text-primary flex-shrink-0">
                {user.username?.[0]?.toUpperCase() || '?'}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              {/* Actions */}
              {currentUser?.id !== userId && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleMessage}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={handleFollow}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isFollowing
                        ? 'bg-muted text-foreground hover:bg-muted/80'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-4 h-4" />
                        Following
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stats.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stats.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stats.messages}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
