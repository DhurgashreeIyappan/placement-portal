import { useState, useEffect } from 'react';
import { getMyInterviewProgress } from '../../api/studentApi';

export default function MyProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInterviewProgress()
      .then((res) => setProgress(res.data.progress || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <>
      <div className="page-header">
        <h1>Interview Progress</h1>
      </div>
      {progress.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">—</div>
            <div className="empty-state-title">No registrations yet</div>
            <p className="empty-state-text">Register for a company drive to see your interview progress here.</p>
          </div>
        </div>
      ) : (
        progress.map((item, idx) => (
          <div key={idx} className="card">
            <h3>{item.registration?.company?.name} ({item.registration?.company?.academicYear})</h3>
            <p className="text-muted" style={{ marginBottom: '0.75rem' }}>Registration status: <span className="badge badge-info">{item.registration?.status}</span></p>
            <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {item.rounds?.map((r, i) => (
                  <tr key={i}>
                    <td>{r.roundName}</td>
                    <td>
                      <span className={`badge ${r.status === 'cleared' ? 'badge-success' : r.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        ))
      )}
    </>
  );
}
