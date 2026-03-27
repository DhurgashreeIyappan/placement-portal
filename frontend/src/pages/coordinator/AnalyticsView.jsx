import { motion } from 'framer-motion';
import { Award, Building2, FileText, GraduationCap, Search, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getDashboardStats, getPlacedStudents } from '../../api/analyticsApi';

const STAT_CONFIG = [
  { key: 'totalCompanies', label: 'Total Companies', icon: Building2, color: '#818CF8', bg: 'rgba(129,140,248,0.15)' },
  { key: 'totalRegistrations', label: 'Total Registrations', icon: Users, color: '#2DD4BF', bg: 'rgba(45,212,191,0.15)' },
  { key: 'placedCount', label: 'Placed Students', icon: Award, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  { key: 'totalStudents', label: 'Total Students', icon: GraduationCap, color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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

  const placementRate = summary?.totalStudents
    ? Math.round(((summary.placedCount ?? 0) / summary.totalStudents) * 100)
    : 0;

  // Prepare chart data from companies
  const chartData = summary?.companies?.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
    fullName: c.name,
    registrations: c.registrationCount
  })) || [];

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Analytics & Reports</h1>
          <p>Placement statistics and insights</p>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: 260 }}>
          <Search size={14} style={{ position: 'absolute', left: 16, color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Filter by academic year..."
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="filter-input"
            style={{ paddingLeft: 40, width: '100%', borderRadius: 'var(--radius-full)', background: 'var(--surface)' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading analytics...</span></div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Stats Grid */}
          <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
            {STAT_CONFIG.map(({ key, label, icon: Icon, color, bg }) => (
              <motion.div variants={itemVariants} key={key} className="stat-card">
                <div className="stat-icon" style={{ background: bg }}><Icon size={22} color={color} /></div>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{summary?.[key] ?? 0}</div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            {/* Placement Rate Visual */}
            <motion.div variants={itemVariants} className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">Placement Rate</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
                <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-strong)" strokeWidth="3" />
                    <motion.path
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${placementRate}, 100` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="var(--primary)" strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{placementRate}%</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>Placed</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recharts Bar Chart */}
            <motion.div variants={itemVariants} className="card" style={{ marginBottom: 0 }}>
              <h2 className="section-title">Registrations by Company</h2>
              <div style={{ height: '240px', width: '100%' }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backdropFilter: 'blur(20px)' }}
                        itemStyle={{ color: 'var(--text)', fontWeight: 600 }}
                      />
                      <Bar dataKey="registrations" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#color${index % 2})`} />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="color0" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818CF8" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#818CF8" stopOpacity={0.3} />
                        </linearGradient>
                        <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2DD4BF" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#2DD4BF" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    No registration data available
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <h2 className="section-title">Company-wise Report</h2>
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
                        <td style={{ fontWeight: 600, color: 'var(--text)' }}>{c.name}</td>
                        <td>{c.academicYear}</td>
                        <td><span style={{ fontWeight: 600 }}>{c.registrationCount}</span></td>
                        <td><span className={c.isPublished ? 'badge badge-success' : 'badge badge-warning'}>{c.isPublished ? 'Live' : 'Draft'}</span></td>
                        <td>
                          <Link to={`/coordinator/companies/${c._id}/report`} className="btn btn-sm">
                            <FileText size={12} />Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--space-6) 0' }}>
                <div className="empty-state-icon"><TrendingUp size={24} color="var(--text-muted)" /></div>
                <div className="empty-state-title">No companies in this period</div>
                <p className="empty-state-text">Try a different academic year or add company drives.</p>
              </div>
            )}
          </motion.div>

          {/* Placed students */}
          <motion.div variants={itemVariants} className="card">
            <h2 className="section-title">Placed Students</h2>
            {placements.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-6) 0' }}>
                <div className="empty-state-icon"><Award size={24} color="var(--text-muted)" /></div>
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
                        <td style={{ fontWeight: 600, color: 'var(--text)' }}>{p.student?.name}</td>
                        <td>{p.student?.rollNo || '—'}</td>
                        <td>{p.company?.name}</td>
                        <td style={{ fontWeight: 600, color: 'var(--success)' }}>{p.ctc ? `₹${p.ctc} LPA` : '—'}</td>
                        <td>{new Date(p.placedAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
