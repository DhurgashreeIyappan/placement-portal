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
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-input" style={{ marginLeft: '0.5rem' }}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : experiences.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">—</div>
            <div className="empty-state-title">No experiences in this category</div>
            <p className="empty-state-text">Change the filter or wait for students to submit experiences.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
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
        </div>
      )}
    </>
  );
}
