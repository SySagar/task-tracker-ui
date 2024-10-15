import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (username: string, password: string) => 
  axios.post(`${API_URL}/token/`, { username, password });

export const register = (username: string, password: string) => 
  axios.post(`${API_URL}/auth/register/`, { username, password });

export const fetchTasks = () => api.get('/tasks/').then(response => response.data);
export const createTask = (task: { title: string, status: string }) => api.post('/tasks/', task);
export const updateTaskStatus = (taskId: number, status: string) => 
  api.post('/tasks/update_status/', { id: taskId, status });
export const deleteTask = (taskId: number) => api.delete(`/tasks/${taskId}/`);