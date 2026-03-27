import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Moon,
  PenLine,
  ShieldCheck,
  Sun,
  TrendingUp,
  Users
} from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function SidebarLink({ to, icon: Icon, children, end }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
      <Icon size={18} />
      <span>{children}</span>
    </NavLink>
  );
}

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="app-layout">
      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="sidebar-logo-icon">
              <GraduationCap color="white" size={20} />
            </div>
            <div className="sidebar-logo-text">
              PlacePort
              <span>Placement Portal</span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-sm"
            style={{ padding: 6, background: 'var(--surface-hover)', border: '1px solid var(--border)' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={14} color="var(--text-muted)" /> : <Moon size={14} color="var(--text-muted)" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          {user && (
            <SidebarLink to={user.role === 'coordinator' ? '/coordinator' : '/student'} icon={LayoutDashboard} end>
              Dashboard
            </SidebarLink>
          )}

          {user?.role === 'coordinator' && (
            <>
              <div className="sidebar-section-label">Management</div>
              <SidebarLink to="/coordinator/companies" icon={Building2}>Companies</SidebarLink>
              <SidebarLink to="/coordinator/groups" icon={Users}>Groups</SidebarLink>
              <SidebarLink to="/coordinator/announcements" icon={Bell}>Announcements</SidebarLink>
              <div className="sidebar-section-label">Insights</div>
              <SidebarLink to="/coordinator/calendar" icon={CalendarDays}>Calendar</SidebarLink>
              <SidebarLink to="/coordinator/analytics" icon={BarChart3}>Analytics</SidebarLink>
              <SidebarLink to="/coordinator/experiences" icon={ShieldCheck}>Moderate Experiences</SidebarLink>
            </>
          )}

          {user?.role === 'student' && (
            <>
              <div className="sidebar-section-label">Placement</div>
              <SidebarLink to="/student/drives" icon={Building2}>Company Drives</SidebarLink>
              <SidebarLink to="/student/progress" icon={TrendingUp}>My Progress</SidebarLink>
              <SidebarLink to="/student/placement-history" icon={History}>Placement History</SidebarLink>
              <SidebarLink to="/student/announcements" icon={Bell}>Announcements</SidebarLink>
            </>
          )}

          <div className="sidebar-section-label">Community</div>
          <SidebarLink to="/experiences" icon={BookOpen}>Interview Experiences</SidebarLink>
          {user?.role === 'student' && (
            <SidebarLink to="/experiences/submit" icon={PenLine}>Submit Experience</SidebarLink>
          )}
        </nav>

        {/* Footer / User */}
        <div className="sidebar-footer">
          {user ? (
            <>
              <div className="sidebar-user">
                <div className="user-avatar">{initials}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role-badge">{user.role}</div>
                </div>
              </div>
              <button type="button" className="btn btn-danger" style={{ width: '100%' }} onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Login</Link>
              <Link to="/register" className="btn" style={{ width: '100%', justifyContent: 'center' }}>Register</Link>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Mobile Topbar ─── */}
      <div className="mobile-topbar" style={{ background: 'var(--navbar-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <nav className="navbar-mobile" style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="sidebar-logo-icon" style={{ width: 28, height: 28 }}><GraduationCap size={16} color="white" /></div>
            <span style={{ fontWeight: 800, color: 'var(--text)' }}>PlacePort</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-sm"
              style={{ padding: 6, background: 'transparent', border: '1px solid var(--border)' }}
            >
              {theme === 'dark' ? <Sun size={14} color="var(--text)" /> : <Moon size={14} color="var(--text)" />}
            </button>
            {user ? (
              <button type="button" className="btn btn-sm btn-danger" onClick={handleLogout} style={{ padding: '6px' }}><LogOut size={14} /></button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            )}
          </div>
        </nav>
      </div>

      {/* ─── Main Content with Framer Motion ─── */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="page-container"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
