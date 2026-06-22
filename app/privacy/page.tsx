import Link from 'next/link'

export default function PrivacyPolicy() {
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
        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: June 2024</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
            <p className="text-foreground/80">
              ChatApp ("we", "us", "our", or "Company") operates the ChatApp application (the "Service"). 
              This page informs you of our policies regarding the collection, use, and disclosure of personal 
              data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Information Collection and Use</h2>
            <p className="text-foreground/80">We collect several different types of information for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li><strong>Personal Data:</strong> Email address, username, password, and profile information</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our Service</li>
              <li><strong>Communication Data:</strong> Messages, files, and other content you share</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Use of Data</h2>
            <p className="text-foreground/80">ChatApp uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer care and support</li>
              <li>To gather analysis or valuable information so that we can improve the Service</li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Security of Data</h2>
            <p className="text-foreground/80">
              The security of your data is important to us, but remember that no method of transmission over the Internet 
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
              your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Changes to This Privacy Policy</h2>
            <p className="text-foreground/80">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy 
              Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Contact Us</h2>
            <p className="text-foreground/80">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@chatapp.com" className="text-primary hover:underline">
                privacy@chatapp.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
