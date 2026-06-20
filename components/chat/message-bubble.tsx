'use client'

import { Message } from '@/lib/store/chat-store'
import { format } from 'date-fns'
import Image from 'next/image'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formattedTime = format(new Date(message.created_at), 'HH:mm')

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        {/* Text Content */}
        {message.content && (
          <p className="text-sm break-words">{message.content}</p>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => {
              if (attachment.file_type.startsWith('image/')) {
                return (
                  <div key={attachment.id} className="rounded overflow-hidden">
                    <Image
                      src={attachment.file_url}
                      alt={attachment.file_name}
                      width={300}
                      height={200}
                      className="max-w-xs h-auto"
                    />
                  </div>
                )
              } else if (attachment.file_type.startsWith('video/')) {
                return (
                  <video
                    key={attachment.id}
                    src={attachment.file_url}
                    controls
                    className="max-w-xs h-auto rounded"
                  />
                )
              } else {
                return (
                  <a
                    key={attachment.id}
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 7H4a2 2 0 00-2 2v5a2 2 0 002 2h2.93l1.586 2.793A1 1 0 0010 17h5a2 2 0 002-2V9a2 2 0 00-2-2z" />
                    </svg>
                    <span className="text-xs truncate">{attachment.file_name}</span>
                  </a>
                )
              }
            })}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-xs mt-1 ${isOwn ? 'text-indigo-200' : 'text-gray-600'}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  )
}
