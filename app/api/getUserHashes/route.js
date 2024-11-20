import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const privateOnly = searchParams.get('private') === 'true';

  try {
    let query;
    let values;

    if (email) {
      // Get user's private reports
      if (privateOnly) {
        query = `
          SELECT dtv2.title, dtv2.created_at, dtv2.payload, dtv2.md5_hash
          FROM data_table_v2 dtv2 
          JOIN user_data ud ON dtv2.md5_hash = ud.md5_hash 
          WHERE ud.user_email = $1 AND ud.private = true
          ORDER BY dtv2.created_at DESC
        `;
        values = [email];
      } else {
        // Get public reports
        query = `
          SELECT dtv2.title, dtv2.created_at, dtv2.payload, dtv2.md5_hash
          FROM data_table_v2 dtv2 
          LEFT JOIN user_data ud ON dtv2.md5_hash = ud.md5_hash 
          WHERE (ud.private = false OR ud.private IS NULL)
          ORDER BY dtv2.created_at DESC
        `;
      }
    } else {
      // Get all public reports
      query = `
        SELECT dtv2.title, dtv2.created_at, dtv2.payload, dtv2.md5_hash
        FROM data_table_v2 dtv2 
        LEFT JOIN user_data ud ON dtv2.md5_hash = ud.md5_hash 
        WHERE (ud.private = false OR ud.private IS NULL)
        ORDER BY dtv2.created_at DESC
      `;
    }

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}