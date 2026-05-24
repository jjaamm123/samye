// src/pages/Packages.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Map, Activity, AlertCircle } from 'lucide-react';
import TourCard from '../components/TourCard';
import AdventureCard from '../components/AdventureCard';
import { CurrencyContext } from '../context/CurrencyContext'; 
import '../App.css';

function Packages() {
  const { currency, toggleCurrency } = useContext(CurrencyContext);

  const [tours, setTours] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingAdv, setLoadingAdv] = useState(true);
  const [errorTours, setErrorTours] = useState(null);
  const [errorAdv, setErrorAdv] = useState(null);

  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tours');
  const [tourFilter, setTourFilter] = useState('All');
  const [adventureFilter, setAdventureFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tours')
      .then(r => setTours(r.data))
      .catch(() => setErrorTours('Could not load tour packages.'))
      .finally(() => setLoadingTours(false));

    axios.get('http://localhost:5000/api/adventures')
      .then(r => setAdventures(r.data))
      .catch(() => setErrorAdv('Could not load adventure packages.'))
      .finally(() => setLoadingAdv(false));
  }, []);

  const handleCategorySwitch = (cat) => {
    setActiveCategory(cat);
    setSearch('');
  };

  const tourFilterOptions = ['All', ...new Set(tours.map(t => t.destination).filter(Boolean))];

  const filteredTours = tours.filter(t => {
    const matchFilter = tourFilter === 'All' || t.destination === tourFilter;
    const matchSearch = !search
      || t.title?.toLowerCase().includes(search.toLowerCase())
      || t.destination?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const adventureFilterOptions = ['All', ...new Set(adventures.map(a => a.intensity).filter(Boolean))];

  const filteredAdventures = adventures.filter(a => {
    const matchFilter = adventureFilter === 'All' || a.intensity === adventureFilter;
    const matchSearch = !search
      || a.title?.toLowerCase().includes(search.toLowerCase())
      || a.sportType?.toLowerCase().includes(search.toLowerCase())
      || a.location?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const isTours = activeCategory === 'tours';
  const loading = isTours ? loadingTours : loadingAdv;
  const error   = isTours ? errorTours   : errorAdv;
  const count   = isTours ? filteredTours.length : filteredAdventures.length;

  const heroImage = isTours
    ? 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80'
    : 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/packages" className="active-link">Packages</Link>
          <Link to="/custom-tour">Build My Trip</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      <div className="packages-hero" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="packages-hero-overlay"></div>
        <div className="packages-hero-content">
          <span className="packages-hero-eyebrow" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            {isTours ? 'Cultural Heritage' : 'Adventure Expeditions'}
          </span>
          <h1 className="packages-hero-title" style={{ fontWeight: '700', letterSpacing: '-1px' }}>Our Curated Packages</h1>
          <p className="packages-hero-sub" style={{ fontSize: '1.2rem', fontWeight: '300' }}>
            {isTours
              ? 'Guided treks, luxury monastery stays, and premium heritage circuits.'
              : 'White-water rafting, paragliding, and high-altitude Himalayan climbing.'}
          </p>
        </div>

        <div className="packages-toggle-wrapper">
          <div className="packages-toggle" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div
              className="packages-toggle-slider"
              style={{ transform: isTours ? 'translateX(-5%)' : 'translateX(100%)', background: '#f1f5f9', border: '1px solid #e2e8f0' }}
            ></div>
            <button
              className={`packages-toggle-btn ${isTours ? 'active' : ''}`}
              onClick={() => handleCategorySwitch('tours')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                color: isTours ? '#0f172a' : '#94a3b8', /* <-- Forces dark text when active, gray when inactive */
                zIndex: 2, fontWeight: '600', transition: 'color 0.2s' 
              }}
            >
              <Map size={18} /> Tours & Treks
            </button>
            <button
              className={`packages-toggle-btn ${!isTours ? 'active' : ''}`}
              onClick={() => handleCategorySwitch('adventures')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                color: !isTours ? '#0f172a' : '#94a3b8', /* <-- Forces dark text when active, gray when inactive */
                zIndex: 2, fontWeight: '600', transition: 'color 0.2s' 
              }}
            >
              <Activity size={18} /> Adventure Sports
            </button>
          </div>
        </div>
      </div>

      {/* ── FLATTENED CURRENCY TOGGLE ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '32px', paddingRight: '5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: '#ffffff', borderRadius: '8px', padding: '4px', 
          display: 'flex', gap: '4px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' 
        }}>
          <button 
            onClick={() => currency !== 'USD' && toggleCurrency()} 
            style={{ 
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
              background: currency === 'USD' ? '#f1f5f9' : 'transparent', color: currency === 'USD' ? '#0f172a' : '#64748b', transition: 'all 0.2s ease' 
            }}
          >
            USD
          </button>
          <button 
            onClick={() => currency !== 'NPR' && toggleCurrency()} 
            style={{ 
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
              background: currency === 'NPR' ? '#f1f5f9' : 'transparent', color: currency === 'NPR' ? '#0f172a' : '#64748b', transition: 'all 0.2s ease' 
            }}
          >
            NPR
          </button>
        </div>
      </div>
      {/* ─────────────────────────────────── */}

      <div className="packages-controls" style={{ background: 'transparent', boxShadow: 'none', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="packages-search"
            placeholder={isTours ? 'Search destinations...' : 'Search activities...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '44px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)' }}
          />
        </div>
        
        <div className="packages-filters">
          {isTours
            ? tourFilterOptions.map(opt => (
                <button key={opt} className={`packages-filter-pill ${tourFilter === opt ? 'active' : ''}`} onClick={() => setTourFilter(opt)} style={{ border: tourFilter === opt ? '1px solid #1a5c9e' : '1px solid #e2e8f0' }}>
                  {opt}
                </button>
              ))
            : adventureFilterOptions.map(opt => (
                <button key={opt} className={`packages-filter-pill ${adventureFilter === opt ? 'active' : ''}`} onClick={() => setAdventureFilter(opt)} style={{ border: adventureFilter === opt ? '1px solid #1a5c9e' : '1px solid #e2e8f0' }}>
                  {opt}
                </button>
              ))
          }
        </div>
        {!loading && (
          <span className="packages-result-count" style={{ color: '#64748b', fontWeight: '500' }}>
            {count} {isTours ? 'itinerary' : 'activity'}{count !== 1 ? 'ies' : ''} found
          </span>
        )}
      </div>

      <div className="packages-grid-wrapper">
        {loading && <p className="status-msg" style={{ color: '#64748b' }}>Loading {isTours ? 'tours' : 'adventures'}…</p>}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', padding: '40px' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}
        
        {!loading && !error && count === 0 && (
          <div className="packages-empty-state" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
            <Search size={48} color="#cbd5e1" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
            <p style={{ color: '#475569', fontSize: '1.1rem' }}>No {isTours ? 'tours' : 'adventures'} match your current filters.</p>
            <button className="packages-reset-btn" onClick={() => { setSearch(''); isTours ? setTourFilter('All') : setAdventureFilter('All'); }} style={{ background: '#1a5c9e', borderRadius: '6px' }}>
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && count > 0 && (
          <>
            {isTours && tourFilter === 'All' ? (
              ['Nepal', 'Tibet', 'India'].map(dest => {
                const group = filteredTours.filter(t => t.destination === dest);
                if (group.length === 0) return null;
                return (
                  <div className="packages-destination-group" key={dest} style={{ borderBottom: dest !== 'India' ? '1px solid #e2e8f0' : 'none', paddingBottom: '40px', marginBottom: '40px' }}>
                    <div className="packages-group-header">
                      <h2 className="section-title" style={{ color: '#0f172a' }}>{dest} Expeditions</h2>
                      <p className="section-subtitle" style={{ color: '#64748b' }}>
                        {dest === 'Nepal' && 'Trekking routes, temples, and the roof of the world.'}
                        {dest === 'Tibet' && 'Sacred monasteries and high plateau journeys.'}
                        {dest === 'India' && 'Ancient heritage and spiritual heartlands.'}
                      </p>
                    </div>
                    <div className="tours-grid">
                      {group.map(tour => <TourCard key={tour._id} tour={tour} />)}
                    </div>
                  </div>
                );
              })
            ) : isTours ? (
              <div className="tours-grid">
                {filteredTours.map(tour => <TourCard key={tour._id} tour={tour} />)}
              </div>
            ) : (
              <div className="tours-grid">
                {filteredAdventures.map(adv => <AdventureCard key={adv._id} adventure={adv} />)}
              </div>
            )}
          </>
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Samye Travels</span>
            <p>Crafting sacred journeys across Nepal, Tibet & India since 2010.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/custom-tour">Build My Trip</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <p>namaste@samyetravels.com</p>
            <p>+977 1-4412345</p>
            <p>Thamel, Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Samye Travels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Packages;