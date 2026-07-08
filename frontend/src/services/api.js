import axios from 'axios';

// Create a configured instance of Axios
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Intercept all outgoing requests
api.interceptors.request.use(
    (config) => {
        // Retrieve the token saved during the login step
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