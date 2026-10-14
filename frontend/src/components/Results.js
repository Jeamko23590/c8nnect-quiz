import React from 'react';
import './Results.css';

function Results({ result, onRestart }) {
  const percentage = (result.score / result.totalQuestions) * 100;
  const minutes = Math.floor(result.timeUsedSeconds / 60);
  const seconds = result.timeUsedSeconds % 60;

  const getPerformanceMessage = () => {
    if (percentage === 100) return '🎉 Perfect Score!';
    if (percentage >= 80) return '🌟 Excellent!';
    if (percentage >= 60) return '👍 Good Job!';
    if (percentage >= 40) return '💪 Keep Practicing!';
    return '📚 Study More!';
  };

  const getScoreColor = () => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="results">
      <div className="card results-card">
        <div className="results-header">
          <h2>Quiz Complete! 🎯</h2>
          <p className="performance-message">{getPerformanceMessage()}</p>
        </div>

        <div className="score-display">
          <div className="score-circle" style={{ borderColor: getScoreColor() }}>
            <div className="score-number" style={{ color: getScoreColor() }}>
              {result.score}/{result.totalQuestions}
            </div>
            <div className="score-percentage">{percentage.toFixed(0)}%</div>
          </div>
        </div>

        <div className="results-details">
          <div className="result-item">
            <span className="result-label">⏱️ Time Taken:</span>
            <span className="result-value">
              {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">✅ Correct Answers:</span>
            <span className="result-value">{result.score}</span>
          </div>
          <div className="result-item">
            <span className="result-label">❌ Wrong Answers:</span>
            <span className="result-value">{result.totalQuestions - result.score}</span>
          </div>
        </div>

        <div className="results-message">
          <p>{result.message}</p>
          <p className="leaderboard-hint">Check the leaderboard below to see your ranking!</p>
        </div>

        <button onClick={onRestart} className="restart-button">
          Take Quiz Again
        </button>
      </div>
    </div>
  );
}

export default Results;
