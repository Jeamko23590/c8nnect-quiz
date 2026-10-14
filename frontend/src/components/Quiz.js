import React, { useState, useEffect } from 'react';
import './Quiz.css';
import { getQuestions, submitQuiz } from '../services/api';

function Quiz({ nickname, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await getQuestions();
      setQuestions(data);
      setStartTime(Date.now());
      setLoading(false);
    } catch (err) {
      setError('Failed to load questions. Please make sure the backend is running.');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestion].id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    const timeUsedSeconds = Math.floor((Date.now() - startTime) / 1000);

    const answers = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[q.id],
    }));

    const submission = {
      nickname: nickname,
      answers: answers,
      timeUsedSeconds: timeUsedSeconds,
    };

    try {
      const result = await submitQuiz(submission);
      onComplete(result);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p className="loading">Loading questions...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="card">
        <p className="error">{error}</p>
        <button onClick={loadQuestions}>Retry</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="card">
        <p className="error">No questions available.</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="quiz">
      <div className="card quiz-card">
        <div className="quiz-header">
          <div className="player-info">
            <span className="player-name">👤 {nickname}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="question-counter">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="question-container">
          <h3 className="question-text">{question.questionText}</h3>

          <div className="options">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = question[`option${option}`];
              const isSelected = selectedAnswers[question.id] === option;

              return (
                <button
                  key={option}
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <span className="option-label">{option}</span>
                  <span className="option-text">{optionText}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="quiz-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="nav-button"
          >
            ← Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button onClick={handleNext} className="nav-button">
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={!allAnswered}
            >
              Submit Quiz
            </button>
          )}
        </div>

        <div className="answer-status">
          {Object.keys(selectedAnswers).length} / {questions.length} questions answered
        </div>
      </div>
    </div>
  );
}

export default Quiz;
