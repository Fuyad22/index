import { neon } from '@netlify/neon';

const fallbackMembers = [
  { name: 'Kawser Ahmed', role: 'President', type: 'executive', department: 'LLB', photo: 'images/cover.jpg', bio: 'Guides MU Chatrodol strategy and mentors every executive team.' },
  { name: 'Md Jakariya Ahmed', role: 'Senior Vice President', type: 'executive', department: 'English', photo: 'images/pro-vc.jpg', bio: 'Builds partnerships and leads storytelling across campus.' },
  { name: 'Abu Tanim', role: 'Secretary', type: 'executive', department: 'LLB', bio: 'Keeps documentation organized and events on schedule.' }
];

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(payload)
});

export default async function handler(event) {
  if (event?.httpMethod && event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!process.env.NETLIFY_DATABASE_URL) {
    return jsonResponse(200, {
      source: 'fallback',
      members: fallbackMembers,
      note: 'Set NETLIFY_DATABASE_URL to fetch live data from Neon.'
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
        photo_url AS photo,
        bio
      FROM members
      ORDER BY sort_order NULLS LAST, name ASC;
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

    return jsonResponse(200, { source: 'database', members });
  } catch (error) {
    console.error('Neon query failed', error);
    return jsonResponse(500, {
      source: 'error',
      message: 'Unable to query Neon database.',
      details: error.message,
      members: fallbackMembers
    });
  }
}
