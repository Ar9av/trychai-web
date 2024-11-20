'use client'
import NavBar from '@/components/navbar'
import Footer from '@/components/footer'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const blogs = {
  'market-research-ai': {
    title: 'The Future of Market Research: How AI is Transforming the Industry',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'AI & Technology',
    content: `
      <h2>Introduction</h2>
      <p>The landscape of market research is undergoing a dramatic transformation, driven by advances in artificial intelligence and machine learning. Traditional methods of gathering and analyzing market data are being enhanced and, in some cases, replaced by AI-powered solutions that offer unprecedented speed, accuracy, and depth of insight.</p>

      <h2>The Rise of AI in Market Research</h2>
      <p>Artificial Intelligence is revolutionizing how businesses understand their markets and make decisions. AI-powered tools can now analyze vast amounts of data from multiple sources in real-time, providing insights that would have taken weeks or months to gather through traditional methods.</p>

      <h2>Key Benefits of AI-Powered Market Research</h2>
      <ul>
        <li>Faster data collection and analysis</li>
        <li>More accurate predictions and trend identification</li>
        <li>Real-time market insights</li>
        <li>Reduced human bias in data interpretation</li>
        <li>Cost-effective research solutions</li>
      </ul>

      <h2>How TrychAI is Leading the Change</h2>
      <p>At TrychAI, we're at the forefront of this transformation. Our platform combines advanced AI algorithms with comprehensive data sources to generate detailed market reports in minutes, not weeks. This allows businesses of all sizes to access professional-grade market research that was previously only available to large enterprises with substantial research budgets.</p>

      <h2>The Future of Market Research</h2>
      <p>As AI technology continues to evolve, we can expect even more sophisticated tools and capabilities in the market research space. From natural language processing that can analyze customer sentiment across social media to predictive analytics that can forecast market trends with increasing accuracy, the future of market research is bright and full of possibilities.</p>

      <h2>Conclusion</h2>
      <p>The integration of AI into market research isn't just changing how we gather and analyze data—it's democratizing access to valuable market insights. As tools like TrychAI become more sophisticated and accessible, businesses of all sizes can make data-driven decisions with confidence.</p>
    `
  }
}

export default function BlogPost() {
  const params = useParams()
  const blog = blogs[params.slug]

  if (!blog) {
    return <div>Blog post not found</div>
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blogs</span>
          </Link>

          <article className="prose prose-invert max-w-none">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm">
                  {blog.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-zinc-100 mb-4">{blog.title}</h1>
              
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
            </div>

            <div 
              className="text-zinc-300 space-y-6"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>
        </main>
      </ScrollArea>
      <Footer />
    </div>
  )
}