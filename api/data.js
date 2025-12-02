// Vercel Serverless Function - GET/POST site data
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'mu_chatrodol';
const COLLECTION_NAME = 'sitedata';

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }
    
    if (!MONGODB_URI) {
        return null;
    }
    
    const client = await MongoClient.connect(MONGODB_URI);
    
    cachedClient = client;
    return client;
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Check if MongoDB is configured
    if (!MONGODB_URI) {
        console.warn('MONGODB_URI not configured, using default data');
        const defaultData = require('../site-data-default.js');
        res.status(200).json(defaultData);
        return;
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        if (req.method === 'GET') {
            // Get site data
            const data = await collection.findOne({ _id: 'main' });
            
            if (!data) {
                // Return default data if none exists
                const defaultData = require('../site-data-default.js');
                res.status(200).json(defaultData);
                return;
            }
            
            res.status(200).json(data);
        } else if (req.method === 'POST') {
            // Update site data (admin only - add authentication here)
            const { heroSlides, members, events, stats, posts, about, activities, footer, applications, contactMessages } = req.body;
            
            const updateData = {
                _id: 'main',
                heroSlides,
                members,
                events,
                stats,
                posts,
                about: about || {},
                activities: activities || [],
                footer: footer || {},
                applications: applications || [],
                contactMessages: contactMessages || [],
                updatedAt: new Date()
            };
            
            await collection.updateOne(
                { _id: 'main' },
                { $set: updateData },
                { upsert: true }
            );
            
            res.status(200).json({ success: true, message: 'Data updated successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
