#!/bin/bash

echo "===================================="
echo "Quiz Application - Quick Start"
echo "===================================="
echo ""

# Check if PostgreSQL is running
echo "Checking if PostgreSQL is running..."
if ! pg_isready -q; then
    echo "[ERROR] PostgreSQL is not running"
    echo "Please start PostgreSQL service first"
    echo "  Mac: brew services start postgresql@14"
    echo "  Linux: sudo systemctl start postgresql"
    exit 1
fi

echo "[OK] PostgreSQL is running"
echo ""

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw quizdb; then
    echo "Creating quizdb database..."
    psql -U postgres -c "CREATE DATABASE quizdb"
    echo "[OK] Database created"
else
    echo "[OK] Database already exists"
fi
echo ""

# Start backend
echo "===================================="
echo "Starting Backend..."
echo "===================================="
cd backend
gnome-terminal -- bash -c "mvn spring-boot:run; exec bash" 2>/dev/null || \
xterm -e "mvn spring-boot:run" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && mvn spring-boot:run"' 2>/dev/null || \
(mvn spring-boot:run &)
cd ..

echo "Waiting for backend to start..."
sleep 15

# Start frontend
echo ""
echo "===================================="
echo "Starting Frontend..."
echo "===================================="
cd frontend
gnome-terminal -- bash -c "npm start; exec bash" 2>/dev/null || \
xterm -e "npm start" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm start"' 2>/dev/null || \
(npm start &)
cd ..

echo ""
echo "===================================="
echo "Application is starting!"
echo "===================================="
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop this script"
echo "(Note: This won't stop the backend/frontend processes)"
echo ""

# Keep script running
tail -f /dev/null
