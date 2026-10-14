const { initializeDatabase, getPool } = require('../init-db');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Initialize database on first request
    await initializeDatabase();
    
    const pool = getPool();
    const query = `
      SELECT id, question_text, option_a, option_b, option_c, option_d
      FROM question
      ORDER BY RANDOM()
      LIMIT 5
    `;
    
    const result = await pool.query(query);
    
    // Format response
    const questions = result.rows.map(row => ({
      id: row.id,
      questionText: row.question_text,
      optionA: row.option_a,
      optionB: row.option_b,
      optionC: row.option_c,
      optionD: row.option_d
    }));
    
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch questions',
      message: error.message 
    });
  }
};
