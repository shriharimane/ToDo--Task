import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Tasks API
export const tasksAPI = {
  createTask: (taskData) => api.post('/tasks', taskData),
  getTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, taskData) => api.patch(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getAllUsers: () => api.get('/tasks/users'),
};

export default api;
