import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function GET(req) {
    const url = new URL(req.url);
    const hash = url.searchParams.get('hash');
    if (!hash) {
        return new Response(JSON.stringify({ error: 'Hash is required' }), { status: 400 });
    }

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT title, output FROM data_table_v2 WHERE md5_hash = $1', [hash]);
        client.release();

        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Report not found' }), { status: 404 });
        }

        let data = JSON.parse(result.rows[0].output);
        data.title = result.rows[0].title
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching report:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}