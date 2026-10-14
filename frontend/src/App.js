import React, { useState } from 'react';
import './App.css';
import NicknameEntry from './components/NicknameEntry';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';

function App() {
  const [stage, setStage] = useState('nickname'); // nickname, quiz, results
  const [nickname, setNickname] = useState('');
  const [quizResult, setQuizResult] = useState(null);

  const handleNicknameSubmit = (name) => {
    setNickname(name);
    setStage('quiz');
  };

  const handleQuizComplete = (result) => {
    setQuizResult(result);
    setStage('results');
  };

  const handleRestart = () => {
    setStage('nickname');
    setNickname('');
    setQuizResult(null);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🎯 Quiz Challenge</h1>
        
        {stage === 'nickname' && (
          <NicknameEntry onSubmit={handleNicknameSubmit} />
        )}
        
        {stage === 'quiz' && (
          <Quiz nickname={nickname} onComplete={handleQuizComplete} />
        )}
        
        {stage === 'results' && (
          <Results result={quizResult} onRestart={handleRestart} />
        )}
        
        <Leaderboard />
      </div>
    </div>
  );
}

export default App;
