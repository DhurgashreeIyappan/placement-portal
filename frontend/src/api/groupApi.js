import axios from './axios';

export const getGroups = (params) => axios.get('/groups', { params });
export const getGroupById = (id) => axios.get(`/groups/${id}`);
export const createGroup = (data) => axios.post('/groups', data);
export const updateGroup = (id, data) => axios.put(`/groups/${id}`, data);
export const addMembersToGroup = (id, memberIds) => axios.post(`/groups/${id}/members`, { memberIds });
export const removeMemberFromGroup = (id, memberId) => axios.delete(`/groups/${id}/members/${memberId}`);
export const deleteGroup = (id) => axios.delete(`/groups/${id}`);
