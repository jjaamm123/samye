import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December','Flexible'];

const EMPTY_TOUR = {
  title: '', destination: 'Nepal', duration: '', price: '',
  difficulty: 'Moderate', description: '', featuredImage: '/images/safari.jpg',

  includedRaw: '',
  excludedRaw: '',
  itinerary: []
};

const EMPTY_DAY = { day: '', title: '', description: '' };

function AdminDashboard() {
  const [tab, setTab] = useState('tours');

  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState(EMPTY_TOUR);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => { fetchTours(); }, []);

  useEffect(() => {
    if (tab === 'inquiries' && inquiries.length === 0) fetchInquiries();
  }, [tab]);

  const fetchTours = () =>
    axios.get('http://localhost:5000/api/tours')
      .then(r => setTours(r.data))
      .catch(console.error);

  const fetchInquiries = () => {
    setLoadingInquiries(true);
    axios.get('http://localhost:5000/api/inquiries')
      .then(r => setInquiries(r.data))
      .catch(console.error)
      .finally(() => setLoadingInquiries(false));
  };

  const handleChange = e =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const addDay = () =>
    setFormData(f => ({
      ...f,
      itinerary: [...f.itinerary, { ...EMPTY_DAY, day: f.itinerary.length + 1 }]
    }));

  const updateDay = (index, field, value) =>
    setFormData(f => ({
      ...f,
      itinerary: f.itinerary.map((d, i) => i === index ? { ...d, [field]: value } : d)
    }));

  const removeDay = (index) =>
    setFormData(f => ({
      ...f,
      itinerary: f.itinerary
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, day: i + 1 })) 
    }));
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await axios.post('http://localhost:5000/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Update the form state with the new real image URL
      setFormData(f => ({ ...f, featuredImage: response.data.imageUrl }));
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Check server console.');
    } finally {
      setUploadingImage(false);
    }
  };  

  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      ...formData,
      included: formData.includedRaw
        .split(',').map(s => s.trim()).filter(Boolean),
      excluded: formData.excludedRaw
        .split(',').map(s => s.trim()).filter(Boolean),
    };
    delete payload.includedRaw;
    delete payload.excludedRaw;

    axios.post('http://localhost:5000/api/tours', payload)
      .then(() => {
        setSubmitStatus('success');
        fetchTours();
        setFormData(EMPTY_TOUR);
        setTimeout(() => setSubmitStatus(null), 4000);
      })
      .catch(err => { console.error(err); setSubmitStatus('error'); });
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this tour? Cannot be undone.')) return;
    axios.delete(`http://localhost:5000/api/tours/${id}`)
      .then(fetchTours).catch(console.error);
  };

  const updateInquiryStatus = (id, status) =>
    axios.patch(`http://localhost:5000/api/inquiries/${id}`, { status })
      .then(() => fetchInquiries()).catch(console.error);

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-logo">Samye</span>
          <span className="admin-sidebar-sub">Admin Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          <span
            className={`admin-nav-item ${tab === 'tours' ? 'active' : ''}`}
            onClick={() => setTab('tours')}
          >📦 Tour Packages</span>
          <span
            className={`admin-nav-item ${tab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setTab('inquiries')}
          >📬 Inquiries
            {inquiries.filter(i => i.status === 'new').length > 0 && (
              <span className="admin-badge">
                {inquiries.filter(i => i.status === 'new').length}
              </span>
            )}
          </span>
          <Link to="/" className="admin-nav-item">🌐 View Live Site</Link>
        </nav>

        <div className="admin-sidebar-stats">
          <div className="admin-stat">
            <span className="admin-stat-number">{tours.length}</span>
            <span className="admin-stat-label">Active Tours</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-number">
              {inquiries.filter(i => i.status === 'new').length}
            </span>
            <span className="admin-stat-label">New Inquiries</span>
          </div>
        </div>
      </aside>

      <main className="admin-main">

        {tab === 'tours' && (
          <>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">Tour Management</h1>
                <p className="admin-page-subtitle">Add, review, and remove tour packages</p>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Add New Package</h2>
              </div>

              {submitStatus === 'success' && (
                <div className="admin-alert success">✓ Tour published successfully!</div>
              )}
              {submitStatus === 'error' && (
                <div className="admin-alert error">✗ Failed to publish. Check the console.</div>
              )}

              <form onSubmit={handleSubmit} className="admin-form">

                <div className="admin-form-group">
                  <label className="admin-label">Tour Title</label>
                  <input name="title" value={formData.title} onChange={handleChange}
                    required placeholder="e.g. Everest Base Camp Trek" className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Destination</label>
                  <select name="destination" value={formData.destination}
                    onChange={handleChange} className="admin-input">
                    <option>Nepal</option>
                    <option>Tibet</option>
                    <option>India</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Duration (Days)</label>
                  <input type="number" name="duration" value={formData.duration}
                    onChange={handleChange} required placeholder="e.g. 14" className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Price (USD)</label>
                  <input type="number" name="price" value={formData.price}
                    onChange={handleChange} required placeholder="e.g. 1800" className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Difficulty</label>
                  <select name="difficulty" value={formData.difficulty}
                    onChange={handleChange} className="admin-input">
                    <option>Easy</option>
                    <option>Moderate</option>
                    <option>Hard</option>
                    <option>Challenging</option>
                  </select>
                </div>

                {/* ─── NEW FEATURED IMAGE UPLOAD FIELD ─── */}
                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Featured Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="admin-input" 
                    style={{ padding: '8px' }}
                  />
                  
                  {uploadingImage && <p className="admin-label-hint">Uploading image to server...</p>}
                  
                  {formData.featuredImage && formData.featuredImage !== '/images/safari.jpg' && (
                    <div className="admin-image-preview" style={{ marginTop: '12px' }}>
                      <img 
                        src={formData.featuredImage} 
                        alt="Preview" 
                        style={{ width: '200px', borderRadius: '8px', border: '1px solid #ddd' }} 
                      />
                    </div>
                  )}
                </div>
                {/* ─────────────────────────────────────── */}

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Short Description</label>
                  <textarea name="description" value={formData.description}
                    onChange={handleChange} required rows="3"
                    placeholder="Describe the tour experience…"
                    className="admin-input admin-textarea"></textarea>
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">
                    ✅ What's Included
                    <span className="admin-label-hint">— comma-separated</span>
                  </label>
                  <input
                    name="includedRaw"
                    value={formData.includedRaw}
                    onChange={handleChange}
                    placeholder="Airport transfers, All meals, Licensed guide, Permits, Accommodation"
                    className="admin-input"
                  />
                  {formData.includedRaw && (
                    <div className="admin-tag-preview">
                      {formData.includedRaw.split(',').map(s => s.trim()).filter(Boolean).map((t, i) => (
                        <span key={i} className="admin-tag included">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">
                    ❌ What's Excluded
                    <span className="admin-label-hint">— comma-separated</span>
                  </label>
                  <input
                    name="excludedRaw"
                    value={formData.excludedRaw}
                    onChange={handleChange}
                    placeholder="International flights, Travel insurance, Personal expenses, Tips"
                    className="admin-input"
                  />
                  {formData.excludedRaw && (
                    <div className="admin-tag-preview">
                      {formData.excludedRaw.split(',').map(s => s.trim()).filter(Boolean).map((t, i) => (
                        <span key={i} className="admin-tag excluded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">
                    🗓️ Itinerary
                    <span className="admin-label-hint">— add one row per day</span>
                  </label>

                  {formData.itinerary.length === 0 && (
                    <p className="admin-itinerary-empty">
                      No days added yet. Click "Add Day" to start building the itinerary.
                    </p>
                  )}

                  {formData.itinerary.map((day, index) => (
                    <div key={index} className="admin-itinerary-row">
                      <div className="admin-itinerary-day-badge">Day {day.day}</div>

                      <input
                        className="admin-input admin-itinerary-title"
                        placeholder="Day title, e.g. 'Fly to Kathmandu, hotel check-in'"
                        value={day.title}
                        onChange={e => updateDay(index, 'title', e.target.value)}
                        required
                      />

                      <textarea
                        className="admin-input admin-textarea admin-itinerary-desc"
                        placeholder="Optional detail — what happens this day, highlights, accommodation…"
                        value={day.description}
                        onChange={e => updateDay(index, 'description', e.target.value)}
                        rows="2"
                      />

                      <button
                        type="button"
                        className="admin-itinerary-remove"
                        onClick={() => removeDay(index)}
                        title="Remove this day"
                      >✕</button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="admin-add-day-btn"
                    onClick={addDay}
                  >
                    + Add Day {formData.itinerary.length + 1}
                  </button>
                </div>

                <div className="admin-form-full">
                  <button type="submit" className="admin-submit-btn">+ Publish Tour</button>
                </div>

              </form>
            </div>

            <div className="admin-card" style={{ marginTop: '28px' }}>
              <div className="admin-card-header">
                <h2 className="admin-card-title">Active Tours</h2>
                <span className="admin-card-count">{tours.length} total</span>
              </div>

              {tours.length === 0 ? (
                <p className="admin-empty-state">No tours yet. Add one above.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Destination</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Days</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tours.map(tour => (
                        <tr key={tour._id}>
                          <td className="admin-td-title">{tour.title}</td>
                          <td>
                            <span className="admin-destination-badge">{tour.destination}</span>
                          </td>
                          <td>{tour.duration} days</td>
                          <td className="admin-td-price">${tour.price}</td>
                          <td>{tour.itinerary?.length || 0} days</td>
                          <td style={{ textAlign: 'right' }}>
                            <Link to={`/tour/${tour._id}`} className="admin-action-view">View ↗</Link>
                            <button onClick={() => handleDelete(tour._id)} className="admin-action-delete">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'inquiries' && (
          <>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">Inquiries</h1>
                <p className="admin-page-subtitle">Customer enquiries from the contact and tour pages</p>
              </div>
              <button className="admin-refresh-btn" onClick={fetchInquiries}>↺ Refresh</button>
            </div>

            {loadingInquiries && <p className="admin-empty-state">Loading inquiries…</p>}

            {!loadingInquiries && inquiries.length === 0 && (
              <p className="admin-empty-state">No inquiries yet.</p>
            )}

            {!loadingInquiries && inquiries.length > 0 && (
              <div className="admin-inquiry-list">
                {inquiries.map(inq => (
                  <div
                    key={inq._id}
                    className={`admin-inquiry-card status-${inq.status}`}
                  >
                    <div
                      className="admin-inquiry-header"
                      onClick={() => setExpandedInquiry(expandedInquiry === inq._id ? null : inq._id)}
                    >
                      <div className="admin-inquiry-header-left">
                        <span className={`admin-inquiry-status-dot status-${inq.status}`}></span>
                        <div>
                          <strong className="admin-inquiry-name">{inq.name}</strong>
                          <span className="admin-inquiry-email">{inq.email}</span>
                        </div>
                      </div>

                      <div className="admin-inquiry-header-right">
                        <span className="admin-inquiry-pill">{inq.travelMonth}</span>
                        <span className="admin-inquiry-pill">{inq.groupSize} pax</span>
                        <span className="admin-inquiry-pill budget">{inq.budgetRange}</span>
                        <span className="admin-inquiry-date">
                          {new Date(inq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="admin-inquiry-chevron">
                          {expandedInquiry === inq._id ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>

                    {expandedInquiry === inq._id && (
                      <div className="admin-inquiry-body">
                        <div className="admin-inquiry-detail-grid">
                          <div>
                            <span className="admin-inquiry-field-label">Subject</span>
                            <p className="admin-inquiry-field-value">{inq.subject}</p>
                          </div>
                          <div>
                            <span className="admin-inquiry-field-label">Travel Month</span>
                            <p className="admin-inquiry-field-value">{inq.travelMonth}</p>
                          </div>
                          <div>
                            <span className="admin-inquiry-field-label">Group Size</span>
                            <p className="admin-inquiry-field-value">{inq.groupSize} people</p>
                          </div>
                          <div>
                            <span className="admin-inquiry-field-label">Budget Range</span>
                            <p className="admin-inquiry-field-value">{inq.budgetRange}</p>
                          </div>
                        </div>

                        <div style={{ marginTop: '12px' }}>
                          <span className="admin-inquiry-field-label">Message</span>
                          <p className="admin-inquiry-message">{inq.message}</p>
                        </div>

                        <div className="admin-inquiry-actions">
                          <span className="admin-inquiry-field-label">Update Status:</span>
                          {['new', 'contacted', 'converted', 'closed'].map(s => (
                            <button
                              key={s}
                              onClick={() => updateInquiryStatus(inq._id, s)}
                              className={`admin-status-btn ${inq.status === s ? 'active' : ''} status-btn-${s}`}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;