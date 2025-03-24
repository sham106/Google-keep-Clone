import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
  
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
};

// Notes services
export const noteService = {
  getAllNotes: async (archived = false) => {
    const response = await api.get(`/notes?archived=${archived}`);
    return response.data;
  },
  
  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },
  
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },
  
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },
  
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
  
  toggleArchive: async (id) => {
    const response = await api.patch(`/notes/${id}/archive`);
    return response.data;
  },
  
  togglePin: async (id) => {
    const response = await api.patch(`/notes/${id}/pin`);
    return response.data;
  },
  toggleTrash: async (id) => {
    try {
      const response = await api.patch(`/notes/${id}/trash`);
      return response.data;
    } catch (error) {
      console.error('Error toggling trash status:', error);
      throw error;
    }
  },
  
  emptyTrash: async () => {
    try {
      const response = await api.delete('/notes/empty-trash');
      return response.data;
    } catch (error) {
      console.error('Error emptying trash:', error);
      throw error;
    }
  },
  
  restoreFromTrash: async (id) => {
    // This uses toggleTrash as the backend endpoint is the same
    try {
      const response = await api.patch(`/api/notes/${id}/trash`);
      return response.data;
    } catch (error) {
      console.error('Error restoring note from trash:', error);
      throw error;
    }
  },
};

export default { authService, noteService };