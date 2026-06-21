'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminSignUpSuccess() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      try {
        const supabase = createClient()
        
        // Wait a moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          // Session is established, redirect to admin
          router.push('/admin')
        } else {
          // If no session yet, wait a bit more
          await new Promise(resolve => setTimeout(resolve, 1000))
          router.push('/admin')
        }
      } catch (error) {
        console.error('Error checking session:', error)
        router.push('/admin')
      }
    }

    const timer = setTimeout(() => {
      checkSessionAndRedirect()
    }, 1500)

    // Show countdown
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsReady(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Admin!</h1>
        <p className="text-gray-600 mb-4">
          Your admin account has been created successfully.
        </p>
        
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <p className="text-indigo-900 font-medium">Redirecting to Admin Panel...</p>
          <p className="text-indigo-700 text-sm mt-2">in {countdown} second{countdown !== 1 ? 's' : ''}</p>
        </div>

        <button
          onClick={() => router.push('/admin')}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Go to Admin Panel Now
        </button>
      </div>
    </div>
  )
}
