'use client'
import NavBar from '@/components/navbar'
import Footer from '@/components/footer'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold text-zinc-100 mb-8">Terms of Use</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">1. Acceptance of Terms</h2>
              <p className="text-zinc-400">
                By accessing and using TrychAI, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">2. Use License</h2>
              <p className="text-zinc-400">
                Permission is granted to temporarily access and use TrychAI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">3. Service Description</h2>
              <p className="text-zinc-400">
                TrychAI provides AI-powered market research reports. While we strive for accuracy, we cannot guarantee the completeness or accuracy of generated reports. Users should verify critical information independently.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">4. User Obligations</h2>
              <p className="text-zinc-400">
                Users agree to use TrychAI responsibly and not to misuse the platform or circumvent any limitations. Users are responsible for maintaining the confidentiality of their account credentials.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-100">5. Intellectual Property</h2>
              <p className="text-zinc-400">
                The platform, including all content and functionality, is protected by intellectual property laws. Users may not copy, modify, or distribute platform content without explicit permission.
              </p>
            </section>
          </div>
        </main>
      </ScrollArea>
      <Footer />
    </div>
  )
}