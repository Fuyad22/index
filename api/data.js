const { MongoClient } = require('mongodb');

const DATABASE_NAME = 'mu_chatrodol';
const COLLECTION_NAME = 'sitedata';
const DEFAULT_ID = 'main';

const getDefaultData = () => {
    try {
        return require('../site-data-default');
    } catch (error) {
        console.warn('Falling back to inline defaults', error);
        return {
            heroSlides: [],
            members: [],
            events: [],
            stats: [],
            posts: [],
            about: {},
            activities: [],
            footer: { text: '© 2025 MU Chatrodol', credit: '', showCredit: false },
            applications: [],
            contactMessages: []
        };
    }
};

const { MONGODB_URI } = process.env;
let cachedClient = null;

async function connectToDatabase() {
    if (!MONGODB_URI) {
        throw new Error('Missing MONGODB_URI environment variable');
    }

    if (cachedClient) {
        return cachedClient;
    }

    const client = await MongoClient.connect(MONGODB_URI);
    cachedClient = client;
    return client;
}

async function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 1e7) {
                reject(new Error('Request body too large'));
                req.connection.destroy();
            }
        });
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // If MongoDB is not configured, just serve defaults.
    if (!MONGODB_URI) {
        if (req.method === 'GET') {
            res.status(200).json(getDefaultData());
        } else {
            res.status(503).json({ error: 'Database not configured. Configure MONGODB_URI to enable saving.' });
        }
        return;
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);

        if (req.method === 'GET') {
            const data = await collection.findOne({ _id: DEFAULT_ID });
            res.status(200).json(data || getDefaultData());
            return;
        }

        if (req.method === 'POST') {
            const rawBody = await readRequestBody(req);
            let payload = {};
            if (rawBody) {
                try {
                    payload = JSON.parse(rawBody);
                } catch (error) {
                    res.status(400).json({ error: 'Invalid JSON payload' });
                    return;
                }
            }

            const sanitized = {
                heroSlides: payload.heroSlides || [],
                members: payload.members || [],
                events: payload.events || [],
                stats: payload.stats || [],
                posts: payload.posts || [],
                about: payload.about || {},
                activities: payload.activities || [],
                footer: payload.footer || {},
                applications: payload.applications || [],
                contactMessages: payload.contactMessages || [],
                updatedAt: new Date()
            };

            await collection.updateOne(
                { _id: DEFAULT_ID },
                { $set: sanitized },
                { upsert: true }
            );

            res.status(200).json({ success: true });
            return;
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API error', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
