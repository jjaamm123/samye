import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import VisualMoodboard    from '../components/VisualMoodboard';
import MultiStepLeadModal from '../components/MultiStepLeadModal';


// ── Duration parser (kept for totalTripDays calculation) ─────────────────────
function parseDurationToDays(durationStr) {
  if (!durationStr) return 1;
  const s = String(durationStr).toLowerCase();
  if (s.includes('full day') || s === '1 day') return 1;
  if (s.includes('half day')) return 0.5;
  const hourMatch = s.match(/(\d+\.?\d*)\s*hour/);
  if (hourMatch) return parseFloat(hourMatch[1]) / 8;
  const dayMatch = s.match(/(\d+\.?\d*)\s*day/);
  if (dayMatch) return parseFloat(dayMatch[1]);
  return 1;
}

export default function CustomTour() {

  // ── Lead-capture modal visibility ────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [tours, setTours] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingAdv, setLoadingAdv] = useState(true);
  const [pickerTab, setPickerTab] = useState('tours'); 
  const [pickerSearch, setPickerSearch] = useState('');

  const [tripItems, setTripItems] = useState([]);

  const [groupSize, setGroupSize] = useState(2);
  const [travelDate, setTravelDate] = useState('');
  const [tripName, setTripName] = useState('My Custom Journey');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/tours`)
      .then(r => {
        const data = r.data;
        // ── DIAGNOSTIC: open browser DevTools → Console to see exact API shape ──
        console.log('API Response [tours]:', data);
        // Handles bare array OR envelope shapes like { tours: [...] } or { data: [...] }
        const arr = Array.isArray(data)         ? data
                  : Array.isArray(data?.tours)   ? data.tours
                  : Array.isArray(data?.data)    ? data.data
                  : [];
        setTours(arr);
      })
      .catch(() => {})
      .finally(() => setLoadingTours(false));

    axios.get(`${import.meta.env.VITE_API_URL}/api/adventures`)
      .then(r => {
        const data = r.data;
        console.log('API Response [adventures]:', data);
        const arr = Array.isArray(data)              ? data
                  : Array.isArray(data?.adventures)   ? data.adventures
                  : Array.isArray(data?.data)          ? data.data
                  : [];
        setAdventures(arr);
      })
      .catch(() => {})
      .finally(() => setLoadingAdv(false));
  }, []);

  const addItem = (item, type) => {
    const already = tripItems.some(i => i._id === item._id && i.type === type);
    if (already) return;
    setTripItems(prev => [...prev, { ...item, type, uid: `${type}-${item._id}-${Date.now()}` }]);
  };

  const removeItem = (uid) => setTripItems(prev => prev.filter(i => i.uid !== uid));


  // ── DERIVED: total trip days & transit days ──────────────────────────────────
  const transitDays = useMemo(() => {
    const destinations = [...new Set(tripItems.map(i => i.destination || i.location || '').filter(Boolean))];
    return Math.max(0, destinations.length - 1);
  }, [tripItems]);

  const totalTripDays = useMemo(() => {
    const baseDays = tripItems.reduce((s, i) => s + parseDurationToDays(i.duration ?? '1'), 0);
    return Math.ceil(baseDays + transitDays);
  }, [tripItems, transitDays]);

  // ── SAFE ARRAY GUARDS ────────────────────────────────────────────────────
  // These are the true crash sites. tours/adventures .filter() runs during
  // every render — including the render triggered immediately after the fetch
  // resolves. If the setter stored a non-array (object, null, etc.) these
  // blow up with "X.filter is not a function".
  // Wrapping in Array.isArray() is the single most important safety net here.
  const safeTours      = Array.isArray(tours)      ? tours      : [];
  const safeAdventures = Array.isArray(adventures) ? adventures : [];

  const filteredTours = safeTours.filter(t =>
    !pickerSearch || t.title?.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    t.destination?.toLowerCase().includes(pickerSearch.toLowerCase())
  );
  const filteredAdventures = safeAdventures.filter(a =>
    !pickerSearch || a.title?.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    a.sportType?.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    a.location?.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const isAdded = (item, type) => tripItems.some(i => i._id === item._id && i.type === type);

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/custom-tour" className="active-link">Build My Trip</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      <div
        className="page-hero"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Custom Itineraries</span>
          <h1 className="page-hero-title">Build Your Expedition</h1>
        </div>
      </div>

      {/* ── THE CURRENCY TOGGLE has been removed (inquiry-only model) ── */}


      <div className="builder-layout">

        <div className="builder-picker">
          <div className="builder-panel-header">
            <h2 className="builder-panel-title">Choose Your Packages</h2>
            <p className="builder-panel-sub">Click "Add to Trip" on any item below</p>
          </div>

          <input
            type="text"
            className="builder-search"
            placeholder="Search tours or adventures..."
            value={pickerSearch}
            onChange={e => setPickerSearch(e.target.value)}
          />

          <div className="builder-picker-tabs">
            <button
              className={`builder-picker-tab ${pickerTab === 'tours' ? 'active' : ''}`}
              onClick={() => setPickerTab('tours')}
            >
              Tours ({filteredTours.length})
            </button>
            <button
              className={`builder-picker-tab ${pickerTab === 'adventures' ? 'active' : ''}`}
              onClick={() => setPickerTab('adventures')}
            >
              Adventures ({filteredAdventures.length})
            </button>
          </div>

          <div className="builder-package-list">
            {pickerTab === 'tours' && (
              loadingTours ? <p className="builder-loading">Loading tours...</p> :
              filteredTours.length === 0 ? <p className="builder-empty">No tours found.</p> :
              filteredTours.map(tour => (
                <PickerItem
                  key={tour._id}
                  item={tour}
                  type="tour"
                  added={isAdded(tour, 'tour')}
                  onAdd={() => addItem(tour, 'tour')}
                  badge={tour.destination}
                  meta={`${tour.duration} Days`}
                  difficulty={tour.difficulty}
                />
              ))
            )}
            {pickerTab === 'adventures' && (
              loadingAdv ? <p className="builder-loading">Loading adventures...</p> :
              filteredAdventures.length === 0 ? <p className="builder-empty">No adventures found.</p> :
              filteredAdventures.map(adv => (
                <PickerItem
                  key={adv._id}
                  item={adv}
                  type="adventure"
                  added={isAdded(adv, 'adventure')}
                  onAdd={() => addItem(adv, 'adventure')}
                  badge={adv.sportType || adv.location}
                  meta={adv.duration}
                  difficulty={adv.intensity}
                />
              ))
            )}
          </div>
        </div>

        <div className="builder-trip">
          <div className="builder-panel-header">
            <h2 className="builder-panel-title">Your Trip</h2>
            <p className="builder-panel-sub">{tripItems.length} package{tripItems.length !== 1 ? 's' : ''} selected</p>
          </div>

          <input
            type="text"
            className="builder-trip-name-input"
            value={tripName}
            onChange={e => setTripName(e.target.value)}
            placeholder="Name your journey..."
          />

          <div className="builder-inputs-grid">
            <div className="builder-input-group">
              <label className="builder-input-label">Group Size</label>
              <div className="builder-stepper">
                <button onClick={() => setGroupSize(s => Math.max(1, s - 1))}>−</button>
                <span>{groupSize}</span>
                <button onClick={() => setGroupSize(s => s + 1)}>+</button>
              </div>
              <span className="builder-input-hint">
                Specify number of travellers
              </span>
            </div>

            <div className="builder-input-group" style={{ gridColumn: 'span 2' }}>
              <label className="builder-input-label">Travel Date</label>
              <input
                type="date"
                className="builder-date-input"
                value={travelDate}
                onChange={e => setTravelDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {tripItems.length === 0 ? (
            <div className="builder-empty-trip">
              <span className="builder-empty-icon"></span>
              <p>Your trip is empty. Add packages from the left panel to get started.</p>
            </div>
          ) : (
            <div className="builder-timeline">
              {tripItems.map((item, index) => (
                <div className="builder-timeline-item" key={item.uid}>
                  <div className="builder-timeline-connector">
                    <div className="builder-timeline-dot" style={{ backgroundColor: item.type === 'adventure' ? '#e63946' : '#1a5c9e' }}>
                      {item.type === 'adventure' ? 'A' : 'T'}
                    </div>
                    {index < tripItems.length - 1 && <div className="builder-timeline-line"></div>}
                  </div>
                  <div className="builder-timeline-card">
                    <div className="builder-timeline-card-top">
                      <div>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          borderRadius: '2px',
                          backgroundColor: item.type === 'adventure' ? 'rgba(230,57,70,0.1)' : 'rgba(26,92,158,0.1)',
                          color: item.type === 'adventure' ? '#e63946' : '#1a5c9e',
                          marginBottom: '6px'
                        }}>
                          {item.type === 'adventure' ? item.sportType || 'Adventure' : 'Tour'}
                        </span>
                        <h4 className="builder-timeline-title">{item.title}</h4>
                        <div className="builder-timeline-meta">
                          <span>{item.destination || item.location}</span>
                          <span>{item.duration} {item.type === 'tour' ? 'days' : ''}</span>
                        </div>
                      </div>
                      <button className="builder-remove-btn" onClick={() => removeItem(item.uid)} title="Remove">✕</button>
                    </div>
                  </div>
                </div>
              ))}

              {transitDays > 0 && (
                <div className="builder-transit-note">
                  + {transitDays} transit day(s) added for multi-destination travel
                </div>
              )}
            </div>
          )}

          {/* Duration chip — the only summary shown */}
          {totalTripDays > 0 && (
            <div className="builder-totals-bar">
              <div className="builder-total-chip">
                <span>Total Duration</span>
                <strong>{totalTripDays} Days</strong>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Visual Expedition Moodboard (replaces old cost breakdown) ── */}
        <VisualMoodboard
          selectedTours={tripItems}
          totalTripDays={totalTripDays}
          onRequestItinerary={() => setIsModalOpen(true)}
          onRemove={removeItem}
        />

      </div>

      {/* ── MULTI-STEP LEAD CAPTURE MODAL ── */}
      <MultiStepLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTours={tripItems}
        tripName={tripName}
      />

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Samye Travels</span>
            <p>Crafting sacred journeys across Nepal, Tibet & India since 2010.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/tours">Tours</Link>
            <Link to="/adventures">Adventures</Link>
            <Link to="/custom-tour">Build My Trip</Link>
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

function PickerItem({ item, type, added, onAdd, badge, meta, difficulty }) {
  const intensityColors = { Easy: '#2ecc71', Moderate: '#f39c12', Hard: '#e63946', Intense: '#e67e22', Extreme: '#e63946', Challenging: '#c0392b' };
  const diffColor = intensityColors[difficulty] || '#888';

  return (
    <div className={`picker-item ${added ? 'added' : ''}`}>
      <div className="picker-item-body">
        <div className="picker-item-badges">
          <span className="picker-badge">{badge}</span>
          {difficulty && (
            <span className="picker-difficulty" style={{ color: diffColor, borderColor: diffColor }}>
              {difficulty}
            </span>
          )}
        </div>
        <h4 className="picker-item-title">{item.title}</h4>
        <div className="picker-item-meta">
          <span>{meta}</span>
        </div>
      </div>
      <button
        className={`picker-add-btn ${added ? 'added' : ''}`}
        onClick={onAdd}
        disabled={added}
      >
        {added ? '✓ Added' : '+ Add to Trip'}
      </button>
    </div>
  );
}