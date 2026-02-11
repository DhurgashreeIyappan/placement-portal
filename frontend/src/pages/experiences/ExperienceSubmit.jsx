import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { submitExperience } from '../../api/experienceApi';
import { useAuth } from '../../context/AuthContext';

export default function ExperienceSubmit() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    companyId: '',
    companyName: '',
    yearOfVisit: '',
    academicYear: '',
    preparationTips: '',
    roundDetails: [{ roundName: '', experience: '', questions: '', tips: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/companies/published').then((res) => setCompanies(res.data.companies || [])).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'companyId') {
      const c = companies.find((x) => x._id === value);
      if (c) setForm((f) => ({ ...f, companyName: c.name }));
    }
  };

  const handleRoundChange = (index, field, value) => {
    setForm((f) => ({
      ...f,
      roundDetails: f.roundDetails.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    }));
  };

  const addRound = () => {
    setForm((f) => ({ ...f, roundDetails: [...f.roundDetails, { roundName: '', experience: '', questions: '', tips: '' }] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    const payload = {
      companyId: form.companyId || undefined,
      companyName: form.companyName,
      yearOfVisit: form.yearOfVisit,
      academicYear: form.academicYear || undefined,
      preparationTips: form.preparationTips || undefined,
      roundDetails: form.roundDetails
        .filter((r) => r.roundName || r.experience)
        .map((r) => ({
          roundName: r.roundName,
          experience: r.experience,
          questions: r.questions ? r.questions.split('\n').filter(Boolean) : [],
          tips: r.tips,
        })),
    };
    submitExperience(payload)
      .then(() => setMessage('Experience submitted for moderation. Thank you!'))
      .catch((err) => setMessage(err.message || 'Failed to submit'))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="page-header">
        <h1>Submit Interview Experience</h1>
        <Link to="/experiences" className="btn">Back to list</Link>
      </div>
      {!user?.isPlaced && (
        <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--warning)' }}>
          <p>Only placed students can submit experiences. If you are placed, ensure your placement is recorded by the coordinator.</p>
        </div>
      )}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company</label>
            <select name="companyId" value={form.companyId} onChange={handleChange}>
              <option value="">Select (optional)</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.academicYear})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Company Name *</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Company name" />
          </div>
          <div className="form-group">
            <label>Year of visit *</label>
            <input name="yearOfVisit" value={form.yearOfVisit} onChange={handleChange} required placeholder="e.g. 2024" />
          </div>
          <div className="form-group">
            <label>Academic year</label>
            <input name="academicYear" value={form.academicYear} onChange={handleChange} placeholder="2024-25" />
          </div>
          <div className="form-group">
            <label>Preparation tips</label>
            <textarea name="preparationTips" value={form.preparationTips} onChange={handleChange} rows={3} />
          </div>
          <h3 style={{ margin: '1rem 0 0.5rem' }}>Round-wise details</h3>
          {form.roundDetails.map((r, i) => (
            <div key={i} className="card" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label>Round name</label>
                <input value={r.roundName} onChange={(e) => handleRoundChange(i, 'roundName', e.target.value)} placeholder="e.g. Technical" />
              </div>
              <div className="form-group">
                <label>Experience</label>
                <textarea value={r.experience} onChange={(e) => handleRoundChange(i, 'experience', e.target.value)} rows={2} />
              </div>
              <div className="form-group">
                <label>Questions (one per line)</label>
                <textarea value={r.questions} onChange={(e) => handleRoundChange(i, 'questions', e.target.value)} rows={2} placeholder="Question 1&#10;Question 2" />
              </div>
              <div className="form-group">
                <label>Tips</label>
                <input value={r.tips} onChange={(e) => handleRoundChange(i, 'tips', e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" className="btn" onClick={addRound}>Add round</button>
          {message && <p className={message.includes('submitted') ? 'success-msg' : 'error-msg'} style={{ marginTop: '1rem' }}>{message}</p>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', display: 'block' }} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
    </>
  );
}
