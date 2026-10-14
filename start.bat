@echo off
echo ====================================
echo Quiz Application - Quick Start
echo ====================================
echo.

echo Checking if PostgreSQL is running...
psql -U postgres -c "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PostgreSQL is not running or not accessible
    echo Please start PostgreSQL service first
    pause
    exit /b 1
)

echo [OK] PostgreSQL is running
echo.

echo Creating database if it doesn't exist...
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'quizdb'" | findstr "1" >nul
if errorlevel 1 (
    echo Creating quizdb database...
    psql -U postgres -c "CREATE DATABASE quizdb"
    echo [OK] Database created
) else (
    echo [OK] Database already exists
)
echo.

echo ====================================
echo Starting Backend...
echo ====================================
cd backend
start "Quiz Backend" cmd /k "mvn spring-boot:run"
cd ..

echo Waiting for backend to start...
timeout /t 15 /nobreak >nul

echo.
echo ====================================
echo Starting Frontend...
echo ====================================
cd frontend
start "Quiz Frontend" cmd /k "npm start"
cd ..

echo.
echo ====================================
echo Application is starting!
echo ====================================
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to view this window...
pause >nul
