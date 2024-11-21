import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const hashtag = searchParams.get('hashtag');
  
  if (!hashtag) {
    return NextResponse.json({ error: 'Hashtag is required' }, { status: 400 });
  }

  try {
    console.log("Fetching news for hashtag:", hashtag);
    const news = await prisma.news.findMany({
      where: {
        hashtag: "#" + hashtag.toLowerCase()
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}