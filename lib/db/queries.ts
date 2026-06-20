import { createClient } from '@/lib/supabase/server'

// Users
export async function getOrCreateUser(id: string, email: string, username: string) {
  const supabase = await createClient()
  
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (existingUser) {
    return existingUser
  }

  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({
      id,
      email,
      username,
    })
    .select()
    .single()

  if (createError) throw createError
  return newUser
}

export async function getUserByUsername(username: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function searchUsers(query: string, limit = 10) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(limit)

  if (error) throw error
  return data
}

// Conversations
export async function getOrCreateDirectConversation(userId1: string, userId2: string) {
  const supabase = await createClient()
  
  // Check if conversation exists
  const { data: existing, error: existError } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId1)

  if (existError) throw existError

  for (const { conversation_id } of existing || []) {
    const { data: participants } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conversation_id)

    if (participants?.length === 2 && participants.some(p => p.user_id === userId2)) {
      return { data: { id: conversation_id }, error: null }
    }
  }

  // Create new conversation
  const { data: conversation, error: createError } = await supabase
    .from('conversations')
    .insert({
      conversation_type: 'direct',
    })
    .select()
    .single()

  if (createError) throw createError

  // Add participants
  const { error: participantError } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: conversation.id, user_id: userId1 },
      { conversation_id: conversation.id, user_id: userId2 },
    ])

  if (participantError) throw participantError

  return { data: conversation, error: null }
}

export async function getUserConversations(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('conversation_participants')
    .select(
      `
      conversation_id,
      conversations (
        id,
        conversation_type,
        group_name,
        group_avatar_url,
        created_at,
        updated_at
      )
      `
    )
    .eq('user_id', userId)
    .order('joined_at', { ascending: false })

  if (error) throw error
  return data
}

// Messages
export async function getConversationMessages(conversationId: string, limit = 50) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      *,
      users (
        id,
        username,
        email,
        avatar_url
      ),
      attachments (*)
      `
    )
    .eq('conversation_id', conversationId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data?.reverse() || []
}

export async function createMessage(
  conversationId: string,
  senderId: string,
  content: string,
  messageType: 'text' | 'image' | 'video' | 'file' | 'call' = 'text'
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      message_type: messageType,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Attachments
export async function createAttachment(
  messageId: string,
  fileUrl: string,
  fileName: string,
  fileType: string,
  fileSize?: number
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('attachments')
    .insert({
      message_id: messageId,
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
