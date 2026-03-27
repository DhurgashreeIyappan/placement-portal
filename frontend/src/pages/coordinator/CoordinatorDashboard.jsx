import { motion } from 'framer-motion';
import {
  Award, BarChart3, Bell, Building2, Calendar,
  ChevronRight, FileText, GraduationCap, Plus, Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api/analyticsApi';

const STAT_CONFIG = [
  { key: 'totalCompanies', label: 'Total Companies', icon: Building2, color: '#818CF8', bg: 'rgba(129,140,248,0.15)' },
  { key: 'totalRegistrations', label: 'Total Registrations', icon: Users, color: '#2DD4BF', bg: 'rgba(45,212,191,0.15)' },
  { key: 'placedCount', label: 'Placed Students', icon: Award, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  { key: 'totalStudents', label: 'Total Students', icon: GraduationCap, color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
];

const QUICK_LINKS = [
  { to: '/coordinator/companies', icon: Building2, label: 'Manage Company Drives', desc: 'Add and edit drives' },
  { to: '/coordinator/groups', icon: Users, label: 'Student Groups', desc: 'Manage groups' },
  { to: '/coordinator/announcements', icon: Bell, label: 'Post Announcements', desc: 'Notify students' },
  { to: '/coordinator/calendar', icon: Calendar, label: 'Placement Calendar', desc: 'Schedule events' },
  { to: '/coordinator/analytics', icon: BarChart3, label: 'Analytics & Reports', desc: 'View insights' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading dashboard...</span></div>;
  if (error) return <p className="error-msg">{error}</p>;

  const placementRate = summary?.totalStudents
    ? Math.round(((summary.placedCount ?? 0) / summary.totalStudents) * 100)
    : 0;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Coordinator Dashboard</h1>
          <p>Monitor placements, companies, and student progress</p>
        </div>
        <Link to="/coordinator/companies/new" className="btn btn-primary">
          <Plus size={16} /> Add Company
        </Link>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
          {STAT_CONFIG.map(({ key, label, icon: Icon, color, bg }) => (
            <motion.div variants={itemVariants} key={key} className="stat-card">
              <div className="stat-icon" style={{ background: bg }}><Icon size={22} color={color} /></div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{summary?.[key] ?? 0}</div>
            </motion.div>
          ))}
        </div>

        {/* Placement Rate Banner */}
        {summary?.totalStudents > 0 && (
          <motion.div variants={itemVariants} className="welcome-banner" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <h2 style={{ marginBottom: 'var(--space-1)' }}>Placement Rate</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {summary.placedCount} of {summary.totalStudents} students placed this cycle
                </p>
              </div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', lineHeight: 1, textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                {placementRate}%
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-5)', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${placementRate}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ height: '100%', background: 'rgba(255,255,255,0.9)', borderRadius: 3, boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}
              />
            </div>
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-5)' }}>
          {/* Quick Links */}
          <motion.div variants={itemVariants} className="card" style={{ marginBottom: 0 }}>
            <h2 className="section-title">Quick Links</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {QUICK_LINKS.map(({ to, icon: Icon, label, desc }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                  transition: 'all 0.2s', color: 'var(--text)'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-xs)', background: 'rgba(129,140,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color="var(--primary-light)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-dim)" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Companies Overview */}
          <motion.div variants={itemVariants} className="card" style={{ marginBottom: 0 }}>
            <h2 className="section-title">Companies Overview</h2>
            {summary?.companies?.length > 0 ? (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Registrations</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.companies.slice(0, 5).map((c) => (
                      <tr key={c._id}>
                        <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.name}</td>
                        <td style={{ fontWeight: 500 }}>{c.registrationCount}</td>
                        <td>
                          <span className={c.isPublished ? 'badge badge-success' : 'badge badge-warning'}>{c.isPublished ? 'Live' : 'Draft'}</span>
                        </td>
                        <td>
                          <Link to={`/coordinator/companies/${c._id}/report`} className="btn btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                            <FileText size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--space-6) 0' }}>
                <div className="empty-state-icon"><Building2 size={24} color="var(--text-muted)" /></div>
                <div className="empty-state-title">No companies yet</div>
                <p className="empty-state-text">Add your first company drive to get started.</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
