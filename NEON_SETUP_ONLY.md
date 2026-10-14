# 🗄️ Neon Database Setup Guide

Follow these steps to set up your PostgreSQL database on Neon. This is the **ONLY** manual setup required - everything else is automated.

---

## What is Neon?

Neon is a serverless PostgreSQL database that:
- ✅ Has a **generous free tier** (perfect for this project)
- ✅ Requires **no server management**
- ✅ **Scales automatically** based on usage
- ✅ Includes **automatic backups**
- ✅ Takes **5 minutes to set up**

---

## Step 1: Create Neon Account (1 minute)

1. Go to: **https://neon.tech**
2. Click **"Sign Up"** (top right)
3. Sign up with one of:
   - GitHub (recommended - fastest)
   - Google
   - Email

4. After signup, you'll be redirected to the Neon dashboard

---

## Step 2: Create New Project (2 minutes)

1. In the Neon dashboard, click **"Create a project"** or **"New Project"**

2. **Configure your project:**

   **Project Name:**
   ```
   c8nnect-quiz
   ```
   *(or any name you prefer)*

   **PostgreSQL Version:**
   - Select **14** or higher (usually default)

   **Region:**
   - Choose closest to your target users
   - Recommendations:
     - **US East (Ohio)** - For US/Americas users
     - **EU West (Ireland)** - For European users
     - **Asia Pacific (Singapore)** - For Asian users

3. Click **"Create project"**

4. Wait 10-20 seconds for database creation

---

## Step 3: Get Your Connection String (2 minutes)

After project creation, you'll see connection details immediately.

### 3.1 Find Connection Details

1. Look for the connection details panel (should appear automatically)
2. Or click **"Connection Details"** or **"Connect"** button

### 3.2 Select Java/JDBC Format

1. Find the dropdown that says "Node.js", "Python", etc.
2. Click it and select **"Java"** or **"JDBC"**

### 3.3 Copy the Connection String

You'll see something like this:

```
jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?user=username&password=abc123xyz456&sslmode=require
```

**IMPORTANT:** Make sure it includes:
- ✅ Starts with `jdbc:postgresql://`
- ✅ Contains your endpoint (ep-xxxxx)
- ✅ Contains `?user=xxxxx`
- ✅ Contains `&password=xxxxx`
- ✅ Ends with `&sslmode=require`

### 3.4 Save Your Connection String

**Save this connection string somewhere safe!** You'll need it for Vercel deployment.

I recommend:
- Copy to Notepad/Notes app
- Or keep this browser tab open
- Or save in a password manager

---

## Step 4: Verify Database is Active (1 minute)

Let's test the database to make sure it's working.

1. In Neon dashboard, find and click **"SQL Editor"** (left sidebar or top menu)

2. You'll see a SQL editor interface

3. Run this test query:
   ```sql
   SELECT version();
   ```

4. Click **"Run"** or press **Ctrl+Enter** (Cmd+Enter on Mac)

5. You should see PostgreSQL version information ✅

**Example output:**
```
PostgreSQL 14.x on x86_64-pc-linux-gnu, compiled by gcc...
```

---

## ✅ Neon Setup Complete!

Your database is ready! Here's what you have:

```
✅ Database: neondb (default database)
✅ Region: [Your selected region]
✅ Status: Active
✅ Connection String: Saved and ready to use
```

---

## 📋 What You Need for Next Steps

When deploying to Vercel, you'll need this information:

**Connection String** (the JDBC URL you copied):
```
jdbc:postgresql://ep-xxxxx.REGION.aws.neon.tech/neondb?user=USER&password=PASSWORD&sslmode=require
```

That's it! Keep this connection string handy.

---

## 🚀 Next: Deploy to Vercel

Now that Neon is set up, follow the **`QUICK_DEPLOY.md`** guide to deploy your application to Vercel.

The entire Vercel deployment process takes about 15 minutes and requires:
- Your Neon connection string (you have this now ✅)
- Vercel account (free - sign up with GitHub)
- Follow the step-by-step guide in `QUICK_DEPLOY.md`

---

## 💡 Useful Neon Features

### SQL Editor
- Run queries directly from browser
- View your data anytime
- Useful for debugging

### Monitoring Dashboard
- View database usage
- See active connections
- Monitor storage

### Automatic Backups
- Neon backs up your data automatically
- Restore from any point in time
- No configuration needed

---

## 🔍 Verify Data Later

After deploying and using your app, you can check if data is being saved:

1. Go to Neon Dashboard → SQL Editor
2. Run these queries:

**Check questions:**
```sql
SELECT * FROM question LIMIT 5;
```
*Should show 10 questions*

**Check quiz attempts:**
```sql
SELECT * FROM quiz_attempt ORDER BY attempt_date DESC LIMIT 10;
```
*Should show submitted quizzes*

**View leaderboard:**
```sql
SELECT 
    nickname, 
    score, 
    time_used_seconds,
    attempt_date 
FROM quiz_attempt 
ORDER BY score DESC, time_used_seconds ASC 
LIMIT 10;
```
*Should show top scores*

---

## 🐛 Troubleshooting

### Problem: Can't find connection string

**Solution:**
1. Go to Neon Dashboard
2. Click your project name
3. Click "Connection Details" or "Settings"
4. Look for "Connection String"
5. Select "Java" or "JDBC" format

### Problem: Connection string doesn't have password

**Solution:**
1. In Neon dashboard, go to Settings
2. Look for "Reset Password" or "Generate Password"
3. Copy the new connection string with password
4. Save it immediately (password only shows once)

### Problem: Database shows as "Paused"

**Solution:**
- Neon free tier auto-pauses after inactivity
- It will auto-resume when your app connects
- No action needed - first request might be slow

### Problem: Can't access SQL Editor

**Solution:**
1. Make sure you're logged into Neon
2. Select your project from dashboard
3. Look for "SQL Editor" in left sidebar
4. Or go to: `https://console.neon.tech/app/projects/YOUR_PROJECT_ID`

---

## 📊 Free Tier Limits

Neon free tier includes:
- ✅ **1 project**
- ✅ **10 GB storage** (plenty for quiz app)
- ✅ **Unlimited compute hours** (with auto-pause)
- ✅ **500 MB** data transfer/month (sufficient for testing)

**Perfect for:**
- Development and testing
- Small to medium apps
- Learning projects
- Side projects

**If you need more:**
- Upgrade to paid tier anytime
- Starts at $19/month for unlimited projects
- Only pay for what you use

---

## 🎯 Summary

**What you did:**
1. ✅ Created Neon account
2. ✅ Created database project
3. ✅ Got connection string
4. ✅ Verified database works

**What you have:**
- ✅ Production-ready PostgreSQL database
- ✅ Connection string for Vercel
- ✅ SQL Editor for data management
- ✅ Automatic backups and scaling

**What's next:**
- 📖 Open `QUICK_DEPLOY.md`
- 🚀 Deploy to Vercel (15 minutes)
- 🎉 Go live!

---

## 📞 Resources

- **Neon Documentation**: https://neon.tech/docs
- **Neon SQL Editor Guide**: https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor
- **Neon Support**: https://neon.tech/docs/introduction/support

**Ready to deploy?** → Open `QUICK_DEPLOY.md` and continue!
