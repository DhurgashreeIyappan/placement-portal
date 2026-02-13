import { useState, useEffect } from 'react';
import { getPublishedCompanies } from '../../api/studentApi';
import { getMyRegistrations } from '../../api/registrationApi';
import { checkEligibility, registerForCompany } from '../../api/registrationApi';

export default function DriveListing() {
  const [companies, setCompanies] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingId, setCheckingId] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [message, setMessage] = useState('');

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
    registerForCompany(companyId)
      .then(() => {
        setMessage('Registered successfully.');
        getMyRegistrations().then((rRes) => setRegistrations(rRes.data.registrations || []));
      })
      .catch((err) => setMessage(err.message || 'Registration failed'));
  };

  return (
    <>
      <div className="page-header">
        <h1>Company Drives</h1>
      </div>
      {message && <p className={message.includes('success') ? 'success-msg' : 'error-msg'}>{message}</p>}
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : companies.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">—</div>
            <div className="empty-state-title">No published drives</div>
            <p className="empty-state-text">There are no open company drives at the moment. Check back later.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Academic Year</th>
                <th>Eligibility</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.academicYear}</td>
                  <td>
                    {c.eligibility?.minCgpa != null && `CGPA≥${c.eligibility.minCgpa} `}
                    {c.eligibility?.maxBacklog != null && `Backlog≤${c.eligibility.maxBacklog}`}
                    {!c.eligibility?.minCgpa && !c.eligibility?.maxBacklog && '—'}
                  </td>
                  <td>{c.registrationDeadline ? new Date(c.registrationDeadline).toLocaleDateString() : '—'}</td>
                  <td>
                    {isRegistered(c._id) ? <span className="badge badge-success">Registered</span> : <span className="badge badge-info">Open</span>}
                  </td>
                  <td>
                    <button type="button" className="btn" onClick={() => handleCheckEligibility(c._id)} disabled={checkingId === c._id}>
                      {checkingId === c._id ? 'Checking...' : 'Check eligibility'}
                    </button>
                    {!isRegistered(c._id) && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginLeft: '0.5rem' }}
                        onClick={() => handleRegister(c._id)}
                        disabled={eligibility?.companyId === c._id && !eligibility?.eligible}
                      >
                        Register
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {eligibility && (
            <div className="card" style={{ marginTop: '1rem' }}>
              <h4>Eligibility for {eligibility.company?.name}</h4>
              <p>Eligible: <strong>{eligibility.eligible ? 'Yes' : 'No'}</strong></p>
              <p>Already registered: {eligibility.alreadyRegistered ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
