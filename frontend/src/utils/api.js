import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
    : 'http://localhost:6500';

const api = axios.create({
    // Ensure that even if VITE_API_URL is just the domain, we append /api
    baseURL: `${BASE_URL}/api`,
});

console.log('🔗 NexBank Internal Link established at:', api.defaults.baseURL);

// Add a request interceptor to include the JWT token in all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
