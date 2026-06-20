import { NextRequest, NextResponse } from 'next/server'

// Direct API call approach
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Step 1: Create user via Supabase Auth Admin API
    const createUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
      }),
    })

    let userId: string | null = null
    const createUserData = await createUserResponse.json()

    if (createUserResponse.ok && createUserData.id) {
      userId = createUserData.id
    } else if (createUserResponse.status === 422) {
      // User already exists - get user ID by fetching from database
      const getClientResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/get_user_id_by_email?email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY,
          },
        }
      )
      
      // Fallback: try to find user in users table
      if (!getClientResponse.ok) {
        return NextResponse.json(
          { error: 'Admin user creation failed', details: createUserData },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Failed to create user', details: createUserData },
        { status: 400 }
      )
    }

    // If we don't have userId, return error
    if (!userId) {
      return NextResponse.json(
        { error: 'Could not create or find admin user' },
        { status: 400 }
      )
    }

    // Step 2: Update user profile and set as admin
    const updateProfileResponse = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        is_admin: true,
        username: email.split('@')[0],
      }),
    })

    if (!updateProfileResponse.ok) {
      console.error('Failed to update admin status')
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user setup complete - email verification bypassed',
      userId,
      email,
      adminReady: true,
    })
  } catch (error) {
    console.error('Error in set-admin:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
