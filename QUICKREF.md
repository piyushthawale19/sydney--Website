# 📋 Quick Reference - Sydney Events Platform

## 🚀 Quick Start Commands

### First Time Setup
```bash
# 1. Install all dependencies (Windows)
install.bat

# Or (Mac/Linux)
chmod +x install.sh && ./install.sh

# 2. Configure environment variables
# Edit: backend/.env, frontend/.env, scraper/.env

# 3. Seed database
cd backend && npm run seed
```

### Development (3 Terminals)
```bash
# Terminal 1 - Backend
cd backend && npm run dev
# ✅ Running on http://localhost:5000

# Terminal 2 - Frontend  
cd frontend && npm run dev
# ✅ Running on http://localhost:5173

# Terminal 3 - Scraper (optional)
cd scraper && npm run scrape
# Or for continuous: npm start
```

---

## 🔧 Useful Commands

### Backend
```bash
cd backend

npm run dev          # Start development server
npm start            # Start production server
npm run seed         # Seed database with 20 events
node server.js       # Direct run
```

### Frontend
```bash
cd frontend

npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Scraper
```bash
cd scraper

npm run scrape       # Run all scrapers once
npm start            # Start cron service (continuous)
```

---

## 🔗 Important URLs

### Development
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |
| Google OAuth | http://localhost:5000/api/auth/google |

### API Endpoints
```
Public:
  GET    /api/events              List all events
  GET    /api/events/:id          Get single event
  POST   /api/interest            Record interest

Admin (requires JWT):
  POST   /api/events              Create event
  PUT    /api/events/:id          Update event
  DELETE /api/events/:id          Delete event
  PATCH  /api/events/:id/import   Import event
  GET    /api/events/stats/overview  Statistics

Auth:
  GET    /api/auth/google         Start OAuth
  GET    /api/auth/me             Current user
  POST   /api/auth/verify         Verify token
```

---

## 📁 File Structure Quick Reference

```
sydney-events-platform/
├── backend/
│   ├── config/           # Database & Auth config
│   ├── controllers/      # Route logic
│   ├── middleware/       # Auth & errors
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Seed script
│   ├── .env             # Environment vars
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   └── index.css    # Global styles
│   ├── .env             # Frontend env
│   └── vite.config.js   # Vite config
│
├── scraper/
│   ├── scrapers/        # Scraper files
│   ├── .env             # Scraper env
│   └── index.js         # Cron scheduler
│
├── README.md            # Full documentation
├── SETUP.md             # Setup guide
├── DEPLOYMENT.md        # Deploy checklist
├── ARCHITECTURE.md      # System diagram
└── PROJECT_SUMMARY.md   # Feature summary
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sydney-events
JWT_SECRET=your-secret
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-session-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

### Scraper (.env)
```env
MONGO_URI=mongodb://localhost:27017/sydney-events
SCRAPER_CRON_SCHEDULE=0 */12 * * *
PUPPETEER_HEADLESS=true
```

---

## 🗄️ Database Models

### Event
```javascript
{
  title: String,
  dateTime: Date,
  venue: String,
  city: String (default: "Sydney"),
  description: String,
  category: String,
  imageUrl: String,
  sourceSite: String,
  originalUrl: String,
  status: [String], // new, updated, inactive, imported
  imported: Boolean,
  importedBy: String,
  importNotes: String
}
```

### User
```javascript
{
  googleId: String,
  email: String,
  name: String,
  picture: String,
  role: String (default: "admin")
}
```

### Interest
```javascript
{
  email: String,
  eventId: ObjectId,
  consent: Boolean,
  createdAt: Date
}
```

---

## 🐛 Common Issues & Fixes

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongo  # or mongosh

# Start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
# Windows: net start MongoDB
```

### Port Already in Use
```bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000
#          taskkill /PID <PID> /F

# Mac/Linux: lsof -ti:5000 | xargs kill -9
```

### Google OAuth Error
- Check redirect URI: `http://localhost:5000/api/auth/google/callback`
- Verify Client ID and Secret in .env
- Add yourself as test user in Google Console

### Frontend Can't Connect
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend/.env
- Check CORS settings in backend

### Scraper Not Working
- Sites may have changed structure
- This is normal - use seed data for demo
- Modify scraper selectors as needed

---

## 📊 Key Features Checklist

**Public Features:**
- ✅ Event grid (responsive)
- ✅ Search & filters
- ✅ Get Tickets modal
- ✅ Email capture
- ✅ Auto-redirect

**Admin Features:**
- ✅ Google OAuth login
- ✅ Statistics dashboard
- ✅ Event table
- ✅ Preview sidebar
- ✅ Import events
- ✅ Status tracking

**Scraping:**
- ✅ 3 scrapers (Eventbrite, Sydney.com, What's On)
- ✅ Duplicate detection
- ✅ Status updates
- ✅ Cron automation
- ✅ 20 seed events

---

## 🎯 Testing Checklist

**Development:**
- [ ] Backend starts on :5000
- [ ] Frontend starts on :5173
- [ ] Can see events on homepage
- [ ] Search works
- [ ] Filters work
- [ ] Get Tickets modal works
- [ ] Can login with Google
- [ ] Dashboard loads
- [ ] Can import events

**Production:**
- [ ] HTTPS enabled
- [ ] Google OAuth works with production URL
- [ ] All API calls succeed
- [ ] Mobile responsive
- [ ] Fast load times
- [ ] No console errors

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Complete project documentation |
| **SETUP.md** | Step-by-step setup guide |
| **DEPLOYMENT.md** | Production deployment checklist |
| **ARCHITECTURE.md** | System design & data flow |
| **PROJECT_SUMMARY.md** | Feature list & completion status |
| **QUICKREF.md** | This file - quick reference |

---

## 🆘 Getting Help

1. Check **SETUP.md** for detailed setup
2. See **README.md** for troubleshooting
3. Review **ARCHITECTURE.md** for system overview
4. Check console logs for specific errors
5. Verify all .env files are configured

---

## 💡 Pro Tips

1. **Use install scripts**: Run `install.bat` (Windows) or `install.sh` (Mac/Linux)
2. **Seed the database**: Always run `npm run seed` after setup
3. **Test backend first**: Make sure API works before frontend
4. **Use MongoDB Atlas**: Easier than local MongoDB
5. **Check logs**: Console output shows detailed errors
6. **Use Postman**: Test API endpoints directly
7. **Clear cache**: If auth issues, clear localStorage
8. **Update selectors**: Sites change - scrapers may need updates

---

## 🚢 Deployment Quick Steps

1. **Database**: Set up MongoDB Atlas
2. **Backend**: Deploy to Render/Railway
3. **Frontend**: Deploy to Vercel/Netlify
4. **Scraper**: AWS Lambda or keep with backend
5. **Update**: Google OAuth redirect URIs
6. **Set**: Production environment variables
7. **Test**: All features in production

See **DEPLOYMENT.md** for detailed checklist.

---

**🎉 You're all set!** For full details, see the other documentation files.
