import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../api/calendarApi';
import { getCompanies } from '../../api/companyApi';

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    company: '',
    title: '',
    description: '',
    eventDate: '',
    endDate: '',
    type: 'other',
  });

  const fetchEvents = () => {
    getEvents()
      .then((res) => setEvents(res.data.events))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCompanies().then((res) => setCompanies(res.data.companies)).catch(console.error);
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      company: form.company,
      title: form.title,
      description: form.description,
      eventDate: new Date(form.eventDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      type: form.type,
    };
    (editingId ? updateEvent(editingId, payload) : createEvent(payload))
      .then(() => {
        fetchEvents();
        setShowForm(false);
        setEditingId(null);
        setForm({ company: '', title: '', description: '', eventDate: '', endDate: '', type: 'other' });
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this event?')) {
      deleteEvent(id).then(() => fetchEvents()).catch(console.error);
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev._id);
    setForm({
      company: ev.company?._id || '',
      title: ev.title,
      description: ev.description || '',
      eventDate: ev.eventDate ? ev.eventDate.slice(0, 16) : '',
      endDate: ev.endDate ? ev.endDate.slice(0, 16) : '',
      type: ev.type || 'other',
    });
    setShowForm(true);
  };

  return (
    <>
      <div className="page-header">
        <h1>Placement Calendar</h1>
        <button type="button" className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm({ company: '', title: '', description: '', eventDate: '', endDate: '', type: 'other' }); }}>Add Event</button>
      </div>
      {showForm && (
        <div className="card">
          <h3>{editingId ? 'Edit Event' : 'New Event'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Company</label>
              <select name="company" value={form.company} onChange={handleChange}>
                <option value="">Select</option>
                {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date & Time *</label>
              <input name="eventDate" type="datetime-local" value={form.eventDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End (optional)</label>
              <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="pre_placement_talk">Pre-placement talk</option>
                <option value="aptitude">Aptitude</option>
                <option value="technical">Technical</option>
                <option value="hr">HR</option>
                <option value="result">Result</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn" style={{ marginLeft: '0.5rem' }} onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </form>
        </div>
      )}
      <div className="card">
        <h2 className="section-title">Upcoming events</h2>
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">—</div>
            <div className="empty-state-title">No events yet</div>
            <p className="empty-state-text">Add an event above to build your placement calendar.</p>
          </div>
        ) : (
          <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id}>
                  <td>{new Date(ev.eventDate).toLocaleString()}</td>
                  <td>{ev.title}</td>
                  <td>{ev.company?.name || '—'}</td>
                  <td><span className="badge badge-info">{ev.type}</span></td>
                  <td>
                    <button type="button" className="btn" onClick={() => startEdit(ev)}>Edit</button>
                    <button type="button" className="btn" onClick={() => handleDelete(ev._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </>
  );
}
