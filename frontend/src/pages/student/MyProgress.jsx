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

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="page-header">
        <h1>Interview Progress</h1>
      </div>
      {progress.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No registrations yet. Register for a company drive to see progress.</p>
      ) : (
        progress.map((item, idx) => (
          <div key={idx} className="card">
            <h3>{item.registration?.company?.name} ({item.registration?.company?.academicYear})</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Registration status: <span className="badge badge-info">{item.registration?.status}</span></p>
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
        ))
      )}
    </>
  );
}
