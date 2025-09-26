import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.defaults.withCredentials = true;

api.interceptors.request.use((config) => {
  try {
    const root = localStorage.getItem('persist:root');
    if (root) {
      const parsedRoot = JSON.parse(root);
      if (parsedRoot?.auth) {
        const authSlice = JSON.parse(parsedRoot.auth);
        const token = authSlice?.token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {}
  
  try {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      
    }
    return Promise.reject(err);
  }
);

export default api;
