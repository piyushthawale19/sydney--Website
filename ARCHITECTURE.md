# System Architecture - Sydney Events Platform

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SYDNEY EVENTS PLATFORM                         │
│                     Full-Stack MERN Application                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Frontend)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────┐     ┌─────────────────┐     ┌──────────────────┐  │
│  │   Home Page    │     │  Admin Dashboard│     │   Login Page     │  │
│  │                │     │                 │     │                  │  │
│  │  • Event Grid  │     │  • Stats Cards  │     │  • Google OAuth  │  │
│  │  • Search Bar  │     │  • Events Table │     │  • Login Flow    │  │
│  │  • Filters     │     │  • Preview      │     │                  │  │
│  │  • Get Tickets │     │  • Import       │     │                  │  │
│  └────────────────┘     └─────────────────┘     └──────────────────┘  │
│                                                                         │
│  Technology: React 18 + Vite + Tailwind CSS + React Router             │
│  Port: 5173 (development)                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTPS/REST API
                                   │ Axios Client
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER (Backend)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Express.js API Server                       │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │  │
│  │  │   Auth Routes   │  │  Event Routes   │  │ Interest Routes │ │  │
│  │  │                 │  │                 │  │                 │ │  │
│  │  │ • Google OAuth  │  │ • GET /events   │  │ • POST /interest│ │  │
│  │  │ • JWT Verify    │  │ • POST /events  │  │ • GET /interest │ │  │
│  │  │ • /auth/me      │  │ • PUT /events   │  │ • GET /stats    │ │  │
│  │  │                 │  │ • PATCH /import │  │                 │ │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘ │  │
│  │                                                                  │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                      Middleware Layer                            │  │
│  │  • Authentication (JWT)                                          │  │
│  │  • Authorization (Role-based)                                    │  │
│  │  • Error Handling                                                │  │
│  │  • Rate Limiting (100 req/15min)                                 │  │
│  │  • Security (Helmet, CORS)                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Technology: Node.js + Express.js + Passport.js + JWT                  │
│  Port: 5000 (development)                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Mongoose ODM
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER (Database)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         MongoDB Atlas                            │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │  │
│  │  │  Events         │  │     Users       │  │   Interests     │ │  │
│  │  │  Collection     │  │   Collection    │  │   Collection    │ │  │
│  │  │                 │  │                 │  │                 │ │  │
│  │  │ • title         │  │ • googleId      │  │ • email         │ │  │
│  │  │ • dateTime      │  │ • email         │  │ • eventId       │ │  │
│  │  │ • venue         │  │ • name          │  │ • consent       │ │  │
│  │  │ • city          │  │ • picture       │  │ • timestamp     │ │  │
│  │  │ • description   │  │ • role (admin)  │  │                 │ │  │
│  │  │ • status []     │  │                 │  │                 │ │  │
│  │  │ • sourceSite    │  │ Indexes:        │  │ Indexes:        │ │  │
│  │  │ • originalUrl   │  │ • email (unique)│  │ • email         │ │  │
│  │  │ • imported      │  │ • googleId      │  │ • eventId       │ │  │
│  │  │                 │  │                 │  │                 │ │  │
│  │  │ Indexes:        │  │                 │  │                 │ │  │
│  │  │ • title+date    │  │                 │  │                 │ │  │
│  │  │ • city+date     │  │                 │  │                 │ │  │
│  │  │ • text search   │  │                 │  │                 │ │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Technology: MongoDB (NoSQL Document Database)                          │
│  Storage: MongoDB Atlas Cloud / Local MongoDB                          │
└─────────────────────────────────────────────────────────────────────────┘
                                   ▲
                                   │
                                   │ Direct Connection
                                   │
