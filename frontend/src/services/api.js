import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://moengage-assignment-2qql.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (username, password) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get('/auth/verify');
  return response.data;
};

// Query APIs
export const executeQuery = async (query) => {
  const response = await api.post('/query/execute', { query });
  return response.data;
};

export const getQueryHistory = async () => {
  const response = await api.get('/query/history');
  return response.data;
};

// Tables APIs
export const getTables = async () => {
  const response = await api.get('/tables/');
  return response.data;
};

export const getTableInfo = async (tableName) => {
  const response = await api.get(`/tables/${tableName}`);
  return response.data;
};

export default api;
