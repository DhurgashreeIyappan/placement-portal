import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  return (
    <>
      <div className="page-header">
        <h1>Student Dashboard</h1>
      </div>
      <div className="grid-2">
        <Link to="/student/drives" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Company Drives</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>View and register for drives</p>
        </Link>
        <Link to="/student/progress" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Interview Progress</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Track rounds per company</p>
        </Link>
        <Link to="/student/placement-history" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Placement History</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your placement records</p>
        </Link>
        <Link to="/student/announcements" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Announcements</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Group notifications</p>
        </Link>
        <Link to="/experiences" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Interview Experiences</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Browse seniors' experiences</p>
        </Link>
        <Link to="/experiences/submit" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Submit Experience</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Share your interview experience (placed students)</p>
        </Link>
      </div>
    </>
  );
}
