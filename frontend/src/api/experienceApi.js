import axios from './axios';

export const getExperiences = (params) => axios.get('/experiences', { params });
export const getExperienceById = (id) => axios.get(`/experiences/${id}`);
export const getMyExperiences = () => axios.get('/experiences/my/list');
export const submitExperience = (data) => axios.post('/experiences', data);
export const moderateExperience = (id, status) => axios.patch(`/experiences/${id}/moderate`, { status });
