import { useState, useEffect } from 'react';
import { getMyPlacementHistory } from '../../api/analyticsApi';

export default function PlacementHistory() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPlacementHistory()
      .then((res) => setPlacements(res.data.placements || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <>
      <div className="page-header">
        <h1>Placement History</h1>
      </div>
      {placements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">—</div>
            <div className="empty-state-title">No placement records yet</div>
            <p className="empty-state-text">Your placement history will appear here once recorded.</p>
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
                <th>CTC</th>
                <th>Role</th>
                <th>Placed At</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((p) => (
                <tr key={p._id}>
                  <td>{p.company?.name}</td>
                  <td>{p.company?.academicYear || p.academicYear}</td>
                  <td>{p.ctc ? `₹${p.ctc}` : '—'}</td>
                  <td>{p.role || '—'}</td>
                  <td>{new Date(p.placedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </>
  );
}
