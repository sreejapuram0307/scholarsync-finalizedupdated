@echo off
echo ========================================
echo GitHub Push Setup - First Time
echo ========================================
echo.

echo This script will help you push your project to GitHub
echo.

REM Configure Git
echo [1/7] Configuring Git...
git config core.autocrlf false
echo ✓ Line ending configuration set
echo.

REM Check Git status
echo [2/7] Checking Git status...
git status
echo.

echo [3/7] Adding all files...
git add .
echo ✓ Files added
echo.

echo [4/7] Creating initial commit...
git commit -m "Initial commit: ScholarSync AI Scholarship Platform with Chat, Roadmap, and Community"
echo ✓ Commit created
echo.

echo [5/7] Renaming branch to main...
git branch -M main
echo ✓ Branch renamed
echo.

echo ========================================
echo IMPORTANT: Next Steps
echo ========================================
echo.
echo 1. Go to https://github.com and create a new repository
echo 2. Name it: ScholarSync or Innovathon_ScholarSync
echo 3. DO NOT initialize with README
echo 4. Copy the repository URL
echo.
echo Then run these commands:
echo.
echo git remote add origin YOUR_GITHUB_URL
echo git push -u origin main
echo.
echo Example:
echo git remote add origin https://github.com/yourusername/ScholarSync.git
echo git push -u origin main
echo.
echo ========================================
pause
