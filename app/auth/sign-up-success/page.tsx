'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpSuccess() {
  const [verificationComplete, setVerificationComplete] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user?.email_confirmed_at || user?.confirmed_at) {
          // User is verified, sync to database and redirect to chat
          try {
            await fetch('/api/auth/sync-user', {
              method: 'POST',
            })
          } catch (syncError) {
            console.error('Error syncing user:', syncError)
          }
          
          setTimeout(() => {
            router.push('/chat')
          }, 2000)
          setVerificationComplete(true)
        }
      } catch (error) {
        console.error('Error checking verification:', error)
      }
    }

    // Check every 3 seconds
    const interval = setInterval(checkEmailVerification, 3000)
    checkEmailVerification()

    return () => clearInterval(interval)
  }, [supabase, router])

  if (verificationComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border border-border">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Email Verified!</h1>
          <p className="text-muted-foreground mb-6">
            Your account is confirmed. Redirecting to chat...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border border-border">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
        <p className="text-muted-foreground mb-6">
          We&apos;ve sent a confirmation link to your email. Please click it to verify your account and get started.
        </p>

        <Link href="/auth/login">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </div>
    </div>
  )
}
