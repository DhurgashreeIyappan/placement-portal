import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects routes: requires login. Optionally restrict by role.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.role] - 'coordinator' | 'student'
 */
export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'coordinator' ? '/coordinator' : '/student'} replace />;
  }

  return children;
}
