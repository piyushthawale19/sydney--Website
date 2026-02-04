# 🚀 Deployment Checklist

Use this checklist when deploying to production.

## Pre-Deployment

### 1. Code Quality
- [ ] All code committed to Git
- [ ] No console.logs in production code
- [ ] Environment variables not hardcoded
- [ ] .gitignore excludes .env files
- [ ] All dependencies in package.json
- [ ] Build succeeds without errors: `npm run build`

### 2. Environment Variables
- [ ] All production values configured
- [ ] Secrets are strong and unique
- [ ] MongoDB Atlas connection string ready
- [ ] Google OAuth redirect URIs updated
- [ ] CORS origins updated for production URL

### 3. Database
- [ ] MongoDB Atlas cluster created
- [ ] Network access configured (allow production server)
- [ ] Database user created with appropriate permissions
- [ ] Connection string tested
- [ ] Sample data seeded (optional)

### 4. Google OAuth
- [ ] Production OAuth credentials created
- [ ] Authorized redirect URIs include production domain
- [ ] Consent screen configured
- [ ] Test with production app

---

## Backend Deployment (Render/Railway)

### Render.com
1. [ ] Sign up at render.com
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect GitHub repository
4. [ ] Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. [ ] Add environment variables:
   ```
   NODE_ENV=production
   MONGO_URI=<your-atlas-uri>
   JWT_SECRET=<strong-secret>
   GOOGLE_CLIENT_ID=<your-client-id>
   GOOGLE_CLIENT_SECRET=<your-secret>
   GOOGLE_CALLBACK_URL=https://your-api.onrender.com/api/auth/google/callback
   FRONTEND_URL=https://your-frontend.vercel.app
   SESSION_SECRET=<strong-secret>
   ```
6. [ ] Deploy
7. [ ] Test API: `https://your-api.onrender.com/api/health`

### Railway.app
```bash
railway login
railway init
railway add # Select MongoDB
railway up
railway --service mongodb connection
# Copy connection string and add to railway.app web UI
```

---

## Frontend Deployment (Vercel/Netlify)

### Vercel
1. [ ] Sign up at vercel.com
2. [ ] Click "New Project"
3. [ ] Import GitHub repository
4. [ ] Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. [ ] Add environment variables:
   ```
   VITE_API_URL=https://your-api.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=<your-client-id>
   ```
6. [ ] Deploy
7. [ ] Test: Visit your-app.vercel.app

### Netlify
1. [ ] Sign up at netlify.com
2. [ ] Drag & drop `frontend/dist` folder after build
3. [ ] Or connect GitHub and configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. [ ] Add environment variables in Site Settings
5. [ ] Deploy

---

## Scraper Deployment (AWS Lambda)

### Option 1: AWS Lambda + EventBridge
1. [ ] Package scraper: `cd scraper && zip -r scraper.zip .`
2. [ ] Go to AWS Lambda console
3. [ ] Create function (Node.js 18.x)
4. [ ] Upload scraper.zip
5. [ ] Add environment variables
6. [ ] Increase timeout to 5 minutes
7. [ ] Increase memory to 512MB
8. [ ] Create EventBridge rule:
   - **Schedule expression**: `cron(0 */12 * * ? *)`
   - **Target**: Your Lambda function
9. [ ] Test manually first

### Option 2: Keep on Render (Background Worker)
1. [ ] Create new "Background Worker" on Render
2. [ ] Same repo as backend
3. [ ] Start command: `cd scraper && npm start`
4. [ ] Add same environment variables

---

## Post-Deployment

### 1. Testing
- [ ] Test public event listing page
- [ ] Test search and filters
- [ ] Test "Get Tickets" modal
- [ ] Test Google OAuth login
- [ ] Test admin dashboard
- [ ] Test event import
- [ ] Test on mobile device
- [ ] Test in different browsers

### 2. Monitoring
- [ ] Set up error monitoring (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Monitor database usage

### 3. Security
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Check security headers (Helmet)
- [ ] Test rate limiting
- [ ] Review CORS settings
- [ ] Check JWT expiration

### 4. Performance
- [ ] Test API response times
- [ ] Check database query performance
- [ ] Monitor bundle size
- [ ] Test loading speed (Lighthouse)
- [ ] Enable caching headers

### 5. SEO
- [ ] Submit sitemap to Google
- [ ] Add meta tags
- [ ] Test with Google Search Console
- [ ] Add Open Graph tags
- [ ] Add structured data (JSON-LD)

---

## Production Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sydney-events

# JWT (use strong 64+ char secret)
JWT_SECRET=<generate-strong-secret>

# Google OAuth Production
GOOGLE_CLIENT_ID=<prod-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<prod-secret>
GOOGLE_CALLBACK_URL=https://api.yourapp.com/api/auth/google/callback

# Frontend
FRONTEND_URL=https://yourapp.com

# Session
SESSION_SECRET=<generate-strong-secret>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yourapp.com/api
VITE_GOOGLE_CLIENT_ID=<prod-client-id>.apps.googleusercontent.com
```

### Scraper (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sydney-events
SCRAPER_CRON_SCHEDULE=0 */12 * * *
PUPPETEER_HEADLESS=true
PUPPETEER_TIMEOUT=30000
```

---

## Domain Setup (Optional)

### Custom Domain
1. [ ] Purchase domain (Namecheap, GoDaddy, etc.)
2. [ ] Add domain to Vercel/Netlify (for frontend)
3. [ ] Add custom domain to Render (for backend)
4. [ ] Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: your-app.vercel.app
   
   Type: A
   Name: api
   Value: <render-ip>
   ```
5. [ ] Update Google OAuth redirect URIs
6. [ ] Update CORS origins
7. [ ] Update .env files with new domains
8. [ ] Test SSL certificate

---

## Rollback Plan

### If Something Goes Wrong
1. [ ] Revert to previous Git commit
2. [ ] Redeploy previous version
3. [ ] Check logs for errors
4. [ ] Restore database backup if needed
5. [ ] Update status page

---

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor database size
- [ ] Review scraper success rate
- [ ] Check uptime statistics

### Monthly
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Database backup verification
- [ ] Performance audit

### As Needed
- [ ] Scale database if needed
- [ ] Optimize slow queries
- [ ] Update scraper selectors (if sites change)
- [ ] Add new event sources

---

## Support & Documentation

- [ ] Update README with production URLs
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures
- [ ] Set up alerting for critical errors

---

## Success Criteria

- [ ] ✅ All pages load in < 3 seconds
- [ ] ✅ 99.9% uptime
- [ ] ✅ Zero security vulnerabilities
- [ ] ✅ Mobile responsive on all devices
- [ ] ✅ Scraper runs successfully every 12 hours
- [ ] ✅ Google OAuth works reliably
- [ ] ✅ Database queries < 100ms
- [ ] ✅ API responses < 200ms

---

**🎉 Ready for Production!**

After completing this checklist, your Sydney Events Platform will be live and ready for users!
