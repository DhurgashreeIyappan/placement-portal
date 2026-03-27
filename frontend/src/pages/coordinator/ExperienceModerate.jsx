import { BookOpen, Calendar, CheckCircle2, Eye, Filter, User, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { moderateExperience } from '../../api/experienceApi';

const STATUS_OPTIONS = ['pending', 'approved', 'rejected', ''];
const STATUS_LABELS = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', '': 'All' };

export default function ExperienceModerate() {
  const [experiences, setExperiences] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const fetchExperiences = () => {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    axios.get('/experiences/moderation', { params })
      .then((res) => setExperiences(res.data.experiences || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExperiences(); }, [filter]);

  const handleModerate = (id, status) => {
    moderateExperience(id, status).then(() => fetchExperiences()).catch(console.error);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Moderate Experiences</h1>
          <p>Review and approve interview experiences submitted by students</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={14} color="var(--text-muted)" />
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: filter === s ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: filter === s ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: filter === s ? 'var(--primary-light)' : 'var(--text-muted)',
                fontWeight: filter === s ? 600 : 400,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>
      ) : experiences.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><BookOpen size={26} color="var(--text-muted)" /></div>
            <div className="empty-state-title">No experiences in this category</div>
            <p className="empty-state-text">Change the filter or wait for students to submit experiences.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {experiences.map((exp) => (
            <div key={exp._id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 200 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 'var(--radius)',
                    background: 'rgba(255,107,157,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <BookOpen size={20} color="#FF6B9D" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                      {exp.companyName || exp.company?.name}
                    </h3>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        <User size={11} />{exp.author?.name}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        <Calendar size={11} />{exp.yearOfVisit}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className={`badge ${exp.status === 'approved' ? 'badge-success' : exp.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                    {exp.status}
                  </span>
                  <Link to={`/experiences/${exp._id}`} className="btn btn-sm"><Eye size={13} />View</Link>
                  {exp.status === 'pending' && (
                    <>
                      <button type="button" className="btn btn-success btn-sm" onClick={() => handleModerate(exp._id, 'approved')}>
                        <CheckCircle2 size={13} />Approve
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleModerate(exp._id, 'rejected')}>
                        <XCircle size={13} />Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
