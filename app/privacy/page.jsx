'use client'
import NavBar from '@/components/navbar'
import Footer from '@/components/footer'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold text-zinc-100 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">1. Information We Collect</h2>
              <p className="text-zinc-400">
                We collect information that you provide directly to us, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>Account information (email, name)</li>
                <li>Usage data and search queries</li>
                <li>Generated report content</li>
                <li>Payment information (processed securely by third-party providers)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">2. How We Use Your Information</h2>
              <p className="text-zinc-400">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>Provide and improve our services</li>
                <li>Process your transactions</li>
                <li>Send you technical notices and updates</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">3. Data Security</h2>
              <p className="text-zinc-400">
                We implement appropriate technical and organizational measures to maintain the security of your personal information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">4. Data Sharing</h2>
              <p className="text-zinc-400">
                We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our platform, conducting our business, or serving our users.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">5. Your Rights</h2>
              <p className="text-zinc-400">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>
            </section>
          </div>
        </main>
      </ScrollArea>
      <Footer />
    </div>
  )
}