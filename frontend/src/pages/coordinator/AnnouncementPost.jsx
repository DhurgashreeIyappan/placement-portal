import { useState, useEffect } from 'react';
import { getGroups } from '../../api/groupApi';
import { createAnnouncement, getAnnouncementsByGroup } from '../../api/announcementApi';

export default function AnnouncementPost() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getGroups().then((res) => setGroups(res.data.groups)).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      getAnnouncementsByGroup(selectedGroup)
        .then((res) => setAnnouncements(res.data.announcements))
        .catch(console.error);
    } else {
      setAnnouncements([]);
    }
  }, [selectedGroup]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGroup || !title.trim() || !content.trim()) return;
    setLoading(true);
    setMessage('');
    createAnnouncement(selectedGroup, title.trim(), content.trim())
      .then(() => {
        setTitle('');
        setContent('');
        setMessage('Announcement posted.');
        getAnnouncementsByGroup(selectedGroup).then((res) => setAnnouncements(res.data.announcements));
      })
      .catch((err) => setMessage(err.message || 'Failed to post'))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="page-header">
        <h1>Post Announcements</h1>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group *</label>
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} required>
              <option value="">Select group</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>{g.name} ({g.type})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} required />
          </div>
          {message && <p className={message.includes('posted') ? 'success-msg' : 'error-msg'}>{message}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Posting...' : 'Post Announcement'}</button>
        </form>
      </div>
      {selectedGroup && (
        <div className="card">
          <h3>Recent announcements in this group</h3>
          {announcements.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No announcements yet.</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {announcements.map((a) => (
                <li key={a._id} style={{ borderBottom: '1px solid var(--border)', padding: '0.75rem 0' }}>
                  <strong>{a.title}</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{a.content}</p>
                  <small>{new Date(a.createdAt).toLocaleString()} · {a.createdBy?.name}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
