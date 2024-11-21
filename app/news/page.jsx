'use client'
import React, { useState, useEffect } from 'react'
import NavBar from '@/components/navbar'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { BackgroundBeams } from "@/components/ui/background"
import { ExternalLink, Calendar, Hash, ArrowRight, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'
import { motion } from 'framer-motion'
import Exa from 'exa-js'
import Sidebar from '@/components/sidebar'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const hashtags = ['AI', 'VentureCapital', 'Startups', 'Technology', 'Innovation']

export default function NewsPage() {
  const [selectedHashtag, setSelectedHashtag] = useState('AI')
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [similarArticles, setSimilarArticles] = useState([])
  const [showSimilar, setShowSimilar] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchNews(selectedHashtag)
  }, [selectedHashtag])

  const fetchNews = async (hashtag) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/news?hashtag=${hashtag}`)
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarArticles = async (article) => {
    setSelectedArticle(article)
    setShowSimilar(true)
    try {
      const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY)
      const domain = new URL(article.news_json.link).hostname
      const result = await exa.findSimilar(domain, {
        excludeDomains: [domain],
        numResults: 10,
        startPublishedDate: new Date(new Date(article.date).getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
      })
      setSimilarArticles(result.results)
    } catch (error) {
      console.error('Error fetching similar articles:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {!isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-16 left-4 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out z-50 sm:top-1/2 sm:-translate-y-1/2 ${
            isSidebarOpen ? 'sm:left-[260px]' : 'sm:left-4'
          }`}
        >
          {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
        </button>
      )}
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-zinc-100">News Feed</h1>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((hashtag) => (
                <Badge
                  key={hashtag}
                  variant={selectedHashtag === hashtag ? "default" : "outline"}
                  className="cursor-pointer hover:bg-zinc-800 transition-colors"
                  onClick={() => setSelectedHashtag(hashtag)}
                >
                  <Hash className="h-3 w-3 mr-1" />
                  {hashtag}
                </Badge>
              ))}
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-pulse">
                    <div className="h-6 w-3/4 bg-zinc-800 rounded mb-4"></div>
                    <div className="h-4 w-1/4 bg-zinc-800 rounded mb-6"></div>
                    <div className="h-20 bg-zinc-800 rounded"></div>
                  </div>
                ))
              ) : (
                news.map((item, index) => {
                  const newsData = item.news_json
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h2 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-zinc-300 transition-colors">
                              {newsData.title}
                            </h2>
                            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(newsData.date_of_post)}</span>
                            </div>
                          </div>
                          <p className="text-zinc-300 mb-4 line-clamp-3">
                            {newsData.summary}
                          </p>
                          <div className="flex items-center gap-4">
                            <Link
                              href={newsData.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                            >
                              Read full article
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fetchSimilarArticles(item)}
                              className="text-zinc-400 hover:text-zinc-300"
                            >
                              Similar articles
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </main>

      <Sheet open={showSimilar} onOpenChange={setShowSimilar}>
        <SheetContent side="right" className="w-full sm:w-[400px] bg-zinc-950 border-l border-zinc-800">
          <SheetHeader>
            <SheetTitle className="text-zinc-100">Similar Articles</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          {selectedArticle && (
            <div className="mb-4">
              <p className="text-sm text-zinc-400">Based on</p>
              <p className="text-zinc-200 font-medium">{selectedArticle.news_json.title}</p>
            </div>
          )}
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-4">
              {similarArticles.map((article, index) => (
                <Link
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
                >
                  <h3 className="text-zinc-100 font-medium mb-2">{article.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">{formatDate(article.publishedDate)}</span>
                    <ExternalLink className="h-4 w-4 text-zinc-400" />
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
    </div>
  )
}