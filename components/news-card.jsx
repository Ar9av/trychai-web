import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";

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
      className="w-full"
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">
              {news.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Typography variant="muted" className="mb-4 text-sm line-clamp-3">
            {news.summary}
          </Typography>
          <div className="flex justify-between items-center">
            <Link
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors text-sm flex items-center gap-1"
            >
              Read full article
              <ExternalLink className="h-3 w-3" />
            </Link>
            <span className="text-xs text-right">{formatDate(news.publishedDate)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}