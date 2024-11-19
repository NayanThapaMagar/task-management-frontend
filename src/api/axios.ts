import axios from 'axios';
import { initializeSocket } from '../socktes/socket';

// Set environment-specific base URL
const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`

// Create an axios instance with a base URL for authentication APIs.
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach token to every request (if available)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach JWT token in Authorization header
            initializeSocket(token);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle responses and errors globally
axiosInstance.interceptors.response.use(
    (response) => response, // Pass valid responses to the next step
    (error) => {
        if (error.response) {
            // Handle specific status codes globally
            const { status } = error.response;
            if (status === 401) {
                console.error('Unauthorized - Redirecting to login');
                // Optional: Redirect to login page, clear token, etc.
                localStorage.removeItem('token'); // Clear invalid token
                window.location.href = '/login';  // Redirect user to login page
            } else if (status === 403) {
                console.error('Forbidden - Insufficient permissions');
                // Optional: Handle insufficient permissions, show alert, etc.
                alert('You do not have permission to perform this action');
            } else {
                // Handle other status codes as needed
                // console.error('Error:', error.response.data.message || 'An error occurred');
            }
        }
        return Promise.reject(error); // Reject the error so that specific components can also handle it
    }
);

export default axiosInstance;
