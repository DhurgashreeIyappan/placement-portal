import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies, deleteCompany, publishCompany } from '../../api/companyApi';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState('');

  const fetchCompanies = () => {
    setLoading(true);
    getCompanies(academicYear ? { academicYear } : {})
      .then((res) => setCompanies(res.data.companies))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompanies();
  }, [academicYear]);

  const handlePublish = (id) => {
    publishCompany(id).then(() => fetchCompanies()).catch(console.error);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this company drive?')) {
      deleteCompany(id).then(() => fetchCompanies()).catch(console.error);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Company Drives</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Filter by academic year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            style={{ width: '180px', padding: '0.5rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)' }}
          />
          <Link to="/coordinator/companies/new" className="btn btn-primary">Add Company</Link>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Academic Year</th>
                <th>Eligibility</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.academicYear}</td>
                  <td>
                    {c.eligibility?.minCgpa != null && `CGPA≥${c.eligibility.minCgpa} `}
                    {c.eligibility?.maxBacklog != null && `Backlog≤${c.eligibility.maxBacklog}`}
                    {!c.eligibility?.minCgpa && !c.eligibility?.maxBacklog && '—'}
                  </td>
                  <td>{c.registrationDeadline ? new Date(c.registrationDeadline).toLocaleDateString() : '—'}</td>
                  <td><span className={c.isPublished ? 'badge badge-success' : 'badge badge-warning'}>{c.isPublished ? 'Published' : 'Draft'}</span></td>
                  <td>
                    <Link to={`/coordinator/companies/${c._id}/edit`} className="btn" style={{ marginRight: '0.5rem' }}>Edit</Link>
                    <Link to={`/coordinator/companies/${c._id}/report`} className="btn" style={{ marginRight: '0.5rem' }}>Report</Link>
                    {!c.isPublished && <button type="button" className="btn btn-primary" style={{ marginRight: '0.5rem' }} onClick={() => handlePublish(c._id)}>Publish</button>}
                    <button type="button" className="btn" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {companies.length === 0 && <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>No companies yet. Add one to get started.</p>}
        </div>
      )}
    </>
  );
}
