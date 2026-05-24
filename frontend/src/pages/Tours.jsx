import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TourCard from '../components/TourCard';
import '../App.css';

function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/tours`)
      .then((response) => {
        setTours(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError("Could not load tour packages.");
        setLoading(false);
      });
  }, []);

  const destinations = ['All', ...new Set(tours.map(t => t.destination).filter(Boolean))];

  const filteredTours = tours.filter(t => {
    const matchesSearch = !searchQuery ||
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || t.destination === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/tours" className="active-link">Tour Packages</Link>
          <Link to="/adventures">Adventure Sports</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      {/* Hero banner for Tours */}
      <div className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Cultural & Spiritual</span>
          <h1 className="page-hero-title">Tour Packages</h1>
        </div>
      </div>

      <div className="adventure-sport-strip">
        {[
          { label: 'Nepal', icon: '🏔️' },
          { label: 'Tibet', icon: '📿' },
          { label: 'India', icon: '🛕' }
        ].map(dest => (
          <button
            key={dest.label}
            className={`adventure-sport-pill ${activeTab === dest.label ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === dest.label ? 'All' : dest.label)}
          >
            <span className="adventure-sport-icon">{dest.icon}</span>
            <span>{dest.label}</span>
          </button>
        ))}
      </div>

      <div className="content-container">
        <div className="listing-controls">
          <input
            type="text"
            className="listing-search-input"
            placeholder="Search tours by name or destination..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="listing-tabs">
            {destinations.map(tab => (
              <button
                key={tab}
                className={`listing-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="status-msg">Loading tours...</p>}
        {error && <p className="status-msg error">⚠️ {error}</p>}
        {!loading && !error && filteredTours.length === 0 && (
          <p className="status-msg">No tours match your search. Try resetting the filter!</p>
        )}

        {!loading && !error && filteredTours.length > 0 && (
          <div className="tours-grid" style={{ marginTop: '40px' }}>
            {filteredTours.map(tour => (
              <TourCard key={tour._id} tour={tour} /> 
            ))}
          </div>
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Samye Travels</span>
            <p>Crafting sacred journeys across Nepal, Tibet & India since 2010.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Tours;