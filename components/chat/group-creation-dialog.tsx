'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { X } from 'lucide-react'

interface GroupCreationDialogProps {
  isOpen: boolean
  onClose: () => void
  onGroupCreated?: () => void
}

const RELATIONSHIP_TYPES = [
  { value: 'girlfriend', label: 'Girlfriend', emoji: '👩‍🦰' },
  { value: 'boyfriend', label: 'Boyfriend', emoji: '👨‍🦱' },
  { value: 'bestfriend', label: 'Best Friend', emoji: '👫' },
  { value: 'others', label: 'Others', emoji: '👥' },
]

export function GroupCreationDialog({ isOpen, onClose, onGroupCreated }: GroupCreationDialogProps) {
  const [groupName, setGroupName] = useState('')
  const [selectedRelationship, setSelectedRelationship] = useState<string>('others')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { currentUser, addConversation } = useChatStore()

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setUsers([])
      return
    }

    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
        .neq('id', currentUser?.id)
        .limit(10)

      setUsers((data || []).filter(u => !selectedUsers.includes(u.id)))
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers([...selectedUsers, userId])
    setSearchQuery('')
    setUsers([])
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(id => id !== userId))
  }

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0 || !currentUser) {
      alert('Please fill in all fields and select at least one user')
      return
    }

    setLoading(true)
    try {
      // Create group conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({
          conversation_type: 'group',
          group_name: groupName,
          relationship_type: selectedRelationship,
        })
        .select()
        .single()

      if (!conversation) throw new Error('Failed to create conversation')

      // Add all selected users and current user as participants
      const participants = [currentUser.id, ...selectedUsers]
      await supabase.from('conversation_participants').insert(
        participants.map(userId => ({
          conversation_id: conversation.id,
          user_id: userId,
        }))
      )

      // Fetch participant data
      const { data: participantUsers } = await supabase
        .from('users')
        .select('*')
        .in('id', participants)

      const newConversation = {
        id: conversation.id,
        conversation_type: 'group' as const,
        group_name: groupName,
        relationship_type: selectedRelationship,
        created_at: new Date().toISOString(),
        participants: participantUsers || [],
      }

      addConversation(newConversation)
      onGroupCreated?.()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error creating group:', error)
      alert('Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setGroupName('')
    setSelectedRelationship('others')
    setSelectedUsers([])
    setSearchQuery('')
    setUsers([])
  }

  if (!isOpen) return null

  const selectedUserData = users.filter(u => selectedUsers.includes(u.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Group Chat</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Relationship Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Relationship Type</label>
            <div className="grid grid-cols-2 gap-2">
              {RELATIONSHIP_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedRelationship(type.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    selectedRelationship === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-xs font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add Users */}
          <div>
            <label className="block text-sm font-medium mb-2">Add Members</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchUsers(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-2"
            />

            {/* Search Results */}
            {users.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className="w-full text-left p-3 hover:bg-muted border-b border-border last:border-b-0 transition-colors"
                  >
                    <p className="font-medium text-sm">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Selected Members ({selectedUsers.length})
              </label>
              <div className="space-y-2">
                {selectedUsers.map((userId) => {
                  const user = users.find(u => u.id === userId) || selectedUserData.find(u => u.id === userId)
                  return (
                    <div
                      key={userId}
                      className="flex items-center justify-between bg-muted p-2 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{user?.username}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(userId)}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={loading || !groupName || selectedUsers.length === 0}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  )
}
