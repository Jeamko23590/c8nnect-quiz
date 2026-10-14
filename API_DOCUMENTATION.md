# API Documentation

Base URL: `http://localhost:8080/api/quiz`

## Endpoints

### 1. Get Random Questions

Retrieves 5 randomly selected questions from the database.

**Endpoint:** `GET /api/quiz/questions`

**Request:**
```http
GET /api/quiz/questions HTTP/1.1
Host: localhost:8080
```

**Response:** `200 OK`
```json
[
  {
    "id": 3,
    "questionText": "A salon wants customers to book appointments online. What system does it need?",
    "optionA": "Accounting System",
    "optionB": "Inventory Management System",
    "optionC": "Appointment Booking System",
    "optionD": "Document Management System"
  },
  {
    "id": 7,
    "questionText": "A school wants students to access lessons, activities, and learning materials online. What system does it need?",
    "optionA": "Inventory Management System",
    "optionB": "Learning Management System (LMS)",
    "optionC": "Accounting System",
    "optionD": "Appointment Booking System"
  }
  // ... 3 more questions
]
```

**Notes:**
- Returns exactly 5 questions per request
- Questions are randomly selected each time
- Correct answers are NOT included in the response
- Questions are shuffled from the pool of 10 available questions

---

### 2. Submit Quiz

Submits user's answers and records the attempt in the database.

**Endpoint:** `POST /api/quiz/submit`

**Request:**
```http
POST /api/quiz/submit HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "nickname": "John",
  "answers": [
    {
      "questionId": 3,
      "selectedAnswer": "C"
    },
    {
      "questionId": 7,
      "selectedAnswer": "B"
    },
    {
      "questionId": 1,
      "selectedAnswer": "A"
    },
    {
      "questionId": 5,
      "selectedAnswer": "A"
    },
    {
      "questionId": 9,
      "selectedAnswer": "C"
    }
  ],
  "timeUsedSeconds": 145
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| nickname | string | Yes | User's nickname (2-20 characters) |
| answers | array | Yes | Array of answer objects |
| answers[].questionId | number | Yes | ID of the question |
| answers[].selectedAnswer | string | Yes | Selected option: "A", "B", "C", or "D" |
| timeUsedSeconds | number | Yes | Time taken to complete quiz in seconds |

**Response:** `200 OK`
```json
{
  "score": 5,
  "totalQuestions": 5,
  "timeUsedSeconds": 145,
  "message": "You scored 5 out of 5!"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| score | number | Number of correct answers |
| totalQuestions | number | Total number of questions (always 5) |
| timeUsedSeconds | number | Time used to complete the quiz |
| message | string | Congratulatory message |

**Error Responses:**

`400 Bad Request` - Invalid request body
```json
{
  "error": "Invalid submission data"
}
```

---

### 3. Get Leaderboard

Retrieves the leaderboard with quiz attempts ranked by score and time.

**Endpoint:** `GET /api/quiz/leaderboard`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 10 | Number of entries to return |

**Request:**
```http
GET /api/quiz/leaderboard?limit=10 HTTP/1.1
Host: localhost:8080
```

**Response:** `200 OK`
```json
[
  {
    "id": 15,
    "nickname": "SpeedyGonzales",
    "score": 5,
    "timeUsedSeconds": 85,
    "attemptDate": "2026-10-14T08:30:15",
    "rank": 1
  },
  {
    "id": 23,
    "nickname": "QuizMaster",
    "score": 5,
    "timeUsedSeconds": 92,
    "attemptDate": "2026-10-14T09:15:42",
    "rank": 2
  },
  {
    "id": 18,
    "nickname": "SmartCookie",
    "score": 5,
    "timeUsedSeconds": 110,
    "attemptDate": "2026-10-14T08:45:30",
    "rank": 3
  },
  {
    "id": 21,
    "nickname": "Learner123",
    "score": 4,
    "timeUsedSeconds": 75,
    "attemptDate": "2026-10-14T09:00:20",
    "rank": 4
  }
  // ... more entries
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique attempt ID |
| nickname | string | User's nickname |
| score | number | Number of correct answers (0-5) |
| timeUsedSeconds | number | Time taken in seconds |
| attemptDate | string | ISO 8601 timestamp of attempt |
| rank | number | Position in leaderboard |

**Ranking Logic:**
1. Primary sort: Highest score first
2. Secondary sort: Lowest time first (among same scores)

Example ranking:
- 5/5 in 60s → Rank 1
- 5/5 in 90s → Rank 2
- 4/5 in 30s → Rank 3
- 4/5 in 45s → Rank 4

**Notes:**
- Returns empty array if no attempts exist
- Limit can be any positive number
- Attempts with same score and time are ordered by attempt date (most recent first)

---

## Error Handling

All endpoints may return the following error responses:

### 500 Internal Server Error
```json
{
  "timestamp": "2026-10-14T10:30:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Database connection error",
  "path": "/api/quiz/questions"
}
```

### CORS Headers

All responses include CORS headers:
```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

---

## Data Models

### Question
```json
{
  "id": "number",
  "questionText": "string",
  "optionA": "string",
  "optionB": "string",
  "optionC": "string",
  "optionD": "string"
}
```

### Answer
```json
{
  "questionId": "number",
  "selectedAnswer": "string (A|B|C|D)"
}
```

### Quiz Submission
```json
{
  "nickname": "string",
  "answers": "Answer[]",
  "timeUsedSeconds": "number"
}
```

### Quiz Result
```json
{
  "score": "number",
  "totalQuestions": "number",
  "timeUsedSeconds": "number",
  "message": "string"
}
```

### Leaderboard Entry
```json
{
  "id": "number",
  "nickname": "string",
  "score": "number",
  "timeUsedSeconds": "number",
  "attemptDate": "string (ISO 8601)",
  "rank": "number"
}
```

---

## Usage Examples

### Example 1: Complete Quiz Flow

```javascript
// Step 1: Get questions
const questionsResponse = await fetch('http://localhost:8080/api/quiz/questions');
const questions = await questionsResponse.json();
console.log(questions); // Array of 5 questions

// Step 2: User answers questions
const submission = {
  nickname: "TestUser",
  answers: questions.map(q => ({
    questionId: q.id,
    selectedAnswer: "A" // User's selection
  })),
  timeUsedSeconds: 120
};

// Step 3: Submit quiz
const submitResponse = await fetch('http://localhost:8080/api/quiz/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(submission)
});
const result = await submitResponse.json();
console.log(result); // { score: 3, totalQuestions: 5, ... }

// Step 4: Get leaderboard
const leaderboardResponse = await fetch('http://localhost:8080/api/quiz/leaderboard?limit=10');
const leaderboard = await leaderboardResponse.json();
console.log(leaderboard); // Top 10 entries
```

### Example 2: Using cURL

```bash
# Get questions
curl http://localhost:8080/api/quiz/questions

# Submit quiz
curl -X POST http://localhost:8080/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "CurlUser",
    "answers": [
      {"questionId": 1, "selectedAnswer": "B"},
      {"questionId": 3, "selectedAnswer": "C"},
      {"questionId": 5, "selectedAnswer": "A"},
      {"questionId": 7, "selectedAnswer": "B"},
      {"questionId": 9, "selectedAnswer": "C"}
    ],
    "timeUsedSeconds": 180
  }'

# Get leaderboard
curl http://localhost:8080/api/quiz/leaderboard?limit=5
```

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting for production use.

## Authentication

Currently, no authentication is required. The application is open for public use.

## Versioning

Current API version: v1

The API does not use URL versioning. Breaking changes will be communicated in release notes.
