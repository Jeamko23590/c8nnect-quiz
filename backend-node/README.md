# Quiz Backend - Node.js/Express

RESTful API for the quiz application built with Node.js, Express, and PostgreSQL.

## Features

- Get random quiz questions
- Submit quiz answers and calculate scores
- View leaderboard rankings
- PostgreSQL database integration
- CORS enabled
- Vercel-ready deployment

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Native pg driver

## API Endpoints

### GET /api/quiz/questions
Get 5 random questions (without correct answers).

**Response:**
```json
[
  {
    "id": 1,
    "questionText": "What is...",
    "optionA": "Option A",
    "optionB": "Option B",
    "optionC": "Option C",
    "optionD": "Option D"
  }
]
```

### POST /api/quiz/submit
Submit quiz answers and get score.

**Request:**
```json
{
  "nickname": "John",
  "answers": [
    {
      "questionId": 1,
      "selectedAnswer": "A"
    }
  ],
  "timeUsedSeconds": 120
}
```

**Response:**
```json
{
  "score": 4,
  "totalQuestions": 5,
  "timeUsedSeconds": 120,
  "message": "You scored 4 out of 5!"
}
```

### GET /api/quiz/leaderboard?limit=10
Get top quiz attempts.

**Response:**
```json
[
  {
    "id": 1,
    "nickname": "John",
    "score": 5,
    "timeUsedSeconds": 90,
    "attemptDate": "2026-10-14T07:45:00Z",
    "rank": 1
  }
]
```

## Local Development

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- Database `quizdb` created

### Setup

1. Install dependencies:
```bash
cd backend-node
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DATABASE_URL=postgresql://localhost:5432/quizdb?user=postgres&password=postgres
FRONTEND_URL=http://localhost:3000
```

4. Start server:
```bash
npm run dev
```

Server will start on `http://localhost:8080`

## Production Deployment (Vercel)

### Environment Variables Required:
```
DATABASE_URL=postgresql://[neon-host]/[db]?user=[user]&password=[pass]&sslmode=require
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Deploy:
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `backend-node`
4. Add environment variables
5. Deploy!

## Database Schema

### `question` table
```sql
id                SERIAL PRIMARY KEY
question_text     TEXT NOT NULL
option_a          VARCHAR(255)
option_b          VARCHAR(255)
option_c          VARCHAR(255)
option_d          VARCHAR(255)
correct_answer    CHAR(1)
created_date      TIMESTAMP
```

### `quiz_attempt` table
```sql
id                  SERIAL PRIMARY KEY
nickname            VARCHAR(100)
score               INTEGER
time_used_seconds   INTEGER
attempt_date        TIMESTAMP
```

## Project Structure

```
backend-node/
├── server.js              # Main application entry
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
├── .env                  # Environment variables (local)
├── db/
│   ├── config.js         # Database connection
│   └── init.js           # Database initialization
├── routes/
│   └── quiz.js           # API routes
└── controllers/
    └── quizController.js # Business logic
```

## Testing

Test endpoints locally:

```bash
# Get questions
curl http://localhost:8080/api/quiz/questions

# Submit quiz
curl -X POST http://localhost:8080/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"nickname":"Test","answers":[{"questionId":1,"selectedAnswer":"A"}],"timeUsedSeconds":60}'

# Get leaderboard
curl http://localhost:8080/api/quiz/leaderboard?limit=10
```

## Troubleshooting

**Database connection error:**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database `quizdb` exists

**CORS errors:**
- Verify FRONTEND_URL matches your frontend domain
- Check CORS middleware configuration

**Port already in use:**
- Change PORT in .env file
- Or kill process on port 8080
