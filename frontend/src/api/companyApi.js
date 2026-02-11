import axios from './axios';

export const getCompanies = (params) => axios.get('/companies', { params });
export const getCompanyById = (id) => axios.get(`/companies/${id}`);
export const createCompany = (data) => axios.post('/companies', data);
export const updateCompany = (id, data) => axios.put(`/companies/${id}`, data);
export const publishCompany = (id) => axios.patch(`/companies/${id}/publish`);
export const deleteCompany = (id) => axios.delete(`/companies/${id}`);
