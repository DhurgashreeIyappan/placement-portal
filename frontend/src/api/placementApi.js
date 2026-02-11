import axios from './axios';

export const getPlacements = (params) => axios.get('/placements', { params });
export const createPlacement = (data) => axios.post('/placements', data);
