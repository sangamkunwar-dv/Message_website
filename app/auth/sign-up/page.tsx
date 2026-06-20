'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTerms, setShowTerms] = useState(false)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  const validateForm = () => {
    if (!username.trim()) {
      setError('Username is required')
      return false
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return false
    }
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!password) {
      setError('Password is required')
      return false
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions')
      return false
    }
    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username,
          },
        },
      })

      if (signUpError) throw signUpError

      router.push('/auth/sign-up-success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md max-h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600 mb-6">Join our chat community</p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Min 3 characters</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">We&apos;ll send a verification link</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Min 8 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="agreeTerms" className="text-sm text-gray-700 cursor-pointer">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Terms & Conditions
                  </button>
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading || !agreeTerms} className="w-full">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
            
            <div className="prose prose-sm max-w-none space-y-4 text-gray-700 text-sm">
              <section>
                <h3 className="font-bold mt-4 mb-2">1. Service Description</h3>
                <p>This chat application provides real-time messaging, file sharing, and communication services to users.</p>
              </section>

              <section>
                <h3 className="font-bold mt-4 mb-2">2. User Responsibilities</h3>
                <p>Users agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide accurate information during signup</li>
                  <li>Keep passwords confidential</li>
                  <li>Not use the service for illegal activities</li>
                  <li>Not harass or abuse other users</li>
                  <li>Not upload malicious content</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold mt-4 mb-2">3. Privacy & Data</h3>
                <p>We respect your privacy. Personal data is processed according to our Privacy Policy. Messages are stored securely and encrypted.</p>
              </section>

              <section>
                <h3 className="font-bold mt-4 mb-2">4. Acceptable Use</h3>
                <p>You agree not to use this service for:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Spam or unsolicited messages</li>
                  <li>Sharing sensitive personal information without consent</li>
                  <li>Phishing or social engineering</li>
                  <li>Copyright or intellectual property violations</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold mt-4 mb-2">5. Content Ownership</h3>
                <p>You retain ownership of content you create. By uploading content, you grant us a license to store and deliver it.</p>
              </section>

              <section>
                <h3 className="font-bold mt-4 mb-2">6. Limitation of Liability</h3>
                <p>We provide this service &quot;as is&quot; without warranties. We&apos;re not liable for service interruptions or data loss.</p>
              </section>

              <section>
                <h3 className="font-bold mt-4 mb-2">7. Changes to Terms</h3>
                <p>We may update these terms. Continued use of the service means you accept new terms.</p>
              </section>

              <section>
                <h3 className="font-bold mt-4 mb-2">8. Contact</h3>
                <p>For questions, contact us at support@chat-app.com</p>
              </section>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowTerms(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setAgreeTerms(true)
                  setShowTerms(false)
                }}
              >
                Agree & Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
