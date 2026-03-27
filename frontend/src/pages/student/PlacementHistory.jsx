import { Award, Briefcase, Building2, Calendar, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMyPlacementHistory } from '../../api/analyticsApi';

export default function PlacementHistory() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPlacementHistory()
      .then((res) => setPlacements(res.data.placements || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-state"><div className="spinner" /><span>Loading history...</span></div>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Placement History</h1>
          <p>Your placement records and offers</p>
        </div>
        {placements.length > 0 && (
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--success-bg)',
            border: '1px solid rgba(0,230,118,0.2)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            color: 'var(--success)', fontWeight: 600, fontSize: 'var(--text-sm)'
          }}>
            <Trophy size={16} /> {placements.length} Placement{placements.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {placements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><Award size={26} color="var(--text-muted)" /></div>
            <div className="empty-state-title">No placement records yet</div>
            <p className="empty-state-text">Your placement history will appear here once recorded by the coordinator.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {placements.map((p) => (
            <div key={p._id} className="card" style={{ marginBottom: 0, borderLeft: '3px solid var(--success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius)',
                    background: 'var(--success-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Building2 size={22} color="var(--success)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--text)', marginBottom: 4 }}>
                      {p.company?.name}
                    </h3>
                    <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>AY {p.company?.academicYear || p.academicYear}</span>
                  </div>
                </div>
                <span className="badge badge-success" style={{ fontSize: 'var(--text-sm)' }}>Placed ✓</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                {p.role && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    <Briefcase size={14} color="var(--primary-light)" />
                    <span>{p.role}</span>
                  </div>
                )}
                {p.ctc && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    <Award size={14} color="var(--success)" />
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>₹{p.ctc} LPA</span>
                  </div>
                )}
                {p.placedAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    <Calendar size={14} />
                    <span>{new Date(p.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
