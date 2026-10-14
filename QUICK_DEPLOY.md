# 🚀 Quick Deploy Guide - After Neon Setup

This guide assumes you've already completed the Neon database setup. Just follow these steps to deploy to Vercel.

---

## Prerequisites Completed ✅

- [x] Neon database created
- [x] Neon connection string saved
- [x] Code pushed to GitHub: https://github.com/Jeamko23590/c8nnect-quiz.git

---

## Step 1: Deploy Backend to Vercel (5 minutes)

### 1.1 Import Project

1. Go to **Vercel Dashboard**: https://vercel.com/new
2. Click **"Add New..."** → **"Project"**
3. If not connected, click **"Import Git Repository"** and connect GitHub
4. Search for and select: `Jeamko23590/c8nnect-quiz`
5. Click **"Import"**

### 1.2 Configure Backend Project

In the configuration screen:

**Project Settings:**
- **Project Name**: `c8nnect-quiz-backend` (or your choice)
- **Framework Preset**: `Other`
- **Root Directory**: Click **"Edit"** → Type: `backend` → Click **"Continue"**

**Build Settings:**
- Leave as default (Vercel auto-detects from `vercel.json`)

**Environment Variables:**

Click **"Environment Variables"** and add these **3 variables**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Paste your full Neon JDBC connection string |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `FRONTEND_URL` | `http://localhost:3000` (temporary, we'll update this) |

**Important:** Your `DATABASE_URL` should look like:
```
jdbc:postgresql://ep-xxxxx.us-east-2.aws.neon.tech/neondb?user=yourusername&password=yourpassword&sslmode=require
```

### 1.3 Deploy Backend

1. Click **"Deploy"**
2. Wait 5-10 minutes for first build
3. **COPY YOUR BACKEND URL** when deployment completes
   - It will look like: `https://c8nnect-quiz-backend.vercel.app`
4. **Test it**: Visit `https://your-backend-url.vercel.app/api/quiz/questions`
   - You should see JSON with questions ✅

---

## Step 2: Deploy Frontend to Vercel (5 minutes)

### 2.1 Import Project Again

1. Go back to **Vercel Dashboard**: https://vercel.com/new
2. Click **"Add New..."** → **"Project"**
3. Select the **same repository**: `Jeamko23590/c8nnect-quiz`
4. Click **"Import"**

### 2.2 Configure Frontend Project

In the configuration screen:

**Project Settings:**
- **Project Name**: `c8nnect-quiz-frontend` (or your choice)
- **Framework Preset**: `Create React App`
- **Root Directory**: Click **"Edit"** → Type: `frontend` → Click **"Continue"**

**Build Settings:**
- **Build Command**: `npm run build` (should auto-populate)
- **Output Directory**: `build` (should auto-populate)
- **Install Command**: `npm install` (should auto-populate)

**Environment Variables:**

Click **"Environment Variables"** and add this **1 variable**:

| Name | Value |
|------|-------|
| `REACT_APP_API_BASE_URL` | `https://YOUR-BACKEND-URL.vercel.app/api/quiz` |

**Replace `YOUR-BACKEND-URL`** with the backend URL from Step 1.3

Example: If your backend is `https://c8nnect-quiz-backend.vercel.app`, then use:
```
https://c8nnect-quiz-backend.vercel.app/api/quiz
```

### 2.3 Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-5 minutes for build
3. **COPY YOUR FRONTEND URL** when deployment completes
   - It will look like: `https://c8nnect-quiz-frontend.vercel.app`
4. **DON'T TEST YET** - we need to update CORS first

---

## Step 3: Update Backend CORS (2 minutes)

Now we need to tell the backend about the frontend URL.

### 3.1 Update Backend Environment Variable

1. Go to **Vercel Dashboard**
2. Click on your **backend project** (`c8nnect-quiz-backend`)
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar
5. Find the `FRONTEND_URL` variable
6. Click **"Edit"** (pencil icon)
7. Change value from `http://localhost:3000` to your **actual frontend URL**
   - Example: `https://c8nnect-quiz-frontend.vercel.app`
8. Click **"Save"**

### 3.2 Redeploy Backend

1. Click **"Deployments"** tab
2. Find the latest deployment (top of list)
3. Click **"..."** (three dots) on the right
4. Click **"Redeploy"**
5. Click **"Redeploy"** in confirmation dialog
6. Wait 2-3 minutes for redeployment

---

## Step 4: Test Your Application (5 minutes)

### 4.1 Open Your App

1. Visit your **frontend URL**: `https://your-frontend-url.vercel.app`
2. You should see the nickname entry screen

### 4.2 Complete Test Flow

1. ✅ Enter nickname: "TestUser"
2. ✅ Click "Start Quiz"
3. ✅ Verify 5 questions load
4. ✅ Answer all questions
5. ✅ Click "Submit Quiz"
6. ✅ Verify results page shows
7. ✅ Check leaderboard displays your score
8. ✅ Verify your ranking is shown

### 4.3 Verify Database

1. Go to **Neon Dashboard**: https://console.neon.tech
2. Select your project
3. Click **"SQL Editor"**
4. Run this query:
   ```sql
   SELECT * FROM quiz_attempt ORDER BY attempt_date DESC LIMIT 5;
   ```
5. You should see your test submission ✅

---

## ✅ Deployment Complete!

Your quiz application is now live and accessible worldwide!

### Your Live URLs

```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.vercel.app
Database: Neon PostgreSQL (serverless)
```

### Share Your App

Send your frontend URL to anyone for testing:
- Works on mobile and desktop
- No installation required
- Instant access

---

## 🔧 Making Updates

Whenever you push changes to GitHub, Vercel automatically redeploys:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push

# Vercel automatically redeploys both frontend and backend
```

---

## 📊 Monitoring

### View Logs

**Backend Logs:**
1. Vercel Dashboard → Backend Project
2. Click **"Functions"** tab
3. Click any function to see logs

**Frontend Logs:**
1. Vercel Dashboard → Frontend Project
2. Click **"Deployments"** tab
3. Click any deployment → Click **"View Function Logs"**

### Check Database Usage

1. Neon Dashboard → Your Project
2. Click **"Monitoring"** tab
3. View active connections and storage

### Enable Analytics

1. Vercel Dashboard → Frontend Project
2. Click **"Analytics"** tab
3. Click **"Enable"** (free tier available)

---

## 🐛 Troubleshooting

### Problem: Backend shows "Application Error"

**Solution:**
1. Check Vercel function logs for errors
2. Verify DATABASE_URL is correct in environment variables
3. Ensure Neon database is active (not paused)
4. Try redeploying backend

### Problem: Frontend shows "Network Error"

**Solution:**
1. Open browser console (F12)
2. Check for CORS errors
3. Verify FRONTEND_URL is set correctly in backend
4. Redeploy backend after updating FRONTEND_URL
5. Clear browser cache and reload

### Problem: Questions don't appear

**Solution:**
1. Test backend directly: `https://your-backend.vercel.app/api/quiz/questions`
2. Check Neon SQL Editor - verify questions exist:
   ```sql
   SELECT COUNT(*) FROM question;
   ```
3. Check backend logs for database connection errors
4. Verify DATABASE_URL includes `?sslmode=require`

### Problem: Can't submit quiz

**Solution:**
1. Check browser console for errors
2. Test backend submit endpoint with curl:
   ```bash
   curl -X POST https://your-backend.vercel.app/api/quiz/submit \
     -H "Content-Type: application/json" \
     -d '{"nickname":"Test","answers":[{"questionId":1,"selectedAnswer":"A"}],"timeUsedSeconds":60}'
   ```
3. Check if data reaches database (Neon SQL Editor)

---

## 🎯 Next Steps

1. ✅ **Custom Domain** (Optional)
   - Vercel Settings → Domains → Add Domain
   - Follow DNS configuration instructions

2. ✅ **Error Tracking** (Optional)
   - Set up Sentry or LogRocket
   - Monitor production errors

3. ✅ **Performance Testing**
   - Use Vercel Analytics
   - Test from different locations

4. ✅ **Backup Strategy**
   - Neon provides automatic backups
   - Export data periodically via SQL Editor

5. ✅ **Share and Collect Feedback**
   - Send URL to friends/testers
   - Note any issues or improvements

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Spring Boot on Vercel**: https://vercel.com/guides/spring-boot

---

## 🎉 Success Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend URL copied and saved
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied and saved
- [ ] Backend FRONTEND_URL updated
- [ ] Backend redeployed
- [ ] Can load quiz questions
- [ ] Can submit quiz
- [ ] Leaderboard works
- [ ] Database shows data
- [ ] No errors in browser console
- [ ] Tested on mobile device

**All checked? Congratulations! You're live! 🚀**
