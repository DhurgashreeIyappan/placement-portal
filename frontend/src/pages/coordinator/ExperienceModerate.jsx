import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { moderateExperience } from '../../api/experienceApi';

export default function ExperienceModerate() {
  const [experiences, setExperiences] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending | approved | rejected | ''
  const [loading, setLoading] = useState(true);

  const fetchExperiences = () => {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    axios.get('/experiences/moderation', { params })
      .then((res) => setExperiences(res.data.experiences || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExperiences();
  }, [filter]);

  const handleModerate = (id, status) => {
    moderateExperience(id, status).then(() => fetchExperiences()).catch(console.error);
  };

  return (
    <>
      <div className="page-header">
        <h1>Moderate Interview Experiences</h1>
        <Link to="/coordinator" className="btn">Back to Dashboard</Link>
      </div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <label>Filter by status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: '0.5rem', padding: '0.35rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)' }}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : experiences.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No experiences in this category.</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Year</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp._id}>
                  <td>{exp.companyName || exp.company?.name}</td>
                  <td>{exp.yearOfVisit}</td>
                  <td>{exp.author?.name}</td>
                  <td><span className={`badge ${exp.status === 'approved' ? 'badge-success' : exp.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>{exp.status}</span></td>
                  <td>
                    <Link to={`/experiences/${exp._id}`} className="btn" style={{ marginRight: '0.5rem' }}>View</Link>
                    {exp.status === 'pending' && (
                      <>
                        <button type="button" className="btn btn-primary" style={{ marginRight: '0.5rem' }} onClick={() => handleModerate(exp._id, 'approved')}>Approve</button>
                        <button type="button" className="btn" onClick={() => handleModerate(exp._id, 'rejected')}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
