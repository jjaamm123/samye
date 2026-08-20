import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Map, Activity, AlertCircle, Filter } from 'lucide-react';
import TourCard from '../components/TourCard';
import AdventureCard from '../components/AdventureCard';
import { CurrencyContext } from '../context/CurrencyContext'; 
import Navbar from '../components/Navbar';
import '../App.css';

function Packages() {
  const { currency, toggleCurrency } = useContext(CurrencyContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [tours, setTours] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingAdv, setLoadingAdv] = useState(true);
  const [errorTours, setErrorTours] = useState(null);
  const [errorAdv, setErrorAdv] = useState(null);

  const [activeCategory, setActiveCategory] = useState('tours');
  const [search, setSearch] = useState('');
  
  // Adventures still use simple state filters as taxonomy wasn't overhauled for them
  const [adventureFilter, setAdventureFilter] = useState('All');

  useEffect(() => {
    const queryStr = searchParams.toString();
    const endpoint = queryStr ? `/api/tours?${queryStr}` : `/api/tours`;

    setLoadingTours(true);
    axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`)
      .then(r => {
        const data = r.data;
        const arr = Array.isArray(data) ? data : Array.isArray(data?.tours) ? data.tours : Array.isArray(data?.data) ? data.data : [];
        setTours(arr);
      })
      .catch(() => setErrorTours('Could not load tour packages.'))
      .finally(() => setLoadingTours(false));
  }, [searchParams]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/adventures`)
      .then(r => {
        const data = r.data;
        const arr = Array.isArray(data) ? data : Array.isArray(data?.adventures) ? data.adventures : Array.isArray(data?.data) ? data.data : [];
        setAdventures(arr);
      })
      .catch(() => setErrorAdv('Could not load adventure packages.'))
      .finally(() => setLoadingAdv(false));
  }, []);

  const handleCategorySwitch = (cat) => {
    setActiveCategory(cat);
    setSearch('');
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearch('');
    setAdventureFilter('All');
  };

  const safeTours = Array.isArray(tours) ? tours : [];
  const safeAdventures = Array.isArray(adventures) ? adventures : [];

  const filteredTours = safeTours.filter(t => {
    const matchSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.destination?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const adventureFilterOptions = ['All', ...new Set(safeAdventures.map(a => a.intensity).filter(Boolean))];
  const filteredAdventures = safeAdventures.filter(a => {
    const matchFilter = adventureFilter === 'All' || a.intensity === adventureFilter;
    const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.sportType?.toLowerCase().includes(search.toLowerCase()) || a.location?.toLowerCase().includes(search.toLowerCase());
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
      <Navbar />

      <div className="packages-hero" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="packages-hero-overlay"></div>
        <motion.div
          className="packages-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="packages-hero-eyebrow" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            {isTours ? 'Cultural Heritage' : 'Adventure Expeditions'}
          </span>
          <h1 className="packages-hero-title" style={{ fontWeight: '700', letterSpacing: '-1px' }}>Our Curated Packages</h1>
          <p className="packages-hero-sub" style={{ fontSize: '1.2rem', fontWeight: '300' }}>
            {isTours
              ? 'Guided treks, luxury monastery stays, and premium heritage circuits.'
              : 'White-water rafting, paragliding, and high-altitude Himalayan climbing.'}
          </p>
        </motion.div>

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
                color: isTours ? '#0f172a' : '#94a3b8',
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
                color: !isTours ? '#0f172a' : '#94a3b8',
                zIndex: 2, fontWeight: '600', transition: 'color 0.2s' 
              }}
            >
              <Activity size={18} /> Adventure Sports
            </button>
          </div>
        </div>
      </div>

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
          >USD</button>
          <button 
            onClick={() => currency !== 'NPR' && toggleCurrency()} 
            style={{ 
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
              background: currency === 'NPR' ? '#f1f5f9' : 'transparent', color: currency === 'NPR' ? '#0f172a' : '#64748b', transition: 'all 0.2s ease' 
            }}
          >NPR</button>
        </div>
      </div>

      <div className="packages-controls" style={{ background: 'transparent', boxShadow: 'none', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center', paddingLeft: '5%', paddingRight: '5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="packages-search"
            placeholder={isTours ? 'Search destinations or titles...' : 'Search activities...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '44px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)', width: '100%' }}
          />
        </div>

        {!isTours && (
          <div className="packages-filters">
            {adventureFilterOptions.map(opt => (
              <button key={opt} className={`packages-filter-pill ${adventureFilter === opt ? 'active' : ''}`} onClick={() => setAdventureFilter(opt)} style={{ border: adventureFilter === opt ? '1px solid #1a5c9e' : '1px solid #e2e8f0' }}>
                {opt}
              </button>
            ))}
          </div>
        )}
        
        {!loading && (
          <span className="packages-result-count" style={{ color: '#64748b', fontWeight: '500', marginLeft: 'auto' }}>
            {count} {isTours ? 'itinerary' : 'activity'}{count !== 1 ? 'ies' : ''} found
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '32px', maxWidth: '1200px', margin: '40px auto', padding: '0 5%', alignItems: 'flex-start' }}>
        {/* FACETED TOUR FILTERS */}
        {isTours && (
          <aside style={{ flexShrink: 0, width: '250px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Filter size={18} color="#0f172a" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Filters</h3>
              {(searchParams.toString() !== '') && (
                <button onClick={clearFilters} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}>Clear All</button>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Destination</h4>
              <select 
                value={searchParams.get('destination') || ''} 
                onChange={e => updateFilter('destination', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="">All Destinations</option>
                <option value="Nepal">Nepal</option>
                <option value="Tibet">Tibet</option>
                <option value="India">India</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Experience Theme</h4>
              <select 
                value={searchParams.get('experienceTheme') || ''} 
                onChange={e => updateFilter('experienceTheme', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="">All Themes</option>
                <option value="Adventure & Active">Adventure & Active</option>
                <option value="Nature & Discovery">Nature & Discovery</option>
                <option value="Culture & Lifestyle">Culture & Lifestyle</option>
                <option value="Leisure & Scenic">Leisure & Scenic</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Travel Style</h4>
              <select 
                value={searchParams.get('travelStyle') || ''} 
                onChange={e => updateFilter('travelStyle', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="">All Styles</option>
                <option value="Family">Family</option>
                <option value="Group">Group</option>
                <option value="Solo">Solo</option>
                <option value="Couples">Couples</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Tailor-Made">Tailor-Made</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Season</h4>
              <select 
                value={searchParams.get('season') || ''} 
                onChange={e => updateFilter('season', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="">All Seasons</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
          </aside>
        )}

        {/* PACKAGE GRID */}
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          {loading && <p className="status-msg" style={{ color: '#64748b', padding: '40px', textAlign: 'center' }}>Loading {isTours ? 'tours' : 'adventures'}…</p>}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', padding: '40px' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}
          
          {!loading && !error && count === 0 && (
            <div className="packages-empty-state" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '60px 20px', textAlign: 'center' }}>
              <Search size={48} color="#cbd5e1" strokeWidth={1.5} style={{ marginBottom: '16px', display: 'inline-block' }} />
              <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '16px' }}>No {isTours ? 'tours' : 'adventures'} match your current filters.</p>
              <button className="packages-reset-btn" onClick={clearFilters} style={{ background: '#1a5c9e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && count > 0 && (
            <div className="tours-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '24px' 
            }}>
              {isTours 
                ? filteredTours.map(tour => <TourCard key={tour._id} tour={tour} />)
                : filteredAdventures.map(adv => <AdventureCard key={adv._id} adventure={adv} />)
              }
            </div>
          )}
        </div>
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