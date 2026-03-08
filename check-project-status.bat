@echo off
echo ========================================
echo ScholarSync Project Status Check
echo ========================================
echo.

echo Checking project structure...
echo.

echo [Backend Status]
if exist "backend\package.json" (
    echo ✓ backend\package.json exists
) else (
    echo ✗ backend\package.json NOT FOUND
)

if exist "backend\server.js" (
    echo ✓ backend\server.js exists
) else (
    echo ✗ backend\server.js NOT FOUND
)

if exist "backend\models" (
    echo ✓ backend\models folder exists
) else (
    echo ✗ backend\models folder NOT FOUND
)

echo.
echo [Frontend Status]
if exist "frontend\package.json" (
    echo ✓ frontend\package.json exists
) else (
    echo ✗ frontend\package.json NOT FOUND
)

if exist "frontend\src" (
    echo ✓ frontend\src folder exists
) else (
    echo ✗ frontend\src folder NOT FOUND
)

if exist "frontend\index.html" (
    echo ✓ frontend\index.html exists
) else (
    echo ✗ frontend\index.html NOT FOUND
)

echo.
echo [Data Files]
if exist "scholarships.json" (
    echo ✓ scholarships.json exists
) else (
    echo ✗ scholarships.json NOT FOUND
)

echo.
echo ========================================
echo.
echo DIAGNOSIS:
echo If you see multiple "NOT FOUND" messages above,
echo your repository is missing the source code files.
echo.
echo NEXT STEPS:
echo 1. Check if you cloned from the correct repository URL
echo 2. Check if there are other branches with the code
echo 3. Contact the repository owner for the complete code
echo 4. Or check if the code is in a different location
echo.
pause
