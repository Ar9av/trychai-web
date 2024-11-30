'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navbar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BackgroundBeams } from "@/components/ui/background";
import { ExternalLink, Calendar, Hash, ArrowRight, Plus, Lock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { motion } from 'framer-motion';
import Exa from 'exa-js';
import Sidebar from '@/components/sidebar';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Modal, ModalContent, Input, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useClerk } from "@clerk/clerk-react";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import NewsCard from '@/components/news-card';

const defaultHashtags = ['AI', 'VentureCapital', 'Startups', 'Technology', 'Innovation'];

export default function NewsPage() {
  const [selectedHashtag, setSelectedHashtag] = useState('AI');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [customHashtag, setCustomHashtag] = useState('');
  const [hashtags, setHashtags] = useState(defaultHashtags);
  const [totalCredits, setTotalCredits] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { session } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserTags();
      fetchCredits();
    }
  }, [session]);

  useEffect(() => {
    fetchNews(selectedHashtag);
  }, [selectedHashtag]);

  const fetchUserTags = async () => {
    try {
      const response = await fetch(`/api/tags?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setHashtags([...defaultHashtags, ...data.map(tag => tag.tag)]);
      }
    } catch (error) {
      console.error('Error fetching user tags:', error);
    }
  };

  const fetchCredits = async () => {
    try {
      const response = await fetch(`/api/credits?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setTotalCredits(data.totalCredits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchNews = async (hashtag) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/news?hashtag=${hashtag}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarArticles = async (article) => {
    setSelectedArticle(article);
    setShowSimilar(true);
    try {
      const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY);
      const domain = new URL(article.news_json.link).hostname;
      const result = await exa.findSimilar(domain, {
        excludeDomains: [domain],
        numResults: 10,
        startPublishedDate: new Date(new Date(article.date).getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setSimilarArticles(result.results);
    } catch (error) {
      console.error('Error fetching similar articles:', error);
    }
  };

  const handleAddHashtag = async () => {
    if (totalCredits < 5) {
      toast.error('You need at least 5 credits to add custom tags');
      router.push('/credits');
      return;
    }

    if (customHashtag && !hashtags.includes(customHashtag)) {
      try {
        const response = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id, tag: customHashtag }),
        });

        if (response.ok) {
          setHashtags([...hashtags, customHashtag]);
          setSelectedHashtag(customHashtag);
          setCustomHashtag('');
          setIsModalOpen(false);
          toast.info('News for this tag will be loaded in 5 minutes');
        } else {
          throw new Error('Failed to save tag');
        }
      } catch (error) {
        toast.error('Failed to save tag');
      }
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-black relative">
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
            <div className="flex flex-wrap gap-2 items-center">
              {hashtags.map((hashtag) => (
                <Badge
                  key={hashtag}
                  variant={selectedHashtag === hashtag ? "default" : "outline"}
                  className="cursor-pointer hover:bg-zinc-800 transition-colors"
                  onClick={() => setSelectedHashtag(hashtag)}
                >
                  <Hash className="h-3 w-3 mr-1" />{hashtag}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                className="rounded-full"
                disabled={totalCredits < 5}
                title={totalCredits < 5 ? 'Need 5 credits to add custom tags' : 'Add custom tag'}
              >
                {totalCredits < 5 ? <Lock className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
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
                news.map((item, index) => (
                  <NewsCard key={index} news={item} index={index} />
                ))
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

      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        placement="center"
        backdrop="blur"
        className="z-[9999]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-zinc-100">Add Custom Tag</ModalHeader>
              <ModalBody>
                <Input
                  label="Tag Name"
                  placeholder="Enter tag name"
                  value={customHashtag}
                  onChange={(e) => setCustomHashtag(e.target.value)}
                  variant="bordered"
                  className="mb-4"
                  disabled={totalCredits < 5}
                />
                {totalCredits < 5 && (
                  <p className="text-red-400 text-sm mb-4">
                    You need at least 5 credits to add custom tags.
                    <Link href="/credits" className="text-blue-400 ml-2 hover:underline">
                      Get more credits
                    </Link>
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    handleAddHashtag();
                    onClose();
                  }}
                  disabled={totalCredits < 5 || !customHashtag}
                >
                  Add Tag
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
    </div>
  );
}