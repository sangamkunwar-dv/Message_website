'use client'

import { useState } from 'react'
import { Phone, PhoneOff, Video } from 'lucide-react'

interface CallDialogProps {
  isOpen: boolean
  onClose: () => void
  onStartCall: (type: 'audio' | 'video') => void
  userName: string
}

export function CallDialog({ isOpen, onClose, onStartCall, userName }: CallDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleStartCall = async (type: 'audio' | 'video') => {
    setLoading(true)
    try {
      onStartCall(type)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-lg p-8 max-w-sm mx-4">
        <h3 className="text-lg font-bold mb-2">Start Call</h3>
        <p className="text-muted-foreground mb-6">
          Call with <span className="font-semibold">{userName}</span>
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => handleStartCall('audio')}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Phone className="w-5 h-5" />
            <span>Audio Call</span>
          </button>
          <button
            onClick={() => handleStartCall('video')}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Video className="w-5 h-5" />
            <span>Video Call</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
