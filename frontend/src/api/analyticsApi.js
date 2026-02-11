import axios from './axios';

export const getDashboardStats = (params) => axios.get('/analytics/dashboard', { params });
export const getCompanyWiseReport = (companyId) => axios.get(`/analytics/company/${companyId}`);
export const getPlacedStudents = (params) => axios.get('/analytics/placed-students', { params });
export const getMyPlacementHistory = () => axios.get('/analytics/my-placement-history');
