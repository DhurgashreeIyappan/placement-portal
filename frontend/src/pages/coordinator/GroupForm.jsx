import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getGroupById, createGroup, updateGroup, addMembersToGroup, removeMemberFromGroup } from '../../api/groupApi';
import { getCompanies } from '../../api/companyApi';
import { getRegistrationsByCompany } from '../../api/registrationApi';

export default function GroupForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [group, setGroup] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'company', company: '', batchYear: '' });
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [addMemberId, setAddMemberId] = useState('');

  useEffect(() => {
    getCompanies().then((res) => setCompanies(res.data.companies)).catch(console.error);
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      getGroupById(id)
        .then((res) => {
          setGroup(res.data.group);
          setForm({
            name: res.data.group.name,
            type: res.data.group.type,
            company: res.data.group.company?._id || '',
            batchYear: res.data.group.batchYear || '',
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
      type: form.type,
      ...(form.type === 'company' && form.company && { company: form.company }),
      ...(form.type === 'batch' && { batchYear: form.batchYear }),
    };
    (isEdit ? updateGroup(id, payload) : createGroup(payload))
      .then((res) => {
        if (isEdit) setGroup(res.data.group);
        else navigate('/coordinator/groups');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const loadStudentsForCompany = (companyId) => {
    if (!companyId) return;
    getRegistrationsByCompany(companyId)
      .then((res) => setStudents(res.data.registrations.map((r) => r.student)))
      .catch(console.error);
  };

  const handleAddMember = () => {
    if (!addMemberId || !id) return;
    addMembersToGroup(id, [addMemberId])
      .then((res) => setGroup(res.data.group))
      .catch(console.error);
    setAddMemberId('');
  };

  const handleRemoveMember = (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    removeMemberFromGroup(id, memberId)
      .then((res) => setGroup(res.data.group))
      .catch(console.error);
  };

  return (
    <>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Group' : 'New Group'}</h1>
        <Link to="/coordinator/groups" className="btn">Back to list</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Type *</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="company">Company</option>
              <option value="batch">Batch</option>
            </select>
          </div>
          {form.type === 'company' && (
            <div className="form-group">
              <label>Company</label>
              <select name="company" value={form.company} onChange={(e) => { handleChange(e); loadStudentsForCompany(e.target.value); }}>
                <option value="">Select company</option>
                {companies.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.academicYear})</option>)}
              </select>
            </div>
          )}
          {form.type === 'batch' && (
            <div className="form-group">
              <label>Batch Year</label>
              <input name="batchYear" value={form.batchYear} onChange={handleChange} placeholder="2022" />
            </div>
          )}
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
      {isEdit && group && (
        <div className="card">
          <h3>Members ({group.members?.length ?? 0})</h3>
          {form.type === 'company' && form.company && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <select value={addMemberId} onChange={(e) => setAddMemberId(e.target.value)} style={{ minWidth: 200 }}>
                <option value="">Add student...</option>
                {students.filter((s) => !group.members?.some((m) => m._id === s._id)).map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.rollNo || s.email})</option>
                ))}
              </select>
              <button type="button" className="btn btn-primary" onClick={handleAddMember} disabled={!addMemberId}>Add</button>
            </div>
          )}
          <table>
            <thead>
              <tr><th>Name</th><th>Email / Roll</th>{form.type === 'company' && <th>Action</th>}</tr>
            </thead>
            <tbody>
              {group.members?.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.rollNo || m.email}</td>
                  {form.type === 'company' && <td><button type="button" className="btn" onClick={() => handleRemoveMember(m._id)}>Remove</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
          {(!group.members || group.members.length === 0) && <p style={{ color: 'var(--text-muted)' }}>No members yet.</p>}
        </div>
      )}
    </>
  );
}
