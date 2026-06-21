'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { SearchUsers } from './search-users'
import { ConversationItem } from './conversation-item'
import { GroupCreationDialog } from './group-creation-dialog'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, LogOut, Plus, User } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  const { conversations, currentUser, setCurrentConversation } = useChatStore()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/auth/login')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex w-full sm:w-64 md:w-80 h-screen bg-card border-r border-border flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Chats</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* User Info */}
          {currentUser && (
            <div className="bg-muted rounded-lg p-3 mb-4">
              <p className="text-sm font-medium truncate">{currentUser.username}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
            </div>
          )}

          {/* User Menu */}
          <div className="flex gap-2">
            <button
              onClick={() => setGroupDialogOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              title="Create group chat"
            >
              <Plus className="w-4 h-4" />
            </button>
            <Link
              href="/profile"
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="px-3 py-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Section */}
        {searchOpen && (
          <div className="p-4 border-b border-border">
            <SearchUsers />
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-2">Search for users to start chatting</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onClick={() => setCurrentConversation(conversation)}
              />
            ))
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 top-16 z-40 bg-card border-r border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* User Info */}
            {currentUser && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm font-medium">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setGroupDialogOpen(true)
                  setMobileOpen(false)
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Group</span>
              </button>
              <Link
                href="/profile"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <div className="flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2">
                <ThemeToggle />
                <span className="text-sm">Theme</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex-1 px-3 py-2 hover:bg-muted rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>

            {/* Search */}
            <div className="border-t border-border pt-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-full px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                🔍 Search Users
              </button>
            </div>

            {/* Search Results */}
            {searchOpen && (
              <div className="border-t border-border pt-4">
                <SearchUsers />
              </div>
            )}

            {/* Conversations */}
            <div className="border-t border-border pt-4">
              <h2 className="text-sm font-semibold mb-2">Conversations</h2>
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              ) : (
                conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    onClick={() => {
                      setCurrentConversation(conversation)
                      setMobileOpen(false)
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Group Creation Dialog */}
      <GroupCreationDialog
        isOpen={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
      />
    </>
  )
}
