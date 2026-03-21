import axios from 'axios';

// Always use env if available, else fallback
const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : 'http://localhost:6500';

// ✅ ALWAYS append /api (this fixes your 404)
const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true
});

console.log('API Base URL:', api.defaults.baseURL);

// Attach JWT token automatically
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

export default api;