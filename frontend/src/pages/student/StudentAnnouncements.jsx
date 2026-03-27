import { Bell, Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  if (loading) return (
    <div className="loading-state"><div className="spinner" /><span>Loading announcements...</span></div>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Announcements</h1>
          <p>Notifications from your placement groups</p>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><Bell size={26} color="var(--text-muted)" /></div>
            <div className="empty-state-title">No announcements yet</div>
            <p className="empty-state-text">Announcements from your groups will appear here.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {announcements.map((a) => (
            <div key={a._id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius)',
                    background: 'rgba(108,99,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Bell size={18} color="var(--primary-light)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{a.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {a.group?.name && (
                        <span className="badge badge-purple" style={{ fontSize: 'var(--text-xs)' }}>
                          <Users size={10} /> {a.group.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{a.content}</p>
              {a.createdBy?.name && (
                <p className="text-muted" style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                  Posted by {a.createdBy.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
