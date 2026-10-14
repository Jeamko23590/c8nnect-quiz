# Quiz Website with Leaderboard

A full-stack quiz application built with React, Spring Boot, and PostgreSQL. Users answer 5 randomly selected questions from a pool of 10, and their scores are tracked on a leaderboard based on score and completion time.

## Features

- **Random Questions**: 5 questions randomly selected from a pool of 10 questions
- **Nickname Entry**: Users enter their nickname before starting the quiz
- **Interactive Quiz Interface**: Clean UI with progress tracking and answer selection
- **Timer Tracking**: Tracks time taken to complete the quiz
- **Scoring System**: Automatic scoring based on correct answers
- **Leaderboard**: Rankings based on highest score, then fastest completion time
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-refresh**: Leaderboard automatically updates every 30 seconds

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.1.5
- Spring Data JPA
- PostgreSQL
- Maven
- Lombok

### Frontend
- React 18.2.0
- Axios (for API calls)
- CSS3 (with animations)

## Prerequisites

Before running this application, make sure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
- **Maven 3.6+**
- **Node.js 16+ and npm**
- **PostgreSQL 12+**

## Database Setup

1. Install PostgreSQL and start the PostgreSQL service

2. Create a database named `quizdb`:
   ```sql
   CREATE DATABASE quizdb;
   ```

3. Update database credentials in `backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/quizdb
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```

4. The application will automatically create tables and populate questions on startup using the DataInitializer class.

## Installation & Running

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your nickname on the welcome screen
3. Click "Start Quiz" to begin
4. Answer all 5 questions by selecting an option (A, B, C, or D)
5. Navigate between questions using "Previous" and "Next" buttons
6. Click "Submit Quiz" after answering all questions
7. View your results and ranking on the leaderboard
8. Click "Take Quiz Again" to restart with a new set of random questions

## API Endpoints

### Get Random Questions
```
GET /api/quiz/questions
```
Returns 5 random questions from the database (without correct answers).

**Response:**
```json
[
  {
    "id": 1,
    "questionText": "Question text here...",
    "optionA": "Option A",
    "optionB": "Option B",
    "optionC": "Option C",
    "optionD": "Option D"
  }
]
```

### Submit Quiz
```
POST /api/quiz/submit
```
Submits quiz answers and saves the attempt.

**Request Body:**
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

### Get Leaderboard
```
GET /api/quiz/leaderboard?limit=10
```
Returns top quiz attempts ordered by score (desc) and time (asc).

**Response:**
```json
[
  {
    "id": 1,
    "nickname": "John",
    "score": 5,
    "timeUsedSeconds": 90,
    "attemptDate": "2026-10-14T07:45:00",
    "rank": 1
  }
]
```

## Project Structure

```
Online Quiz/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/quiz/app/
│   │       │   ├── config/
│   │       │   │   ├── CorsConfig.java
│   │       │   │   └── DataInitializer.java
│   │       │   ├── controller/
│   │       │   │   └── QuizController.java
│   │       │   ├── dto/
│   │       │   │   ├── AnswerDTO.java
│   │       │   │   ├── LeaderboardEntryDTO.java
│   │       │   │   ├── QuestionDTO.java
│   │       │   │   ├── QuizResultDTO.java
│   │       │   │   └── QuizSubmissionDTO.java
│   │       │   ├── model/
│   │       │   │   ├── Question.java
│   │       │   │   └── QuizAttempt.java
│   │       │   ├── repository/
│   │       │   │   ├── QuestionRepository.java
│   │       │   │   └── QuizAttemptRepository.java
│   │       │   ├── service/
│   │       │   │   └── QuizService.java
│   │       │   └── QuizApplication.java
│   │       └── resources/
│   │           ├── application.properties
│   │           └── data.sql
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Leaderboard.js
│   │   │   ├── Leaderboard.css
│   │   │   ├── NicknameEntry.js
│   │   │   ├── NicknameEntry.css
│   │   │   ├── Quiz.js
│   │   │   ├── Quiz.css
│   │   │   ├── Results.js
│   │   │   └── Results.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## Questions

The quiz contains 10 questions about business information systems:

1. Point-of-Sale (POS) Systems
2. Inventory Management Systems
3. Appointment Booking Systems
4. Online Ordering Systems
5. Customer Relationship Management (CRM) Systems
6. Payroll Systems
7. Learning Management Systems (LMS)
8. Customer Support/Helpdesk Systems
9. Accounting Systems
10. Human Resource Management Systems (HRMS)

Each quiz session randomly selects 5 questions from this pool.

## Leaderboard Ranking Logic

The leaderboard ranks users based on:
1. **Primary**: Highest score (5 is best)
2. **Secondary**: Fastest completion time (lower is better)

Example:
- User with 5/5 in 60 seconds ranks higher than 5/5 in 90 seconds
- User with 5/5 ranks higher than 4/5 regardless of time
- User with 4/5 in 30 seconds ranks higher than 4/5 in 60 seconds

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Ensure PostgreSQL is running
- Verify database credentials in `application.properties`
- Check if `quizdb` database exists

**Port 8080 Already in Use:**
- Change the port in `application.properties`:
  ```properties
  server.port=8081
  ```
- Update the frontend API URL in `frontend/src/services/api.js`

### Frontend Issues

**Cannot Connect to Backend:**
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify API_BASE_URL in `frontend/src/services/api.js`

**Port 3000 Already in Use:**
- The React app will prompt you to use another port
- Or manually set port: `PORT=3001 npm start` (Linux/Mac) or set PORT=3001 in environment

## Future Enhancements

- User authentication and persistent user profiles
- Question categories and difficulty levels
- More detailed quiz analytics
- Export leaderboard to CSV
- Admin panel to manage questions
- Quiz history for each user
- Social sharing of results
- Multiple quiz topics

## License

This project is open source and available for educational purposes.

## Contact

For questions or issues, please create an issue in the repository.
