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
  const [oauthLoading, setOauthLoading] = useState<'google' | 'facebook' | null>(null)
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
      // Check if this is the admin email
      const isAdmin = email === 'sangamkunwar48@gmail.com'

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: username,
          },
        },
      })

      if (signUpError) throw signUpError

      // If admin signup, redirect to admin sign-up success (which will then auto-redirect to admin)
      if (isAdmin && data.user) {
        router.push('/auth/admin-signup-success')
      } else {
        // Regular users need to verify email
        router.push('/auth/sign-up-success')
      }
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'An error occurred'
      
      // Provide helpful error messages
      if (errorMessage.includes('rate limit')) {
        errorMessage = 'Too many signup attempts. Please wait a few minutes and try again with a different email address, or use Google/Facebook signup instead.'
      } else if (errorMessage.includes('already')) {
        errorMessage = 'This email is already registered. Please log in instead.'
      } else if (errorMessage.includes('invalid')) {
        errorMessage = 'Please enter a valid email address.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    if (!supabase) return
    setOauthLoading(provider)
    setError(null)

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (oauthError) {
        throw oauthError
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OAuth signup failed'
      setError(errorMessage)
      console.error('OAuth error:', err)
      setOauthLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-screen overflow-y-auto border border-border">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join our chat community</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-foreground">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground outline-none"
            />
            <p className="text-xs text-muted-foreground">Minimum 3 characters</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground outline-none"
            />
            <p className="text-xs text-muted-foreground">
              {email === 'sangamkunwar48@gmail.com' 
                ? 'Admin account - Direct admin panel access' 
                : 'We&apos;ll send a verification link'}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground outline-none"
            />
            <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 cursor-pointer accent-primary"
              />
              <div className="flex-1">
                <label htmlFor="agreeTerms" className="text-sm text-foreground cursor-pointer">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-primary hover:underline font-semibold transition-colors"
                  >
                    Terms & Conditions
                  </button>
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading || !agreeTerms} 
            className="w-full py-3 font-semibold rounded-xl text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Creating account...
              </span>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <div className="border-t border-border pt-6 mt-6 space-y-4">
          <p className="text-center text-muted-foreground text-sm font-medium">Or sign up with</p>
          
          <button
            onClick={() => handleOAuth('google')}
            disabled={oauthLoading === 'google'}
            className="w-full px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-foreground hover:border-primary/50 duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {oauthLoading === 'google' ? 'Signing up...' : 'Google'}
          </button>

          <button
            onClick={() => handleOAuth('facebook')}
            disabled={oauthLoading === 'facebook'}
            className="w-full px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-foreground hover:border-primary/50 duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {oauthLoading === 'facebook' ? 'Signing up...' : 'Facebook'}
          </button>

          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>
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
