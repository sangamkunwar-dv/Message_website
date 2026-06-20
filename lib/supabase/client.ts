// Mock Supabase client for local development without Supabase credentials
export function createClient() {
  // Mock data storage
  const mockUsers = new Map([
    ['1', { id: '1', username: 'Alice', email: 'alice@example.com', avatar_url: '' }],
    ['2', { id: '2', username: 'Bob', email: 'bob@example.com', avatar_url: '' }],
    ['3', { id: '3', username: 'Charlie', email: 'charlie@example.com', avatar_url: '' }],
  ])

  const mockConversations = new Map([
    ['conv-1', { id: 'conv-1', conversation_type: 'direct', created_at: new Date().toISOString() }],
    ['conv-2', { id: 'conv-2', conversation_type: 'direct', created_at: new Date().toISOString() }],
  ])

  const mockMessages = new Map([
    ['conv-1', [
      { id: 'm1', conversation_id: 'conv-1', sender_id: '1', content: 'Hey, how are you?', message_type: 'text', created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 'm2', conversation_id: 'conv-1', sender_id: '2', content: 'I\'m doing great!', message_type: 'text', created_at: new Date(Date.now() - 1800000).toISOString() },
    ]],
  ])

  return {
    auth: {
      getUser: async () => {
        const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('chat_user') || 'null') : null
        return { data: { user } }
      },
      signUp: async (data: any) => {
        const user = { 
          id: Math.random().toString(36).substr(2, 9),
          email: data.email,
          user_metadata: { username: data.email.split('@')[0] }
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('chat_user', JSON.stringify(user))
        }
        return { data: { user }, error: null }
      },
      signInWithPassword: async (data: any) => {
        const user = { 
          id: Math.random().toString(36).substr(2, 9),
          email: data.email,
          user_metadata: { username: data.email.split('@')[0] }
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('chat_user', JSON.stringify(user))
        }
        return { data: { user }, error: null }
      },
      signOut: async () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('chat_user')
        }
        return { error: null }
      }
    },
    from: (table: string) => ({
      select: (fields: string) => ({
        eq: (field: string, value: any) => ({
          single: async () => {
            if (table === 'users' && field === 'id') {
              return { data: mockUsers.get(value) || null, error: null }
            }
            return { data: null, error: null }
          },
          order: (field: string, options: any) => ({
            async then(onFulfilled: any, onRejected: any) {
              if (table === 'conversation_participants' && field === 'joined_at') {
                return onFulfilled({ data: Array.from(mockConversations.values()).map((c: any) => ({
                  conversation_id: c.id,
                  conversations: c
                })), error: null })
              }
              return onFulfilled({ data: [], error: null })
            }
          })
        }),
        is: (field: string, value: any) => ({
          order: (field: string, options: any) => ({
            then(onFulfilled: any, onRejected: any) {
              if (table === 'messages') {
                const convId = arguments[0] // This is hacky but works for demo
                return onFulfilled({ data: mockMessages.get('conv-1') || [], error: null })
              }
              return onFulfilled({ data: [], error: null })
            }
          })
        }),
        then(onFulfilled: any, onRejected: any) {
          if (table === 'users') {
            return onFulfilled({ data: Array.from(mockUsers.values()), error: null })
          }
          if (table === 'conversation_participants') {
            return onFulfilled({ data: [], error: null })
          }
          if (table === 'conversations') {
            return onFulfilled({ data: Array.from(mockConversations.values()), error: null })
          }
          return onFulfilled({ data: [], error: null })
        }
      })
    }),
    channel: (name: string) => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({ unsubscribe: () => {} })
    })
  }
}
