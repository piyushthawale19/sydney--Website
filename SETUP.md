# 🚀 Quick Setup Guide - Sydney Events Platform

This guide will get you up and running in **15 minutes**.

## Prerequisites Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] MongoDB installed OR MongoDB Atlas account
- [ ] Google Account (for OAuth setup)
- [ ] Code editor (VS Code recommended)

## Step-by-Step Setup

### 1️⃣ MongoDB Setup (Choose One)

#### Option A: Local MongoDB (Easier for Development)
```bash
# Windows: Download installer from mongodb.com
# Mac:
brew install mongodb-community
brew services start mongodb-community

# Linux:
sudo apt-get install mongodb
sudo systemctl start mongodb

# Verify MongoDB is running:
mongo
# or
mongosh
```

#### Option B: MongoDB Atlas (Cloud - Recommended for Production)
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (M0 - Free)
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Add `/sydney-events` to the end

---

### 2️⃣ Google OAuth Setup (5 minutes)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project**
   - Click "Select a project" → "New Project"
   - Name: "Sydney Events Platform"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: External
     - App name: "Sydney Events Platform"
     - User support email: (your email)
     - Developer contact: (your email)
     - Save and Continue (skip scopes)
     - Add yourself as test user
   
5. **Configure OAuth Client**
   - Application type: **Web application**
   - Name: "Sydney Events Web Client"
   - Authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:5000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click "Create"

6. **Copy Credentials**
   - **Client ID** (ends with `.apps.googleusercontent.com`)
   - **Client Secret**
   - Keep these safe! You'll need them in the next step.

---

### 3️⃣ Install Dependencies

```bash
# From project root
cd sydney-events-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install scraper dependencies
cd ../scraper
npm install

cd ..
```

---

### 4️⃣ Configure Environment Variables

#### Backend (`backend/.env`)
```bash
cd backend
# Copy example file
cp .env.example .env

# Edit .env with your values
```

**Add these values to `backend/.env`:**
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/sydney-events
# OR if using Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sydney-events

# JWT Secret (generate a random string)
JWT_SECRET=my-super-secret-jwt-key-2026

# Google OAuth (paste your credentials from step 2)
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Session Secret
SESSION_SECRET=my-session-secret-2026
```

#### Frontend (`frontend/.env`)
```bash
cd ../frontend
cp .env.example .env

# Edit .env
```

**Add these values to `frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```
⚠️ **Important**: Use the SAME Client ID from backend!

#### Scraper (`scraper/.env`)
```bash
cd ../scraper
cp .env.example .env

# Edit .env
```

**Add to `scraper/.env`:**
```env
MONGO_URI=mongodb://localhost:27017/sydney-events
# Must match backend!

SCRAPER_CRON_SCHEDULE=0 */12 * * *
PUPPETEER_HEADLESS=true
RUN_ON_STARTUP=false
```

---

### 5️⃣ Seed Database with Sample Events

```bash
cd ../backend
npm run seed
```

You should see:
```
✅ MongoDB Connected
✅ Seeded 20 events successfully
📊 Summary:
   Total Events: 20
   Categories: Festival, Arts & Culture, Music, Sports, ...
```

---

### 6️⃣ Start the Application

**Open 3 Terminal Windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Should see: `🚀 Server running in development mode on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Should see: `Local: http://localhost:5173/`

**Terminal 3 - Optional Scraper (for testing):**
```bash
cd scraper
npm run scrape
```
✅ This runs scraper once. For continuous cron, use `npm start`

---

### 7️⃣ Test the Application

#### Test Public Site
1. Open browser: **http://localhost:5173**
2. You should see events grid
3. Try searching and filtering
4. Click "GET TICKETS" on any event
5. Enter email → should redirect to event URL

#### Test Admin Dashboard
1. Click **"Admin Login"** in header
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You should be redirected to dashboard
5. You'll see:
   - Stats cards (Total, New, Updated, etc.)
   - Filters
   - Event table
   - Click on event to see preview sidebar
   - Try importing an event

---

## 🎉 Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can see 20 events on home page
- [ ] Search and filters work
- [ ] "Get Tickets" modal works
- [ ] Can login with Google
- [ ] Dashboard shows stats and events
- [ ] Can import events

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongo
# or
mongosh

# If not running, start it:
# Mac:
brew services start mongodb-community
# Linux:
sudo systemctl start mongodb
```

### Google OAuth Error: "redirect_uri_mismatch"
- Check that redirect URI in Google Console EXACTLY matches:
  ```
  http://localhost:5000/api/auth/google/callback
  ```
- No trailing slash!
- Check both backend `.env` and Google Console

### Google OAuth Error: "access_denied"
- Make sure you added yourself as a test user in OAuth consent screen
- Check email matches the one you're signing in with

### Port Already in Use
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Frontend Can't Connect to Backend
- Check backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env` is correct
- Check CORS settings in backend allow `http://localhost:5173`

### Scraper Not Finding Events
- This is normal! Sites change their HTML structure
- The seed script already added 20 events for demo
- You can modify scraper selectors based on actual site structure

---

## 📚 Next Steps

1. **Customize Event Sources**: Edit `scraper/scrapers/*.js` to match actual site structure
2. **Add More Features**: See Optional Assignment 2 in README
3. **Deploy**: Follow deployment guide in README.md
4. **Customize Styling**: Edit Tailwind config and components

---

## 🆘 Still Having Issues?

1. Check all `.env` files have correct values
2. Verify MongoDB is running
3. Check Google Console settings match exactly
4. Try restarting all services
5. Check console logs for specific errors

---

## 🎯 Quick Command Reference

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Seed database
cd backend && npm run seed

# Run scraper once
cd scraper && npm run scrape

# Run scraper continuously (cron)
cd scraper && npm start
```

---

**Ready to deploy?** See [README.md](./README.md) for deployment instructions!
