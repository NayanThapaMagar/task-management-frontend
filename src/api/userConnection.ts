import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/connections`;

const userConnectionAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

userConnectionAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

userConnectionAxios.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                console.error('Unauthorized - Redirecting to login');
                localStorage.removeItem('token'); 
                window.location.href = '/login'; 
            } else if (status === 403) {
                console.error('Forbidden - Insufficient permissions');
                alert('You do not have permission to perform this action');
            } else {
                console.error('Error:', error.response.data.message || 'An error occurred');
            }
        }
        return Promise.reject(error); 
    }
);

export default userConnectionAxios;
