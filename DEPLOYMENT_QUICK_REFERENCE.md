# 📋 Deployment Quick Reference Card

Keep this handy during deployment!

---

## 🎯 The 3-Step Process

```
1️⃣ NEON (5 min)     →    2️⃣ VERCEL BACKEND (5 min)    →    3️⃣ VERCEL FRONTEND (5 min)
   Set up database         Deploy Spring Boot              Deploy React app
```

---

## 1️⃣ Neon Database Setup

### Actions:
```
1. Go to: https://neon.tech
2. Sign up (use GitHub for fastest)
3. Create project: "c8nnect-quiz"
4. Select region (closest to users)
5. Copy JDBC connection string
6. Save it somewhere safe!
```

### What You Get:
```
jdbc:postgresql://ep-xxxxx.REGION.aws.neon.tech/neondb?user=USER&password=PASS&sslmode=require
```

**✅ Done? → Continue to Backend deployment**

---

## 2️⃣ Vercel Backend Deployment

### Actions:
```
1. Go to: https://vercel.com/new
2. Import: Jeamko23590/c8nnect-quiz
3. Framework Preset: Other
4. Root Directory: backend
5. Add Environment Variables (see below)
6. Deploy
7. Copy backend URL
```

### Environment Variables:

Click **"Add More"** button for each variable. Add these **3 variables**:

**Variable 1:**
- Key: `DATABASE_URL`
- Value: `[Paste your Neon JDBC connection string here]`

**Variable 2:**
- Key: `SPRING_PROFILES_ACTIVE`
- Value: `prod`

**Variable 3:**
- Key: `FRONTEND_URL`
- Value: `http://localhost:3000`

**Important:** After adding each variable, click **"+ Add More"** to add the next one.

Leave **"Environments"** as `Production and Preview` (default).

### Test Backend:
```
https://YOUR-BACKEND-URL.vercel.app/api/quiz/questions
```
Should return JSON with questions ✅

**✅ Done? → Continue to Frontend deployment**

---

## 3️⃣ Vercel Frontend Deployment

### Actions:
```
1. Go to: https://vercel.com/new
2. Import: Jeamko23590/c8nnect-quiz (same repo)
3. Framework: Create React App
4. Root Directory: frontend
5. Add Environment Variable (see below)
6. Deploy
7. Copy frontend URL
```

### Environment Variable:

Click **"Add More"** button and add this **1 variable**:

**Variable:**
- Key: `REACT_APP_API_BASE_URL`
- Value: `https://YOUR-BACKEND-URL.vercel.app/api/quiz`

**Replace YOUR-BACKEND-URL** with your actual backend URL from Step 2.

Example: If backend is `https://c8nnect-quiz-backend.vercel.app`, use:
```
https://c8nnect-quiz-backend.vercel.app/api/quiz
```

Leave **"Environments"** as `Production and Preview` (default).

**✅ Done? → Continue to CORS update**

---

## 4️⃣ Update Backend CORS

### Actions:
```
1. Go to Vercel → Backend Project
2. Settings → Environment Variables
3. Edit FRONTEND_URL
4. Change to: https://YOUR-FRONTEND-URL.vercel.app
5. Deployments → Redeploy latest
```

**✅ Done? → Test your app!**

---

## ✅ Testing Checklist

Visit: `https://YOUR-FRONTEND-URL.vercel.app`

```
□ Page loads without errors
□ Enter nickname: "TestUser"
□ Click "Start Quiz"
□ Questions appear (5 total)
□ Can select answers
□ Can navigate between questions
□ Click "Submit Quiz"
□ Results page shows score
□ Leaderboard displays ranking
□ No CORS errors in console (F12)
```

**All checked? You're live! 🎉**

---

## 🔗 Important URLs

### Save These After Deployment:

```
GitHub Repo:
https://github.com/Jeamko23590/c8nnect-quiz.git

Neon Dashboard:
https://console.neon.tech

Vercel Dashboard:
https://vercel.com/dashboard

Your Backend URL:
https://_____________________.vercel.app

Your Frontend URL:
https://_____________________.vercel.app

Your Live App:
https://_____________________.vercel.app
```

