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

  if (loading) return <div className="loading-state">Loading dashboard...</div>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <>
      <div className="page-header">
        <h1>Coordinator Dashboard</h1>
        <Link to="/coordinator/companies/new" className="btn btn-primary">Add Company Drive</Link>
      </div>
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-label">Total Companies</div>
          <div className="stat-value">{summary?.totalCompanies ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Registrations</div>
          <div className="stat-value">{summary?.totalRegistrations ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Placed Students</div>
          <div className="stat-value">{summary?.placedCount ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{summary?.totalStudents ?? 0}</div>
        </div>
      </div>
      <div className="card">
        <h2 className="section-title">Quick Links</h2>
        <ul className="quick-links">
          <li><Link to="/coordinator/companies">Manage Company Drives</Link></li>
          <li><Link to="/coordinator/groups">Student Groups</Link></li>
          <li><Link to="/coordinator/announcements">Post Announcements</Link></li>
          <li><Link to="/coordinator/calendar">Placement Calendar</Link></li>
          <li><Link to="/coordinator/analytics">Analytics & Reports</Link></li>
        </ul>
      </div>
      {summary?.companies?.length > 0 ? (
        <div className="card">
          <h2 className="section-title">Companies Overview</h2>
          <div className="table-wrapper">
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
        </div>
      ) : (
        <div className="card">
          <h2 className="section-title">Companies Overview</h2>
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">—</div>
            <div className="empty-state-title">No companies yet</div>
            <p className="empty-state-text">Add your first company drive to get started.</p>
            <Link to="/coordinator/companies/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Company Drive</Link>
          </div>
        </div>
      )}
    </>
  );
}
