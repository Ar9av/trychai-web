import { Pool } from 'pg';

// Create a connection pool to the PostgreSQL database.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Function to insert a user into the PostgreSQL database.
 */
const insertUser = async (userEmail) => {
  const query = 'INSERT INTO interested_users (user_email) VALUES ($1) RETURNING *';
  const values = [userEmail];
  const client = await pool.connect();

  try {
    const res = await client.query(query, values);
    return res.rows[0];
  } finally {
    client.release();
  }
};

/**
 * Handle POST requests to insert a new user.
 */
export async function POST(request) {
  const { user_email } = await request.json();

  if (!user_email || typeof user_email !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid user_email' }), { status: 400 });
  }

  try {
    const newUser = await insertUser(user_email);
    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    console.error('Error inserting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

/**
 * Handler for other HTTP methods that are not allowed on this route.
 */
export async function handler(req, res) {
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}