---

## 🆘 Quick Troubleshooting

### Backend won't deploy
```
❌ Check: DATABASE_URL format correct?
❌ Check: Includes ?user=xxx&password=xxx&sslmode=require?
❌ Check: Neon database is active (not paused)?
```

### Frontend shows "Network Error"
```
❌ Check: REACT_APP_API_BASE_URL has /api/quiz at end?
❌ Check: Backend is deployed and accessible?
❌ Check: FRONTEND_URL updated in backend?
❌ Check: Backend redeployed after FRONTEND_URL update?
```

### Questions don't load
```
❌ Check: Backend test URL returns JSON?
❌ Check: Browser console for errors (F12)?
❌ Check: Neon SQL Editor shows questions exist?
```

### CORS errors
```
❌ Check: FRONTEND_URL exactly matches frontend URL?
❌ Check: No trailing slash in FRONTEND_URL?
❌ Check: Backend was redeployed after FRONTEND_URL update?
```

---

## 📊 Environment Variables Cheat Sheet

### Backend (3 variables)
| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `jdbc:postgresql://ep-xxx.us-east-2.aws.neon.tech/neondb?user=user&password=pass&sslmode=require` |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `FRONTEND_URL` | `https://c8nnect-quiz-frontend.vercel.app` |

### Frontend (1 variable)
| Variable | Example |
|----------|---------|
| `REACT_APP_API_BASE_URL` | `https://c8nnect-quiz-backend.vercel.app/api/quiz` |

---

## 🎯 Deployment Flow Diagram

```
┌─────────────────┐
│  Setup Neon DB  │
│  (5 minutes)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Deploy Backend  │
│ to Vercel       │
│ (5 minutes)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Deploy Frontend │
│ to Vercel       │
│ (5 minutes)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Update Backend  │
│ CORS Settings   │
│ (2 minutes)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Test & Go Live │
│  (5 minutes)    │
└─────────────────┘
```

**Total Time: ~22 minutes**

---

## 💾 Save Your Credentials

Use this template to save your credentials securely:

```
=================================
C8NNECT QUIZ - DEPLOYMENT INFO
=================================

NEON DATABASE:
Project Name: c8nnect-quiz
Region: _______________
Connection String: 
jdbc:postgresql://ep-__________.________.aws.neon.tech/neondb?user=________&password=________&sslmode=require

VERCEL BACKEND:
Project Name: c8nnect-quiz-backend
URL: https://_____________________.vercel.app
Deployed: [Date]

VERCEL FRONTEND:
Project Name: c8nnect-quiz-frontend
URL: https://_____________________.vercel.app
Deployed: [Date]

GITHUB:
Repository: https://github.com/Jeamko23590/c8nnect-quiz.git
Branch: main

NOTES:
- Backend redeploys automatically on git push
- Frontend redeploys automatically on git push
- Neon auto-pauses after 5 minutes inactivity (resumes on first query)
- Vercel free tier: unlimited deployments
- Neon free tier: 10 GB storage

Last Updated: [Date]
=================================
```

---

## 🚀 Making Updates Later

### To Update Code:
```bash
# Make changes
git add .
git commit -m "Your update message"
git push

# Vercel automatically redeploys both apps
```

### To Update Environment Variables:
```
1. Vercel Dashboard → Project → Settings
2. Environment Variables → Edit
3. Save
4. Deployments → Redeploy
```

### To Check Database:
```
1. Neon Dashboard → SQL Editor
2. Run: SELECT * FROM quiz_attempt ORDER BY attempt_date DESC LIMIT 10;
```

---

## 📞 Help Resources

- **Detailed Guides**: See `START_HERE.md` for navigation
- **Neon Docs**: https://neon.tech/docs
- **Vercel Docs**: https://vercel.com/docs
- **Project README**: See `README.md` for project overview

---

**Print this page or keep it open during deployment!** 🖨️

**Ready to start?** → Open `START_HERE.md` or `NEON_SETUP_ONLY.md`
