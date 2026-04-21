import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const problemsAPI = {
  getProblems: (filters) => api.get('/problems', { params: filters }),
  getProblem: (id) => api.get(`/problems/${id}`),
  submitSolution: (id, code, language) =>
    api.post(`/problems/${id}/submit`, { code, language }),
  bookmarkProblem: (id) => api.post(`/problems/${id}/bookmark`),
  unbookmarkProblem: (id) => api.delete(`/problems/${id}/bookmark`),
  getCategories: () => api.get('/problems/categories/list'),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getSubmissions: () => api.get('/user/submissions'),
  getBookmarks: () => api.get('/user/bookmarks'),
  getStats: () => api.get('/user/stats'),
};

export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
};

export const contestAPI = {
  getContests: () => api.get('/contests'),
  getContest: (id) => api.get(`/contests/${id}`),
  joinContest: (id) => api.post(`/contests/${id}/join`),
};

export default api;
