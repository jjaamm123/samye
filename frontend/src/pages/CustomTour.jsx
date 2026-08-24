import Navbar from '../components/Navbar';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Loader from '../components/Loader';
import VisualMoodboard    from '../components/VisualMoodboard';
import MultiStepLeadModal from '../components/MultiStepLeadModal';


/**
 * Parses diverse duration strings into numerical days for aggregation.
 * @param {string|number} durationStr - The duration (e.g., '11 days', 'half day', 3)
 * @returns {number} The duration normalized in days.
 */
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

  // STATE MANAGEMENT
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
        const arr = Array.isArray(data) ? data
                  : Array.isArray(data?.tours) ? data.tours
                  : Array.isArray(data?.data) ? data.data
                  : [];
        setTours(arr);
      })
      .catch(() => {})
      .finally(() => setLoadingTours(false));

    axios.get(`${import.meta.env.VITE_API_URL}/api/adventures`)
      .then(r => {
        const data = r.data;
        const arr = Array.isArray(data) ? data
                  : Array.isArray(data?.adventures) ? data.adventures
                  : Array.isArray(data?.data) ? data.data
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


  // DERIVED STATE
  const transitDays = useMemo(() => {
    const destinations = [...new Set(tripItems.map(i => i.destination || i.location || '').filter(Boolean))];
    return Math.max(0, destinations.length - 1);
  }, [tripItems]);

  const totalTripDays = useMemo(() => {
    // Number() correctly handles both stored-as-number (11) and numeric-string ('11') durations.
    // parseDurationToDays only matched strings containing the word "day" â€” bare integers failed.
    const baseDays = tripItems.reduce((acc, i) => {
      const match = String(i.duration || '').match(/(\d+)\s*Day/i) || String(i.duration || '').match(/^(\d+)$/);
      const days = match ? parseInt(match[1], 10) : 0;
      return acc + days;
    }, 0);
    return Math.ceil(baseDays + transitDays);
  }, [tripItems, transitDays]);

  // DERIVED EXPEDITION STATS
  const INTENSITY_RANK = { Easy: 1, Moderate: 2, Hard: 3, Challenging: 4, Intense: 4, Extreme: 5 };
  const INTENSITY_COLOR = {
    Easy: '#2ecc71', Moderate: '#f39c12', Hard: '#e63946',
    Challenging: '#c0392b', Intense: '#e67e22', Extreme: '#e63946',
  };
  const maxIntensity = useMemo(() => {
    const tags = tripItems.map(i => i.difficulty || i.intensity).filter(Boolean);
    if (tags.length === 0) return null;
    return tags.reduce((best, cur) =>
      (INTENSITY_RANK[cur] ?? 0) > (INTENSITY_RANK[best] ?? 0) ? cur : best
    );
  }, [tripItems]);

  const hasBothTypes = useMemo(() => {
    const hasTour = tripItems.some(i => i.type === 'tour');
    const hasAdv  = tripItems.some(i => i.type === 'adventure');
    return hasTour && hasAdv;
  }, [tripItems]);

  // SAFE ARRAY GUARDS
  // NOTE: Type-guarding API arrays to prevent runtime filter() exceptions during hot re-renders.
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

      <Navbar />

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

      {/* â”€â”€ THE CURRENCY TOGGLE has been removed (inquiry-only model) â”€â”€ */}


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
              loadingTours ? <Loader message="Loading tours..." className="py-10 min-h-[200px]" /> :
              filteredTours.length === 0 ? <p className="builder-empty">No tours found.</p> :
              filteredTours.map(tour => (
                <PickerItem
                  key={tour._id}
                  item={tour}
                  type="tour"
                  added={isAdded(tour, 'tour')}
                  onAdd={() => addItem(tour, 'tour')}
                  badge={tour.destination}
                  meta={tour.duration}
                  difficulty={tour.difficulty}
                />
              ))
            )}
            {pickerTab === 'adventures' && (
              loadingAdv ? <Loader message="Loading adventures..." className="py-10 min-h-[200px]" /> :
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
                <button onClick={() => setGroupSize(s => Math.max(1, s - 1))}>-</button>
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
                          <span>{item.duration}</span>
                        </div>
                      </div>
                      <button className="builder-remove-btn flex items-center justify-center p-1" onClick={() => removeItem(item.uid)} title="Remove"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
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

          {/* â”€â”€ Duration chip â”€â”€ */}
          {totalTripDays > 0 && (
            <div className="builder-totals-bar">
              <div className="builder-total-chip">
                <span>Total Duration</span>
                <strong>~{totalTripDays} Days</strong>
              </div>
            </div>
          )}

          {/* â”€â”€ Expedition Overview â€” fills the empty bottom space â”€â”€ */}
          {tripItems.length > 0 && (
            <div style={{
              marginTop: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>

              {/* Row 1: Max Intensity + Bundle badge */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {maxIntensity && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px',
                    background: '#fafaf9',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    flex: '1 1 140px',
                  }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                      background: INTENSITY_COLOR[maxIntensity] || '#888',
                    }} />
                    <div>
                      <div style={{
                        fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px',
                      }}>
                        Max Intensity
                      </div>
                      <div style={{
                        fontSize: '0.82rem', fontWeight: '700', color: INTENSITY_COLOR[maxIntensity] || '#333',
                        fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em',
                      }}>
                        {maxIntensity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}

                {hasBothTypes && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px',
                    background: 'rgba(26,92,158,0.05)',
                    border: '1px solid rgba(26,92,158,0.18)',
                    borderRadius: '4px',
                    flex: '1 1 140px',
                  }}>
                    <span style={{ fontSize: '1rem' }}>ðŸŽ¯</span>
                    <div>
                      <div style={{
                        fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px',
                      }}>
                        Bundle
                      </div>
                      <div style={{
                        fontSize: '0.82rem', fontWeight: '700', color: '#1a5c9e',
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        Tour + Adventure
                      </div>
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px',
                  background: '#fafaf9',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  flex: '1 1 120px',
                }}>
                  <span style={{ fontSize: '1rem' }}>ðŸ‘¥</span>
                  <div>
                    <div style={{
                      fontSize: '0.62rem', color: '#94a3b8', fontFamily: "'Inter', sans-serif",
                      letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px',
                    }}>
                      Group Size
                    </div>
                    <div style={{
                      fontSize: '0.82rem', fontWeight: '700', color: '#050b16',
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {groupSize} {groupSize === 1 ? 'Person' : 'People'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Trip protection trust badges */}
              <div style={{
                display: 'flex', gap: '0',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                {[
                  { icon: <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>, label: 'Trip Protection', sub: 'Expert-guided safety' },
                  { icon: <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, label: 'Visa Support',    sub: 'End-to-end assistance' },
                  { icon: <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>, label: '24/7 Support',    sub: 'On-trip helpline' },
                ].map((badge, i, arr) => (
                  <div key={badge.label} style={{
                    flex: 1, padding: '10px 12px',
                    background: '#fafaf9',
                    borderRight: i < arr.length - 1 ? '1px solid #e5e7eb' : 'none',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.05rem', marginBottom: '3px' }}>{badge.icon}</div>
                    <div style={{
                      fontSize: '0.65rem', fontWeight: '700', color: '#050b16',
                      fontFamily: "'Inter', sans-serif", lineHeight: 1.2,
                    }}>
                      {badge.label}
                    </div>
                    <div style={{
                      fontSize: '0.6rem', color: '#94a3b8',
                      fontFamily: "'Inter', sans-serif", marginTop: '1px',
                    }}>
                      {badge.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* â”€â”€ RIGHT: Visual Expedition Moodboard (replaces old cost breakdown) â”€â”€ */}
        <VisualMoodboard
          selectedTours={tripItems}
          totalTripDays={totalTripDays}
          onRequestItinerary={() => setIsModalOpen(true)}
          onRemove={removeItem}
        />

      </div>

      {/* â”€â”€ MULTI-STEP LEAD CAPTURE MODAL â”€â”€ */}
      <MultiStepLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTours={tripItems}
        tripName={tripName}
      />


    </div>
  );
}

function PickerItem({ item, type, added, onAdd, badge, meta, difficulty }) {
  const intensityColors = { Easy: '#2ecc71', Moderate: '#f39c12', Hard: '#e63946', Intense: '#e67e22', Extreme: '#e63946', Challenging: '#c0392b' };
  const diffColor = intensityColors[difficulty] || '#888';
  const detailsPath = type === 'tour' ? `/tours/${item._id}` : `/adventures/${item._id}`;

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <button
          className={`picker-add-btn ${added ? 'added' : ''}`}
          onClick={onAdd}
          disabled={added}
        >
          {added ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Added
            </span>
          ) : '+ Add to Trip'}
        </button>
        <Link
          to={detailsPath}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '5px 10px',
            background: 'transparent',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            color: '#64748b',
            fontSize: '0.72rem',
            fontWeight: '600',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.04em',
            textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#1a5c9e';
            e.currentTarget.style.color = '#1a5c9e';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
