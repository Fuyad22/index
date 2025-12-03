require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'mu_chatrodol';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'sitedata';
const DEFAULT_ID = process.env.DOCUMENT_ID || 'main';
const LOCAL_DATA_FILE = path.join(__dirname, 'site-data-local.json');

const getDefaultData = () => {
    try {
        return require('./site-data-default');
    } catch (error) {
        console.warn('Unable to load site-data-default.js, returning minimal defaults.', error);
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

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname)));

let cachedClient = null;

function readLocalData() {
    if (fs.existsSync(LOCAL_DATA_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(LOCAL_DATA_FILE, 'utf-8'));
        } catch (error) {
            console.warn('Unable to parse local data file, falling back to defaults.', error);
        }
    }
    return null;
}

function writeLocalData(data) {
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function getDbClient() {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not configured. Please set it in your .env file.');
    }

    if (cachedClient) {
        return cachedClient;
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedClient = client;
    return client;
}

app.get('/api/data', async (req, res) => {
    if (!MONGODB_URI) {
        const localData = readLocalData();
        res.status(200).json(localData || getDefaultData());
        return;
    }

    try {
        const client = await getDbClient();
        const db = client.db(DB_NAME);
        const record = await db.collection(COLLECTION_NAME).findOne({ _id: DEFAULT_ID });
        res.status(200).json(record || getDefaultData());
    } catch (error) {
        console.error('GET /api/data failed:', error);
        res.status(500).json({ error: 'Failed to load data', details: error.message });
    }
});

app.post('/api/data', async (req, res) => {
    try {
        const payload = req.body || {};
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

        if (!MONGODB_URI) {
            writeLocalData(sanitized);
            res.status(200).json({ success: true, source: 'local-file' });
            return;
        }

        const client = await getDbClient();
        const db = client.db(DB_NAME);
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: DEFAULT_ID },
            { $set: sanitized },
            { upsert: true }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('POST /api/data failed:', error);
        res.status(500).json({ error: 'Failed to save data', details: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
