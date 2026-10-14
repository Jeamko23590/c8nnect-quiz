import React, { useState } from 'react';
import './NicknameEntry.css';

function NicknameEntry({ onSubmit }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }
    
    if (nickname.trim().length < 2) {
      setError('Nickname must be at least 2 characters');
      return;
    }
    
    if (nickname.trim().length > 20) {
      setError('Nickname must be less than 20 characters');
      return;
    }
    
    onSubmit(nickname.trim());
  };

  return (
    <div className="card nickname-entry">
      <h2>Welcome to the Quiz!</h2>
      <p className="subtitle">Enter your nickname to get started</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your nickname..."
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError('');
          }}
          maxLength={20}
          autoFocus
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Start Quiz</button>
      </form>
    </div>
  );
}

export default NicknameEntry;
