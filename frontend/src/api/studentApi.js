import axios from './axios';

export const getPublishedCompanies = () => axios.get('/student/companies');
export const getMyInterviewProgress = () => axios.get('/student/interview-progress');
