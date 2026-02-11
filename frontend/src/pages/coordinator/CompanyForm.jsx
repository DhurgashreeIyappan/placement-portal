import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCompanyById, createCompany, updateCompany } from '../../api/companyApi';

export default function CompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    academicYear: '',
    minCgpa: '',
    maxBacklog: 0,
    minTenthPercent: '',
    minTwelfthPercent: '',
    allowedBranches: '',
    batchYears: '',
    registrationDeadline: '',
  });

  useEffect(() => {
    if (isEdit) {
      getCompanyById(id)
        .then((res) => {
          const c = res.data.company;
          setForm({
            name: c.name || '',
            description: c.description || '',
            academicYear: c.academicYear || '',
            minCgpa: c.eligibility?.minCgpa ?? '',
            maxBacklog: c.eligibility?.maxBacklog ?? 0,
            minTenthPercent: c.eligibility?.minTenthPercent ?? '',
            minTwelfthPercent: c.eligibility?.minTwelfthPercent ?? '',
            allowedBranches: (c.eligibility?.allowedBranches || []).join(', '),
            batchYears: (c.eligibility?.batchYears || []).join(', '),
            registrationDeadline: c.registrationDeadline ? c.registrationDeadline.slice(0, 16) : '',
          });
        })
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      name: form.name,
      description: form.description,
      academicYear: form.academicYear,
      eligibility: {
        minCgpa: form.minCgpa === '' ? undefined : Number(form.minCgpa),
        maxBacklog: form.maxBacklog === '' ? undefined : Number(form.maxBacklog),
        minTenthPercent: form.minTenthPercent === '' ? undefined : Number(form.minTenthPercent),
        minTwelfthPercent: form.minTwelfthPercent === '' ? undefined : Number(form.minTwelfthPercent),
        allowedBranches: form.allowedBranches ? form.allowedBranches.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        batchYears: form.batchYears ? form.batchYears.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      },
      registrationDeadline: form.registrationDeadline ? new Date(form.registrationDeadline).toISOString() : undefined,
    };
    (isEdit ? updateCompany(id, payload) : createCompany(payload))
      .then(() => navigate('/coordinator/companies'))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Company Drive' : 'New Company Drive'}</h1>
        <Link to="/coordinator/companies" className="btn">Back to list</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
          </div>
          <div className="form-group">
            <label>Academic Year * (e.g. 2024-25)</label>
            <input name="academicYear" value={form.academicYear} onChange={handleChange} required placeholder="2024-25" />
          </div>
          <div className="form-group">
            <label>Registration Deadline</label>
            <input name="registrationDeadline" type="datetime-local" value={form.registrationDeadline} onChange={handleChange} />
          </div>
          <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1rem' }}>Eligibility (optional)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Min CGPA</label>
              <input name="minCgpa" type="number" step="0.01" min="0" max="10" value={form.minCgpa} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Max Backlogs</label>
              <input name="maxBacklog" type="number" min="0" value={form.maxBacklog} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Min 10th %</label>
              <input name="minTenthPercent" type="number" min="0" max="100" value={form.minTenthPercent} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Min 12th %</label>
              <input name="minTwelfthPercent" type="number" min="0" max="100" value={form.minTwelfthPercent} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Allowed Branches (comma-separated, empty = all)</label>
            <input name="allowedBranches" value={form.allowedBranches} onChange={handleChange} placeholder="CSE, ECE, EEE" />
          </div>
          <div className="form-group">
            <label>Batch Years (comma-separated)</label>
            <input name="batchYears" value={form.batchYears} onChange={handleChange} placeholder="2022, 2023" />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </>
  );
}
