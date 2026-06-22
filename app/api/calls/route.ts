import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { conversationId, callType } = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create call message
    const { data: callMessage, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message_type: 'call',
        content: `Started a ${callType} call`,
      })
      .select()
      .single()

    if (error) throw error

    // Generate a unique call room ID
    const callRoomId = `${conversationId}-${Date.now()}`

    return NextResponse.json({
      callId: callMessage.id,
      roomId: callRoomId,
      callType,
    })
  } catch (error) {
    console.error('Call error:', error)
    return NextResponse.json(
      { error: 'Failed to start call' },
      { status: 500 }
    )
  }
}
