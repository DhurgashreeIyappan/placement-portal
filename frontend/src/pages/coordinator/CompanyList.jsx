import { Building2, Calendar, Edit2, Eye, Plus, Search, Send, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCompany, getCompanies, publishCompany } from '../../api/companyApi';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchCompanies = () => {
    setLoading(true);
    getCompanies(academicYear ? { academicYear } : {})
      .then((res) => setCompanies(res.data.companies))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCompanies(); }, [academicYear]);

  const handlePublish = (id) => {
    publishCompany(id).then(() => fetchCompanies()).catch(console.error);
  };

  const handleDelete = (id) => {
    deleteCompany(id).then(() => { setConfirmDeleteId(null); fetchCompanies(); }).catch(console.error);
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading companies...</span></div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Company Drives</h1>
          <p>Manage and publish placement drives</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Filter by academic year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="filter-input"
              style={{ paddingLeft: 32 }}
            />
          </div>
          <Link to="/coordinator/companies/new" className="btn btn-primary">
            <Plus size={16} /> Add Company
          </Link>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><Building2 size={26} color="var(--text-muted)" /></div>
            <div className="empty-state-title">No companies yet</div>
            <p className="empty-state-text">Add your first company drive to get started.</p>
            <Link to="/coordinator/companies/new" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
              <Plus size={15} /> Add Company Drive
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {companies.map((c) => (
            <div key={c._id} className="card" style={{ marginBottom: 0 }}>

              {/* Delete confirmation overlay */}
              {confirmDeleteId === c._id && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 'inherit',
                  background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(4px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 'var(--space-4)', zIndex: 10
                }}>
                  <p style={{ color: 'var(--text)', fontWeight: 600 }}>Delete "{c.name}"?</p>
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button className="btn" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c._id)}><Trash2 size={14} />Delete</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 200 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius)',
                    background: c.isPublished ? 'var(--success-bg)' : 'rgba(108,99,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Building2 size={20} color={c.isPublished ? 'var(--success)' : 'var(--primary-light)'} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{c.name}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>AY {c.academicYear}</span>
                      {c.eligibility?.minCgpa != null && (
                        <span className="badge badge-info" style={{ fontSize: 10 }}><ShieldCheck size={9} />CGPA≥{c.eligibility.minCgpa}</span>
                      )}
                      {c.eligibility?.maxBacklog != null && (
                        <span className="badge badge-info" style={{ fontSize: 10 }}>Backlog≤{c.eligibility.maxBacklog}</span>
                      )}
                      {c.registrationDeadline && (
                        <span className="badge badge-warning" style={{ fontSize: 10 }}><Calendar size={9} />{new Date(c.registrationDeadline).toLocaleDateString()}</span>
                      )}
                      <span className={`badge ${c.isPublished ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                        {c.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <Link to={`/coordinator/companies/${c._id}/edit`} className="btn btn-sm"><Edit2 size={13} />Edit</Link>
                  <Link to={`/coordinator/companies/${c._id}/report`} className="btn btn-sm"><Eye size={13} />Report</Link>
                  {!c.isPublished && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handlePublish(c._id)}>
                      <Send size={13} />Publish
                    </button>
                  )}
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirmDeleteId(c._id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
