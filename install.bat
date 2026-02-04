@echo off
echo ========================================
echo Sydney Events Platform - Quick Install
echo ========================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo [2/3] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

echo [3/3] Installing Scraper Dependencies...
cd ..\scraper
call npm install
if errorlevel 1 (
    echo ERROR: Scraper installation failed!
    pause
    exit /b 1
)
echo ✓ Scraper dependencies installed
echo.

cd ..

echo ========================================
echo ✓ All dependencies installed!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Setup MongoDB (local or Atlas)
echo 2. Setup Google OAuth credentials
echo 3. Edit .env files in:
echo    - backend/.env
echo    - frontend/.env
echo    - scraper/.env
echo 4. Seed database: cd backend ^&^& npm run seed
echo 5. Start services (3 terminals):
echo    - Backend:  cd backend ^&^& npm run dev
echo    - Frontend: cd frontend ^&^& npm run dev
echo    - Scraper:  cd scraper ^&^& npm run scrape
echo.
echo For detailed instructions, see SETUP.md
echo.
pause
