import axios from './axios';

export const register = (data) => axios.post('/auth/register', data);
const API_URL = import.meta.env.VITE_API_URL || '';

export const login = (data) => axios.post(`${API_URL}/api/auth/login`, data);
export const getMe = () => axios.get('/auth/me');
