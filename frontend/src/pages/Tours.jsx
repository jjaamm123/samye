import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TourCard from '../components/TourCard';
import Loader from '../components/Loader';
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

      <Navbar />

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
          { label: 'Nepal', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
          { label: 'Tibet', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
          { label: 'India', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> }
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

        {loading && <Loader message="Curating available journeys..." />}
        {error && <p className="status-msg error"><svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>{error}</p>}
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

    </div>
  );
}

export default Tours;
