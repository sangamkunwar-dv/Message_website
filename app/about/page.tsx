import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            ChatApp
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
          >
            Back Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">About ChatApp</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connecting people around the world through seamless, secure, and intuitive communication.
            </p>
          </div>

          {/* Mission Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="text-foreground/80">
              At ChatApp, we believe that communication is the foundation of human connection. Our mission is to provide 
              a platform that makes it easy for people to stay connected with their friends, family, and colleagues 
              anywhere in the world. We're committed to building a service that prioritizes privacy, security, and user experience.
            </p>
          </section>

          {/* Values Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-bold text-foreground mb-2">Privacy First</h3>
                <p className="text-foreground/80">
                  Your privacy is paramount. We encrypt your conversations and never store personal messages on our servers.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-bold text-foreground mb-2">Security</h3>
                <p className="text-foreground/80">
                  We use industry-leading security measures to protect your data and ensure a safe communication experience.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-bold text-foreground mb-2">Innovation</h3>
                <p className="text-foreground/80">
                  We continuously innovate to bring you the latest features and improvements in communication technology.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-bold text-foreground mb-2">Accessibility</h3>
                <p className="text-foreground/80">
                  ChatApp is designed to be accessible to everyone, with support for various devices and platforms.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Our Team</h2>
            <p className="text-foreground/80">
              ChatApp was created by a dedicated team of developers and designers passionate about building great communication tools. 
              We're committed to delivering the best experience possible and listening to our users.
            </p>
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-2xl font-bold text-foreground mb-2">Founded by Sangam Kunwar</p>
              <p className="text-muted-foreground">Full Stack Developer • Innovator • Communication Enthusiast</p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-4 bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground">Get In Touch</h2>
            <p className="text-foreground/80 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="space-y-2">
              <p className="text-foreground">
                Email:{' '}
                <a href="mailto:hello@chatapp.com" className="text-primary hover:underline">
                  hello@chatapp.com
                </a>
              </p>
              <p className="text-foreground">
                Support:{' '}
                <a href="mailto:support@chatapp.com" className="text-primary hover:underline">
                  support@chatapp.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
