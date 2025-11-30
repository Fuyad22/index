import { neon } from '@netlify/neon';

const fallbackMembers = [
  { name: 'Kawser Ahmed', role: 'President', type: 'executive', department: 'LLB', photo: 'images/cover.jpg', bio: 'Guides MU Chatrodol strategy and mentors every executive team.' },
  { name: 'Md Jakariya Ahmed', role: 'Senior Vice President', type: 'executive', department: 'English', photo: 'images/pro-vc.jpg', bio: 'Builds partnerships and leads storytelling across campus.' },
  { name: 'Abu Tanim', role: 'Secretary', type: 'executive', department: 'LLB', bio: 'Keeps documentation organized and events on schedule.' }
];

export default async function handler(event) {
  if (event?.httpMethod && event.httpMethod !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  if (!process.env.NETLIFY_DATABASE_URL) {
    return new Response(JSON.stringify({
      source: 'fallback',
      members: fallbackMembers,
      note: 'Using fallback data. Database not configured.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const rows = await sql`
      SELECT
        id,
        name,
        role,
        COALESCE(type, 'member') AS type,
        department,
        photo AS photo,
        bio
      FROM members
      ORDER BY name ASC;
    `;

    const members = rows.map((row, index) => ({
      id: row.id ?? index,
      name: row.name,
      role: row.role,
      type: row.type,
      department: row.department,
      photo: row.photo,
      bio: row.bio
    }));

    return new Response(JSON.stringify({ source: 'database', members }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    console.error('Neon query failed', error);
    return new Response(JSON.stringify({
      source: 'fallback-after-error',
      message: 'Database error, using fallback data.',
      members: fallbackMembers
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
