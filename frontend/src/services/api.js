import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ai-powered-commerce-app.onrender.com/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');

        // If a token exists, attach it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;