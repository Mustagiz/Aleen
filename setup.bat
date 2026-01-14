@echo off
echo ========================================
echo   ALEEN CLOTHING - SETUP SCRIPT
echo ========================================
echo.

echo [1/5] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/5] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [3/5] Checking MongoDB...
echo Please ensure MongoDB is running before proceeding.
echo If using MongoDB Atlas, skip this step.
echo.
pause

echo [4/5] Creating Admin User...
cd ..\backend
call node seed.js
if %errorlevel% neq 0 (
    echo WARNING: Admin user creation failed. You may need to run 'node seed.js' manually.
)
echo.

echo [5/5] Setup Complete!
echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo.
echo 1. Configure Cloudinary (optional):
echo    - Sign up at https://cloudinary.com
echo    - Add credentials to backend\.env
echo.
echo 2. Start the application:
echo    - Terminal 1: cd backend ^&^& npm run dev
echo    - Terminal 2: cd frontend ^&^& npm run dev
echo.
echo 3. Access the app:
echo    - URL: http://localhost:3000
echo    - Login: admin@aleen.com / admin123
echo.
echo ========================================
echo.
pause
