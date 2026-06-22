import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      
      // Sync user to database
      if (user) {
        try {
          const username = user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`
          
          // Check if user exists
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (!existingUser) {
            // Create user if doesn't exist
            await supabase.from('users').insert({
              id: user.id,
              email: user.email || '',
              username: username,
              avatar_url: user.user_metadata?.avatar_url,
            })
          }
        } catch (syncError) {
          console.error('Error syncing user:', syncError)
        }
      }
      
      // Determine redirect based on user email
      let redirectPath = '/chat'
      if (user?.email === 'sangamkunwar48@gmail.com') {
        redirectPath = '/admin'
      }
      
      // Use a temporary redirect to a confirmation page that will do the final redirect
      return NextResponse.redirect(`${origin}/auth/oauth-success?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
