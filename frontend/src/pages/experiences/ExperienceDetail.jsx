import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  if (loading) return <p>Loading...</p>;
  if (!experience) return <p>Experience not found.</p>;

  return (
    <>
      <div className="page-header">
        <h1>{experience.companyName || experience.company?.name} — {experience.yearOfVisit}</h1>
        <Link to="/experiences" className="btn">Back to list</Link>
      </div>
      <div className="card">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>By {experience.author?.name}</p>
        {experience.preparationTips && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h3>Preparation tips</h3>
            <p>{experience.preparationTips}</p>
          </section>
        )}
        {experience.roundDetails?.length > 0 && (
          <section>
            <h3>Round-wise experience</h3>
            {experience.roundDetails.map((r, i) => (
              <div key={i} style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: 6 }}>
                <strong>{r.roundName || `Round ${r.roundIndex + 1}`}</strong>
                {r.experience && <p style={{ marginTop: '0.5rem' }}>{r.experience}</p>}
                {r.questions?.length > 0 && (
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                    {r.questions.map((q, j) => <li key={j}>{q}</li>)}
                  </ul>
                )}
                {r.tips && <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Tips: {r.tips}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
