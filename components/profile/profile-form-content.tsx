'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Save, X, Camera } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  bio?: string | null
}

export function ProfileFormContent() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [stats, setStats] = useState({ followers: 0, following: 0 })

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    bio: '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userData) {
        setProfile(userData)
        setFormData({
          full_name: userData.full_name || '',
          email: userData.email,
          bio: userData.bio || '',
        })
        if (userData.avatar_url) {
          setAvatarPreview(userData.avatar_url)
        }

        // Fetch followers and following counts
        const { count: followersCount } = await supabase
          .from('followers')
          .select('*', { count: 'exact' })
          .eq('following_id', user.id)

        const { count: followingCount } = await supabase
          .from('followers')
          .select('*', { count: 'exact' })
          .eq('follower_id', user.id)

        setStats({
          followers: followersCount || 0,
          following: followingCount || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Update profile data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          bio: formData.bio,
          avatar_url: avatarPreview,
        })
        .eq('id', profile.id)

      if (updateError) throw updateError

      setSuccess(true)
      setProfile({
        ...profile,
        full_name: formData.full_name,
        email: formData.email,
        avatar_url: avatarPreview,
        bio: formData.bio,
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save profile'
      setError(errorMsg)
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-foreground">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 sm:pt-0">
      {/* Header */}
      <header className="border-b border-border fixed sm:sticky top-0 left-0 right-0 z-50 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Profile Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSaveProfile} className="space-y-8">
            {/* Avatar Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Change Picture
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                  {avatarFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null)
                        setAvatarPreview(profile?.avatar_url || null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors inline-flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Profile Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{stats.followers}</p>
                  <p className="text-sm text-muted-foreground mt-1">Followers</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{stats.following}</p>
                  <p className="text-sm text-muted-foreground mt-1">Following</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-foreground focus:outline-none"
                    placeholder="Your email"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
                Profile updated successfully!
              </div>
            )}

            {/* Save Button */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
