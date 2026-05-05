import axios from 'axios';
import { showErrorToast } from '../helpers/toast';


const baseURL = process.env.REACT_APP_API_URL

const axiosInstance = axios.create({
    baseURL: baseURL,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            // Clear the token from local storage
            localStorage.removeItem('authToken');

            // Redirect to login page
            // If using React Router:
            // useHistory() is a hook and cannot be used here directly
            // You need to handle redirection in your component or use a custom function
            showErrorToast('You are not authorized. Please log in again.')
            window.location.href = '/'; // Redirect using window.location
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
