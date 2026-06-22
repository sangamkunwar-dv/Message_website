'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function OAuthSuccess() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const redirect = searchParams.get('redirect') || '/chat'
    // Small delay to ensure session is properly set
    setTimeout(() => {
      window.location.href = redirect
    }, 500)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}
