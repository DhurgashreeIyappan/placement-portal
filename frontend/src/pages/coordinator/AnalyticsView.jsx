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
          style={{ padding: '0.5rem', width: 160, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)' }}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Companies</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{summary?.totalCompanies ?? 0}</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Registrations</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{summary?.totalRegistrations ?? 0}</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Placed Students</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{summary?.placedCount ?? 0}</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Students</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{summary?.totalStudents ?? 0}</p>
            </div>
          </div>
          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Company-wise report</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Click on a company to see detailed report (registrations, rounds, placed).</p>
            {summary?.companies?.length > 0 ? (
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
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No companies in this period.</p>
            )}
          </div>
          <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>Placed students list</h2>
            {placements.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No placements in this period.</p>
            ) : (
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
            )}
          </div>
        </>
      )}
    </>
  );
}
