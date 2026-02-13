import { Link, NavLink, useNavigate } from 'react-router-dom';
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
        <div className="navbar-nav">
          {user && (
            <NavLink to={user.role === 'coordinator' ? '/coordinator' : '/student'} end>
              Dashboard
            </NavLink>
          )}
          {user?.role === 'coordinator' && (
            <>
              <NavLink to="/coordinator/companies">Companies</NavLink>
              <NavLink to="/coordinator/groups">Groups</NavLink>
              <NavLink to="/coordinator/calendar">Calendar</NavLink>
              <NavLink to="/coordinator/analytics">Analytics</NavLink>
              <NavLink to="/coordinator/experiences">Moderate Experiences</NavLink>
            </>
          )}
          {user?.role === 'student' && (
            <>
              <NavLink to="/student/drives">Drives</NavLink>
              <NavLink to="/student/progress">Progress</NavLink>
              <NavLink to="/student/placement-history">Placement History</NavLink>
              <NavLink to="/student/announcements">Announcements</NavLink>
            </>
          )}
          <NavLink to="/experiences">Interview Experiences</NavLink>
        </div>
        <div className="navbar-nav">
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
      <main className="page-container">
        {children}
      </main>
    </>
  );
}
