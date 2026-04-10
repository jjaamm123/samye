import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AdminDashboard() {
  const [tours, setTours] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [formData, setFormData] = useState({
    title: '',
    destination: 'Nepal',
    duration: '',
    price: '',
    difficulty: 'Moderate',
    description: '',
    featuredImage: '/images/safari.jpg'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/tours', formData)
      .then(() => {
        setSubmitStatus('success');
        fetchTours();
        setFormData({
          title: '', destination: 'Nepal', duration: '', price: '',
          difficulty: 'Moderate', description: '', featuredImage: '/images/safari.jpg'
        });
        setTimeout(() => setSubmitStatus(null), 4000); 
      })
      .catch(err => {
        console.error(err);
        setSubmitStatus('error');
      });
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
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Everest Base Camp Trek"
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Destination</label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="Nepal">Nepal</option>
                <option value="Tibet">Tibet</option>
                <option value="India">India</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Duration (Days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="e.g. 14"
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Price (USD)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="e.g. 1800"
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-label">Short Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe the tour experience..."
                className="admin-input admin-textarea"
              ></textarea>
            </div>

            <div className="admin-form-full">
              <button type="submit" className="admin-submit-btn">
                + Publish Tour
              </button>
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
                      <td>
                        <span className="admin-destination-badge">{tour.destination}</span>
                      </td>
                      <td>{tour.duration} days</td>
                      <td className="admin-td-price">${tour.price}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={`/tour/${tour._id}`} className="admin-action-view">
                          View Live ↗
                        </Link>
                        <button
                          onClick={() => handleDelete(tour._id)}
                          className="admin-action-delete"
                        >
                          Delete
                        </button>
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