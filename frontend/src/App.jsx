import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Coordinator pages
import AnalyticsView from './pages/coordinator/AnalyticsView';
import AnnouncementPost from './pages/coordinator/AnnouncementPost';
import CalendarView from './pages/coordinator/CalendarView';
import CompanyForm from './pages/coordinator/CompanyForm';
import CompanyList from './pages/coordinator/CompanyList';
import CompanyReport from './pages/coordinator/CompanyReport';
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import ExperienceModerate from './pages/coordinator/ExperienceModerate';
import GroupForm from './pages/coordinator/GroupForm';
import GroupList from './pages/coordinator/GroupList';

// Student pages
import DriveListing from './pages/student/DriveListing';
import MyProgress from './pages/student/MyProgress';
import PlacementHistory from './pages/student/PlacementHistory';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentDashboard from './pages/student/StudentDashboard';

// Experience (shared)
import ExperienceBrowse from './pages/experiences/ExperienceBrowse';
import ExperienceDetail from './pages/experiences/ExperienceDetail';
import ExperienceSubmit from './pages/experiences/ExperienceSubmit';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-state">Loading...</div>;
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
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
