import axios from './axios';

export const registerForCompany = (companyId) => axios.post('/registrations', { companyId });
export const getMyRegistrations = () => axios.get('/registrations/my');
export const checkEligibility = (companyId) => axios.get(`/registrations/check-eligibility/${companyId}`);
export const getRegistrationsByCompany = (companyId) => axios.get(`/registrations/company/${companyId}`);
export const updateRegistrationStatus = (id, companyId, status) => axios.patch(`/registrations/${id}`, { companyId, status });
