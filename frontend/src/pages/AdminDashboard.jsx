import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AdminDashboard() {
  const [tours, setTours] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    destination: 'Nepal',
    duration: '',
    price: '',
    difficulty: 'Moderate',
    description: '',
    featuredImage: '/images/cards/heritage.jpg',
    itinerary: [],
    gallery: [] 
  });

  useEffect(() => { fetchTours(); }, []);

  const fetchTours = () => {
    axios.get('http://localhost:5000/api/tours')
      .then(res => setTours(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleItineraryChange = (index, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index].activity = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, activity: '' }]
    });
  };

  // 3. Remove a day and re-number the remaining days so they stay sequential
  const removeItineraryDay = (indexToRemove) => {
    const filteredItinerary = formData.itinerary.filter((_, index) => index !== indexToRemove);
    const renumberedItinerary = filteredItinerary.map((item, index) => ({ ...item, day: index + 1 }));
    setFormData({ ...formData, itinerary: renumberedItinerary });
  };

  const handleEditClick = (tour) => {
    setIsEditing(true);
    setEditingId(tour._id);
    setFormData({
      title: tour.title,
      destination: tour.destination,
      duration: tour.duration,
      price: tour.price,
      difficulty: tour.difficulty,
      description: tour.description,
      featuredImage: tour.featuredImage || '',
      itinerary: tour.itinerary || [],
      gallery: tour.gallery || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '', destination: 'Nepal', duration: '', price: '',
      difficulty: 'Moderate', description: '', featuredImage: '/images/cards/heritage.jpg',
      itinerary: [] // Reset
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      axios.put(`http://localhost:5000/api/tours/${editingId}`, formData)
        .then(() => {
          setSubmitStatus('success');
          fetchTours();
          handleCancelEdit();
          setTimeout(() => setSubmitStatus(null), 4000); 
        })
        .catch(err => {
          console.error(err);
          setSubmitStatus('error');
        });
    } else {
      axios.post('http://localhost:5000/api/tours', formData)
        .then(() => {
          setSubmitStatus('success');
          fetchTours();
          handleCancelEdit(); 
          setTimeout(() => setSubmitStatus(null), 4000); 
        })
        .catch(err => {
          console.error(err);
          setSubmitStatus('error');
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this tour? This cannot be undone.")) {
      axios.delete(`http://localhost:5000/api/tours/${id}`)
        .then(() => fetchTours())
        .catch(err => console.error(err));
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
          <span className="admin-nav-item active">📦 Tour Packages</span>
          <Link to="/" className="admin-nav-item">🌐 View Live Site</Link>
        </nav>
        <div className="admin-sidebar-stats">
          <div className="admin-stat">
            <span className="admin-stat-number">{tours.length}</span>
            <span className="admin-stat-label">Active Tours</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-number">
              {[...new Set(tours.map(t => t.destination))].length}
            </span>
            <span className="admin-stat-label">Destinations</span>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Tour Management</h1>
            <p className="admin-page-subtitle">Add, review, and modify tour packages</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">{isEditing ? "Edit Package" : "Add New Package"}</h2>
          </div>

          {submitStatus === 'success' && (
            <div className="admin-alert success">✓ Tour {isEditing ? 'updated' : 'published'} successfully!</div>
          )}
          {submitStatus === 'error' && (
            <div className="admin-alert error">✗ Failed to save. Check the console.</div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label className="admin-label">Tour Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Everest Base Camp Trek" className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Destination</label>
              <select name="destination" value={formData.destination} onChange={handleChange} className="admin-input">
                <option value="Nepal">Nepal</option>
                <option value="Tibet">Tibet</option>
                <option value="India">India</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Duration (Days)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} required placeholder="e.g. 14" className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Price (USD)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 1800" className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="admin-input">
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Featured Image Path</label>
              <input type="text" name="featuredImage" value={formData.featuredImage} onChange={handleChange} required placeholder="/images/adventure/hero.jpg" className="admin-input" />
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-label">Short Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" placeholder="Describe the tour experience..." className="admin-input admin-textarea"></textarea>
            </div>

            {/* --- DETAILED ITINERARY BUILDER --- */}
            <div className="admin-form-group admin-form-full" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
              <label className="admin-label" style={{ fontSize: '1.1rem', color: '#1a5c9e', marginBottom: '15px' }}>Day-by-Day Itinerary</label>
              
              {formData.itinerary.map((dayItem, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: '#f7f2e8', padding: '12px 15px', borderRadius: '4px', fontWeight: 'bold', color: '#1a5c9e', whiteSpace: 'nowrap', border: '1px solid #d4c4a4' }}>
                    Day {dayItem.day}
                  </div>
                  <input
                    type="text"
                    value={dayItem.activity}
                    onChange={(e) => handleItineraryChange(index, e.target.value)}
                    placeholder="e.g. Arrive in Kathmandu, transfer to hotel and rest."
                    className="admin-input"
                    style={{ flex: 1 }}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => removeItineraryDay(index)} 
                    style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    title="Remove Day"
                  >
                    X
                  </button>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addItineraryDay} 
                style={{ backgroundColor: '#eeddaa', color: '#050b16', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}
              >
                + Add Day
              </button>
            </div>

            {/* --- NEW: GALLERY BUILDER --- */}
            <div className="admin-form-group admin-form-full" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
              <label className="admin-label" style={{ fontSize: '1.1rem', color: '#1a5c9e', marginBottom: '15px' }}>Gallery Photos</label>
              
              {formData.gallery.map((imgUrl, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                  <img src={imgUrl} alt="preview" style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} onError={(e) => e.target.style.display = 'none'} />
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => {
                      const newGallery = [...formData.gallery];
                      newGallery[index] = e.target.value;
                      setFormData({ ...formData, gallery: newGallery });
                    }}
                    placeholder="/images/cards/photo1.jpg"
                    className="admin-input"
                    style={{ flex: 1 }}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const newGallery = formData.gallery.filter((_, idx) => idx !== index);
                      setFormData({ ...formData, gallery: newGallery });
                    }} 
                    style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '12px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    X
                  </button>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, ''] })} 
                style={{ backgroundColor: '#eeddaa', color: '#050b16', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}
              >
                + Add Photo
              </button>
            </div>

            {/* --- SUBMIT BUTTONS --- */}
            <div className="admin-form-full" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button type="submit" className="admin-submit-btn">
                {isEditing ? "Update Tour" : "+ Publish Tour"}
              </button>
              
              {isEditing && (
                <button type="button" onClick={handleCancelEdit} className="admin-submit-btn" style={{ backgroundColor: '#ccc', color: '#333' }}>
                  Cancel
                </button>
              )}
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
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map(tour => (
                    <tr key={tour._id}>
                      <td className="admin-td-title">{tour.title}</td>
                      <td><span className="admin-destination-badge">{tour.destination}</span></td>
                      <td>{tour.duration} days</td>
                      <td className="admin-td-price">${tour.price}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={`/tour/${tour._id}`} className="admin-action-view" style={{ marginRight: '15px' }}>View ↗</Link>
                        
                        <button onClick={() => handleEditClick(tour)} className="admin-action-view" style={{ marginRight: '15px', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: '#1a5c9e' }}>
                          Edit ✎
                        </button>
                        
                        <button onClick={() => handleDelete(tour._id)} className="admin-action-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;