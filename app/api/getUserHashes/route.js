import { Pool } from 'pg';
import { NextResponse } from 'next/server';

// Initialize the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure your DATABASE_URL environment variable is set
});

export async function GET() {
  try {
    const query = `
      SELECT dtv2.title, dtv2.created_at, dtv2.payload 
      FROM data_table_v2 dtv2 
      ORDER BY dtv2.created_at DESC
    `;

    // Execute the query
    const result = await pool.query(query);
    const data = result.rows;

    // Respond with the data in JSON format
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    // Respond with an error message in JSON format
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}