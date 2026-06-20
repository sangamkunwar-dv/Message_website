import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, makeAdmin } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Create or get user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError && authError.status !== 422) {
      // 422 means user already exists, which is fine
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData?.user?.id

    if (!userId) {
      // Try to get existing user
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users?.find(u => u.email === email)
      
      if (!existingUser) {
        return NextResponse.json(
          { error: 'Could not create or find user' },
          { status: 400 }
        )
      }
    }

    const finalUserId = userId || (await supabase.auth.admin.listUsers()).data?.find(u => u.email === email)?.id

    // Update user to be admin
    if (makeAdmin && finalUserId) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('id', finalUserId)

      if (updateError) {
        console.error('Error updating admin status:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      message: `User created successfully${makeAdmin ? ' as admin' : ''}`,
      userId: finalUserId,
    })
  } catch (error) {
    console.error('Error in set-admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
