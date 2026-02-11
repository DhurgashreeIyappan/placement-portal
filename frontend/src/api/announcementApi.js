import axios from './axios';

export const createAnnouncement = (groupId, title, content) => axios.post('/announcements', { groupId, title, content });
export const getAnnouncementsByGroup = (groupId) => axios.get(`/announcements/group/${groupId}`);
export const getMyAnnouncements = () => axios.get('/announcements/my');
export const updateAnnouncement = (id, title, content) => axios.put(`/announcements/${id}`, { title, content });
export const deleteAnnouncement = (id) => axios.delete(`/announcements/${id}`);
