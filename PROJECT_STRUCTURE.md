# Project Structure

```
Online Quiz/
│
├── README.md                          # Main project documentation
├── SETUP_GUIDE.md                     # Quick setup instructions
├── API_DOCUMENTATION.md               # API endpoint documentation
├── DEPLOYMENT.md                      # Production deployment guide
├── PROJECT_STRUCTURE.md               # This file
├── .gitignore                         # Root gitignore
├── start.bat                          # Windows quick start script
└── start.sh                           # Linux/Mac quick start script
│
├── backend/                           # Spring Boot Backend
│   ├── .gitignore                     # Backend gitignore
│   ├── pom.xml                        # Maven dependencies
│   │
│   └── src/
│       └── main/
│           ├── java/com/quiz/app/
│           │   │
│           │   ├── QuizApplication.java              # Main Spring Boot application
│           │   │
│           │   ├── config/                           # Configuration classes
│           │   │   ├── CorsConfig.java              # CORS configuration
│           │   │   └── DataInitializer.java         # Database initialization with questions
│           │   │
│           │   ├── controller/                       # REST Controllers
│           │   │   └── QuizController.java          # Quiz API endpoints
│           │   │
│           │   ├── dto/                              # Data Transfer Objects
│           │   │   ├── AnswerDTO.java               # Single answer data
│           │   │   ├── LeaderboardEntryDTO.java     # Leaderboard entry data
│           │   │   ├── QuestionDTO.java             # Question data (without correct answer)
│           │   │   ├── QuizResultDTO.java           # Quiz submission result
│           │   │   └── QuizSubmissionDTO.java       # Quiz submission data
│           │   │
│           │   ├── model/                            # JPA Entities
│           │   │   ├── Question.java                # Question entity
│           │   │   └── QuizAttempt.java             # Quiz attempt entity
│           │   │
│           │   ├── repository/                       # Data Access Layer
│           │   │   ├── QuestionRepository.java      # Question CRUD + random query
│           │   │   └── QuizAttemptRepository.java   # Quiz attempt CRUD + leaderboard query
│           │   │
│           │   └── service/                          # Business Logic Layer
│           │       └── QuizService.java             # Quiz business logic
│           │
│           └── resources/
│               ├── application.properties            # Default configuration
│               ├── application-dev.properties        # Development configuration
│               ├── application-prod.properties       # Production configuration
│               └── data.sql                          # SQL initialization script (backup)
│
└── frontend/                          # React Frontend
    ├── .gitignore                     # Frontend gitignore
    ├── .env.example                   # Environment variables example
    ├── package.json                   # NPM dependencies
    │
    ├── public/
    │   └── index.html                 # HTML template
    │
    └── src/
        ├── index.js                   # React entry point
        ├── index.css                  # Global styles
        │
        ├── App.js                     # Main application component
        ├── App.css                    # App component styles
        │
        ├── components/                # React Components
        │   ├── NicknameEntry.js       # Nickname input component
        │   ├── NicknameEntry.css      # Nickname entry styles
        │   ├── Quiz.js                # Quiz interface component
        │   ├── Quiz.css               # Quiz styles
        │   ├── Results.js             # Results display component
        │   ├── Results.css            # Results styles
        │   ├── Leaderboard.js         # Leaderboard component
        │   └── Leaderboard.css        # Leaderboard styles
        │
        └── services/
            └── api.js                 # API service (Axios wrapper)
```

## Component Descriptions

### Backend Components

#### Configuration (`config/`)
- **CorsConfig**: Configures Cross-Origin Resource Sharing for frontend access
- **DataInitializer**: Populates database with 10 questions on application startup

#### Controllers (`controller/`)
- **QuizController**: Exposes REST API endpoints for quiz operations

#### DTOs (`dto/`)
- **QuestionDTO**: Question data without correct answer (sent to frontend)
- **AnswerDTO**: User's answer for a single question
- **QuizSubmissionDTO**: Complete quiz submission with nickname, answers, and time
- **QuizResultDTO**: Quiz results with score and message
- **LeaderboardEntryDTO**: Single leaderboard entry with rank

