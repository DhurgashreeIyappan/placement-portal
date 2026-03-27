import { ArrowLeft, Calendar, HelpCircle, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExperienceById } from '../../api/experienceApi';

export default function ExperienceDetail() {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperienceById(id)
      .then((res) => setExperience(res.data.experience))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading experience...</span></div>;
  if (!experience) return (
    <div className="card">
      <div className="empty-state">
        <div className="empty-state-title">Experience not found</div>
        <Link to="/experiences" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>← Back to list</Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{experience.companyName || experience.company?.name}</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>Interview Experience · {experience.yearOfVisit}</p>
        </div>
        <Link to="/experiences" className="btn">
          <ArrowLeft size={16} /> Back to list
        </Link>
      </div>

      {/* Author info */}
      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 'var(--text-lg)', color: 'white', flexShrink: 0
          }}>
            {experience.author?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{experience.author?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
              <Calendar size={11} /> Visited {experience.yearOfVisit}
            </div>
          </div>
          <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Placed</span>
        </div>
      </div>

      {/* Preparation Tips */}
      {experience.preparationTips && (
        <div className="card" style={{ marginBottom: 'var(--space-5)', borderLeft: '3px solid var(--accent-2)' }}>
          <h2 className="section-title" style={{ color: 'var(--accent-2)' }}>
            <Lightbulb size={18} color="var(--accent-2)" style={{ marginRight: 'var(--space-2)' }} />
            Preparation Tips
          </h2>
          <p style={{ color: 'var(--text-light)', lineHeight: 1.8, fontSize: 'var(--text-sm)' }}>
            {experience.preparationTips}
          </p>
        </div>
      )}

      {/* Rounds */}
      {experience.roundDetails?.length > 0 && (
        <div>
          <h2 className="section-title">Round-wise Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {experience.roundDetails.map((r, i) => (
              <div key={i} className="card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 'var(--text-sm)', color: 'white', flexShrink: 0
                  }}>
                    {i + 1}
                  </div>
                  <h3 style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {r.roundName || `Round ${i + 1}`}
                  </h3>
                </div>
                {r.experience && (
                  <p style={{ color: 'var(--text-light)', lineHeight: 1.8, fontSize: 'var(--text-sm)', marginBottom: r.questions?.length ? 'var(--space-4)' : 0 }}>
                    {r.experience}
                  </p>
                )}
                {r.questions?.length > 0 && (
                  <div style={{ margin: 'var(--space-3) 0', padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <HelpCircle size={12} /> Questions Asked
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {r.questions.map((q, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-light)' }}>
                          <span style={{ color: 'var(--primary-light)', marginTop: 2, flexShrink: 0 }}>→</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {r.tips && (
                  <div style={{ display: 'flex', gap: 8, padding: 'var(--space-3)', background: 'rgba(255,209,102,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,209,102,0.15)', marginTop: 'var(--space-3)' }}>
                    <Lightbulb size={15} color="var(--accent-2)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{r.tips}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
