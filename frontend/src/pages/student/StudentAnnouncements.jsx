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

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="page-header">
        <h1>Notifications & Announcements</h1>
      </div>
      {announcements.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No announcements from your groups yet.</p>
      ) : (
        <div className="card">
          <ul style={{ listStyle: 'none' }}>
            {announcements.map((a) => (
              <li key={a._id} style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <strong>{a.title}</strong>
                <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>{a.group?.name}</span>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{a.content}</p>
                <small>{new Date(a.createdAt).toLocaleString()} · {a.createdBy?.name}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
