'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/navbar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackgroundBeams } from "@/components/ui/background";
import { ExternalLink, Calendar, Hash, ArrowRight, Plus, Lock, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [customHashtag, setCustomHashtag] = useState('');
  const [hashtags, setHashtags] = useState(defaultHashtags);
  const [totalCredits, setTotalCredits] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
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
    setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    fetchNews(selectedHashtag);
  }, [selectedHashtag]);

  const fetchUserTags = async () => {
    try {
      const response = await fetch(`/api/tags?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        const userTags = data.map(tag => tag.tag);
        setHashtags([...defaultHashtags, ...userTags]);
      }
    } catch (error) {
      console.error('Error fetching user tags:', error);
    }
  };

  const handleRemoveTag = async (tag) => {
    if (defaultHashtags.includes(tag)) {
      toast.error("Default tags cannot be removed");
      return;
    }

    try {
      const response = await fetch(`/api/tags?userId=${session.user.id}&tag=${tag}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setHashtags(prev => prev.filter(t => t !== tag));
        if (selectedHashtag === tag) {
          setSelectedHashtag('AI');
        }
        toast.success('Tag removed successfully');
      } else {
        throw new Error('Failed to remove tag');
      }
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Failed to remove tag');
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

  const fetchNews = async (hashtag, loadMore = false) => {
    if (!loadMore) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(`/api/news?hashtag=${hashtag}&startDate=${startDate.toISOString()}`);
      if (response.ok) {
        const data = await response.json();
        if (loadMore) {
          setNews(prevNews => [...prevNews, ...data]);
        } else {
          setNews(data);
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = async () => {
    if (totalCredits <= 0) {
      toast.error('You need credits to load more news');
      router.push('/credits');
      return;
    }

    try {
      const debitResponse = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          type: 'debit',
          description: `Load more news for ${selectedHashtag}`,
          value: 1
        })
      });

      if (!debitResponse.ok) {
        throw new Error('Failed to deduct credit');
      }

      const newStartDate = new Date(startDate.getTime() - 2 * 24 * 60 * 60 * 1000);
      setStartDate(newStartDate);
      await fetchNews(selectedHashtag, true);
      await fetchCredits();
    } catch (error) {
      console.error('Error loading more news:', error);
      toast.error('Failed to load more news');
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
                  className="cursor-pointer hover:bg-zinc-800 transition-colors group relative"
                  onClick={() => setSelectedHashtag(hashtag)}
                >
                  <Hash className="h-3 w-3 mr-1" />
                  {hashtag}
                  {!defaultHashtags.includes(hashtag) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(hashtag);
                      }}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
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
                <>
                  {news.map((item, index) => (
                    <NewsCard key={index} news={item} index={index} />
                  ))}
                  {news.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore || totalCredits <= 0}
                        className="bg-zinc-800 hover:bg-zinc-700"
                      >
                        {loadingMore ? (
                          "Loading..."
                        ) : totalCredits <= 0 ? (
                          "Need credits to load more"
                        ) : (
                          "Load More News (1 credit)"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>

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