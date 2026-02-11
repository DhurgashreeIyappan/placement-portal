import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExperiences } from '../../api/experienceApi';
import axios from '../../api/axios';

export default function ExperienceBrowse() {
  const [experiences, setExperiences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyFilter, setCompanyFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/companies/published').then((res) => setCompanies(res.data.companies || [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (companyFilter) params.companyId = companyFilter;
    if (yearFilter) params.year = yearFilter;
    getExperiences(params)
      .then((res) => setExperiences(res.data.experiences || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [companyFilter, yearFilter]);

  return (
    <>
      <div className="page-header">
        <h1>Interview Experiences</h1>
        <Link to="/experiences/submit" className="btn btn-primary">Submit Experience (Placed students)</Link>
      </div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 200 }}>
            <label>Company</label>
            <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
              <option value="">All</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, width: 120 }}>
            <label>Year</label>
            <input value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} placeholder="e.g. 2024" />
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : experiences.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No approved experiences yet.</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Year</th>
                <th>Author</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp._id}>
                  <td>{exp.companyName || exp.company?.name}</td>
                  <td>{exp.yearOfVisit}</td>
                  <td>{exp.author?.name}</td>
                  <td><Link to={`/experiences/${exp._id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
