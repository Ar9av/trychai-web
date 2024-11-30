import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function NewsCard({ news, index }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-zinc-300 transition-colors">
              {news.title}
            </h2>
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(news.publishedDate)}</span>
            </div>
          </div>
          <p className="text-zinc-300 mb-4 line-clamp-3">
            {news.summary}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              Read full article
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}