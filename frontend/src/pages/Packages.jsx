// src/pages/Packages.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TourCard from '../components/TourCard';
import AdventureCard from '../components/AdventureCard';
import '../App.css';

function Packages() {
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

      <div
        className="packages-hero"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="packages-hero-overlay"></div>

        <div className="packages-hero-content">
          {/* Eyebrow label updates with active category */}
          <span className="packages-hero-eyebrow">
            {isTours ? 'Cultural & Spiritual' : 'Adrenaline & Thrill'}
          </span>
          <h1 className="packages-hero-title">Choose Your Path</h1>
          <p className="packages-hero-sub">
            {isTours
              ? 'Guided treks, monastery stays, and heritage circuits across Nepal, Tibet & India.'
              : 'Rafting, paragliding, bungee, climbing — the Himalayas as your playground.'}
          </p>
        </div>

        <div className="packages-toggle-wrapper">
          <div className="packages-toggle">
            <div
              className="packages-toggle-slider"
              style={{ transform: isTours ? 'translateX(-5%)' : 'translateX(100%)' }}
            ></div>
            <button
              className={`packages-toggle-btn ${isTours ? 'active' : ''}`}
              onClick={() => handleCategorySwitch('tours')}
            >
              🏔️ Sacred Tours
            </button>
            <button
              className={`packages-toggle-btn ${!isTours ? 'active' : ''}`}
              onClick={() => handleCategorySwitch('adventures')}
            >
              🏄 Adrenaline Adventures
            </button>
          </div>
        </div>
      </div>

      <div className="packages-controls">

        <input
          type="text"
          className="packages-search"
          placeholder={isTours ? 'Search by title or destination…' : 'Search by sport, title, or location…'}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="packages-filters">
          {isTours
            ? tourFilterOptions.map(opt => (
                <button
                  key={opt}
                  className={`packages-filter-pill ${tourFilter === opt ? 'active' : ''}`}
                  onClick={() => setTourFilter(opt)}
                >
                  {opt}
                </button>
              ))
            : adventureFilterOptions.map(opt => (
                <button
                  key={opt}
                  className={`packages-filter-pill ${adventureFilter === opt ? 'active' : ''}`}
                  onClick={() => setAdventureFilter(opt)}
                >
                  {opt}
                </button>
              ))
          }
        </div>

        {!loading && (
          <span className="packages-result-count">
            {count} {isTours ? 'tour' : 'adventure'}{count !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      <div className="packages-grid-wrapper">

        {loading && (
          <p className="status-msg">Loading {isTours ? 'tours' : 'adventures'}…</p>
        )}

        {error && (
          <p className="status-msg error">⚠️ {error}</p>
        )}

        {!loading && !error && count === 0 && (
          <div className="packages-empty-state">
            <span>🔍</span>
            <p>No {isTours ? 'tours' : 'adventures'} match your filters. Try clearing the search or selecting "All".</p>
            <button
              className="packages-reset-btn"
              onClick={() => {
                setSearch('');
                isTours ? setTourFilter('All') : setAdventureFilter('All');
              }}
            >
              Reset Filters
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
                  <div className="packages-destination-group" key={dest}>
                    <div className="packages-group-header">
                      <h2 className="section-title">{dest} Tours</h2>
                      <p className="section-subtitle">
                        {dest === 'Nepal' && 'Trekking, temples, and the roof of the world'}
                        {dest === 'Tibet' && 'Sacred monasteries and high plateau adventures'}
                        {dest === 'India' && 'Ancient temples, vibrant culture, spiritual heartlands'}
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