'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { Button } from '@/components/ui/button'

interface MessageInputProps {
  conversationId: string
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const { currentUser, addMessage } = useChatStore()

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !currentUser) return

    setSending(true)
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: content.trim(),
        })
        .select('*')
        .single()

      if (error) throw error

      addMessage({
        ...message,
        sender: currentUser,
      })

      setContent('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !currentUser) return

    setUploadingFiles(true)
    try {
      for (const file of Array.from(files)) {
        // Upload file to blob storage
        const uniqueFileName = `${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('chat-attachments')
          .upload(`${conversationId}/${uniqueFileName}`, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('chat-attachments')
          .getPublicUrl(`${conversationId}/${uniqueFileName}`)

        // Create message record with file info in content as JSON
        const messageContent = JSON.stringify({
          type: 'file',
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: urlData.publicUrl,
        })

        const { data: message, error: msgError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: currentUser.id,
            content: messageContent,
          })
          .select('*')
          .single()

        if (msgError) throw msgError

        addMessage({
          ...message,
          sender: currentUser,
        })
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploadingFiles(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingFiles}
          className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
          aria-label="Attach file"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Aa"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />

        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Send emoji"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <Button
          type="submit"
          disabled={!content.trim() || sending}
          className="px-4 py-2"
        >
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  )
}
