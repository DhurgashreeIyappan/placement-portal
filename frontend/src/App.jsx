import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Coordinator pages
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import CompanyList from './pages/coordinator/CompanyList';
import CompanyForm from './pages/coordinator/CompanyForm';
import GroupList from './pages/coordinator/GroupList';
import GroupForm from './pages/coordinator/GroupForm';
import AnnouncementPost from './pages/coordinator/AnnouncementPost';
import CalendarView from './pages/coordinator/CalendarView';
import AnalyticsView from './pages/coordinator/AnalyticsView';
import CompanyReport from './pages/coordinator/CompanyReport';
import ExperienceModerate from './pages/coordinator/ExperienceModerate';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import DriveListing from './pages/student/DriveListing';
import MyProgress from './pages/student/MyProgress';
import PlacementHistory from './pages/student/PlacementHistory';
import StudentAnnouncements from './pages/student/StudentAnnouncements';

// Experience (shared)
import ExperienceBrowse from './pages/experiences/ExperienceBrowse';
import ExperienceDetail from './pages/experiences/ExperienceDetail';
import ExperienceSubmit from './pages/experiences/ExperienceSubmit';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'coordinator' ? '/coordinator' : '/student'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      <Route path="/coordinator" element={<ProtectedRoute role="coordinator"><Layout><CoordinatorDashboard /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/companies" element={<ProtectedRoute role="coordinator"><Layout><CompanyList /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/companies/new" element={<ProtectedRoute role="coordinator"><Layout><CompanyForm /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/companies/:id/edit" element={<ProtectedRoute role="coordinator"><Layout><CompanyForm /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/companies/:id/report" element={<ProtectedRoute role="coordinator"><Layout><CompanyReport /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/groups" element={<ProtectedRoute role="coordinator"><Layout><GroupList /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/groups/new" element={<ProtectedRoute role="coordinator"><Layout><GroupForm /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/groups/:id/edit" element={<ProtectedRoute role="coordinator"><Layout><GroupForm /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/announcements" element={<ProtectedRoute role="coordinator"><Layout><AnnouncementPost /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/calendar" element={<ProtectedRoute role="coordinator"><Layout><CalendarView /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/analytics" element={<ProtectedRoute role="coordinator"><Layout><AnalyticsView /></Layout></ProtectedRoute>} />
      <Route path="/coordinator/experiences" element={<ProtectedRoute role="coordinator"><Layout><ExperienceModerate /></Layout></ProtectedRoute>} />

      <Route path="/student" element={<ProtectedRoute role="student"><Layout><StudentDashboard /></Layout></ProtectedRoute>} />
      <Route path="/student/drives" element={<ProtectedRoute role="student"><Layout><DriveListing /></Layout></ProtectedRoute>} />
      <Route path="/student/progress" element={<ProtectedRoute role="student"><Layout><MyProgress /></Layout></ProtectedRoute>} />
      <Route path="/student/placement-history" element={<ProtectedRoute role="student"><Layout><PlacementHistory /></Layout></ProtectedRoute>} />
      <Route path="/student/announcements" element={<ProtectedRoute role="student"><Layout><StudentAnnouncements /></Layout></ProtectedRoute>} />

      <Route path="/experiences" element={<Layout><ExperienceBrowse /></Layout>} />
      <Route path="/experiences/:id" element={<Layout><ExperienceDetail /></Layout>} />
      <Route path="/experiences/submit" element={<ProtectedRoute role="student"><Layout><ExperienceSubmit /></Layout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={user ? (user.role === 'coordinator' ? '/coordinator' : '/student') : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
