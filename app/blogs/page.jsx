'use client'
import NavBar from '@/components/navbar'
import Footer from '@/components/footer'
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const blogs = [
  {
    id: 'market-research-ai',
    title: 'The Future of Market Research: How AI is Transforming the Industry',
    excerpt: 'Discover how artificial intelligence is revolutionizing market research, making it faster, more accurate, and more accessible than ever before.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'AI & Technology'
  },
  {
    id: 'data-driven-decisions',
    title: 'Making Data-Driven Decisions in Modern Business',
    excerpt: 'Learn how businesses are leveraging AI-powered market research to make better, more informed decisions in today\'s fast-paced market.',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Business Strategy'
  }
]

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-zinc-100 mb-8">TrychAI Blog</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.id}`}>
                <article className="group p-6 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm">
                      {blog.category}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-zinc-100 mb-3 group-hover:text-zinc-300 transition-colors">
                    {blog.title}
                  </h2>
                  
                  <p className="text-zinc-400 mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-zinc-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    <span>Read more</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </main>
      </ScrollArea>
      <Footer />
    </div>
  )
}