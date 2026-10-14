import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { getLeaderboard } from '../services/api';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard(10);
      setLeaderboard(data);
      setLoading(false);
      setError('');
    } catch (err) {
      setError('Failed to load leaderboard');
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="leaderboard">
      <div className="card leaderboard-card">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button onClick={loadLeaderboard} className="refresh-button" title="Refresh">
            🔄
          </button>
        </div>

        {loading && leaderboard.length === 0 ? (
          <p className="loading">Loading leaderboard...</p>
        ) : error && leaderboard.length === 0 ? (
          <div>
            <p className="error">{error}</p>
            <button onClick={loadLeaderboard}>Retry</button>
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="no-data">No entries yet. Be the first to take the quiz!</p>
        ) : (
          <div className="leaderboard-table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Time</th>
                  <th className="date-column">Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`leaderboard-row ${index < 3 ? 'top-three' : ''}`}
                  >
                    <td className="rank-cell">
                      <span className="rank">{getRankEmoji(entry.rank)}</span>
                    </td>
                    <td className="name-cell">
                      <span className="nickname">{entry.nickname}</span>
                    </td>
                    <td className="score-cell">
                      <span className="score">{entry.score}/5</span>
                    </td>
                    <td className="time-cell">
                      <span className="time">⏱️ {formatTime(entry.timeUsedSeconds)}</span>
                    </td>
                    <td className="date-cell date-column">
                      <span className="date">{formatDate(entry.attemptDate)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="leaderboard-note">
          <p>🎯 Ranked by highest score, then fastest time</p>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
