# Quick Setup Guide

This guide will help you get the Quiz Application up and running quickly.

## Step 1: Install Prerequisites

### Windows

1. **Install Java 17**
   - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
   - Verify: `java -version`

2. **Install Maven**
   - Download from [Apache Maven](https://maven.apache.org/download.cgi)
   - Add to PATH
   - Verify: `mvn -version`

3. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node -v` and `npm -v`

4. **Install PostgreSQL**
   - Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - During installation, remember the password you set for the `postgres` user
   - Verify: `psql --version`

### Mac

```bash
# Using Homebrew
brew install openjdk@17
brew install maven
brew install node
brew install postgresql@14
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install openjdk-17-jdk
sudo apt install maven
sudo apt install nodejs npm
sudo apt install postgresql postgresql-contrib
```

## Step 2: Setup Database

1. **Start PostgreSQL service**

   Windows:
   ```powershell
   # Usually starts automatically, or use Services app
   ```

   Mac:
   ```bash
   brew services start postgresql@14
   ```

   Linux:
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Create Database**

   Open PostgreSQL command line:
   
   Windows:
   ```powershell
   psql -U postgres
   ```

   Mac/Linux:
   ```bash
   sudo -u postgres psql
   ```

   Then run:
   ```sql
   CREATE DATABASE quizdb;
   \q
   ```

3. **Update Database Credentials** (if needed)

   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## Step 3: Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Wait for the message: "Started QuizApplication in X seconds"

Backend will be running at: `http://localhost:8080`

## Step 4: Run Frontend

Open a **new terminal** window:

```bash
cd frontend
npm install
npm start
```

Frontend will automatically open at: `http://localhost:3000`

## Step 5: Test the Application

1. Open `http://localhost:3000` in your browser
2. Enter a nickname (e.g., "TestUser")
3. Click "Start Quiz"
4. Answer the 5 questions
5. Submit and view your results
6. Check the leaderboard

## Common Issues & Solutions

### Issue: "Port 8080 is already in use"

**Solution:** Kill the process using port 8080 or change the backend port

Windows:
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
lsof -ti:8080 | xargs kill -9
```

Or change port in `backend/src/main/resources/application.properties`:
```properties
server.port=8081
```

### Issue: "Cannot connect to database"

**Solutions:**
1. Ensure PostgreSQL is running
2. Check database name is `quizdb`
3. Verify username/password in `application.properties`
4. Test connection:
   ```bash
   psql -U postgres -d quizdb
   ```

### Issue: "CORS error in browser console"

**Solution:** Ensure backend is running and check `CorsConfig.java` has correct frontend URL

### Issue: "npm install fails"

**Solutions:**
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`: 
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: "Maven build fails"

**Solutions:**
1. Ensure Java 17 is installed: `java -version`
2. Clear Maven cache:
   ```bash
   mvn clean
   mvn dependency:purge-local-repository
   ```

## Stopping the Application

### Stop Frontend
Press `Ctrl + C` in the terminal running the frontend

### Stop Backend
Press `Ctrl + C` in the terminal running the backend

### Stop PostgreSQL

Windows: Use Services app

Mac:
```bash
brew services stop postgresql@14
```

Linux:
```bash
sudo systemctl stop postgresql
```

## Development Tips

### Hot Reload

- **Frontend**: React automatically reloads on file changes
- **Backend**: Spring Boot DevTools enables hot reload (already included in pom.xml)

### Viewing Database

Use a database client like:
- [pgAdmin](https://www.pgadmin.org/) (GUI)
- [DBeaver](https://dbeaver.io/) (GUI)
- `psql` command line

Connect with:
- Host: localhost
- Port: 5432
- Database: quizdb
- Username: postgres
- Password: (your password)

### API Testing

Test backend APIs using:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- cURL commands:

```bash
# Get questions
curl http://localhost:8080/api/quiz/questions

# Get leaderboard
curl http://localhost:8080/api/quiz/leaderboard?limit=10
```

## Next Steps

- Customize questions in `DataInitializer.java`
- Modify styling in CSS files
- Add more features (see README.md for ideas)

## Need Help?

If you encounter issues:
1. Check terminal/console for error messages
2. Review the README.md file
3. Verify all prerequisites are installed
4. Ensure all services are running
