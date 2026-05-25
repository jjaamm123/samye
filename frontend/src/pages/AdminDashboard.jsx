import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const EMPTY_DAY = { day: '', title: '', description: '' };

const EMPTY_TOUR = {
  title: '', destination: 'Nepal', duration: '', price: '', localPrice: '',
  difficulty: 'Moderate', description: '', 
  cardImage: '', heroImage: '', galleryImages: [],
  includedRaw: '', excludedRaw: '', itinerary: []
};

const EMPTY_ADVENTURE = {
  title: '', location: '', sportType: '', duration: '', price: '', localPrice: '', minAge: '16+',
  intensity: 'Moderate', description: '', 
  cardImage: '', heroImage: '', galleryImages: [],
  includedRaw: '', excludedRaw: '', itinerary: []
};

const EMPTY_GALLERY = {
  title: '', location: '', category: 'Scenic Views', mediaType: 'image', mediaUrl: ''
};

function AdminDashboard() {
  const [tab, setTab] = useState('tours'); // 'tours', 'adventures', 'inquiries', 'gallery'
  
  const [tours, setTours] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [galleries, setGalleries] = useState([]);

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
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (tab === 'inquiries' && inquiries.length === 0) fetchInquiries();
  }, [tab]);

  const fetchTours = () => axios.get(`${import.meta.env.VITE_API_URL}/api/tours`).then(r => setTours(r.data)).catch(console.error);
  const fetchAdventures = () => axios.get(`${import.meta.env.VITE_API_URL}/api/adventures`).then(r => setAdventures(r.data)).catch(console.error);
  const fetchGalleries = () => axios.get(`${import.meta.env.VITE_API_URL}/api/gallery`).then(r => setGalleries(r.data)).catch(console.error);

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
    if (newTab === 'gallery') setFormData(EMPTY_GALLERY);
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
    if (tab === 'tours') setFormData(EMPTY_TOUR);
    else if (tab === 'adventures') setFormData(EMPTY_ADVENTURE);
    else if (tab === 'gallery') setFormData(EMPTY_GALLERY);
  };

  // ─── FORM HANDLERS ───
  const handleChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const addDay = () => setFormData(f => ({ ...f, itinerary: [...f.itinerary, { ...EMPTY_DAY, day: f.itinerary.length + 1 }] }));
  const updateDay = (index, field, value) => setFormData(f => ({ ...f, itinerary: f.itinerary.map((d, i) => i === index ? { ...d, [field]: value } : d) }));
  const removeDay = (index) => setFormData(f => ({ ...f, itinerary: f.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })) }));

  // ─── CLOUDINARY MEDIA UPLOAD LOGIC ───
  const uploadSingleMediaToCloud = async (file) => {
    const uploadData = new FormData();
    uploadData.append('image', file); // We use 'image' here so it matches the backend multer setup, Cloudinary auto-detects video
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
      const url = await uploadSingleMediaToCloud(file);
      setFormData(f => ({ ...f, [fieldName]: url }));
    } catch (err) {
      alert(`Failed to upload ${fieldName}. Ensure video files aren't too massive.`);
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
      const uploadPromises = files.map(file => uploadSingleMediaToCloud(file));
      const urls = await Promise.all(uploadPromises);
      setFormData(f => ({ ...f, galleryImages: [...(f.galleryImages || []), ...urls] }));
    } catch (err) {
      alert('Failed to upload some gallery images.');
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

    if (tab === 'gallery') {
        if (!formData.mediaUrl) {
            alert("Please upload the media file before saving.");
            return;
        }
        axios.post(`${import.meta.env.VITE_API_URL}/api/gallery`, formData)
            .then(() => {
                setSubmitStatus('success');
                fetchGalleries();
                setFormData(EMPTY_GALLERY);
                setTimeout(() => setSubmitStatus(null), 4000);
            })
            .catch(err => { console.error(err); setSubmitStatus('error'); });
        return;
    }
    
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
      ? axios.put(`${endpoint}/${editingId}`, payload) 
      : axios.post(endpoint, payload);                 

    request.then(() => {
        setSubmitStatus('success');
        tab === 'tours' ? fetchTours() : fetchAdventures();
        cancelEdit();
        setTimeout(() => setSubmitStatus(null), 4000);
      })
      .catch(err => { console.error(err); setSubmitStatus('error'); });
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Delete this item? Cannot be undone.`)) return;
    axios.delete(`${import.meta.env.VITE_API_URL}/api/${tab}/${id}`)
      .then(() => {
          if (tab === 'tours') fetchTours();
          else if (tab === 'adventures') fetchAdventures();
          else fetchGalleries();
      })
      .catch(console.error);
  };

  const updateInquiryStatus = (id, status) => {
    axios.patch(`${import.meta.env.VITE_API_URL}/api/inquiries/${id}`, { status })
      .then(() => fetchInquiries()).catch(console.error);
  };

  const activeData = tab === 'tours' ? tours : tab === 'adventures' ? adventures : galleries;
  const isTour = tab === 'tours';

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-logo">Samye</span>
          <span className="admin-sidebar-sub">Admin Panel</span>
        </div>
        <nav className="admin-sidebar-nav">
          <span className={`admin-nav-item ${tab === 'tours' ? 'active' : ''}`} onClick={() => handleTabSwitch('tours')}>Tours</span>
          <span className={`admin-nav-item ${tab === 'adventures' ? 'active' : ''}`} onClick={() => handleTabSwitch('adventures')}>Adventures</span>
          <span className={`admin-nav-item ${tab === 'gallery' ? 'active' : ''}`} onClick={() => handleTabSwitch('gallery')}>Media Gallery</span>
          <span className={`admin-nav-item ${tab === 'inquiries' ? 'active' : ''}`} onClick={() => handleTabSwitch('inquiries')}>Inquiries
            {inquiries.filter(i => i.status === 'new').length > 0 && (
              <span className="admin-badge">{inquiries.filter(i => i.status === 'new').length}</span>
            )}
          </span>
          <Link to="/" className="admin-nav-item">View Live Site</Link>
        </nav>
      </aside>

      <main className="admin-main">

        {/* ─── TOURS / ADVENTURES TAB ─── */}
        {(tab === 'tours' || tab === 'adventures') && (
          <>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">{isTour ? 'Tour' : 'Adventure'} Management</h1>
                <p className="admin-page-subtitle">Add, edit, and remove {tab}</p>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">{editingId ? 'Edit' : 'Add New'} {isTour ? 'Package' : 'Adventure'}</h2>
                {editingId && <button type="button" onClick={cancelEdit} className="admin-refresh-btn">Cancel Edit</button>}
              </div>

              {submitStatus === 'success' && <div className="admin-alert success">✓ Successfully saved!</div>}
              {submitStatus === 'error' && <div className="admin-alert error">✗ Failed to save. Check the console.</div>}

              <form onSubmit={handleSubmit} className="admin-form">
                
                <div className="admin-form-group">
                  <label className="admin-label">Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} required className="admin-input" />
                </div>

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

        {/* ─── GALLERY TAB ─── */}
        {tab === 'gallery' && (
          <>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">Media Gallery</h1>
                <p className="admin-page-subtitle">Upload photos and videos for the public gallery</p>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Upload New Media</h2>
              </div>
              
              {submitStatus === 'success' && <div className="admin-alert success">✓ Uploaded successfully!</div>}
              {submitStatus === 'error' && <div className="admin-alert error">✗ Failed to save. Check the console.</div>}

              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-group">
                  <label className="admin-label">Title (e.g. "Sunrise at EBC")</label>
                  <input name="title" value={formData.title} onChange={handleChange} required className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Location / Tag</label>
                  <input name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Everest Base Camp" className="admin-input" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="admin-input">
                    <option>Scenic Views</option>
                    <option>Customer Moments</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Media Type</label>
                  <select name="mediaType" value={formData.mediaType} onChange={handleChange} className="admin-input">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-label">Upload File</label>
                  <input 
                    type="file" 
                    accept={formData.mediaType === 'video' ? "video/*" : "image/*"} 
                    onChange={(e) => handleSingleFileUpload(e, 'mediaUrl')} 
                    className="admin-input" 
                    style={{ padding: '8px' }} 
                  />
                  {uploadingImage && <p className="admin-label-hint">Pushing to Cloudinary (this may take a moment for videos)...</p>}
                  
                  {formData.mediaUrl && formData.mediaType === 'image' && (
                    <img src={formData.mediaUrl} alt="Preview" style={{ width: '200px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                  {formData.mediaUrl && formData.mediaType === 'video' && (
                    <video src={formData.mediaUrl} controls style={{ width: '300px', marginTop: '10px', borderRadius: '8px' }} />
                  )}
                </div>

                <div className="admin-form-full">
                  <button type="submit" className="admin-submit-btn" disabled={uploadingImage}>Publish to Gallery</button>
                </div>
              </form>
            </div>

            <div className="admin-card" style={{ marginTop: '28px' }}>
              <div className="admin-card-header">
                <h2 className="admin-card-title">Live Gallery Assets</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {galleries.map(item => (
                  <div key={item._id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', position: 'relative', paddingBottom: '10px' }}>
                    {item.mediaType === 'video' ? (
                      <video src={item.mediaUrl} style={{ width: '100%', height: '140px', objectFit: 'cover', backgroundColor: '#000' }} />
                    ) : (
                      <img src={item.mediaUrl} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: '10px' }}>
                      <p style={{ fontWeight: 'bold', margin: '0 0 4px', fontSize: '0.9rem' }}>{item.title}</p>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0' }}>{item.category} • {item.location}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      style={{ position: 'absolute', top: '8px', right: '8px', background: '#e63946', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '0.8rem' }}
                    >Delete</button>
                  </div>
                ))}
              </div>
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