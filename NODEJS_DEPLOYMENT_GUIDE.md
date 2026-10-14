# 🚀 Node.js Backend Deployment Guide

## ✅ What Changed?

We've converted the backend from **Spring Boot (Java)** to **Node.js/Express** for seamless Vercel deployment!

### Benefits:
- ✅ **Native Vercel support** - No issues with deployment
- ✅ **Faster cold starts** - Serverless functions start instantly
- ✅ **Same API** - Frontend doesn't need any changes
- ✅ **Easier to maintain** - JavaScript everywhere

---

## 📋 Quick Deploy to Vercel

### Step 1: Deploy Backend (5 minutes)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository**: `Jeamko23590/c8nnect-quiz`

3. **Configure Project**:
   - **Project Name**: `c8nnect-quiz-backend`
   - **Framework Preset**: `Other`
   - **Root Directory**: Click **Edit** → Type `backend-node` → Continue

4. **Environment Variables** - Add these 3 variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `FRONTEND_URL` | `http://localhost:3000` (temporary) |
| `NODE_ENV` | `production` |

**Important:** Your DATABASE_URL should be in this format:
```
postgresql://ep-xxx.us-east-2.aws.neon.tech/neondb?user=xxx&password=xxx&sslmode=require
```

**Note:** Remove `jdbc:` prefix if your Neon connection string includes it!

5. **Deploy** - Click deploy and wait ~3 minutes

6. **Copy Backend URL** - Save it for frontend deployment
   - Example: `https://c8nnect-quiz-backend.vercel.app`

7. **Test Backend**: Visit `https://your-backend-url.vercel.app/api/quiz/questions`
   - Should return JSON with 5 questions ✅

---

### Step 2: Deploy Frontend (5 minutes)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository**: `Jeamko23590/c8nnect-quiz` (same repo)

3. **Configure Project**:
   - **Project Name**: `c8nnect-quiz-frontend`
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Click **Edit** → Type `frontend` → Continue

4. **Environment Variables** - Add this 1 variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_BASE_URL` | `https://YOUR-BACKEND-URL.vercel.app/api/quiz` |

**Replace YOUR-BACKEND-URL** with the URL from Step 1.6

Example:
```
https://c8nnect-quiz-backend.vercel.app/api/quiz
```

5. **Deploy** - Click deploy and wait ~2 minutes

6. **Copy Frontend URL**
   - Example: `https://c8nnect-quiz-frontend.vercel.app`

---

### Step 3: Update Backend CORS (2 minutes)

1. Go to **Vercel Dashboard** → **Backend Project**

2. **Settings** → **Environment Variables**

3. Find `FRONTEND_URL` and click **Edit**

4. Change value to your frontend URL from Step 2.6

5. **Deployments** → Click **...** on latest → **Redeploy**

---

### Step 4: Test Everything (5 minutes)

1. **Visit your frontend URL**

2. **Test the flow**:
   - ✅ Enter nickname "TestUser"
   - ✅ Click "Start Quiz"
   - ✅ Answer 5 questions
   - ✅ Submit quiz
   - ✅ View results
   - ✅ Check leaderboard

3. **Verify in Neon**:
   - Go to Neon SQL Editor
   - Run: `SELECT * FROM quiz_attempt ORDER BY attempt_date DESC LIMIT 5;`
   - You should see your test submission ✅

---

## 🎉 You're Live!

Your quiz app is now deployed with:
- ✅ Backend on Vercel (Node.js/Express)
- ✅ Frontend on Vercel (React)
- ✅ Database on Neon (PostgreSQL)

### Your Live URLs:
```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.vercel.app
```

---

## 🔄 Making Updates

Whenever you push changes to GitHub, Vercel automatically redeploys:

```bash
cd "c:\xampp\htdocs\Online Quiz"
git add .
git commit -m "Your changes"
git push
```

---

## 📊 Environment Variables Summary

### Backend (`backend-node` project):
```
DATABASE_URL=postgresql://ep-xxx.region.aws.neon.tech/neondb?user=xxx&password=xxx&sslmode=require
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (`frontend` project):
```
REACT_APP_API_BASE_URL=https://your-backend.vercel.app/api/quiz
```

---

## 🐛 Troubleshooting

### Backend deployment fails
- ✅ Check DATABASE_URL format (should start with `postgresql://` not `jdbc:`)
- ✅ Verify root directory is set to `backend-node`
- ✅ Check build logs for specific errors

### "Cannot find module" error
- ✅ Make sure all dependencies are in `package.json`
- ✅ Try redeploying

### Database connection error
- ✅ Verify Neon database is active
- ✅ Check DATABASE_URL includes `?sslmode=require`
- ✅ Test connection in Neon SQL Editor

### CORS errors
- ✅ Verify FRONTEND_URL matches frontend URL exactly
- ✅ No trailing slash in FRONTEND_URL
- ✅ Redeploy backend after updating

### Questions don't load
- ✅ Test backend directly: `/api/quiz/questions`
- ✅ Check browser console for errors
- ✅ Verify database has questions (Neon SQL Editor)

---

## 🎯 Local Development

Want to run locally?

1. **Backend**:
```bash
cd backend-node
npm install
# Update .env with your local database
npm run dev
# Runs on http://localhost:8080
```

2. **Frontend**:
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🔍 API Testing

Test your live backend:

```bash
# Get questions
curl https://your-backend.vercel.app/api/quiz/questions

# Submit quiz
curl -X POST https://your-backend.vercel.app/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"nickname":"Test","answers":[{"questionId":1,"selectedAnswer":"A"}],"timeUsedSeconds":60}'

# Get leaderboard  
curl https://your-backend.vercel.app/api/quiz/leaderboard?limit=10
```

---

## 📈 Monitoring

### View Logs:
1. Vercel Dashboard → Your Project
2. **Deployments** → Click a deployment
3. **Functions** → View logs

### Check Database:
1. Neon Dashboard → SQL Editor
2. Run queries to check data

### Enable Analytics:
1. Vercel Dashboard → Frontend Project
2. **Analytics** tab → Enable

---

## ✅ Deployment Checklist

- [ ] Neon database created
- [ ] Backend deployed to Vercel (`backend-node`)
- [ ] Backend URL saved
- [ ] Backend `/api/quiz/questions` returns data
- [ ] Frontend deployed to Vercel (`frontend`)
- [ ] Frontend URL saved
- [ ] Backend FRONTEND_URL updated
- [ ] Backend redeployed
- [ ] Can take full quiz
- [ ] Leaderboard shows scores
- [ ] No errors in browser console
- [ ] Database shows quiz attempts

**All checked? You're done! 🎉**

---

## 💡 Next Steps

- 📱 Test on mobile devices
- 📊 Enable Vercel Analytics
- 🎨 Customize the quiz questions
- 🌐 Add custom domain
- 📈 Monitor usage and performance

---

**Need help?** Check the troubleshooting section or test each component individually!
