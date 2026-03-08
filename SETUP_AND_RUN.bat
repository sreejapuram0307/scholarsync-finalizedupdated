@echo off
echo ========================================
echo ScholarSync - Complete Setup and Run
echo ========================================
echo.

echo [Step 1/5] Installing Backend Dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend packages...
    call npm install
    echo ✓ Backend dependencies installed
) else (
    echo ✓ Backend dependencies already installed
)
cd ..
echo.

echo [Step 2/5] Installing Frontend Dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend packages...
    call npm install
    echo ✓ Frontend dependencies installed
) else (
    echo ✓ Frontend dependencies already installed
)
cd ..
echo.

echo [Step 3/5] Checking MongoDB...
net start | findstr -i "MongoDB" >nul
if %errorlevel% equ 0 (
    echo ✓ MongoDB is running
) else (
    echo ⚠ MongoDB is not running
    echo Please start MongoDB manually or use MongoDB Atlas
    echo.
    pause
)
echo.

echo [Step 4/5] Seeding Database...
cd backend
echo Running seed script...
call npm run seed
cd ..
echo.

echo [Step 5/5] Starting Servers...
echo.
echo Opening Backend Server (Port 5000)...
start "ScholarSync Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo Opening Frontend Server (Port 3000)...
start "ScholarSync Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo ✓ ScholarSync is Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows have opened.
echo Wait a few seconds, then open: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
