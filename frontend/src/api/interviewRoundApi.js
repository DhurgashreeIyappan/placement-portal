import axios from './axios';

export const getRoundsByCompany = (companyId) => axios.get(`/interview-rounds/company/${companyId}`);
export const createRound = (data) => axios.post('/interview-rounds', data);
export const updateRoundResult = (id, studentId, status, remarks) => axios.patch(`/interview-rounds/${id}/result`, { studentId, status, remarks });
export const addResultsBulk = (id, results) => axios.patch(`/interview-rounds/${id}/results-bulk`, { results });
export const deleteRound = (id) => axios.delete(`/interview-rounds/${id}`);
