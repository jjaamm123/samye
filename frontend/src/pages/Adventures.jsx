import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdventureCard from '../components/AdventureCard';
import Loader from '../components/Loader';
import '../App.css';

function Adventures() {
  const [adventures, setAdventures] = useState([]);
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
    axios.get(`${import.meta.env.VITE_API_URL}/api/adventures`)
      .then(res => { setAdventures(res.data); setLoading(false); })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError("Could not load adventure packages.");
        setLoading(false);
      });
  }, []);

  const sportTypes = ['All', ...new Set(adventures.map(a => a.sportType).filter(Boolean))];

  const filteredAdventures = adventures.filter(a => {
    const matchesSearch = !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.sportType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || a.sportType === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="app-wrapper">

      <Navbar />

      <div
        className="page-hero"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Adrenaline & Thrill</span>
          <h1 className="page-hero-title">Adventure Sports</h1>
        </div>
      </div>

      <div className="adventure-sport-strip">
        {[
          { label: 'Rafting',     icon: '🌊' },
          { label: 'Paragliding', icon: '🪂' },
          { label: 'Bungee',      icon: '🪢' },
          { label: 'Climbing',    icon: '🧗' },
          { label: 'Biking',      icon: '🚵' },
          { label: 'Zipline',     icon: '🏹' },
        ].map(sport => (
          <button
            key={sport.label}
            className={`adventure-sport-pill ${activeTab === sport.label ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === sport.label ? 'All' : sport.label)}
          >
            <span className="adventure-sport-icon">{sport.icon}</span>
            <span>{sport.label}</span>
          </button>
        ))}
      </div>

      <div className="content-container">

        <div className="listing-controls">
          <input
            type="text"
            className="listing-search-input"
            placeholder="Search adventures by name, sport, or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="listing-tabs">
            {sportTypes.map(tab => (
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

        {loading && <Loader message="Loading adventures..." />}
        {error && <p className="status-msg error">⚠️ {error}</p>}
        {!loading && !error && filteredAdventures.length === 0 && (
          <p className="status-msg">No adventures match your search. Try resetting the filter!</p>
        )}

        {!loading && !error && filteredAdventures.length > 0 && (
          <div className="tours-grid" style={{ marginTop: '40px' }}>
            {filteredAdventures.map(adv => (
              <AdventureCard key={adv._id} adventure={adv} />
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdventureCard from '../components/AdventureCard';
import '../App.css';

function Adventures() {
  const [adventures, setAdventures] = useState([]);
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
    axios.get(`${import.meta.env.VITE_API_URL}/api/adventures`)
      .then(res => { setAdventures(res.data); setLoading(false); })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError("Could not load adventure packages.");
        setLoading(false);
      });
  }, []);

  const sportTypes = ['All', ...new Set(adventures.map(a => a.sportType).filter(Boolean))];

  const filteredAdventures = adventures.filter(a => {
    const matchesSearch = !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.sportType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || a.sportType === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="app-wrapper">

      <Navbar />

      <div
        className="page-hero"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Adrenaline & Thrill</span>
          <h1 className="page-hero-title">Adventure Sports</h1>
        </div>
      </div>

      <div className="adventure-sport-strip">
        {[
          { label: 'Rafting',     icon: '🌊' },
          { label: 'Paragliding', icon: '🪂' },
          { label: 'Bungee',      icon: '🪢' },
          { label: 'Climbing',    icon: '🧗' },
          { label: 'Biking',      icon: '🚵' },
          { label: 'Zipline',     icon: '🏹' },
        ].map(sport => (
          <button
            key={sport.label}
            className={`adventure-sport-pill ${activeTab === sport.label ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === sport.label ? 'All' : sport.label)}
          >
            <span className="adventure-sport-icon">{sport.icon}</span>
            <span>{sport.label}</span>
          </button>
        ))}
      </div>

      <div className="content-container">

        <div className="listing-controls">
          <input
            type="text"
            className="listing-search-input"
            placeholder="Search adventures by name, sport, or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="listing-tabs">
            {sportTypes.map(tab => (
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

        {loading && <Loader message="Loading adventures..." />}
        {error && <p className="status-msg error">⚠️ {error}</p>}
        {!loading && !error && filteredAdventures.length === 0 && (
          <p className="status-msg">No adventures match your search. Try resetting the filter!</p>
        )}

        {!loading && !error && filteredAdventures.length > 0 && (
          <div className="tours-grid" style={{ marginTop: '40px' }}>
            {filteredAdventures.map(adv => (
              <AdventureCard key={adv._id} adventure={adv} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default Adventures;