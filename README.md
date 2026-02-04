# Sydney Events Platform - MERN Stack MVP

A comprehensive event scraping and listing platform for Sydney, Australia. Features automated event scraping, public event listings, and an admin dashboard with Google OAuth authentication.

## 🚀 Project Overview

This platform automatically scrapes events from multiple Sydney event sources (Eventbrite, Sydney.com, What's On Sydney), stores them in MongoDB, and presents them through a clean, modern React interface with an admin dashboard for event management.

## 📁 Project Structure

```
sydney-events-platform/
├── backend/              # Express.js API Server
│   ├── config/          # Database & Passport configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/            # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── index.html
├── scraper/             # Web Scraping Service
│   ├── scrapers/        # Individual site scrapers
│   └── index.js         # Cron scheduler
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - Database
- **Passport.js** - Google OAuth authentication
- **JWT** - Token-based auth
- **Helmet**, **CORS**, **Rate Limiting** - Security

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Scraper
- **Puppeteer** - Headless browser for JS-rendered sites
- **Cheerio** - HTML parsing
- **Axios** - HTTP requests
- **node-cron** - Scheduled jobs

## 📋 Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **Google Cloud Console** account (for OAuth)

## ⚙️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
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
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install and start MongoDB
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string (e.g., `mongodb+srv://username `)

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Authorized JavaScript origins: `http://localhost:5173`
7. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID and Client Secret

### 4. Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sydney-events
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-session-secret
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Scraper** (`scraper/.env`):
```env
MONGO_URI=mongodb://localhost:27017/sydney-events
SCRAPER_CRON_SCHEDULE=0 */12 * * *
PUPPETEER_HEADLESS=true
```

## 🚀 Running the Application

### Development Mode

**Option 1: Run all services separately**

```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Scraper (optional, run on-demand)
cd scraper
npm run scrape
```

**Option 2: Run scraper as cron service**
```bash
cd scraper
npm start
# Runs continuously with scheduled scraping
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📊 Features

### Public Features
- ✅ Browse all Sydney events in a grid layout
- ✅ Search by keyword
- ✅ Filter by category, city, date
- ✅ Responsive design (mobile-first)
- ✅ "Get Tickets" modal with email capture
- ✅ Auto-redirect to original event page
- ✅ SEO-optimized

### Admin Dashboard (Protected)
- ✅ Google OAuth authentication
- ✅ Real-time event statistics
- ✅ Event status tracking (NEW, UPDATED, INACTIVE, IMPORTED)
- ✅ Advanced filters (keyword, city, date range, status)
- ✅ Event preview sidebar
- ✅ Import events to platform with notes
- ✅ View original event links

### Scraping Pipeline
- ✅ Automated scraping from 3+ sources
- ✅ Duplicate detection
- ✅ Update tracking (detect changed events)
- ✅ Inactive event marking
- ✅ Scheduled runs (every 12 hours)
- ✅ User-agent rotation
- ✅ Error handling

## 🔄 Scraper Details

### Scraper Sources
1. **Eventbrite** (`scrapers/eventbrite.js`) - Cheerio + Axios
2. **Sydney.com** (`scrapers/sydneycom.js`) - Cheerio + Axios
3. **What's On Sydney** (`scrapers/whatson.js`) - Puppeteer (JS-rendered)

### Manual Scraping
```bash
cd scraper
npm run scrape
```

### Scheduled Scraping
```bash
cd scraper
npm start
# Runs every 12 hours (configurable in .env)
```

### Scraper Logic
- **NEW**: Event title + date doesn't exist in DB
- **UPDATED**: Existing event with changed description/venue (>10% diff)
- **INACTIVE**: Event date < 1 week ago or removed from source
- **IMPORTED**: Admin manually imported to platform

## 🔐 Authentication Flow

1. User clicks "Admin Login"
2. Redirects to Google OAuth consent screen
3. Google redirects back to `/api/auth/google/callback`
4. Backend generates JWT token
5. Frontend receives token via `/auth/callback?token=...`
6. Token stored in localStorage
7. All subsequent API requests include `Authorization: Bearer <token>`

## 📦 API Endpoints

### Public Endpoints
```
GET  /api/events              - Get all events (with filters)
GET  /api/events/:id          - Get single event
POST /api/interest            - Record email interest
GET  /api/health              - Health check
GET  /api/auth/google         - Initiate Google OAuth
```

### Protected Endpoints (Admin)
```
POST   /api/events            - Create event
PUT    /api/events/:id        - Update event
DELETE /api/events/:id        - Delete event
PATCH  /api/events/:id/import - Import event
GET    /api/events/stats/overview - Event statistics
GET    /api/interest          - Get all interests
GET    /api/auth/me           - Get current user
POST   /api/auth/logout       - Logout
```

## 🎨 Design Philosophy

- **Minimalistic UI**: White backgrounds, ample whitespace
- **Primary Color**: Deep blue (#1E40AF) for accents and CTAs
- **Typography**: Inter font family (Google Fonts)
- **Responsive**: Mobile-first, 3-4 column grid on desktop
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## 🚢 Deployment

### Backend (Render/Railway)
```bash
# Render.com
1. Connect GitHub repo
2. Service: Web Service
3. Build: npm install
4. Start: npm start
5. Add environment variables

# Railway.app
railway login
railway init
railway add # Add MongoDB
railway up
```

### Frontend (Vercel/Netlify)
```bash
# Vercel
cd frontend
vercel

# Netlify
cd frontend
npm run build
# Upload dist/ folder or connect GitHub
```

### Scraper (AWS Lambda + EventBridge)
1. Package scraper: `zip -r scraper.zip .`
2. Create Lambda function
3. Upload zip
4. Add EventBridge cron trigger: `cron(0 */12 * * ? *)`
5. Set environment variables

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run build  # Check for build errors

# Scraper (dry run)
cd scraper
npm run scrape
```

## 📝 Data Models

### Event Schema
```javascript
{
  title: String,
  dateTime: Date,
  venue: String,
  city: String (default: Sydney),
  description: String,
  category: String,
  imageUrl: String,
  sourceSite: String,
  originalUrl: String,
  status: [String] (new, updated, inactive, imported),
  imported: Boolean,
  importedBy: String,
  importNotes: String,
  lastScraped: Date
}
```

### User Schema
```javascript
{
  googleId: String,
  email: String,
  name: String,
  picture: String,
  role: String (admin)
}
```

### Interest Schema
```javascript
{
  email: String,
  eventId: ObjectId,
  consent: Boolean,
  ipAddress: String,
  userAgent: String
}
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check MongoDB is running: `mongo` or check Atlas dashboard
- Verify MONGO_URI in .env files
- Check network access in MongoDB Atlas

### Google OAuth Not Working
- Verify Client ID and Secret in .env
- Check redirect URI matches Google Console exactly
- Ensure Google+ API is enabled

### Scraper Not Finding Events
- Sites may have changed HTML structure - update selectors
- Check for anti-bot measures (use proxies if needed)
- Some sites require JavaScript - use Puppeteer for those

### CORS Errors
- Check FRONTEND_URL in backend .env
- Verify VITE_API_URL in frontend .env
- Backend must allow frontend origin

## 🎯 Future Enhancements (Optional Assignment 2)

- [ ] WhatsApp/Telegram bot integration (Twilio/Vonage)
- [ ] LangChain + LLM for event recommendations
- [ ] Vector search (Pinecone/FAISS)
- [ ] User preference collection
- [ ] Smart notifications for matching events

## 📄 License

MIT License - feel free to use for your projects!

## 👨‍💻 Developer Notes

### Code Quality
- ESLint + Prettier configured
- Modular, reusable components
- Proper error handling
- Environment-based configuration
- Security best practices (Helmet, rate limiting, JWT)

### Database Indexes
Event model has indexes on:
- `title` + `dateTime` (compound for duplicate detection)
- `city` + `dateTime` (for location-based queries)
- Full-text search index on `title`, `description`, `venue`

### Performance
- Frontend: Code splitting, lazy loading
- Backend: MongoDB indexes, pagination
- Scraper: Parallel execution (can extend)

---

## 🎉 MVP Checklist

- [x] Backend API with Express + MongoDB
- [x] Google OAuth authentication
- [x] Event CRUD operations
- [x] Interest/email capture
- [x] Event scraping from 3+ sources
- [x] Duplicate detection & update tracking
- [x] Cron-based auto-scraping
- [x] React frontend with Tailwind
- [x] Public event listing (grid, search, filters)
- [x] Get Tickets modal
- [x] Admin dashboard (protected)
- [x] Event import functionality
- [x] Responsive design
- [x] SEO optimization
- [x] Production-ready code

**Status**: ✅ MVP COMPLETE - Ready for Demo!

For questions or support, please open an issue on GitHub.
#

