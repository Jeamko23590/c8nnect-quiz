# 🚀 Deployment Checklist - Neon + Vercel

Quick reference checklist for deploying your quiz app to production.

## Pre-Deployment

- [ ] All code committed to Git
- [ ] GitHub repository created and code pushed
- [ ] Local application tested and working
- [ ] Backend builds successfully: `cd backend && mvn clean package`
- [ ] Frontend builds successfully: `cd frontend && npm run build`

## Neon Database Setup

- [ ] Neon account created at https://neon.tech
- [ ] Project created in Neon dashboard
- [ ] Connection string copied and saved
- [ ] Database connection tested via SQL Editor
- [ ] Connection string format verified: `jdbc:postgresql://...?sslmode=require`

## Backend Deployment (Vercel)

- [ ] `backend/vercel.json` created
- [ ] `backend/src/main/resources/application-prod.properties` created
- [ ] Code pushed to GitHub
- [ ] Vercel project created for backend
- [ ] Root directory set to `backend`
- [ ] Environment variables added:
  - [ ] `DATABASE_URL` = Neon JDBC connection string
  - [ ] `SPRING_PROFILES_ACTIVE` = `prod`
  - [ ] `FRONTEND_URL` = Your frontend URL (update after frontend deploy)
- [ ] Backend deployed successfully
- [ ] Backend URL copied and saved
- [ ] Test endpoint: `/api/quiz/questions` returns data

## Frontend Deployment (Vercel)

- [ ] `frontend/.env.production` created and updated with backend URL
- [ ] `frontend/src/services/api.js` updated to use environment variable
- [ ] Code pushed to GitHub
- [ ] Vercel project created for frontend
- [ ] Root directory set to `frontend`
- [ ] Framework preset set to "Create React App"
- [ ] Environment variables added:
  - [ ] `REACT_APP_API_BASE_URL` = Your backend URL + `/api/quiz`
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied and saved

## Post-Deployment Configuration

- [ ] Backend `FRONTEND_URL` environment variable updated with actual frontend URL
- [ ] Backend redeployed after FRONTEND_URL update
- [ ] CORS configuration verified

## Testing

- [ ] Frontend loads without errors
- [ ] Can enter nickname and start quiz
- [ ] Questions load successfully
- [ ] Can answer questions and navigate
- [ ] Can submit quiz
- [ ] Results display correctly
- [ ] Leaderboard shows submitted score
- [ ] Leaderboard ranking is correct (score desc, time asc)
- [ ] No CORS errors in browser console
- [ ] No errors in Vercel function logs
- [ ] Database shows quiz_attempt records in Neon SQL Editor

## Monitoring Setup

- [ ] Vercel Analytics enabled on frontend
- [ ] Error notifications enabled in Vercel
- [ ] Neon database monitoring checked
- [ ] Deployment notifications configured

## Documentation

- [ ] Backend URL documented
- [ ] Frontend URL documented
- [ ] Database credentials stored securely
- [ ] Environment variables documented
- [ ] Custom domain configured (if applicable)

## URLs to Save

```
Backend URL: https://_____________________.vercel.app
Frontend URL: https://_____________________.vercel.app
Neon Project: https://console.neon.tech/app/projects/_____
GitHub Repo: https://github.com/_______/_______
```

## Common Commands

```bash
# Push changes and redeploy
git add .
git commit -m "Update configuration"
git push

# View Vercel logs
vercel logs [your-url].vercel.app

# Force redeploy
git commit --allow-empty -m "Redeploy" && git push
```

## Troubleshooting Quick Fixes

**CORS Error:**
- Check FRONTEND_URL in backend environment variables
- Redeploy backend after updating

**Database Connection Error:**
- Verify DATABASE_URL in backend environment variables
- Check Neon database is not paused
- Ensure `?sslmode=require` is in connection string

**Questions Don't Load:**
- Check backend logs in Vercel
- Verify DataInitializer ran successfully
- Manually check database tables in Neon SQL Editor

**Frontend Shows Network Error:**
- Verify REACT_APP_API_BASE_URL in frontend environment variables
- Check backend is deployed and accessible
- Clear browser cache and try again

---

✅ **All checks complete? Your app is ready for live testing!**

See `NEON_VERCEL_DEPLOYMENT.md` for detailed instructions on any step.
