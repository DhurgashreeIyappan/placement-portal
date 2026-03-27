import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Hash, Lock, Mail, Moon, Sun, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState(''); // student only
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { role, name, email, password };
      if (role === 'student') payload.rollNo = rollNo;
      const res = await apiRegister(payload);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'coordinator') navigate('/coordinator');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={toggleTheme}
        style={{ position: 'absolute', top: 24, right: 24, padding: 10, background: 'var(--surface-hover)', borderRadius: '50%', border: '1px solid var(--border)', zIndex: 10 }}
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} color="var(--text-muted)" /> : <Moon size={20} color="var(--text-muted)" />}
      </button>

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-logo">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              width: 56, height: 56, background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius)', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)'
            }}
          >
            <GraduationCap size={28} color="white" />
          </motion.div>
          <h1 className="gradient-text">Create an account</h1>
          <p className="text-muted">Join the placement portal to get started</p>
        </div>

        <div className="auth-card">
          <div style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-6)' }}>
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{ flex: 1, padding: 10, borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', color: role === 'student' ? '#fff' : 'var(--text-muted)', background: role === 'student' ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'all 0.2s' }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('coordinator')}
              style={{ flex: 1, padding: 10, borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', color: role === 'coordinator' ? '#fff' : 'var(--text-muted)', background: role === 'coordinator' ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'all 0.2s' }}
            >
              Coordinator
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" style={{ paddingLeft: 40 }} required />
              </div>
            </div>

            <div className="form-group">
              <label>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@college.edu" style={{ paddingLeft: 40 }} required />
              </div>
            </div>

            <AnimatePresence>
              {role === 'student' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="form-group">
                    <label>Roll Number</label>
                    <div style={{ position: 'relative' }}>
                      <Hash size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 14 }} />
                      <input type="text" value={rollNo} onChange={(e) => setRollNo(e.target.value)} placeholder="e.g. 21CS001" style={{ paddingLeft: 40 }} required={role === 'student'} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: 40 }} minLength={6} required />
              </div>
            </div>

            {error && <div className="error-msg" style={{ marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--text-dim)', fontSize: 'var(--text-sm)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--text)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
