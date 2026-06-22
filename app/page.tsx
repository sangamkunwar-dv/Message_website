import Link from 'next/link'
import { MessageSquare, Phone, Video, Share2, Lock, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">ChatApp</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-balance">
              Connect with Anyone, Anywhere
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              Experience seamless real-time messaging with voice and video calls. Share files, stay connected, and communicate effortlessly with ChatApp.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="/auth/sign-up"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-border flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for seamless communication
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Real-Time Messaging</h3>
              <p className="text-muted-foreground">
                Send and receive messages instantly. Stay connected with your contacts in real-time conversations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Voice & Video Calls</h3>
              <p className="text-muted-foreground">
                Make crystal-clear voice and video calls directly in the app. No separate software needed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">File Sharing</h3>
              <p className="text-muted-foreground">
                Share images, videos, and documents with ease. Secure file storage with reliable access.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your conversations are encrypted and private. We never store your personal messages.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Fast & Reliable</h3>
              <p className="text-muted-foreground">
                Lightning-fast message delivery with 99.9% uptime guarantee. Always available when you need it.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Always Connected</h3>
              <p className="text-muted-foreground">
                Access your chats on any device. Seamless synchronization across all platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Stay Connected?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users already enjoying seamless communication with ChatApp
            </p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/sign-up"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="font-bold">ChatApp</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect, communicate, and collaborate seamlessly.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              Made with <span className="text-primary">♥</span> by{' '}
              <span className="font-semibold text-foreground">Sangam Kunwar</span>
            </p>
            <p>© 2024 ChatApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
