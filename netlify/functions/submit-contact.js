import { neon } from '@netlify/neon';

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(payload)
});

const sanitize = value => (value ?? '').toString().trim();

export default async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed. Use POST.' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (error) {
    return jsonResponse(400, { error: 'Invalid JSON payload.' });
  }

  const name = sanitize(data.name);
  const email = sanitize(data.email);
  const message = sanitize(data.message);

  if (!name || !email || !message) {
    return jsonResponse(400, { error: 'Name, email, and message are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(400, { error: 'Please provide a valid email address.' });
  }

  if (!process.env.NETLIFY_DATABASE_URL) {
    return jsonResponse(200, {
      saved: false,
      message: 'Message received but database connection is not configured. Set NETLIFY_DATABASE_URL to enable storage.'
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const [record] = await sql`
      INSERT INTO contact_messages (name, email, message, submitted_at)
      VALUES (${name}, ${email}, ${message}, NOW())
      RETURNING id, submitted_at;
    `;

    return jsonResponse(200, {
      saved: true,
      message: 'Thank you for reaching out! We will respond soon.',
      id: record?.id,
      submitted_at: record?.submitted_at
    });
  } catch (error) {
    console.error('Failed to insert contact message', error);
    return jsonResponse(500, {
      error: 'Unable to save your message right now. Please try again later.'
    });
  }
}
