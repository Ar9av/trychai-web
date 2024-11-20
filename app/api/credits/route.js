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
    // Get credit history
    const history = await prisma.credit_history.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    // Calculate total credits
    const totalCredits = history.reduce((total, record) => {
      return total + (record.type === 'credit' ? record.value : -record.value);
    }, 0);

    return NextResponse.json({ history, totalCredits });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, type, description, value } = await req.json();

    if (!userId || !type || !description || typeof value !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const record = await prisma.credit_history.create({
      data: {
        user_id: userId,
        type,
        description,
        value
      }
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error creating credit record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}