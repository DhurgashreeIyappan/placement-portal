import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGroups, deleteGroup } from '../../api/groupApi';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroups()
      .then((res) => setGroups(res.data.groups))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete group "${name}"?`)) {
      deleteGroup(id).then(() => setGroups((g) => g.filter((x) => x._id !== id))).catch(console.error);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Student Groups</h1>
        <Link to="/coordinator/groups/new" className="btn btn-primary">Create Group</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Company / Batch</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g._id}>
                  <td>{g.name}</td>
                  <td><span className="badge badge-info">{g.type}</span></td>
                  <td>{g.type === 'company' && g.company ? g.company.name : g.batchYear || '—'}</td>
                  <td>{g.members?.length ?? 0}</td>
                  <td>
                    <Link to={`/coordinator/groups/${g._id}/edit`} className="btn" style={{ marginRight: '0.5rem' }}>Edit</Link>
                    <button type="button" className="btn" onClick={() => handleDelete(g._id, g.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {groups.length === 0 && <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>No groups yet.</p>}
        </div>
      )}
    </>
  );
}
