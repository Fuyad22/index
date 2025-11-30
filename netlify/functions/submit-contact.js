import { neon } from '@netlify/neon';

const sanitize = value => (value ?? '').toString().trim();

export default async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const name = sanitize(data.name);
  const email = sanitize(data.email);
  const message = sanitize(data.message);

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Please provide a valid email address.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  if (!process.env.NETLIFY_DATABASE_URL) {
    return new Response(JSON.stringify({
      saved: false,
      message: 'Message received but not saved. Database not configured.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const [record] = await sql`
      INSERT INTO contact_messages (name, email, message, created_at)
      VALUES (${name}, ${email}, ${message}, NOW())
      RETURNING id, created_at;
    `;

    return new Response(JSON.stringify({
      saved: true,
      message: 'Thank you for reaching out! We will respond soon.',
      id: record?.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    console.error('Failed to insert contact message', error);
    return new Response(JSON.stringify({
      error: 'Unable to save your message right now. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
