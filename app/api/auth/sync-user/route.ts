import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists in public.users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      // Create user in public.users table
      const username = user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`
      
      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email || '',
        username: username,
        avatar_url: user.user_metadata?.avatar_url,
      })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
