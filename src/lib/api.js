// utils/axiosConfig.js
import axios from 'axios';
import { store } from '../redux/app/store';
import { refreshToken, logoutUser } from '../redux/features/auth';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

const api = axios.create()

// api.defaults.baseURL = 'http://localhost:4000/api';
api.defaults.withCredentials = true;

api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.accessToken;
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await store.dispatch(refreshToken()).unwrap();
                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                store.dispatch(logoutUser());
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;