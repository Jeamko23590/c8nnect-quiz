# 📋 Quick Deployment Reference

Print this page or keep it open while deploying!

---

## ⏱️ Total Time: ~20 Minutes

```
Step 1: Neon (5 min) → Step 2: Backend (5 min) → Step 3: Frontend (5 min) → Step 4: Test (5 min)
```

---

## Step 1: Neon Database Setup (5 min)

**URL:** https://neon.tech

**Actions:**
1. Sign up with GitHub
2. Create project: `c8nnect-quiz`
3. Select region (closest to you)
4. Copy connection string
5. **Save it!** You'll need it for Step 2

**Your connection string looks like:**
```
postgresql://ep-xxxxx.region.aws.neon.tech/neondb?user=xxx&password=xxx&sslmode=require
```

---

## Step 2: Deploy Backend (5 min)

**URL:** https://vercel.com/new

**Actions:**
1. Import from GitHub: `Jeamko23590/c8nnect-quiz`
2. **Framework:** Other
3. **Root Directory:** `backend-node` ⭐
4. Add environment variables (see below)
5. Deploy
6. **Copy your backend URL** and save it

**Environment Variables (3 total):**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | [Paste your Neon connection string] |
| `FRONTEND_URL` | `http://localhost:3000` |
| `NODE_ENV` | `production` |

**Test:** Visit `https://your-backend-url.vercel.app/api/quiz/questions`  
Should return JSON with 5 questions ✅

---

## Step 3: Deploy Frontend (5 min)

**URL:** https://vercel.com/new

**Actions:**
1. Import from GitHub: `Jeamko23590/c8nnect-quiz` (same repo)
2. **Framework:** Create React App
3. **Root Directory:** `frontend` ⭐
4. Add environment variable (see below)
5. Deploy
6. **Copy your frontend URL** and save it

**Environment Variable (1 total):**

| Key | Value |
|-----|-------|
| `REACT_APP_API_BASE_URL` | `https://your-backend-url.vercel.app/api/quiz` |

**Important:** Replace `your-backend-url` with URL from Step 2!

---

## Step 4: Update CORS (2 min)

**Actions:**
1. Go to Vercel → **Backend project**
2. Settings → Environment Variables
3. Edit `FRONTEND_URL`
4. Change to: `https://your-frontend-url.vercel.app`
5. Deployments → Redeploy

---

## Step 5: Test (5 min)

**Visit:** `https://your-frontend-url.vercel.app`

**Test Flow:**
- ✅ Enter nickname
- ✅ Start quiz
- ✅ Answer 5 questions
- ✅ Submit
- ✅ View results
- ✅ Check leaderboard

**Verify Database:**
1. Neon Dashboard → SQL Editor
2. Run: `SELECT * FROM quiz_attempt LIMIT 5;`
3. See your submission ✅

---

## 🎉 Done!

Your URLs:
```
Backend:  https://_____________________.vercel.app
Frontend: https://_____________________.vercel.app
Database: Neon PostgreSQL
```

---

## 🐛 Quick Troubleshooting

**Backend won't deploy:**
- ✅ Root directory is `backend-node`?
- ✅ DATABASE_URL starts with `postgresql://` (not `jdbc:`)?
- ✅ All 3 environment variables added?

**Frontend shows "Network Error":**
- ✅ REACT_APP_API_BASE_URL ends with `/api/quiz`?
- ✅ Backend URL is correct?
- ✅ FRONTEND_URL updated in backend?
- ✅ Backend redeployed after FRONTEND_URL update?

**CORS errors:**
- ✅ FRONTEND_URL matches frontend URL exactly?
- ✅ No trailing slash in FRONTEND_URL?
- ✅ Backend redeployed?

**Questions don't load:**
- ✅ Test backend URL directly: `/api/quiz/questions`
- ✅ Check browser console (F12) for errors
- ✅ Verify Neon database is active

---

## 📊 Environment Variables Summary

### Backend (`backend-node` folder):
```
DATABASE_URL=postgresql://ep-xxx.region.aws.neon.tech/neondb?user=xxx&password=xxx&sslmode=require
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (`frontend` folder):
```
REACT_APP_API_BASE_URL=https://your-backend.vercel.app/api/quiz
```

---

## 🔄 Make Updates Later

Push to GitHub → Automatic deployment!

```bash
git add .
git commit -m "Your changes"
git push
```

Both backend and frontend redeploy automatically.

---

## 📞 Need More Help?

- **Detailed Guide:** `NODEJS_DEPLOYMENT_GUIDE.md`
- **Database Setup:** `NEON_SETUP_ONLY.md`
- **Start Guide:** `START_HERE.md`

---

## ✅ Deployment Checklist

- [ ] Neon database created
- [ ] Connection string saved
- [ ] Backend deployed (`backend-node`)
- [ ] Backend URL saved
- [ ] Backend API returns questions
- [ ] Frontend deployed (`frontend`)
- [ ] Frontend URL saved
- [ ] Backend FRONTEND_URL updated
- [ ] Backend redeployed
- [ ] Can take full quiz
- [ ] Leaderboard works
- [ ] No console errors

**All done? You're live! 🚀**
