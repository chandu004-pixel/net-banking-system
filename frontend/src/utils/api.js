import axios from 'axios';

// Robust API URL construction
const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:6500';
    
    // Remove trailing slash
    url = url.replace(/\/$/, '');
    
    // Ensure it ends with /api if the backend expects it
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }
    
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true
});

console.log('Final API Base URL:', api.defaults.baseURL);

// Attach JWT token automaticallye
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