import { BookOpen, Building2, Calendar, Eye, PenLine, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { getExperiences } from '../../api/experienceApi';
import { useAuth } from '../../context/AuthContext';

export default function ExperienceBrowse() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyFilter, setCompanyFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/companies/published').then((res) => setCompanies(res.data.companies || [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (companyFilter) params.companyId = companyFilter;
    if (yearFilter) params.year = yearFilter;
    getExperiences(params)
      .then((res) => setExperiences(res.data.experiences || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [companyFilter, yearFilter]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Interview Experiences</h1>
          <p>Insights shared by placed students</p>
        </div>
        {user?.role === 'student' && (
          <Link to="/experiences/submit" className="btn btn-primary">
            <PenLine size={16} /> Share Experience
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1, minWidth: 180 }}>
            <Building2 size={14} color="var(--text-dim)" />
            <select
              className="filter-input"
              style={{ flex: 1 }}
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: 140 }}>
            <Calendar size={14} color="var(--text-dim)" />
            <input
              className="filter-input"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              placeholder="Year (e.g. 2024)"
            />
          </div>
          {(companyFilter || yearFilter) && (
            <button className="btn btn-sm" onClick={() => { setCompanyFilter(''); setYearFilter(''); }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading experiences...</span></div>
      ) : experiences.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><BookOpen size={26} color="var(--text-muted)" /></div>
            <div className="empty-state-title">No approved experiences yet</div>
            <p className="empty-state-text">Interview experiences shared by placed students will appear here once approved.</p>
          </div>
        </div>
      ) : (
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {experiences.map((exp) => (
            <div key={exp._id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius)',
                  background: 'rgba(255,107,157,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <BookOpen size={20} color="#FF6B9D" />
                </div>
                <span className="badge badge-success" style={{ fontSize: 10 }}>Approved</span>
              </div>
              <h3 style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
                {exp.companyName || exp.company?.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <User size={11} /> {exp.author?.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <Calendar size={11} /> {exp.yearOfVisit}
                </div>
              </div>
              <Link to={`/experiences/${exp._id}`} className="btn btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <Eye size={13} /> Read Experience
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
