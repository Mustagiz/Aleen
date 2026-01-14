@echo off
echo Starting Aleen Clothing with Public Tunnel...
echo.

start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

start cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo Creating public tunnel...
lt --port 3000 --subdomain aleen-clothing

pause
