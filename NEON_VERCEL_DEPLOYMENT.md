# Deploying Quiz Application to Neon + Vercel

This guide provides step-by-step instructions to deploy your quiz application with:
- **Neon** - Serverless PostgreSQL database
- **Vercel** - Backend and Frontend hosting

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Part 1: Database Setup (Neon)](#part-1-database-setup-neon)
3. [Part 2: Backend Deployment (Vercel)](#part-2-backend-deployment-vercel)
4. [Part 3: Frontend Deployment (Vercel)](#part-3-frontend-deployment-vercel)
5. [Part 4: Testing](#part-4-testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- [ ] Git installed and your project in a Git repository
- [ ] GitHub account (required for Vercel deployment)
- [ ] Node.js 16+ and npm installed
- [ ] Java 17+ and Maven installed locally (for building)
- [ ] Neon account (sign up at https://neon.tech - free tier available)
- [ ] Vercel account (sign up at https://vercel.com - free tier available)

---

## Part 1: Database Setup (Neon)

### Step 1: Create Neon Account and Project

1. Go to https://neon.tech and sign up or log in
2. Click **"Create a project"** or **"New Project"**
3. Configure your project:
   - **Project name**: `quiz-app` (or your preferred name)
   - **PostgreSQL version**: Select the latest (14 or higher)
   - **Region**: Choose closest to your target users (e.g., US East, EU West)
   - Click **"Create project"**

### Step 2: Get Database Connection String

1. After project creation, you'll see the connection details
2. Click on **"Connection string"** or **"Connect"**
3. Select **"Java"** or **"JDBC"** from the dropdown
4. Copy the connection string - it will look like:
   ```
   jdbc:postgresql://ep-xxxxx.us-east-2.aws.neon.tech/neondb?user=yourusername&password=yourpassword&sslmode=require
   ```
5. **Save this connection string** - you'll need it multiple times

### Step 3: Create Database Tables

Since Spring Boot will auto-create tables, we need to verify the connection:

1. In Neon dashboard, click **"SQL Editor"**
2. Run this test query to verify:
   ```sql
   SELECT version();
   ```
3. Keep this tab open - you'll use it to verify data later

### Step 4: Note Your Credentials

From the connection string, extract:
- **Host**: `ep-xxxxx.us-east-2.aws.neon.tech`
- **Database**: `neondb` (or your database name)
- **Username**: Your username
- **Password**: Your password
- **Full JDBC URL**: The complete connection string

---

## Part 2: Backend Deployment (Vercel)

### Step 1: Prepare Backend for Vercel

Spring Boot apps need special configuration for Vercel's serverless environment.

1. **Create `vercel.json` in the backend folder**:

Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "pom.xml",
      "use": "@vercel/java"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/"
    }
  ]
}
```

2. **Update application properties for production**

Create `backend/src/main/resources/application-prod.properties`:
```properties
# Database Configuration - will be overridden by environment variables
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=false

# Server Configuration
server.port=8080

# CORS Configuration - will be updated with frontend URL
spring.web.cors.allowed-origins=${FRONTEND_URL:http://localhost:3000}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### Step 2: Push to GitHub

1. **Initialize Git (if not already done)**:
   ```bash
   cd "c:\xampp\htdocs\Online Quiz"
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```

2. **Create GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `quiz-app`)
   - Do NOT initialize with README (you already have files)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/quiz-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy Backend to Vercel

1. **Go to Vercel dashboard**: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (`quiz-app`)
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - Click **"Environment Variables"**

5. **Add Environment Variables**:
   - Click **"Add"** for each variable:
   
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Your full Neon JDBC connection string |
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` (we'll update this later) |

6. Click **"Deploy"**
7. Wait for deployment to complete (5-10 minutes for first deploy)
8. **Copy your backend URL** (e.g., `https://quiz-app-backend.vercel.app`)

### Step 4: Verify Backend Deployment

1. Open your backend URL in browser: `https://your-backend-url.vercel.app/api/quiz/leaderboard`
2. You should see an empty array: `[]`
3. Try getting questions: `https://your-backend-url.vercel.app/api/quiz/questions`
4. If you see JSON with questions, backend is working! ✅

**If deployment fails**, check:
- Build logs in Vercel dashboard
- Make sure Java 17 is specified in `pom.xml`
- Verify DATABASE_URL environment variable is correct

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

1. **Update API URL in frontend**

   Option A: Using environment variable (recommended)
   
   Create `frontend/.env.production`:
   ```env
   REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app/api/quiz
   ```
   
   Update `frontend/src/services/api.js`:
   ```javascript
   import axios from 'axios';

   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/quiz';

   export const getQuestions = () => {
       return axios.get(`${API_BASE_URL}/questions`);
   };

   export const submitQuiz = (quizData) => {
       return axios.post(`${API_BASE_URL}/submit`, quizData);
   };

   export const getLeaderboard = (limit = 10) => {
       return axios.get(`${API_BASE_URL}/leaderboard`, {
           params: { limit }
       });
   };
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Configure frontend for production"
   git push
   ```

### Step 2: Deploy Frontend to Vercel

1. Go to Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository again
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Add Environment Variables**:
   | Name | Value |
   |------|-------|
   | `REACT_APP_API_BASE_URL` | `https://your-backend-url.vercel.app/api/quiz` |

6. Click **"Deploy"**
7. Wait for deployment (2-5 minutes)
8. **Copy your frontend URL** (e.g., `https://quiz-app.vercel.app`)

### Step 3: Update CORS Settings

Now update the backend to allow your frontend:

1. Go to your **backend project** in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Edit `FRONTEND_URL` variable:
   - Change to your actual frontend URL: `https://your-frontend-url.vercel.app`
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click **"..."** on latest deployment → **"Redeploy"**

---

## Part 4: Testing

### Step 1: Test the Application

1. **Open your frontend URL**: `https://your-frontend-url.vercel.app`
2. **Enter a nickname** and click "Start Quiz"
3. **Answer all questions** and submit
4. **Verify results** are displayed
5. **Check leaderboard** - your score should appear

### Step 2: Verify Database

1. Go to **Neon dashboard** → **SQL Editor**
2. Run these queries:
   ```sql
   -- Check questions table
   SELECT * FROM question LIMIT 5;
   
   -- Check quiz attempts
   SELECT * FROM quiz_attempt ORDER BY attempt_date DESC LIMIT 5;
   ```
3. You should see your quiz attempt data ✅

### Step 3: Test from Multiple Devices

1. Open the app on your phone
2. Take the quiz with a different nickname
3. Verify leaderboard updates correctly
4. Check that ranking works (higher score + faster time ranks higher)

---

## Troubleshooting

### Problem: Backend deployment fails

**Solution**:
1. Check Vercel build logs for errors
2. Verify `pom.xml` has Java 17 specified
3. Ensure all dependencies are in `pom.xml`
4. Try local build first: `cd backend && mvn clean package`

### Problem: Frontend shows "Network Error" or CORS error

**Solution**:
1. Check browser console for exact error
2. Verify FRONTEND_URL environment variable in backend
3. Make sure backend CORS configuration includes your frontend URL
4. Redeploy backend after updating FRONTEND_URL

### Problem: Database connection fails

**Solution**:
1. Verify DATABASE_URL in Vercel environment variables
2. Ensure Neon database is active (not paused)
3. Check connection string format - must be complete JDBC URL
4. Verify SSL mode is included: `?sslmode=require`

### Problem: Questions don't load

**Solution**:
1. Check if DataInitializer ran successfully in backend logs
2. Manually insert questions via Neon SQL Editor:
   ```sql
   INSERT INTO question (question_text, option_a, option_b, option_c, option_d, correct_answer, created_date)
   VALUES 
   ('What does POS stand for?', 'Point of Sale', 'Position of Service', 'Product Ordering System', 'Personal Office Suite', 'A', NOW());
   ```
3. Restart backend deployment in Vercel

### Problem: Frontend works locally but not on Vercel

**Solution**:
1. Check that `.env.production` is committed to git
2. Verify REACT_APP_API_BASE_URL is set in Vercel environment variables
3. Clear browser cache and try again
4. Check Vercel function logs for runtime errors

### Problem: Leaderboard doesn't update

**Solution**:
1. Check browser console for API errors
2. Verify `/api/quiz/submit` endpoint is working
3. Check Neon database to confirm data is being saved
4. Try submitting manually via curl:
   ```bash
   curl -X POST https://your-backend-url.vercel.app/api/quiz/submit \
     -H "Content-Type: application/json" \
     -d '{
       "nickname": "TestUser",
       "answers": [{"questionId": 1, "selectedAnswer": "A"}],
       "timeUsedSeconds": 60
     }'
   ```

---

## Performance Optimization

### Enable Vercel Analytics

1. Go to your frontend project in Vercel
2. Navigate to **Analytics** tab
3. Enable Web Analytics (free)
4. Monitor page load times and user traffic

### Database Optimization

1. In Neon, enable **Autoscaling**:
   - Go to Project Settings
   - Enable compute autoscaling
   - This scales resources based on usage

2. Add database indexes for better query performance:
   ```sql
   CREATE INDEX idx_quiz_attempt_score ON quiz_attempt(score DESC, time_used_seconds ASC);
   CREATE INDEX idx_quiz_attempt_date ON quiz_attempt(attempt_date DESC);
   ```

### Enable Caching

Add caching headers in Spring Boot (`backend/src/main/java/com/quiz/app/config/WebConfig.java`):
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/quiz/questions")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES));
    }
}
```

---

## Environment Variables Summary

### Backend (Vercel)
- `DATABASE_URL` - Full Neon connection string
- `SPRING_PROFILES_ACTIVE` - `prod`
- `FRONTEND_URL` - Your frontend Vercel URL

### Frontend (Vercel)
- `REACT_APP_API_BASE_URL` - Your backend Vercel URL + `/api/quiz`

---

## Custom Domain Setup (Optional)

### Add Custom Domain to Frontend

1. Buy domain from provider (Namecheap, Google Domains, etc.)
2. In Vercel frontend project → **Settings** → **Domains**
3. Add your domain (e.g., `quiz.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### Add Custom Domain to Backend

1. In Vercel backend project → **Settings** → **Domains**
2. Add subdomain (e.g., `api.yourdomain.com`)
3. Update `FRONTEND_URL` in backend environment variables
4. Update `REACT_APP_API_BASE_URL` in frontend environment variables
5. Redeploy both projects

---

## Monitoring & Maintenance

### View Backend Logs

1. Vercel Dashboard → Your backend project
2. Go to **Functions** tab
3. Click on any function to see logs
4. Useful for debugging API errors

### View Database Usage

1. Neon Dashboard → Your project
2. Go to **Monitoring** tab
3. View:
   - Active connections
   - Query performance
   - Storage usage

### Set Up Alerts

1. **Vercel**: Settings → Notifications
   - Enable deployment notifications
   - Enable error notifications

2. **Neon**: Settings → Notifications
   - Set up storage alerts
   - Enable connection limit warnings

---

## Costs & Free Tier Limits

### Neon Free Tier
- ✅ 1 project
- ✅ 10 GB storage
- ✅ Unlimited compute hours (with limits)
- ✅ Great for testing and small apps

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Perfect for hobby projects

**Note**: Both services scale easily if you need more resources later.

---

## Next Steps After Deployment

1. ✅ **Monitor Performance**: Check Vercel Analytics
2. ✅ **Test Thoroughly**: Try different scenarios and edge cases
3. ✅ **Share Your App**: Send link to friends for testing
4. ✅ **Collect Feedback**: Note any issues or improvement ideas
5. ✅ **Set Up Monitoring**: Enable error tracking (Sentry, LogRocket)
6. ✅ **Plan Features**: Add new features based on usage
7. ✅ **Backup Data**: Export leaderboard data periodically

---

## Quick Reference

### Useful Commands

```bash
# View backend logs
vercel logs your-backend-url.vercel.app

# View frontend logs  
vercel logs your-frontend-url.vercel.app

# Redeploy backend
cd backend && git commit --allow-empty -m "Redeploy" && git push

# Redeploy frontend
cd frontend && git commit --allow-empty -m "Redeploy" && git push
```

### Important URLs

- **Neon Dashboard**: https://console.neon.tech
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Backend URL**: `https://your-backend-url.vercel.app`
- **Frontend URL**: `https://your-frontend-url.vercel.app`

---

## Success Checklist

- [ ] Neon database created and accessible
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured correctly
- [ ] CORS configured with frontend URL
- [ ] Can load questions successfully
- [ ] Can submit quiz and see results
- [ ] Leaderboard displays correctly
- [ ] Application accessible from multiple devices
- [ ] No errors in browser console
- [ ] Backend logs show no errors

**🎉 Congratulations! Your quiz app is now live and ready for testing!**

---

## Support Resources

- **Neon Documentation**: https://neon.tech/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Spring Boot on Vercel**: https://vercel.com/guides/spring-boot
- **React on Vercel**: https://vercel.com/guides/deploying-react

If you encounter issues not covered here, check the troubleshooting section or consult the official documentation.
