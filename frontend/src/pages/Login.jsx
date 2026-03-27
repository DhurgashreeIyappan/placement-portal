import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Lock, Mail, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const res = await apiLogin({ email, password });
      login(res.data.token, res.data.user);
      // Let the AppRoutes element `<Navigate>` pick it up, or push directly
      if (res.data.user.role === 'coordinator') navigate('/coordinator');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Login failed');
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
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-logo">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              width: 56, height: 56, background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius)', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)'
            }}
          >
            <GraduationCap size={28} color="white" />
          </motion.div>
          <h1 className="gradient-text">Welcome back</h1>
          <p className="text-muted">Enter your details to sign in to your account</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  style={{ paddingLeft: 40 }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: 40 }}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="error-msg"
                style={{ marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-sm)' }}
              >
                {error}
              </motion.div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--text-dim)', fontSize: 'var(--text-sm)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--text)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
