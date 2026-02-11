import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../api/authApi';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    rollNo: '', batch: '', branch: '', cgpa: '', tenthPercent: '', twelfthPercent: '', backlogCount: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'role' ? value : (name === 'cgpa' || name === 'tenthPercent' || name === 'twelfthPercent' || name === 'backlogCount') ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role: form.role };
      if (form.role === 'student') {
        if (form.rollNo) payload.rollNo = form.rollNo;
        if (form.batch) payload.batch = form.batch;
        if (form.branch) payload.branch = form.branch;
        if (form.cgpa !== '') payload.cgpa = form.cgpa;
        if (form.tenthPercent !== '') payload.tenthPercent = form.tenthPercent;
        if (form.twelfthPercent !== '') payload.twelfthPercent = form.twelfthPercent;
        if (form.backlogCount !== '') payload.backlogCount = form.backlogCount;
      }
      const res = await registerApi(payload);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'coordinator' ? '/coordinator' : '/student', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, margin: '2rem auto' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1rem' }}>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password * (min 6)</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Role *</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>
          {form.role === 'student' && (
            <>
              <div className="form-group">
                <label>Roll No</label>
                <input name="rollNo" value={form.rollNo} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Batch (e.g. 2022)</label>
                <input name="batch" value={form.batch} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Branch</label>
                <input name="branch" value={form.branch} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>CGPA</label>
                <input name="cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>10th %</label>
                <input name="tenthPercent" type="number" min="0" max="100" value={form.tenthPercent} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>12th %</label>
                <input name="twelfthPercent" type="number" min="0" max="100" value={form.twelfthPercent} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Backlogs</label>
                <input name="backlogCount" type="number" min="0" value={form.backlogCount} onChange={handleChange} />
              </div>
            </>
          )}
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
