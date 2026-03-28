/**
 * Axios instance with base URL and JWT attachment
 * Global API error handling via interceptors
 */
import axios from 'axios';

const normalizeApiBase = (value) => {
  const raw = (value || '').trim().replace(/\/+$/, '');
  if (!raw) return '/api';

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const cleanPath = parsed.pathname.replace(/\/+$/, '');
      if (!cleanPath || cleanPath === '/') return `${parsed.origin}/api`;
      if (cleanPath.endsWith('/api')) return `${parsed.origin}${cleanPath}`;
      return `${parsed.origin}/api`;
    } catch {
      return '/api';
    }
  }

  return raw.endsWith('/api') ? raw : `${raw}/api`;
};

export const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Centralized error handling: 401 -> clear auth and redirect to login
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message || 'Request failed';
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject({ message, status, data: err.response?.data });
  }
);

export default axiosInstance;
