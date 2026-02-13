import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getPlacedStudents } from '../../api/analyticsApi';

export default function AnalyticsView() {
  const [summary, setSummary] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDashboardStats(academicYear ? { academicYear } : {}).then((res) => setSummary(res.data.summary)),
      getPlacedStudents(academicYear ? { academicYear } : {}).then((res) => setPlacements(res.data.placements || [])),
    ]).catch(console.error).finally(() => setLoading(false));
  }, [academicYear]);

  return (
    <>
      <div className="page-header">
        <h1>Analytics & Reports</h1>
        <input
          type="text"
          placeholder="Filter by academic year"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className="filter-input"
        />
      </div>
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : (
        <>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
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
            <h2 className="section-title">Company-wise report</h2>
            <p className="section-subtitle">Click on a company to see detailed report (registrations, rounds, placed).</p>
            {summary?.companies?.length > 0 ? (
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
                      <td><Link to={`/coordinator/companies/${c._id}/report`}>View Report</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon" aria-hidden="true">—</div>
                <div className="empty-state-title">No companies in this period</div>
                <p className="empty-state-text">Try a different academic year filter or add company drives.</p>
              </div>
            )}
          </div>
          <div className="card">
            <h2 className="section-title">Placed students list</h2>
            {placements.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon" aria-hidden="true">—</div>
                <div className="empty-state-title">No placements in this period</div>
                <p className="empty-state-text">Placement records will appear here once students are marked as placed.</p>
              </div>
            ) : (
              <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Company</th>
                    <th>CTC</th>
                    <th>Placed At</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((p) => (
                    <tr key={p._id}>
                      <td>{p.student?.name}</td>
                      <td>{p.student?.rollNo || '—'}</td>
                      <td>{p.company?.name}</td>
                      <td>{p.ctc ? `₹${p.ctc}` : '—'}</td>
                      <td>{new Date(p.placedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
