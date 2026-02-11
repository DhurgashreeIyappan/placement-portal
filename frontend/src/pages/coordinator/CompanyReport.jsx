import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompanyWiseReport } from '../../api/analyticsApi';
import { getRoundsByCompany } from '../../api/interviewRoundApi';
import { createRound, updateRoundResult } from '../../api/interviewRoundApi';
import { createPlacement } from '../../api/placementApi';

export default function CompanyReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoundName, setNewRoundName] = useState('');
  const [newRoundIndex, setNewRoundIndex] = useState(0);
  const [placementForm, setPlacementForm] = useState({ studentId: '', ctc: '', role: '', academicYear: '' });

  useEffect(() => {
    if (!id) return;
    getCompanyWiseReport(id)
      .then((res) => {
        setReport(res.data);
        setRounds(res.data.rounds || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddRound = (e) => {
    e.preventDefault();
    createRound({ companyId: id, roundName: newRoundName, roundIndex: newRoundIndex })
      .then(() => getCompanyWiseReport(id).then((res) => { setReport(res.data); setRounds(res.data.rounds || []); }))
      .catch(console.error);
    setNewRoundName('');
    setNewRoundIndex((r) => r + 1);
  };

  const handleMarkPlaced = (e) => {
    e.preventDefault();
    if (!placementForm.studentId) return;
    createPlacement({
      studentId: placementForm.studentId,
      companyId: id,
      ctc: placementForm.ctc || undefined,
      role: placementForm.role || undefined,
      academicYear: placementForm.academicYear || undefined,
    })
      .then(() => getCompanyWiseReport(id).then((res) => setReport(res.data)))
      .catch(console.error);
    setPlacementForm({ studentId: '', ctc: '', role: '', academicYear: '' });
  };

  if (loading || !report) return <p>Loading report...</p>;

  return (
    <>
      <div className="page-header">
        <h1>Report: {report.company?.name}</h1>
        <Link to="/coordinator/companies" className="btn">Back to companies</Link>
      </div>
      <div className="grid-2">
        <div className="card">
          <h3>Registrations ({report.registrations?.length ?? 0})</h3>
          <table>
            <thead>
              <tr><th>Student</th><th>Roll No</th><th>Batch</th><th>Status</th></tr>
            </thead>
            <tbody>
              {report.registrations?.map((r) => (
                <tr key={r._id}>
                  <td>{r.student?.name}</td>
                  <td>{r.student?.rollNo || '—'}</td>
                  <td>{r.student?.batch || '—'}</td>
                  <td><span className="badge badge-info">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Interview rounds</h3>
          <ul style={{ listStyle: 'none' }}>
            {rounds.map((r) => (
              <li key={r._id} style={{ marginBottom: '0.5rem' }}>
                {r.roundName} (Index: {r.roundIndex}) — {r.results?.length ?? 0} results
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddRound} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <input placeholder="Round name" value={newRoundName} onChange={(e) => setNewRoundName(e.target.value)} required />
            </div>
            <div className="form-group">
              <input type="number" min={0} placeholder="Round index" value={newRoundIndex} onChange={(e) => setNewRoundIndex(Number(e.target.value))} />
            </div>
            <button type="submit" className="btn btn-primary">Add round</button>
          </form>
        </div>
      </div>
      <div className="card">
        <h3>Placed from this drive ({report.placedCount ?? 0})</h3>
        {report.placedStudents?.length > 0 ? (
          <table>
            <thead>
              <tr><th>Student</th><th>Roll No</th><th>Batch</th></tr>
            </thead>
            <tbody>
              {report.placedStudents.map((p) => (
                <tr key={p._id}>
                  <td>{p.student?.name}</td>
                  <td>{p.student?.rollNo}</td>
                  <td>{p.student?.batch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No placements recorded yet.</p>
        )}
        <h4 style={{ marginTop: '1.5rem' }}>Mark student as placed</h4>
        <form onSubmit={handleMarkPlaced} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 200 }}>
            <label>Student</label>
            <select value={placementForm.studentId} onChange={(e) => setPlacementForm((f) => ({ ...f, studentId: e.target.value }))} required>
              <option value="">Select</option>
              {report.registrations?.filter((r) => !report.placedStudents?.some((p) => p.student?._id === r.student?._id)).map((r) => (
                <option key={r.student?._id} value={r.student?._id}>{r.student?.name} ({r.student?.rollNo})</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, width: 100 }}>
            <label>CTC</label>
            <input value={placementForm.ctc} onChange={(e) => setPlacementForm((f) => ({ ...f, ctc: e.target.value }))} placeholder="LPA" />
          </div>
          <div className="form-group" style={{ marginBottom: 0, width: 120 }}>
            <label>Role</label>
            <input value={placementForm.role} onChange={(e) => setPlacementForm((f) => ({ ...f, role: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, width: 100 }}>
            <label>Year</label>
            <input value={placementForm.academicYear} onChange={(e) => setPlacementForm((f) => ({ ...f, academicYear: e.target.value }))} placeholder="2024-25" />
          </div>
          <button type="submit" className="btn btn-primary">Mark placed</button>
        </form>
      </div>
    </>
  );
}
