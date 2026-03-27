import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  Calendar, CheckCircle2,
  Circle,
  Search, ShieldCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { checkEligibility, getMyRegistrations, registerForCompany } from '../../api/registrationApi';
import { getPublishedCompanies } from '../../api/studentApi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function DriveListing() {
  const [companies, setCompanies] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [checkingId, setCheckingId] = useState(null);
  const [eligibility, setEligibility] = useState(null);

  const [registeringId, setRegisteringId] = useState(null);
  const [message, setMessage] = useState('');

  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([getPublishedCompanies(), getMyRegistrations()])
      .then(([cRes, rRes]) => {
        setCompanies(cRes.data.companies);
        setRegistrations(rRes.data.registrations || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isRegistered = (companyId) => registrations.some((r) => r.company?._id === companyId);

  const handleCheckEligibility = (companyId) => {
    setCheckingId(companyId);
    setEligibility(null);
    checkEligibility(companyId)
      .then((res) => setEligibility({ ...res.data, companyId }))
      .catch(() => setEligibility(null))
      .finally(() => setCheckingId(null));
  };

  const handleRegister = (companyId) => {
    setMessage('');
    setRegisteringId(companyId);
    registerForCompany(companyId)
      .then(() => {
        setMessage('Registered successfully!');
        getMyRegistrations().then((rRes) => setRegistrations(rRes.data.registrations || []));
      })
      .catch((err) => setMessage(err.message || 'Registration failed'))
      .finally(() => setRegisteringId(null));
  };

  const filtered = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading drives...</span></div>;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Company Drives</h1>
          <p>Browse and register for open placement opportunities</p>
        </div>

        <div style={{ position: 'relative', minWidth: 280 }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: 16, top: 12 }} />
          <input
            className="filter-input"
            style={{ width: '100%', paddingLeft: 40, borderRadius: 'var(--radius-full)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className={message.includes('success') ? 'success-msg' : 'error-msg'}
            style={{ marginBottom: 'var(--space-5)' }}
          >
            {message.includes('success') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <div className="empty-state" style={{ padding: 'var(--space-8) 0' }}>
            <div className="empty-state-icon"><Building2 size={32} color="var(--text-muted)" /></div>
            <div className="empty-state-title">No drives found</div>
            <p className="empty-state-text">
              {search ? "We couldn't find any companies matching your search." : "There are no open company drives at the moment."}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {filtered.map((c) => {
            const registered = isRegistered(c._id);
            const eligResult = eligibility?.companyId === c._id ? eligibility : null;

            return (
              <motion.div variants={itemVariants} key={c._id} className="card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
                {registered && (
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: 'var(--success)', zIndex: 1 }} />
                )}

                <div style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>

                  {/* Left: Info */}
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                        background: registered ? 'var(--success-bg)' : 'rgba(129,140,248,0.15)',
                        border: `1px solid ${registered ? 'rgba(16,185,129,0.3)' : 'rgba(129,140,248,0.3)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 20px ${registered ? 'rgba(16,185,129,0.1)' : 'rgba(129,140,248,0.1)'}`
                      }}>
                        <Building2 size={24} color={registered ? "var(--success)" : "var(--primary-light)"} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{c.name}</h3>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
                          AY {c.academicYear}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {c.eligibility?.minCgpa != null && (
                        <span className="badge badge-info"><ShieldCheck size={11} /> CGPA ≥ {c.eligibility.minCgpa}</span>
                      )}
                      {c.eligibility?.maxBacklog != null && (
                        <span className="badge badge-info">Backlogs ≤ {c.eligibility.maxBacklog}</span>
                      )}
                      {c.registrationDeadline && (
                        <span className="badge badge-warning"><Calendar size={11} /> Due: {new Date(c.registrationDeadline).toLocaleDateString()}</span>
                      )}
                      {registered && <span className="badge badge-success"><CheckCircle2 size={11} /> Registered</span>}
                    </div>

                    {eligResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        style={{
                          marginTop: 'var(--space-4)', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                          background: eligResult.eligible ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${eligResult.eligible ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                          fontSize: 'var(--text-sm)', fontWeight: 500,
                          color: eligResult.eligible ? 'var(--success)' : 'var(--error)',
                          display: 'flex', alignItems: 'center', gap: 8
                        }}
                      >
                        {eligResult.eligible ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {eligResult.eligible ? 'You are eligible for this drive!' : 'You do not meet the eligibility criteria.'}
                      </motion.div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', maxWidth: 220 }}>
                    <button
                      type="button"
                      className="btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => handleCheckEligibility(c._id)}
                      disabled={checkingId === c._id}
                    >
                      {checkingId === c._id ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <ShieldCheck size={16} />}
                      {checkingId === c._id ? 'Checking...' : 'Check Eligibility'}
                    </button>

                    {!registered && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => handleRegister(c._id)}
                        disabled={registeringId === c._id || (eligResult && !eligResult.eligible)}
                      >
                        {registeringId === c._id ? (
                          <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />Registering...</>
                        ) : (
                          <><Circle size={16} />Register Now</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </>
  );
}
