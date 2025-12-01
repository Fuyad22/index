# MU Chatrodol - Setup Instructions for Backend API

## Prerequisites
1. MongoDB Atlas account (free tier): https://www.mongodb.com/cloud/atlas
2. Vercel account: https://vercel.com

## Setup Steps

### 1. Create MongoDB Database
1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Create a free account and new cluster
3. Create a database user (Database Access → Add New Database User)
4. Get your connection string (Connect → Connect your application)
5. Replace `<username>`, `<password>`, and `<dbname>` in the connection string

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Vercel Environment Variables
```bash
# Login to Vercel
vercel login

# Add MongoDB connection string as environment variable
vercel env add MONGODB_URI

# Paste your MongoDB connection string when prompted
```

Or add via Vercel Dashboard:
1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add `MONGODB_URI` with your MongoDB connection string

### 4. Deploy to Vercel
```bash
vercel --prod
```

## API Endpoints

### GET /api/data
Fetches all site data (posts, members, events, etc.)

### POST /api/data
Updates site data (used by admin panel)
- Requires JSON body with: `heroSlides`, `members`, `events`, `stats`, `posts`, `applications`, `contactMessages`

## Local Development
```bash
# Start local dev server
vercel dev
```

Access admin panel at: http://localhost:3000/admin.html

## Security Notes
- The current API has no authentication
- Add authentication before production use
- Consider adding admin password verification
- Use environment variables for sensitive data

## Fallback Behavior
- If API is unavailable, site falls back to localStorage
- site-data.js provides initial defaults
- Admin panel saves to both API and localStorage
