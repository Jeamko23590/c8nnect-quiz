const pool = require('../db/config');

// Get 5 random questions (without correct answers)
const getQuestions = async (req, res, next) => {
  try {
    const query = `
      SELECT id, question_text, option_a, option_b, option_c, option_d
      FROM question
      ORDER BY RANDOM()
      LIMIT 5
    `;
    
    const result = await pool.query(query);
    
    // Format response to match frontend expectations
    const questions = result.rows.map(row => ({
      id: row.id,
      questionText: row.question_text,
      optionA: row.option_a,
      optionB: row.option_b,
      optionC: row.option_c,
      optionD: row.option_d
    }));
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    next(error);
  }
};

// Submit quiz and calculate score
const submitQuiz = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    const { nickname, answers, timeUsedSeconds } = req.body;
    
    // Validate input
    if (!nickname || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        error: 'Invalid request. nickname and answers are required.' 
      });
    }
    
    // Calculate score
    let score = 0;
    const totalQuestions = answers.length;
    
    for (const answer of answers) {
      const { questionId, selectedAnswer } = answer;
      
      const query = 'SELECT correct_answer FROM question WHERE id = $1';
      const result = await client.query(query, [questionId]);
      
      if (result.rows.length > 0) {
        const correctAnswer = result.rows[0].correct_answer;
        if (selectedAnswer.toUpperCase() === correctAnswer.toUpperCase()) {
          score++;
        }
      }
    }
    
    // Save quiz attempt
    const insertQuery = `
      INSERT INTO quiz_attempt (nickname, score, time_used_seconds)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    await client.query(insertQuery, [nickname, score, timeUsedSeconds]);
    
    // Return result
    const message = `You scored ${score} out of ${totalQuestions}!`;
    res.json({
      score,
      totalQuestions,
      timeUsedSeconds,
      message
    });
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
    next(error);
  } finally {
    client.release();
  }
};

// Get leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const query = `
      SELECT 
        id,
        nickname,
        score,
        time_used_seconds,
        attempt_date
      FROM quiz_attempt
      ORDER BY score DESC, time_used_seconds ASC, attempt_date ASC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    
    // Add rank to each entry
    const leaderboard = result.rows.map((row, index) => ({
      id: row.id,
      nickname: row.nickname,
      score: row.score,
      timeUsedSeconds: row.time_used_seconds,
      attemptDate: row.attempt_date,
      rank: index + 1
    }));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    next(error);
  }
};

module.exports = {
  getQuestions,
  submitQuiz,
  getLeaderboard
};
