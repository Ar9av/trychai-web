import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req) {
  const created_at = new Date().toISOString();

  try {
    console.log("req:", req);
    console.log("saving report")
    const { user_email, md5_hash } = await req.json();
    const checkQuery = 'SELECT * FROM user_data WHERE user_email = $1 AND md5_hash = $2';
    const checkResult = await pool.query(checkQuery, [user_email, md5_hash]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json({ error: 'Hash already exists for this user' }, { status: 400 });
    }

    const insertQuery = 'INSERT INTO user_data (user_email, md5_hash, created_at) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(insertQuery, [user_email, md5_hash, created_at]);
    const data = result.rows[0];

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}