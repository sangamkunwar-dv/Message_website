'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store/chat-store'
import { Phone, PhoneOff, Video, VideoOff } from 'lucide-react'

interface CallHandlerProps {
  otherUser: any
  conversationId: string
  isVideo: boolean
}

export function CallHandler({ otherUser, conversationId, isVideo }: CallHandlerProps) {
  const [callActive, setCallActive] = useState(false)
  const [callInitiating, setCallInitiating] = useState(false)
  const [incomingCall, setIncomingCall] = useState<any>(null)
  const { currentUser } = useChatStore()
  const supabase = createClient()

  const initiateCall = async () => {
    if (!currentUser || !otherUser) return

    setCallInitiating(true)
    try {
      const { data: call, error } = await supabase
        .from('calls')
        .insert({
          caller_id: currentUser.id,
          receiver_id: otherUser.id,
          call_type: isVideo ? 'video' : 'audio',
          status: 'initiated',
          conversation_id: conversationId,
        })
        .select()
        .single()

      if (error) throw error

      setCallActive(true)

      // Subscribe to call status changes
      subscribeToCallUpdates(call.id)
    } catch (error) {
      console.error('Error initiating call:', error)
    } finally {
      setCallInitiating(false)
    }
  }

  const subscribeToCallUpdates = (callId: string) => {
    const subscription = supabase
      .channel(`call:${callId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'calls',
          filter: `id=eq.${callId}`,
        },
        (payload) => {
          if (payload.new.status === 'rejected' || payload.new.status === 'ended') {
            setCallActive(false)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const endCall = async () => {
    if (!currentUser) return

    try {
      const { data: calls } = await supabase
        .from('calls')
        .select('id')
        .eq('conversation_id', conversationId)
        .in('status', ['initiated', 'active'])
        .single()

      if (calls) {
        await supabase
          .from('calls')
          .update({ status: 'ended' })
          .eq('id', calls.id)
      }

      setCallActive(false)
    } catch (error) {
      console.error('Error ending call:', error)
    }
  }

  if (callActive) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-card rounded-lg p-8 text-center max-w-sm">
          <h2 className="text-xl font-bold mb-4">
            {isVideo ? 'Video Call' : 'Audio Call'}
          </h2>
          <p className="text-muted-foreground mb-6">
            Connected with {otherUser?.full_name}
          </p>

          <div className="flex gap-4 justify-center">
            {isVideo && (
              <button
                onClick={() => {}}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                title="Toggle camera"
              >
                <Video className="w-6 h-6" />
              </button>
            )}

            <button
              onClick={endCall}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              title="End call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={initiateCall}
      disabled={callInitiating}
      className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
      title={isVideo ? 'Start video call' : 'Start audio call'}
    >
      {isVideo ? (
        <Video className="w-5 h-5" />
      ) : (
        <Phone className="w-5 h-5" />
      )}
    </button>
  )
}
