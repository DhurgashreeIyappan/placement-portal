import { motion } from 'framer-motion';
import {
  Bell, BookOpen, Building2, ChevronRight,
  History, PenLine, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  { to: '/student/drives', icon: Building2, label: 'Company Drives', desc: 'Browse and register for open placement drives', color: '#818CF8', bg: 'rgba(129,140,248,0.15)' },
  { to: '/student/progress', icon: TrendingUp, label: 'My Progress', desc: 'Track your interview rounds per company', color: '#2DD4BF', bg: 'rgba(45,212,191,0.15)' },
  { to: '/student/placement-history', icon: History, label: 'Placement History', desc: 'View your placement records and offers', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  { to: '/student/announcements', icon: Bell, label: 'Announcements', desc: 'Group notifications from coordinators', color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
  { to: '/experiences', icon: BookOpen, label: 'Interview Experiences', desc: "Browse seniors' interview experiences", color: '#F472B6', bg: 'rgba(244,114,182,0.15)' },
  { to: '/experiences/submit', icon: PenLine, label: 'Submit Experience', desc: 'Share your interview experience with juniors', color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <>
      {/* Welcome Banner */}
      <motion.div
        className="welcome-banner"
        initial={{ opacity: 0, scale: 0.98, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <h2 style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Welcome back, {firstName}! 👋</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-lg)', fontWeight: 500 }}>
            Your placement journey dashboard — track drives, progress and more.
          </p>
        </div>
      </motion.div>

      {/* Feature Cards Grid */}
      <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Quick Access</h2>

      <motion.div className="grid-3" variants={containerVariants} initial="hidden" animate="visible">
        {FEATURES.map(({ to, icon: Icon, label, desc, color, bg }) => (
          <motion.div key={to} variants={itemVariants}>
            <Link to={to} className="card" style={{
              display: 'flex', flexDirection: 'column', height: '100%', marginBottom: 0,
              textDecoration: 'none', position: 'relative', overflow: 'hidden'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--border-highlight)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 20px ${bg.replace('0.15', '0.4')}`
                }}>
                  <Icon size={24} color={color} />
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ChevronRight size={16} color="var(--text-dim)" />
                </div>
              </div>

              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text)', marginBottom: 'var(--space-2)' }}>
                {label}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6, flex: 1 }}>
                {desc}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