#### Models (`model/`)
- **Question**: Database entity for questions with correct answers
- **QuizAttempt**: Database entity for quiz attempts/submissions

#### Repositories (`repository/`)
- **QuestionRepository**: Data access for questions with random selection query
- **QuizAttemptRepository**: Data access for quiz attempts with leaderboard query

#### Services (`service/`)
- **QuizService**: Business logic for quiz operations (scoring, leaderboard ranking)

### Frontend Components

#### Main App (`App.js`)
- Manages application state and stage transitions
- Stage management: nickname → quiz → results
- Renders appropriate component based on current stage

#### Components

**NicknameEntry** (`components/NicknameEntry.js`)
- User nickname input with validation
- Validates length (2-20 characters)
- Triggers quiz start

**Quiz** (`components/Quiz.js`)
- Fetches 5 random questions from API
- Displays questions one at a time
- Tracks selected answers
- Tracks time taken
- Navigation between questions
- Submits quiz to backend

**Results** (`components/Results.js`)
- Displays quiz score with visual feedback
- Shows time taken
- Performance message based on score
- Color-coded results
- Restart option

**Leaderboard** (`components/Leaderboard.js`)
- Displays top 10 quiz attempts
- Ranked by score (descending) then time (ascending)
- Auto-refreshes every 30 seconds
- Manual refresh button
- Visual indicators for top 3

#### Services

**API Service** (`services/api.js`)
- Axios wrapper for backend communication
- Methods: getQuestions(), submitQuiz(), getLeaderboard()
- Centralized API configuration

## Data Flow

### Quiz Taking Flow
```
1. User enters nickname → NicknameEntry component
2. Start quiz → Quiz component
3. Quiz component → GET /api/quiz/questions → Backend
4. Backend → Random 5 questions → Quiz component
5. User answers questions → Quiz component state
6. Submit quiz → POST /api/quiz/submit → Backend
7. Backend → Calculate score, save attempt → Database
8. Backend → Return result → Results component
9. Results component → Display score
10. Leaderboard → GET /api/quiz/leaderboard → Backend
11. Backend → Query top attempts → Leaderboard component
```

### Database Schema

**questions table**
- id (BIGSERIAL PRIMARY KEY)
- question_text (VARCHAR)
- option_a (VARCHAR)
- option_b (VARCHAR)
- option_c (VARCHAR)
- option_d (VARCHAR)
- correct_answer (VARCHAR)

**quiz_attempts table**
- id (BIGSERIAL PRIMARY KEY)
- nickname (VARCHAR)
- score (INTEGER)
- time_used_seconds (BIGINT)
- attempt_date (TIMESTAMP)

## Technology Dependencies

### Backend
- Spring Boot 3.1.5
  - spring-boot-starter-web
  - spring-boot-starter-data-jpa
- PostgreSQL Driver
- Lombok (code generation)
- Spring Boot DevTools

### Frontend
- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1
- Axios 1.6.0

## File Naming Conventions

### Backend
- **Classes**: PascalCase (e.g., QuizController.java)
- **Packages**: lowercase (e.g., com.quiz.app.controller)
- **Constants**: UPPER_SNAKE_CASE
- **Methods**: camelCase (e.g., getRandomQuestions)

### Frontend
- **Components**: PascalCase (e.g., NicknameEntry.js)
- **Files**: PascalCase for components, lowercase for utilities
- **CSS**: Same name as component (e.g., Quiz.css)
- **Functions**: camelCase (e.g., handleSubmit)

## Port Configuration

- **Backend**: 8080 (configurable in application.properties)
- **Frontend Dev Server**: 3000 (default React)
- **PostgreSQL**: 5432 (default)

## Environment Variables

### Backend
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `SPRING_PROFILES_ACTIVE`: Active profile (dev/prod)

### Frontend
- `REACT_APP_API_BASE_URL`: Backend API URL
- `REACT_APP_LEADERBOARD_REFRESH_INTERVAL`: Refresh interval
- `REACT_APP_MAX_LEADERBOARD_ENTRIES`: Max entries to display
