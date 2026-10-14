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
    
    const limit = parseInt(req.query.limit) || 10;
    
    const pool = getPool();
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
    
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leaderboard',
      message: error.message 
    });
  }
};
