'use client'
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { FileText, Shield, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-zinc-950">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-zinc-100">TrychAI</h3>
            <p className="text-sm text-zinc-400">
              AI-powered market research platform generating comprehensive industry reports in minutes.
            </p>
            <div className="flex items-center space-x-2 text-zinc-400">
              <Mail className="h-4 w-4" />
              <a href="mailto:support@trychai.com" className="text-sm hover:text-zinc-100">
                support@trychai.io
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-zinc-100">Legal</h3>
            <ul className="space-y-2">
            <li>
                <Link href="/blogs" className="text-sm text-zinc-400 hover:text-zinc-100 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-400 hover:text-zinc-100 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-zinc-400 hover:text-zinc-100 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-zinc-800" />

        <div className="text-center text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} TrychAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}