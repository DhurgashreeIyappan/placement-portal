import { AlertCircle, Bell, Calendar, CheckCircle2, MessageSquare, Send, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createAnnouncement, getAnnouncementsByGroup } from '../../api/announcementApi';
import { getGroups } from '../../api/groupApi';

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
        setMessage('Announcement posted successfully!');
        getAnnouncementsByGroup(selectedGroup).then((res) => setAnnouncements(res.data.announcements));
      })
      .catch((err) => setMessage(err.message || 'Failed to post'))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Post Announcement</h1>
          <p>Notify students in specific groups</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', alignItems: 'start' }}>
        {/* Compose form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h2 className="section-title">Compose</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={13} />Target Group *</span></label>
              <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} required>
                <option value="">Select a group...</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>{g.name} ({g.type})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={13} />Title *</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter announcement title"
              />
            </div>
            <div className="form-group">
              <label><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MessageSquare size={13} />Content *</span></label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
                placeholder="Write your announcement..."
              />
            </div>
            {message && (
              <p className={message.includes('success') ? 'success-msg' : 'error-msg'} style={{ marginBottom: 'var(--space-4)' }}>
                {message.includes('success') ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {message}
              </p>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Posting...</>
              ) : (
                <><Send size={15} />Post Announcement</>
              )}
            </button>
          </form>
        </div>

        {/* Recent announcements */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h2 className="section-title">Recent in Group</h2>
          {!selectedGroup ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: 'var(--text-muted)' }}>
              <Bell size={32} style={{ opacity: 0.3, marginBottom: 'var(--space-3)' }} />
              <p className="text-muted">Select a group to see its announcements</p>
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-muted">No announcements in this group yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {announcements.map((a) => (
                <div key={a._id} style={{
                  padding: 'var(--space-4)',
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontSize: 'var(--text-sm)' }}>{a.title}</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', lineHeight: 1.6 }}>{a.content}</p>
                  <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-dim)' }}>
                    <Calendar size={10} />
                    {new Date(a.createdAt).toLocaleDateString()} · {a.createdBy?.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
