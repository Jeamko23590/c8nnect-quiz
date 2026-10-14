import axios from 'axios';

// Use environment variable in production, fallback to localhost in development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/quiz';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getQuestions = async () => {
  const response = await api.get('/questions');
  return response.data;
};

export const submitQuiz = async (submission) => {
  const response = await api.post('/submit', submission);
  return response.data;
};

export const getLeaderboard = async (limit = 10) => {
  const response = await api.get(`/leaderboard?limit=${limit}`);
  return response.data;
};

export default api;
