import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api/analyticsApi';

export default function CoordinatorDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then((res) => setSummary(res.data.summary))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <>
      <div className="page-header">
        <h1>Coordinator Dashboard</h1>
        <Link to="/coordinator/companies/new" className="btn btn-primary">Add Company Drive</Link>
      </div>
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Companies</h3>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{summary?.totalCompanies ?? 0}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Registrations</h3>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{summary?.totalRegistrations ?? 0}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Placed Students</h3>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{summary?.placedCount ?? 0}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Students</h3>
          <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{summary?.totalStudents ?? 0}</p>
        </div>
      </div>
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Quick Links</h2>
        <ul style={{ listStyle: 'none' }}>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/coordinator/companies">Manage Company Drives</Link></li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/coordinator/groups">Student Groups</Link></li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/coordinator/announcements">Post Announcements</Link></li>
          <li style={{ marginBottom: '0.5rem' }}><Link to="/coordinator/calendar">Placement Calendar</Link></li>
          <li><Link to="/coordinator/analytics">Analytics & Reports</Link></li>
        </ul>
      </div>
      {summary?.companies?.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Companies Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Academic Year</th>
                <th>Registrations</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {summary.companies.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.academicYear}</td>
                  <td>{c.registrationCount}</td>
                  <td><span className={c.isPublished ? 'badge badge-success' : 'badge badge-warning'}>{c.isPublished ? 'Published' : 'Draft'}</span></td>
                  <td><Link to={`/coordinator/companies/${c._id}/report`}>Report</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
