const { initializeDatabase, getPool } = require('../init-db');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Initialize database on first request
    await initializeDatabase();
    
    const { nickname, answers, timeUsedSeconds } = req.body;
    
    // Validate input
    if (!nickname || !answers || !Array.isArray(answers)) {
      res.status(400).json({ 
        error: 'Invalid request. nickname and answers are required.' 
      });
      return;
    }
    
    const pool = getPool();
    
    // Calculate score
    let score = 0;
    const totalQuestions = answers.length;
    
    for (const answer of answers) {
      const { questionId, selectedAnswer } = answer;
      
      const query = 'SELECT correct_answer FROM question WHERE id = $1';
      const result = await pool.query(query, [questionId]);
      
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
    await pool.query(insertQuery, [nickname, score, timeUsedSeconds]);
    
    // Return result
    const message = `You scored ${score} out of ${totalQuestions}!`;
    res.status(200).json({
      score,
      totalQuestions,
      timeUsedSeconds,
      message
    });
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ 
      error: 'Failed to submit quiz',
      message: error.message 
    });
  }
};
