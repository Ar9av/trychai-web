import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // your pg_url
});

export async function GET(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  try {
    const query = `
      SELECT dtv2.title, ud.created_at, dtv2.md5_hash
      FROM user_data ud
      JOIN data_table_v2 dtv2 ON ud.md5_hash = dtv2.md5_hash
      WHERE ud.user_email = $1 order by ud.created_at desc;
    `;

    const values = [email];
    const result = await pool.query(query, values);
    const data = result.rows;

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}