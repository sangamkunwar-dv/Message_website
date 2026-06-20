import { create } from 'zustand'

export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content?: string
  message_type: 'text' | 'image' | 'video' | 'file' | 'call'
  created_at: string
  sender?: User
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  message_id: string
  file_url: string
  file_name: string
  file_type: string
  file_size?: number
}

export interface Conversation {
  id: string
  conversation_type: 'direct' | 'group'
  group_name?: string
  group_avatar_url?: string
  created_at: string
  participants?: User[]
  last_message?: Message
  unread_count?: number
}

interface ChatStore {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  
  conversations: Conversation[]
  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  
  currentConversation: Conversation | null
  setCurrentConversation: (conversation: Conversation | null) => void
  
  messages: Message[]
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  
  users: User[]
  setUsers: (users: User[]) => void
  
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  error: string | null
  setError: (error: string | null) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),
  
  currentConversation: null,
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  
  users: [],
  setUsers: (users) => set({ users }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  error: null,
  setError: (error) => set({ error }),
}))
