const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri);
    const db = client.db('mu_chatrodol');
    cachedDb = db;
    return db;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!uri) {
        const defaults = {
            heroSlides: [{
                id: 'slide-1',
                title: 'Welcome to MU Chatrodol',
                subtitle: 'Empowering students, building community',
                ctaText: 'Learn More',
                ctaLink: '#about',
                meta: ['150+ Members', '50 Events'],
                background: 'linear-gradient(135deg, rgba(14,165,233,0.9) 0%, rgba(220,38,38,0.9) 100%)',
                image: 'images/cover.jpg',
                imageAlt: 'MU Chatrodol'
            }],
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
        return res.status(200).json(defaults);
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('sitedata');

        if (req.method === 'GET') {
            const data = await collection.findOne({ _id: 'main' });
            if (!data) {
                const defaults = {
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
                return res.status(200).json(defaults);
            }
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            const data = req.body;
            await collection.updateOne(
                { _id: 'main' },
                { $set: { ...data, _id: 'main', updatedAt: new Date() } },
                { upsert: true }
            );
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
