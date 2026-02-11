import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && <Link to={user.role === 'coordinator' ? '/coordinator' : '/student'}>Dashboard</Link>}
          {user?.role === 'coordinator' && (
            <>
              <Link to="/coordinator/companies">Companies</Link>
              <Link to="/coordinator/groups">Groups</Link>
              <Link to="/coordinator/calendar">Calendar</Link>
              <Link to="/coordinator/analytics">Analytics</Link>
              <Link to="/coordinator/experiences">Moderate Experiences</Link>
            </>
          )}
          {user?.role === 'student' && (
            <>
              <Link to="/student/drives">Drives</Link>
              <Link to="/student/progress">Progress</Link>
              <Link to="/student/placement-history">Placement History</Link>
              <Link to="/student/announcements">Announcements</Link>
            </>
          )}
          <Link to="/experiences">Interview Experiences</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <span className="user-role">{user.name} ({user.role})</span>
              <button type="button" className="btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
        {children}
      </main>
    </>
  );
}
