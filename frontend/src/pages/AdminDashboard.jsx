import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tours'); 
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [inquiries, setInquiries] = useState([]);
  const [tours, setTours] = useState([]);
  const [isEditingTour, setIsEditingTour] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);
  const [tourFormData, setTourFormData] = useState({
    title: '', destination: 'Nepal', duration: '', price: '', difficulty: 'Moderate',
    description: '', featuredImage: '/images/cards/heritage.jpg', itinerary: [], gallery: [] 
  });
  const [expandedInquiryId, setExpandedInquiryId] = useState(null);
  const [adventures, setAdventures] = useState([]);
  const [isEditingAdv, setIsEditingAdv] = useState(false);
  const [editingAdvId, setEditingAdvId] = useState(null);
  const [advFormData, setAdvFormData] = useState({
    title: '', sportType: 'Rafting', location: '', duration: '', price: '', intensity: 'Moderate', minAge: '16+',
    description: '', featuredImage: '', safetyNotes: '', included: [], gallery: [], itinerary: [] 
  });

  useEffect(() => { 
    fetchTours(); 
    fetchAdventures();
    axios.get('http://localhost:5000/api/inquiries').then(res => setInquiries(res.data)).catch(console.error);
  }, []);

  const fetchTours = () => axios.get('http://localhost:5000/api/tours').then(res => setTours(res.data)).catch(console.error);
  const fetchAdventures = () => axios.get('http://localhost:5000/api/adventures').then(res => setAdventures(res.data)).catch(console.error);

  const handleTourChange = (e) => setTourFormData({ ...tourFormData, [e.target.name]: e.target.value });
  
  const handleTourItineraryChange = (index, value) => {
    const newItinerary = [...tourFormData.itinerary];
    newItinerary[index].activity = value;
    setTourFormData({ ...tourFormData, itinerary: newItinerary });
  };
  const addTourItineraryDay = () => setTourFormData({ ...tourFormData, itinerary: [...tourFormData.itinerary, { day: tourFormData.itinerary.length + 1, activity: '' }] });
  const removeTourItineraryDay = (indexToRemove) => {
    const filtered = tourFormData.itinerary.filter((_, index) => index !== indexToRemove);
    const renumbered = filtered.map((item, index) => ({ ...item, day: index + 1 }));
    setTourFormData({ ...tourFormData, itinerary: renumbered });
  };

  const handleEditTourClick = (tour) => {
    setIsEditingTour(true);
    setEditingTourId(tour._id);
    setTourFormData({
      title: tour.title, destination: tour.destination, duration: tour.duration, price: tour.price, difficulty: tour.difficulty,
      description: tour.description, featuredImage: tour.featuredImage || '', itinerary: tour.itinerary || [], gallery: tour.gallery || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelTourEdit = () => {
    setIsEditingTour(false); setEditingTourId(null);
    setTourFormData({ title: '', destination: 'Nepal', duration: '', price: '', difficulty: 'Moderate', description: '', featuredImage: '/images/cards/heritage.jpg', itinerary: [], gallery: [] });
  };

  const handleTourSubmit = (e) => {
    e.preventDefault();
    const request = isEditingTour ? axios.put(`http://localhost:5000/api/tours/${editingTourId}`, tourFormData) : axios.post('http://localhost:5000/api/tours', tourFormData);
    request.then(() => {
      setSubmitStatus('success'); fetchTours(); handleCancelTourEdit(); setTimeout(() => setSubmitStatus(null), 4000); 
    }).catch(() => setSubmitStatus('error'));
  };

  const handleTourDelete = (id) => {
    if (window.confirm("Delete this tour? This cannot be undone.")) {
      axios.delete(`http://localhost:5000/api/tours/${id}`).then(() => fetchTours()).catch(console.error);
    }
  };

  const handleAdvChange = (e) => setAdvFormData({ ...advFormData, [e.target.name]: e.target.value });

  const handleAdvItineraryChange = (index, value) => {
    const newItinerary = [...advFormData.itinerary];
    newItinerary[index].activity = value;
    setAdvFormData({ ...advFormData, itinerary: newItinerary });
  };
  const addAdvItineraryDay = () => setAdvFormData({ ...advFormData, itinerary: [...advFormData.itinerary, { day: advFormData.itinerary.length + 1, activity: '' }] });
  const removeAdvItineraryDay = (indexToRemove) => {
    const filtered = advFormData.itinerary.filter((_, index) => index !== indexToRemove);
    const renumbered = filtered.map((item, index) => ({ ...item, day: index + 1 }));
    setAdvFormData({ ...advFormData, itinerary: renumbered });
  };

  const handleEditAdvClick = (adv) => {
    setIsEditingAdv(true);
    setEditingAdvId(adv._id);
    setAdvFormData({
      title: adv.title, sportType: adv.sportType, location: adv.location, duration: adv.duration, price: adv.price, intensity: adv.intensity, minAge: adv.minAge || '16+',
      description: adv.description, featuredImage: adv.featuredImage || '', safetyNotes: adv.safetyNotes || '', included: adv.included || [], gallery: adv.gallery || [], itinerary: adv.itinerary || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelAdvEdit = () => {
    setIsEditingAdv(false); setEditingAdvId(null);
    setAdvFormData({ title: '', sportType: 'Rafting', location: '', duration: '', price: '', intensity: 'Moderate', minAge: '16+', description: '', featuredImage: '', safetyNotes: '', included: [], gallery: [], itinerary: [] });
  };

  const handleAdvSubmit = (e) => {
    e.preventDefault();
    const request = isEditingAdv ? axios.put(`http://localhost:5000/api/adventures/${editingAdvId}`, advFormData) : axios.post('http://localhost:5000/api/adventures', advFormData);
    request.then(() => {
      setSubmitStatus('success'); fetchAdventures(); handleCancelAdvEdit(); setTimeout(() => setSubmitStatus(null), 4000); 
    }).catch(() => setSubmitStatus('error'));
  };

  const handleAdvDelete = (id) => {
    if (window.confirm("Delete this adventure? This cannot be undone.")) {
      axios.delete(`http://localhost:5000/api/adventures/${id}`).then(() => fetchAdventures()).catch(console.error);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-logo">Samye</span>
          <span className="admin-sidebar-sub">Admin Panel</span>
        </div>
        <nav className="admin-sidebar-nav">
          <span 
            className={`admin-nav-item ${activeTab === 'tours' ? 'active' : ''}`} 
            onClick={() => setActiveTab('tours')} 
            style={{ cursor: 'pointer' }}
          >
            📦 Tour Packages
          </span>
          <span 
            className={`admin-nav-item ${activeTab === 'adventures' ? 'active' : ''}`} 
            onClick={() => setActiveTab('adventures')} 
            style={{ cursor: 'pointer' }}
          >
            🏄 Adventure Sports
          </span>
          <div style={{ margin: '20px 0', borderBottom: '1px solid #334' }}></div>
          <a 
            className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`} 
            onClick={() => setActiveTab('inquiries')}
            style={{ cursor: 'pointer' }}
          >
            📥 Inquiries ({inquiries.length})
          </a>
          <Link to="/" className="admin-nav-item">🌐 View Live Site</Link>
        </nav>
        <div className="admin-sidebar-stats">
          <div className="admin-stat">
            <span className="admin-stat-number">{activeTab === 'tours' ? tours.length : activeTab === 'adventures' ? adventures.length : inquiries.length}</span>
            <span className="admin-stat-label">Total Records</span>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">
              {activeTab === 'tours' ? 'Tour Management' : activeTab === 'adventures' ? 'Adventure Management' : 'Customer Inquiries'}
            </h1>
            <p className="admin-page-subtitle">
              {activeTab === 'tours' ? 'Add, review, and modify tour packages' : activeTab === 'adventures' ? 'Add, review, and modify adventure sports' : 'Review and manage custom trip requests'}
            </p>
          </div>
        </div>

        {activeTab === 'tours' && (
          <>
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">{isEditingTour ? "Edit Tour Package" : "Add New Tour Package"}</h2>
              </div>

              {submitStatus === 'success' && <div className="admin-alert success">✓ Tour {isEditingTour ? 'updated' : 'published'} successfully!</div>}
              {submitStatus === 'error' && <div className="admin-alert error">✗ Failed to save. Check the console.</div>}

              <form onSubmit={handleTourSubmit} className="admin-form">
                <div className="admin-form-group"><label className="admin-label">Tour Title</label><input type="text" name="title" value={tourFormData.title} onChange={handleTourChange} required className="admin-input" /></div>
                <div className="admin-form-group"><label className="admin-label">Destination</label><select name="destination" value={tourFormData.destination} onChange={handleTourChange} className="admin-input"><option value="Nepal">Nepal</option><option value="Tibet">Tibet</option><option value="India">India</option></select></div>
                <div className="admin-form-group"><label className="admin-label">Duration (Days)</label><input type="number" name="duration" value={tourFormData.duration} onChange={handleTourChange} required className="admin-input" /></div>
                <div className="admin-form-group"><label className="admin-label">Price (USD)</label><input type="number" name="price" value={tourFormData.price} onChange={handleTourChange} required className="admin-input" /></div>
                <div className="admin-form-group"><label className="admin-label">Difficulty</label><select name="difficulty" value={tourFormData.difficulty} onChange={handleTourChange} className="admin-input"><option value="Easy">Easy</option><option value="Moderate">Moderate</option><option value="Hard">Hard</option><option value="Challenging">Challenging</option></select></div>
                <div className="admin-form-group"><label className="admin-label">Featured Image Path</label><input type="text" name="featuredImage" value={tourFormData.featuredImage} onChange={handleTourChange} required className="admin-input" /></div>
                <div className="admin-form-group admin-form-full"><label className="admin-label">Short Description</label><textarea name="description" value={tourFormData.description} onChange={handleTourChange} required rows="3" className="admin-input admin-textarea"></textarea></div>

                <div className="admin-form-group admin-form-full" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
                  <label className="admin-label" style={{ fontSize: '1.1rem', color: '#1a5c9e', marginBottom: '15px' }}>Day-by-Day Itinerary</label>
                  {tourFormData.itinerary.map((dayItem, index) => (
                    <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'flex-start' }}>
                      <div style={{ backgroundColor: '#f7f2e8', padding: '12px 15px', borderRadius: '4px', fontWeight: 'bold', color: '#1a5c9e', whiteSpace: 'nowrap', border: '1px solid #d4c4a4' }}>Day {dayItem.day}</div>
                      <input type="text" value={dayItem.activity} onChange={(e) => handleTourItineraryChange(index, e.target.value)} required className="admin-input" style={{ flex: 1 }} />
                      <button type="button" onClick={() => removeTourItineraryDay(index)} style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                    </div>
                  ))}
                  <button type="button" onClick={addTourItineraryDay} style={{ backgroundColor: '#eeddaa', color: '#050b16', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}>+ Add Day</button>
                </div>

                <div className="admin-form-group admin-form-full" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
                  <label className="admin-label" style={{ fontSize: '1.1rem', color: '#1a5c9e', marginBottom: '15px' }}>Gallery Photos</label>
                  {tourFormData.gallery.map((imgUrl, index) => (
                    <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                      <img src={imgUrl} alt="preview" style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} onError={(e) => e.target.style.display = 'none'} />
                      <input type="text" value={imgUrl} onChange={(e) => { const newGallery = [...tourFormData.gallery]; newGallery[index] = e.target.value; setTourFormData({ ...tourFormData, gallery: newGallery }); }} className="admin-input" style={{ flex: 1 }} required />
                      <button type="button" onClick={() => { const newGallery = tourFormData.gallery.filter((_, idx) => idx !== index); setTourFormData({ ...tourFormData, gallery: newGallery }); }} style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setTourFormData({ ...tourFormData, gallery: [...tourFormData.gallery, ''] })} style={{ backgroundColor: '#eeddaa', color: '#050b16', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}>+ Add Photo</button>
                </div>

                <div className="admin-form-full" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="submit" className="admin-submit-btn">{isEditingTour ? "Update Tour" : "+ Publish Tour"}</button>
                  {isEditingTour && <button type="button" onClick={handleCancelTourEdit} className="admin-submit-btn" style={{ backgroundColor: '#ccc', color: '#333' }}>Cancel</button>}
                </div>
              </form>
            </div>  

            <div className="admin-card" style={{ marginTop: '28px' }}>
              <div className="admin-card-header"><h2 className="admin-card-title">Active Tours</h2></div>
              {tours.length === 0 ? <p className="admin-empty-state">No tours yet.</p> : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>Title</th><th>Destination</th><th>Duration</th><th>Price</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                      {tours.map(tour => (
                        <tr key={tour._id}>
                          <td className="admin-td-title">{tour.title}</td><td><span className="admin-destination-badge">{tour.destination}</span></td><td>{tour.duration} days</td><td className="admin-td-price">${tour.price}</td>
                          <td style={{ textAlign: 'right' }}>
                            <Link to={`/tour/${tour._id}`} className="admin-action-view" style={{ marginRight: '15px' }}>View ↗</Link>
                            <button onClick={() => handleEditTourClick(tour)} className="admin-action-view" style={{ marginRight: '15px', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: '#1a5c9e' }}>Edit ✎</button>
                            <button onClick={() => handleTourDelete(tour._id)} className="admin-action-delete">Delete</button>
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

        {activeTab === 'inquiries' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Customer Inquiries</h3>
              <span className="admin-card-count">{inquiries.length} Total</span>
            </div>
            
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message Snippet</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <tr><td colSpan="5" className="admin-empty-state">No inquiries yet.</td></tr>
                  ) : (
                    inquiries.map(inq => (
                      <Fragment key={inq._id}>
                        <tr>
                          <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                          <td className="admin-td-title">{inq.name}</td>
                          <td>{inq.email}</td>
                          <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {inq.message}
                          </td>
                          <td>
                            <button 
                              className="admin-action-view" 
                              onClick={() => setExpandedInquiryId(expandedInquiryId === inq._id ? null : inq._id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              {expandedInquiryId === inq._id ? 'Close ✕' : 'View Full ↓'}
                            </button>
                          </td>
                        </tr>
                        
                        {expandedInquiryId === inq._id && (
                          <tr style={{ backgroundColor: '#faf8f4' }}>
                            <td colSpan="5" style={{ padding: '20px 40px', borderTop: 'none' }}>
                              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '6px', border: '1px solid #e8dfc8', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f0e8d8', display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#666' }}>
                                  <span><strong>Phone:</strong> {inq.phone || 'N/A'}</span>
                                  <span><strong>Received:</strong> {new Date(inq.createdAt).toLocaleString()}</span>
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#050b16', fontSize: '0.95rem' }}>
                                  {inq.message}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'adventures' && (
          <>
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">{isEditingAdv ? "Edit Adventure Sport" : "Add New Adventure Sport"}</h2>
              </div>

              {submitStatus === 'success' && <div className="admin-alert success">✓ Adventure {isEditingAdv ? 'updated' : 'published'} successfully!</div>}
              {submitStatus === 'error' && <div className="admin-alert error">✗ Failed to save. Check the console.</div>}

              <form onSubmit={handleAdvSubmit} className="admin-form">
                <div className="admin-form-group"><label className="admin-label">Adventure Title</label><input type="text" name="title" value={advFormData.title} onChange={handleAdvChange} required placeholder="e.g. Trishuli River Rafting" className="admin-input" /></div>
                
                <div className="admin-form-group"><label className="admin-label">Sport Type</label>
                  <select name="sportType" value={advFormData.sportType} onChange={handleAdvChange} className="admin-input">
                    <option value="Rafting">Rafting</option><option value="Paragliding">Paragliding</option><option value="Bungee">Bungee</option>
                    <option value="Climbing">Climbing</option><option value="Biking">Biking</option><option value="Zipline">Zipline</option>
                    <option value="Kayaking">Kayaking</option>
                    <option value="Ultralight">Ultralight</option>
                    <option value="Helicopter">Helicopter</option>
                  </select>
                </div>

                <div className="admin-form-group"><label className="admin-label">Location</label><input type="text" name="location" value={advFormData.location} onChange={handleAdvChange} required placeholder="e.g. Pokhara, Nepal" className="admin-input" /></div>
                <div className="admin-form-group"><label className="admin-label">Duration</label><input type="text" name="duration" value={advFormData.duration} onChange={handleAdvChange} required placeholder="e.g. Half Day, 3 Hours" className="admin-input" /></div>
                <div className="admin-form-group"><label className="admin-label">Price (USD)</label><input type="number" name="price" value={advFormData.price} onChange={handleAdvChange} required className="admin-input" /></div>
                
                <div className="admin-form-group"><label className="admin-label">Intensity</label>
                  <select name="intensity" value={advFormData.intensity} onChange={handleAdvChange} className="admin-input">
                    <option value="Easy">Easy</option><option value="Moderate">Moderate</option><option value="Intense">Intense</option><option value="Extreme">Extreme</option>
                  </select>
                </div>

                <div className="admin-form-group"><label className="admin-label">Minimum Age</label><input type="text" name="minAge" value={advFormData.minAge} onChange={handleAdvChange} required placeholder="e.g. 16+" className="admin-input" /></div>
                <div className="admin-form-group"><label className="admin-label">Featured Image Path</label><input type="text" name="featuredImage" value={advFormData.featuredImage} onChange={handleAdvChange} required className="admin-input" /></div>
                
                <div className="admin-form-group admin-form-full"><label className="admin-label">Short Description</label><textarea name="description" value={advFormData.description} onChange={handleAdvChange} required rows="3" className="admin-input admin-textarea"></textarea></div>
                <div className="admin-form-group admin-form-full"><label className="admin-label">Safety Notes</label><textarea name="safetyNotes" value={advFormData.safetyNotes} onChange={handleAdvChange} rows="2" placeholder="e.g. Lifejackets provided, guide CPR certified..." className="admin-input admin-textarea"></textarea></div>

                <div className="admin-form-group admin-form-full" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
                  <label className="admin-label" style={{ fontSize: '1.1rem', color: '#1a5c9e', marginBottom: '15px' }}>What's Included</label>
                  {advFormData.included.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                      <span style={{color: '#2ecc71', fontWeight: 'bold'}}>✓</span>
                      <input type="text" value={item} onChange={(e) => { const newInc = [...advFormData.included]; newInc[index] = e.target.value; setAdvFormData({ ...advFormData, included: newInc }); }} className="admin-input" style={{ flex: 1 }} required />
                      <button type="button" onClick={() => { const newInc = advFormData.included.filter((_, idx) => idx !== index); setAdvFormData({ ...advFormData, included: newInc }); }} style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setAdvFormData({ ...advFormData, included: [...advFormData.included, ''] })} style={{ backgroundColor: '#eeddaa', color: '#050b16', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}>+ Add Included Item</button>
                </div>

                <div className="admin-form-group admin-form-full" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
                  <label className="admin-label" style={{ fontSize: '1.1rem', color: '#1a5c9e', marginBottom: '15px' }}>Schedule / Phases</label>
                  {advFormData.itinerary.map((dayItem, index) => (
                    <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'flex-start' }}>
                      <div style={{ backgroundColor: '#f7f2e8', padding: '12px 15px', borderRadius: '4px', fontWeight: 'bold', color: '#1a5c9e', whiteSpace: 'nowrap', border: '1px solid #d4c4a4' }}>Step {dayItem.day}</div>
                      <input type="text" value={dayItem.activity} onChange={(e) => handleAdvItineraryChange(index, e.target.value)} required placeholder="e.g. Safety Briefing and Gear Fitting" className="admin-input" style={{ flex: 1 }} />
                      <button type="button" onClick={() => removeAdvItineraryDay(index)} style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                    </div>
                  ))}
                  <button type="button" onClick={addAdvItineraryDay} style={{ backgroundColor: '#eeddaa', color: '#050b16', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}>+ Add Step</button>
                </div>

                <div className="admin-form-group admin-form-full" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
                  <label className="admin-label" style={{ fontSize: '1.1rem', color: '#1a5c9e', marginBottom: '15px' }}>Gallery Photos</label>
                  {advFormData.gallery.map((imgUrl, index) => (
                    <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                      <img src={imgUrl} alt="preview" style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} onError={(e) => e.target.style.display = 'none'} />
                      <input type="text" value={imgUrl} onChange={(e) => { const newGallery = [...advFormData.gallery]; newGallery[index] = e.target.value; setAdvFormData({ ...advFormData, gallery: newGallery }); }} className="admin-input" style={{ flex: 1 }} required />
                      <button type="button" onClick={() => { const newGallery = advFormData.gallery.filter((_, idx) => idx !== index); setAdvFormData({ ...advFormData, gallery: newGallery }); }} style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setAdvFormData({ ...advFormData, gallery: [...advFormData.gallery, ''] })} style={{ backgroundColor: '#eeddaa', color: '#050b16', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}>+ Add Photo</button>
                </div>

                <div className="admin-form-full" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="submit" className="admin-submit-btn">{isEditingAdv ? "Update Adventure" : "+ Publish Adventure"}</button>
                  {isEditingAdv && <button type="button" onClick={handleCancelAdvEdit} className="admin-submit-btn" style={{ backgroundColor: '#ccc', color: '#333' }}>Cancel</button>}
                </div>
              </form>
            </div>  

            <div className="admin-card" style={{ marginTop: '28px' }}>
              <div className="admin-card-header"><h2 className="admin-card-title">Active Adventures</h2></div>
              {adventures.length === 0 ? <p className="admin-empty-state">No adventures yet.</p> : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>Title</th><th>Sport</th><th>Location</th><th>Price</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                      {adventures.map(adv => (
                        <tr key={adv._id}>
                          <td className="admin-td-title">{adv.title}</td><td><span className="admin-destination-badge" style={{backgroundColor: '#e63946'}}>{adv.sportType}</span></td><td>{adv.location}</td><td className="admin-td-price">${adv.price}</td>
                          <td style={{ textAlign: 'right' }}>
                            <Link to={`/adventure/${adv._id}`} className="admin-action-view" style={{ marginRight: '15px' }}>View ↗</Link>
                            <button onClick={() => handleEditAdvClick(adv)} className="admin-action-view" style={{ marginRight: '15px', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: '#1a5c9e' }}>Edit ✎</button>
                            <button onClick={() => handleAdvDelete(adv._id)} className="admin-action-delete">Delete</button>
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

      </main>
    </div>
  );
}

export default AdminDashboard;