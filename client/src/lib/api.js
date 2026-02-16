// utils/axiosConfig.js
import axios from 'axios';
import { store } from '../redux/app/store';
import { refreshToken, logoutForceUser } from '../redux/features/auth';

let isRefreshing = false;
let failedQueue = [];
const MAX_RETRY = 3;

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

const api = axios.create()

api.defaults.baseURL = `${process.env.NODE_ENV === "development" ? process.env.REACT_APP_SERVER_URL : process.env.REACT_APP_SERVER_URL_DEPLOY}`;
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

        if (error.response?.status === 401) {

            originalRequest._retryCount = originalRequest._retryCount || 0;
            if (originalRequest._retryCount >= MAX_RETRY) {
                store.dispatch(logoutForceUser());
                return Promise.reject(error);
            }

            if (!originalRequest._retry) {
                originalRequest._retryCount += 1;

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

                    originalRequest._retryCount = 0;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    store.dispatch(logoutForceUser());
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;