const express = require('express');
const router = express.Router();
const {
  getQuestions,
  submitQuiz,
  getLeaderboard
} = require('../controllers/quizController');

// GET /api/quiz/questions - Get 5 random questions
router.get('/questions', getQuestions);

// POST /api/quiz/submit - Submit quiz answers
router.post('/submit', submitQuiz);

// GET /api/quiz/leaderboard - Get leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
