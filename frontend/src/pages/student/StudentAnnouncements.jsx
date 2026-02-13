import { useState, useEffect } from 'react';
import { getMyAnnouncements } from '../../api/announcementApi';

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAnnouncements()
      .then((res) => setAnnouncements(res.data.announcements || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <>
      <div className="page-header">
        <h1>Notifications & Announcements</h1>
      </div>
      {announcements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">—</div>
            <div className="empty-state-title">No announcements yet</div>
            <p className="empty-state-text">Announcements from your groups will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <ul className="announcement-list">
            {announcements.map((a) => (
              <li key={a._id} className="announcement-item">
                <strong>{a.title}</strong>
                <span className="badge badge-info">{a.group?.name}</span>
                <p className="text-muted">{a.content}</p>
                <small>{new Date(a.createdAt).toLocaleString()} · {a.createdBy?.name}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
