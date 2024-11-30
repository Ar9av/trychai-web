import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const tags = await prisma.user_tags.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, tag } = await req.json();

    if (!userId || !tag) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTag = await prisma.user_tags.create({
      data: {
        user_id: userId,
        tag
      }
    });

    return NextResponse.json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}