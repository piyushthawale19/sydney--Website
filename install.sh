#!/bin/bash

echo "========================================"
echo "Sydney Events Platform - Quick Install"
echo "========================================"
echo ""

echo "[1/3] Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Backend installation failed!"
    exit 1
fi
echo "✓ Backend dependencies installed"
echo ""

echo "[2/3] Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend installation failed!"
    exit 1
fi
echo "✓ Frontend dependencies installed"
echo ""

echo "[3/3] Installing Scraper Dependencies..."
cd ../scraper
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Scraper installation failed!"
    exit 1
fi
echo "✓ Scraper dependencies installed"
echo ""

cd ..

echo "========================================"
echo "✓ All dependencies installed!"
echo "========================================"
echo ""
echo "NEXT STEPS:"
echo "1. Setup MongoDB (local or Atlas)"
echo "2. Setup Google OAuth credentials"
echo "3. Edit .env files in:"
echo "   - backend/.env"
echo "   - frontend/.env"
echo "   - scraper/.env"
echo "4. Seed database: cd backend && npm run seed"
echo "5. Start services (3 terminals):"
echo "   - Backend:  cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo "   - Scraper:  cd scraper && npm run scrape"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
