import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://blood-and-organ-donar-matching-system.onrender.com');

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

let csrfToken = null;

export const fetchCsrfToken = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/csrf-token`, {
      withCredentials: true,
      timeout: 5000,
    });
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

api.interceptors.request.use((config) => {
  const unsafeMethods = ['post', 'put', 'patch', 'delete'];
  if (config.method && unsafeMethods.includes(config.method.toLowerCase()) && csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && error.response?.data?.code === 'invalid_csrf_token') {
      if (!originalRequest._csrfRetry) {
        originalRequest._csrfRetry = true;
        await fetchCsrfToken();
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401 && !originalRequest._authRetry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._authRetry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_URL}/api/auth/refresh`, null, { withCredentials: true });
        await fetchCsrfToken();
        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (!['/login', '/signup'].includes(window.location.pathname)) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
