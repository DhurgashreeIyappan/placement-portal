import axios from './axios';

export const getEvents = (params) => axios.get('/calendar', { params });
export const createEvent = (data) => axios.post('/calendar', data);
export const updateEvent = (id, data) => axios.put(`/calendar/${id}`, data);
export const deleteEvent = (id) => axios.delete(`/calendar/${id}`);
