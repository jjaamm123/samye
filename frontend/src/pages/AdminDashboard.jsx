import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const EMPTY_DAY = { day: '', title: '', description: '' };

const EMPTY_TOUR = {
  title: '', destination: 'Nepal', duration: '', price: '', localPrice: '',
  difficulty: 'Moderate', description: '', 
  cardImage: '', heroImage: '', galleryImages: [], // Upgraded Image Fields
  includedRaw: '', excludedRaw: '', itinerary: []
};

const EMPTY_ADVENTURE = {
  title: '', location: '', sportType: '', duration: '', price: '', localPrice: '', minAge: '16+',
  intensity: 'Moderate', description: '', 
  cardImage: '', heroImage: '', galleryImages: [], // Upgraded Image Fields
  includedRaw: '', excludedRaw: '', itinerary: []
};

function AdminDashboard() {
  const [tab, setTab] = useState('tours'); // 'tours', 'adventures', 'inquiries'
  
  const [tours, setTours] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  // Unified Form State
  const [formData, setFormData] = useState(EMPTY_TOUR);
  const [editingId, setEditingId] = useState(null); 
  const [submitStatus, setSubmitStatus] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState(null);

  // ─── DATA FETCHING ───
  useEffect(() => { 
    fetchTours(); 
    fetchAdventures();
  }, []);

  useEffect(() => {
    if (tab === 'inquiries' && inquiries.length === 0) fetchInquiries();
  }, [tab]);

  const fetchTours = () => axios.get(`${import.meta.env.VITE_API_URL}/api/tours`).then(r => setTours(r.data)).catch(console.error);
  const fetchAdventures = () => axios.get(`${import.meta.env.VITE_API_URL}/api/adventures`).then(r => setAdventures(r.data)).catch(console.error);

  const fetchInquiries = () => {
    setLoadingInquiries(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/inquiries`)
      .then(r => setInquiries(r.data))
      .catch(console.error).finally(() => setLoadingInquiries(false));
  };

  // ─── TAB & EDIT MANAGEMENT ───
  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setEditingId(null);
    setSubmitStatus(null);
    if (newTab === 'tours') setFormData(EMPTY_TOUR);
    if (newTab === 'adventures') setFormData(EMPTY_ADVENTURE);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      ...item,
      includedRaw: item.included?.join(', ') || '',
      excludedRaw: item.excluded?.join(', ') || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(tab === 'tours' ? EMPTY_TOUR : EMPTY_ADVENTURE);
  };

  // ─── FORM HANDLERS ───
  const handleChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const addDay = () => setFormData(f => ({ ...f, itinerary: [...f.itinerary, { ...EMPTY_DAY, day: f.itinerary.length + 1 }] }));
  const updateDay = (index, field, value) => setFormData(f => ({ ...f, itinerary: f.itinerary.map((d, i) => i === index ? { ...d, [field]: value } : d) }));
  const removeDay = (index) => setFormData(f => ({ ...f, itinerary: f.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })) }));

  // ─── CLOUDINARY IMAGE UPLOAD LOGIC ───
  const uploadSingleImageToCloud = async (file) => {
    const uploadData = new FormData();
    uploadData.append('image', file);
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, uploadData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
    });
    return response.data.imageUrl;
  };

  const handleSingleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadSingleImageToCloud(file);
      setFormData(f => ({ ...f, [fieldName]: url }));
    } catch (err) {
      alert(`Failed to upload ${fieldName}. Check server console.`);
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImage(true);
    try {
      const uploadPromises = files.map(file => uploadSingleImageToCloud(file));
      const urls = await Promise.all(uploadPromises);
      setFormData(f => ({ ...f, galleryImages: [...(f.galleryImages || []), ...urls] }));
    } catch (err) {
      alert('Failed to upload some gallery images. Check server console.');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(f => ({
      ...f,
      galleryImages: f.galleryImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  // ─── SUBMIT HANDLER ───
  const handleSubmit = e => {
    e.preventDefault();
    
    // Ensure critical images exist before submission
    if (!formData.cardImage || !formData.heroImage) {
        alert("Please upload both a Card Image and a Hero Image before saving.");
        return;
    }

    const payload = {
      ...formData,
      included: formData.includedRaw.split(',').map(s => s.trim()).filter(Boolean),
      excluded: formData.excludedRaw.split(',').map(s => s.trim()).filter(Boolean),
    };
    delete payload.includedRaw;
    delete payload.excludedRaw;

    const endpoint = `${import.meta.env.VITE_API_URL}/api/${tab}`;
    const request = editingId 
      ? axios.put(`${endpoint}/${editingId}`, payload) // UPDATE
      : axios.post(endpoint, payload);                  // CREATE

    request.then(() => {
        setSubmitStatus('success');
        tab === 'tours' ? fetchTours() : fetchAdventures();
        cancelEdit();
        setTimeout(() => setSubmitStatus(null), 4000);
      })
      .catch(err => { console.error(err); setSubmitStatus('error'); });
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Delete this ${tab.slice(0,-1)}? Cannot be undone.`)) return;
    axios.delete(`${import.meta.env.VITE_API_URL}/api/${tab}/${id}`)
      .then(() => tab === 'tours' ? fetchTours() : fetchAdventures())
      .catch(console.error);
  };

  const updateInquiryStatus = (id, status) => {
    axios.patch(`${import.meta.env.VITE_API_URL}/api/inquiries/${id}`, { status })
      .then(() => fetchInquiries()).catch(console.error);
  };

  // ─── RENDER HELPERS ───
  const activeData = tab === 'tours' ? tours : adventures;
  const isTour = tab === 'tours';

  return (
    <div className="admin-layout">

      {/* ─── SIDEBAR ─── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-logo">Samye</span>
          <span className="admin-sidebar-sub">Admin Panel</span>
        </div>
        <nav className="admin-sidebar-nav">
          <span className={`admin-nav-item ${tab === 'tours' ? 'active' : ''}`} onClick={() => handleTabSwitch('tours')}>Tours</span>
          <span className={`admin-nav-item ${tab === 'adventures' ? 'active' : ''}`} onClick={() => handleTabSwitch('adventures')}>Adventures</span>
          <span className={`admin-nav-item ${tab === 'inquiries' ? 'active' : ''}`} onClick={() => handleTabSwitch('inquiries')}>Inquiries
            {inquiries.filter(i => i.status === 'new').length > 0 && (
              <span className="admin-badge">{inquiries.filter(i => i.status === 'new').length}</span>
            )}
          </span>
          <Link to="/" className="admin-nav-item">View Live Site</Link>
        </nav>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="admin-main">

        {(tab === 'tours' || tab === 'adventures') && (
          <>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">{isTour ? 'Tour' : 'Adventure'} Management</h1>
                <p className="admin-page-subtitle">Add, edit, and remove {tab}</p>
              </div>
            </div>

            {/* ─── DYNAMIC FORM ─── */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">{editingId ? 'Edit' : 'Add New'} {isTour ? 'Package' : 'Adventure'}</h2>
                {editingId && <button type="button" onClick={cancelEdit} className="admin-refresh-btn">Cancel Edit</button>}
              </div>

              {submitStatus === 'success' && <div className="admin-alert success">✓ Successfully saved!</div>}
              {submitStatus === 'error' && <div className="admin-alert error">✗ Failed to save. Check the console.</div>}

              <form onSubmit={handleSubmit} className="admin-form">
                
                {/* Shared Field */}
                <div className="admin-form-group">
                  <label className="admin-label">Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} required className="admin-input" />
                </div>

                {/* Conditional Fields based on Tab */}
                {isTour ? (
                  <>
                    <div className="admin-form-group">
                      <label className="admin-label">Destination</label>
                      <select name="destination" value={formData.destination || ''} onChange={handleChange} className="admin-input">
                        <option>Nepal</option><option>Tibet</option><option>India</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Difficulty</label>
                      <select name="difficulty" value={formData.difficulty || ''} onChange={handleChange} className="admin-input">
                        <option>Easy</option><option>Moderate</option><option>Hard</option><option>Challenging</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-form-group">
                      <label className="admin-label">Location</label>
                      <input name="location" value={formData.location || ''} onChange={handleChange} required className="admin-input" />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Sport Type</label>
                      <input name="sportType" value={formData.sportType || ''} onChange={handleChange} required placeholder="e.g. Rafting" className="admin-input" />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Intensity</label>
                      <select name="intensity" value={formData.intensity || ''} onChange={handleChange} className="admin-input">
                        <option>Easy</option><option>Moderate</option><option>Intense</option><option>Extreme</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Minimum Age</label>
                      <input name="minAge" value={formData.minAge || ''} onChange={handleChange} placeholder="e.g. 16+" className="admin-input" />
                    </div>
                  </>
                )}

                <div className="admin-form-group">
                  <label className="admin-label">Duration</label>
                  <input name="duration" value={formData.duration} onChange={handleChange} required placeholder="e.g. 14 Days" className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Price (USD)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Local Price (NPR)</label>
                  <input type="number" name="localPrice" value={formData.localPrice} onChange={handleChange} required className="admin-input" />
                </div>

                {/* ─── NEW CLOUDINARY IMAGE UPLOADERS ─── */}
                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Card Image (Required)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleSingleFileUpload(e, 'cardImage')} className="admin-input" style={{ padding: '8px' }} />
                  {formData.cardImage && (
                    <img src={formData.cardImage} alt="Card Preview" style={{ width: '150px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Hero Image (Required)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleSingleFileUpload(e, 'heroImage')} className="admin-input" style={{ padding: '8px' }} />
                  {formData.heroImage && (
                    <img src={formData.heroImage} alt="Hero Preview" style={{ width: '100%', maxHeight: '200px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Gallery Images (Select up to 10)</label>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="admin-input" style={{ padding: '8px' }} />
                  {uploadingImage && <p className="admin-label-hint">Uploading images to Cloudinary...</p>}
                  
                  {formData.galleryImages?.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {formData.galleryImages.map((url, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img src={url} alt={`Gallery ${index}`} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            style={{ position: 'absolute', top: '5px', right: '5px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ─── TEXT & ITINERARY ─── */}
                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="admin-input admin-textarea"></textarea>
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Included (comma-separated)</label>
                  <input name="includedRaw" value={formData.includedRaw} onChange={handleChange} className="admin-input" />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Excluded (comma-separated)</label>
                  <input name="excludedRaw" value={formData.excludedRaw} onChange={handleChange} className="admin-input" />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Itinerary Phases</label>
                  {formData.itinerary.map((day, index) => (
                    <div key={index} className="admin-itinerary-row">
                      <div className="admin-itinerary-day-badge">{isTour ? 'Day' : 'Phase'} {day.day}</div>
                      <input className="admin-input admin-itinerary-title" placeholder="Title" value={day.title} onChange={e => updateDay(index, 'title', e.target.value)} required />
                      <textarea className="admin-input admin-textarea admin-itinerary-desc" placeholder="Details..." value={day.description} onChange={e => updateDay(index, 'description', e.target.value)} rows="2" />
                      <button type="button" className="admin-itinerary-remove" onClick={() => removeDay(index)}>✕</button>
                    </div>
                  ))}
                  <button type="button" className="admin-add-day-btn" onClick={addDay}>+ Add {isTour ? 'Day' : 'Phase'}</button>
                </div>

                <div className="admin-form-full">
                  <button type="submit" className="admin-submit-btn" disabled={uploadingImage}>
                    {editingId ? 'Update' : 'Publish'} {isTour ? 'Tour' : 'Adventure'}
                  </button>
                </div>
              </form>
            </div>

            {/* ─── DYNAMIC DATA TABLE ─── */}
            <div className="admin-card" style={{ marginTop: '28px' }}>
              <div className="admin-card-header">
                <h2 className="admin-card-title">Active {isTour ? 'Tours' : 'Adventures'}</h2>
                <span className="admin-card-count">{activeData.length} total</span>
              </div>

              {activeData.length === 0 ? <p className="admin-empty-state">No data found.</p> : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>{isTour ? 'Destination' : 'Location'}</th>
                        <th>Price</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeData.map(item => (
                        <tr key={item._id}>
                          <td className="admin-td-title">{item.title}</td>
                          <td><span className="admin-destination-badge">{isTour ? item.destination : item.location}</span></td>
                          <td className="admin-td-price">${item.price}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => handleEdit(item)} className="admin-action-view" style={{ marginRight: '8px', cursor: 'pointer', background: 'none', border: 'none', color: '#1a5c9e', fontWeight: 'bold' }}>Edit</button>
                            <button onClick={() => handleDelete(item._id)} className="admin-action-delete">Delete</button>
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

        {/* ─── INQUIRIES TAB ─── */}
        {tab === 'inquiries' && (
          <>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">Inquiries</h1>
              </div>
              <button className="admin-refresh-btn" onClick={fetchInquiries}>↺ Refresh</button>
            </div>
            {!loadingInquiries && inquiries.length > 0 && (
              <div className="admin-inquiry-list">
                {inquiries.map(inq => (
                  <div key={inq._id} className={`admin-inquiry-card status-${inq.status}`}>
                    <div className="admin-inquiry-header" onClick={() => setExpandedInquiry(expandedInquiry === inq._id ? null : inq._id)}>
                      <div className="admin-inquiry-header-left">
                        <span className={`admin-inquiry-status-dot status-${inq.status}`}></span>
                        <div><strong className="admin-inquiry-name">{inq.name}</strong><span className="admin-inquiry-email">{inq.email}</span></div>
                      </div>
                      <div className="admin-inquiry-header-right">
                        <span className="admin-inquiry-date">{new Date(inq.createdAt).toLocaleDateString()}</span>
                        <span className="admin-inquiry-chevron">{expandedInquiry === inq._id ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {expandedInquiry === inq._id && (
                      <div className="admin-inquiry-body">
                        <p><strong>Subject:</strong> {inq.subject}</p>
                        <p><strong>Message:</strong> {inq.message}</p>
                        <div className="admin-inquiry-actions" style={{marginTop: '15px'}}>
                          {['new', 'contacted', 'converted', 'closed'].map(s => (
                            <button key={s} onClick={() => updateInquiryStatus(inq._id, s)} className={`admin-status-btn ${inq.status === s ? 'active' : ''} status-btn-${s}`}>
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