┌─────────────────────────────────────────────────────────────────────────┐
│                     SCRAPING LAYER (Data Pipeline)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Scraping Service (Cron)                       │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │  │
│  │  │   Eventbrite    │  │   Sydney.com    │  │  What's On      │ │  │
│  │  │    Scraper      │  │    Scraper      │  │   Scraper       │ │  │
│  │  │                 │  │                 │  │                 │ │  │
│  │  │ Tech: Cheerio   │  │ Tech: Cheerio   │  │ Tech: Puppeteer │ │  │
│  │  │ Method: Static  │  │ Method: Static  │  │ Method: Dynamic │ │  │
│  │  │                 │  │                 │  │ (JS-rendered)   │ │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘ │  │
│  │                              │                                  │  │
│  │                              ▼                                  │  │
│  │                    ┌──────────────────┐                        │  │
│  │                    │ Duplicate Check  │                        │  │
│  │                    │ & Status Logic   │                        │  │
│  │                    │                  │                        │  │
│  │                    │ • NEW            │                        │  │
│  │                    │ • UPDATED        │                        │  │
│  │                    │ • INACTIVE       │                        │  │
│  │                    └──────────────────┘                        │  │
│  │                              │                                  │  │
│  │                              ▼                                  │  │
│  │                    ┌──────────────────┐                        │  │
│  │                    │  Save to MongoDB │                        │  │
│  │                    └──────────────────┘                        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Technology: Node.js + Puppeteer + Cheerio + node-cron                 │
│  Schedule: Every 12 hours (configurable)                               │
│  Runs: Standalone service or AWS Lambda                                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES (3rd Party)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐         ┌─────────────────┐                     │
│  │  Google OAuth    │         │  Event Sources  │                     │
│  │                  │         │                 │                     │
│  │  • Authentication│         │  • Eventbrite   │                     │
│  │  • User Profile  │         │  • Sydney.com   │                     │
│  │  • Consent Screen│         │  • What's On    │                     │
│  └──────────────────┘         └─────────────────┘                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                              DATA FLOW
═══════════════════════════════════════════════════════════════════════════

SCRAPING PIPELINE:
─────────────────
1. Cron triggers scraper (every 12 hours)
2. Scraper fetches event pages from sources
3. Parse HTML → Extract event data
4. Check for duplicates in MongoDB
5. Determine status (NEW/UPDATED/INACTIVE)
6. Save to MongoDB with metadata
7. Log results

PUBLIC USER FLOW:
────────────────
1. User visits homepage (/)
2. React app loads event data from API
3. Display events in responsive grid
4. User clicks "GET TICKETS"
5. Modal opens with email form
6. Submit → POST /api/interest
7. Redirect to original event URL

ADMIN USER FLOW:
───────────────
1. User clicks "Admin Login"
2. Redirect to Google OAuth
3. Google authenticates user
4. Callback with auth code
5. Backend exchanges code for user info
6. Generate JWT token
7. Frontend stores token
8. Access dashboard with token
9. View stats, filter events
10. Import events with notes
11. Track who imported when

═══════════════════════════════════════════════════════════════════════════
                           SECURITY LAYERS
═══════════════════════════════════════════════════════════════════════════

Frontend:
  • HTTPS only (in production)
  • XSS protection (React auto-escaping)
  • Input validation
  • Token stored in localStorage
  • Protected routes

Backend:
  • Helmet (security headers)
  • CORS (whitelist origins)
  • Rate limiting (100 req/15min)
  • JWT verification
  • Role-based access control
  • Input sanitization
  • MongoDB injection prevention

Database:
  • MongoDB Atlas encryption at rest
  • Network access control
  • Authentication required
  • Field-level encryption (optional)

═══════════════════════════════════════════════════════════════════════════
                        DEPLOYMENT ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════

Development:
  Frontend:  localhost:5173
  Backend:   localhost:5000
  Database:  localhost:27017 OR MongoDB Atlas
  Scraper:   Manual run OR Cron

Production:
  Frontend:  Vercel / Netlify
  Backend:   Render / Railway
  Database:  MongoDB Atlas (Cloud)
  Scraper:   AWS Lambda + EventBridge OR Background Worker

═══════════════════════════════════════════════════════════════════════════
