# Environment Variables for Vercel Deployment

This file contains all the environment variables you'll need to configure in Vercel after setting up your Neon database.

## Backend Environment Variables

Configure these in your **backend** Vercel project:

### Required Variables

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `DATABASE_URL` | Your Neon PostgreSQL JDBC connection string | `jdbc:postgresql://ep-xxx.us-east-2.aws.neon.tech/neondb?user=xxx&password=xxx&sslmode=require` |
| `SPRING_PROFILES_ACTIVE` | Spring Boot profile to use | `prod` |
| `FRONTEND_URL` | Your frontend Vercel URL (update after frontend deployment) | `https://your-frontend.vercel.app` |

### How to Get These Values

**DATABASE_URL:**
1. After creating Neon project, go to Dashboard
2. Click "Connection Details" or "Connect"
3. Select "Java" or "JDBC" from dropdown
4. Copy the full connection string
5. It should include: `?user=xxx&password=xxx&sslmode=require`

**FRONTEND_URL:**
1. Deploy frontend first
2. Copy the frontend URL from Vercel
3. Add it to backend environment variables
4. Redeploy backend

---

## Frontend Environment Variables

Configure these in your **frontend** Vercel project:

### Required Variables

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `REACT_APP_API_BASE_URL` | Your backend Vercel URL + /api/quiz | `https://your-backend.vercel.app/api/quiz` |

### How to Get This Value

**REACT_APP_API_BASE_URL:**
1. Deploy backend first
2. Copy the backend URL from Vercel
3. Add `/api/quiz` at the end
4. Example: If backend is `https://c8nnect-quiz-backend.vercel.app`
5. Then use: `https://c8nnect-quiz-backend.vercel.app/api/quiz`

---

## Quick Copy Template

### For Backend (after Neon setup)
```
DATABASE_URL=jdbc:postgresql://ep-YOUR-ENDPOINT.YOUR-REGION.aws.neon.tech/neondb?user=YOUR-USER&password=YOUR-PASSWORD&sslmode=require
SPRING_PROFILES_ACTIVE=prod
FRONTEND_URL=https://YOUR-FRONTEND-URL.vercel.app
```

### For Frontend (after backend deployment)
```
REACT_APP_API_BASE_URL=https://YOUR-BACKEND-URL.vercel.app/api/quiz
```

---

## Deployment Order

1. ✅ Set up Neon database (you do this)
2. ✅ Deploy backend to Vercel with DATABASE_URL and SPRING_PROFILES_ACTIVE
3. ✅ Deploy frontend to Vercel with REACT_APP_API_BASE_URL
4. ✅ Update backend FRONTEND_URL with frontend URL
5. ✅ Redeploy backend

---

## Verification

### Backend Health Check
Visit: `https://your-backend-url.vercel.app/api/quiz/questions`

Should return: JSON array with 5 question objects

### Frontend Health Check
Visit: `https://your-frontend-url.vercel.app`

Should show: Nickname entry page with "Start Quiz" button

### Database Check
In Neon SQL Editor, run:
```sql
SELECT * FROM question LIMIT 5;
```

Should return: 10 questions about business information systems

---

## Troubleshooting

**Backend deployment fails:**
- Check DATABASE_URL format is correct
- Ensure `sslmode=require` is included
- Verify Neon database is active (not paused)

**Frontend shows network error:**
- Verify REACT_APP_API_BASE_URL has `/api/quiz` at the end
- Check backend is deployed and accessible
- Verify no CORS errors in browser console

**CORS errors:**
- Ensure FRONTEND_URL is set in backend
- Redeploy backend after updating FRONTEND_URL
- Check browser console for exact error message
