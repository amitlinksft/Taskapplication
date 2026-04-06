import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => api.post('/auth/register/', data);
export const loginUser = (data) => api.post('/auth/login/', data);

// Tasks
export const getTasks = (params) => api.get('/tasks/', { params });
export const createTask = (data) => api.post('/tasks/', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}/`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}/`);

// Categories
export const getCategories = () => api.get('/tasks/categories/');
export const createCategory = (data) => api.post('/tasks/categories/', data);
export const deleteCategory = (id) => api.delete(`/tasks/categories/${id}/`);

export default api;
