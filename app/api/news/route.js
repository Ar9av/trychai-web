import { NextResponse } from 'next/server';
import { fetchAndStoreNews } from '@/lib/news-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const hashtag = searchParams.get('hashtag');
  const startDate = searchParams.get('startDate');
  
  if (!hashtag) {
    return NextResponse.json({ error: 'Hashtag is required' }, { status: 400 });
  }

  try {
    // First try to get recent news from database
    const recentNews = await prisma.news.findFirst({
      where: {
        hashtag: `#${hashtag.toLowerCase()}`,
        created_at: {
          gte: new Date(startDate || Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (recentNews) {
      return NextResponse.json(recentNews.news_json);
    }

    // If no recent news, fetch and store new data
    const news = await fetchAndStoreNews(hashtag, startDate);
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}