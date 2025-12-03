# MU Chatrodol - Local Backend Setup

## Prerequisites
1. Node.js 18+ installed locally
2. npm (ships with Node)
3. MongoDB Atlas account (or any MongoDB connection string)

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

### 3. Configure Environment Variables
Create a `.env` file based on `.env.example`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
DB_NAME=mu_chatrodol
COLLECTION_NAME=sitedata
```

### 4. Run Locally
```bash
npm run dev
```

Visit http://localhost:3000 to see the site and http://localhost:3000/admin.html for the admin dashboard.

## API Endpoints

### GET /api/data
Fetches all site data (posts, members, events, etc.)

### POST /api/data
Updates site data (used by admin panel)
- Requires JSON body with: `heroSlides`, `members`, `events`, `stats`, `posts`, `applications`, `contactMessages`

## Local Development
```bash
npm run dev
```

## Security Notes
- The current API has no authentication
- Add authentication before production use
- Consider adding admin password verification
- Use environment variables for sensitive data

## Fallback Behavior
- If API is unavailable, site falls back to localStorage
- site-data.js provides initial defaults
- Admin panel saves to both API and localStorage
