import { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { CurrencyContext } from '../context/CurrencyContext';
import VisualMoodboard     from '../components/VisualMoodboard';
import MultiStepLeadModal from '../components/MultiStepLeadModal';
import { getPriceAmount, getPriceDisplayType, isBespokePrice } from '../utils/priceHelpers';


function calcGroupDiscount(size) {
  if (size >= 12) return { label: 'Large Group (12+)', rate: 0.18, desc: '18% off for groups of 12 or more' };
  if (size >= 8)  return { label: 'Group (8–11)',      rate: 0.12, desc: '12% off for groups of 8–11' };
  if (size >= 4)  return { label: 'Small Group (4–7)', rate: 0.07, desc: '7% off for groups of 4–7' };
  return null;
}

function calcEarlyBirdDiscount(travelDate, bookingDate) {
  if (!travelDate || !bookingDate) return null;
  const daysAhead = Math.floor((new Date(travelDate) - new Date(bookingDate)) / (1000 * 60 * 60 * 24));
  if (daysAhead >= 120) return { label: 'Early Bird (120+ days)', rate: 0.15, desc: '15% off — booked 4+ months ahead' };
  if (daysAhead >= 90)  return { label: 'Early Bird (90+ days)',  rate: 0.10, desc: '10% off — booked 3+ months ahead' };
  if (daysAhead >= 60)  return { label: 'Early Bird (60+ days)',  rate: 0.06, desc: '6% off — booked 2+ months ahead' };
  if (daysAhead >= 30)  return { label: 'Early Bird (30+ days)',  rate: 0.03, desc: '3% off — booked 1+ month ahead' };
  return null;
}

function calcDurationDiscount(totalDays) {
  if (totalDays >= 21) return { label: 'Extended Journey (21+ days)', rate: 0.10, desc: '10% off for journeys of 21+ days' };
  if (totalDays >= 14) return { label: 'Extended Journey (14+ days)', rate: 0.07, desc: '7% off for journeys of 14+ days' };
  if (totalDays >= 10) return { label: 'Extended Journey (10+ days)', rate: 0.04, desc: '4% off for journeys of 10+ days' };
  return null;
}

function calcAdventureBundleDiscount(selectedItems) {
  const hasTour = selectedItems.some(i => i.type === 'tour');
  const hasAdventure = selectedItems.some(i => i.type === 'adventure');
  if (hasTour && hasAdventure)
    return { label: 'Adventure Bundle', rate: 0.08, desc: '8% off for combining tours + adventure sports' };
  return null;
}

function calcComboDiscount(count) {
  if (count >= 5) return { label: 'Mega Combo (5+ packages)', rate: 0.10, desc: '10% off for 5 or more packages' };
  if (count >= 3) return { label: 'Combo (3+ packages)',       rate: 0.05, desc: '5% off for 3 or more packages' };
  return null;
}

function calcSeasonDiscount(travelDate) {
  if (!travelDate) return null;
  const month = new Date(travelDate).getMonth() + 1; 
  if ([10, 11].includes(month))
    return { label: 'Peak Season (Oct–Nov)', rate: -0.05, desc: '5% peak season adjustment (highest demand)' };
  if ([3, 4, 5].includes(month))
    return { label: 'Spring Season Discount', rate: 0.05, desc: '5% off — spring is excellent and less crowded' };
  if ([6, 7, 8, 9].includes(month))
    return { label: 'Monsoon Season Discount', rate: 0.12, desc: '12% off — monsoon season (note: trekking limitations apply)' };
  return null;
}

function parseDurationToDays(durationStr) {
  if (!durationStr) return 1;
  const s = String(durationStr).toLowerCase();
  if (s.includes('full day') || s === '1 day') return 1;
  if (s.includes('half day')) return 0.5;
  const hourMatch = s.match(/(\d+\.?\d*)\s*hour/);
  if (hourMatch) return parseFloat(hourMatch[1]) / 8; // treat 8hrs = 1 day
  const dayMatch = s.match(/(\d+\.?\d*)\s*day/);
  if (dayMatch) return parseFloat(dayMatch[1]);
  return 1;
}

function getFeasibilityReport(selectedItems, travelDate, groupSize) {
  const notes = [];
  const permits = [];
  const warnings = [];
  const tips = [];

  const destinations = [...new Set(selectedItems
    .map(i => i.destination || i.location || '')
    .filter(Boolean))];

  const month = travelDate ? new Date(travelDate).getMonth() + 1 : null;
  const totalDays = selectedItems.reduce((sum, i) => sum + parseDurationToDays(i.duration), 0)
    + Math.max(0, destinations.length - 1); // transit days

  if (destinations.includes('Tibet') || selectedItems.some(i => (i.destination || i.location || '').includes('Tibet'))) {
    permits.push({ name: 'Tibet Travel Permit (TTP)', cost: 65, perPerson: true, processDays: 7, note: 'Required for all Tibet entry. Apply via registered agency only.' });
    permits.push({ name: 'Tibet Alien Travel Permit', cost: 40, perPerson: true, processDays: 3, note: 'Required for areas outside Lhasa.' });
  }
  if (selectedItems.some(i => ['Nepal', 'Pokhara', 'Everest', 'Annapurna', 'ABC', 'EBC', 'Ghandruk'].some(kw =>
    (i.title || '').includes(kw) || (i.destination || '').includes(kw) || (i.location || '').includes(kw)
  ))) {
    permits.push({ name: 'TIMS Card (Trekkers Information)', cost: 20, perPerson: true, processDays: 1, note: 'Required for all Nepal treks. Available in Kathmandu/Pokhara.' });
    permits.push({ name: 'Annapurna / Sagarmatha NP Entry', cost: 35, perPerson: true, processDays: 0, note: 'National Park entry fee. Paid at the park gate.' });
  }
  if (destinations.includes('India') || selectedItems.some(i => (i.destination || i.location || '').includes('India'))) {
    permits.push({ name: 'India Tourist Visa', cost: 80, perPerson: true, processDays: 5, note: 'e-Visa available for most nationalities. Apply online at indianvisaonline.gov.in' });
  }

  if (month && [6, 7, 8, 9].includes(month)) {
    const hasTrek = selectedItems.some(i =>
      ['trek', 'abc', 'ebc', 'everest', 'annapurna', 'base camp', 'ghandruk', 'himalaya'].some(kw =>
        (i.title || '').toLowerCase().includes(kw)
      )
    );
    const hasRafting = selectedItems.some(i =>
      ['raft', 'kayak', 'river'].some(kw => (i.title || '').toLowerCase().includes(kw))
    );
    if (hasTrek) warnings.push({ icon: '—', text: 'Monsoon season (Jun–Sep): High-altitude trekking routes are slippery and some passes may be closed. Consider lower-altitude alternatives.' });
    if (hasRafting) tips.push({ icon: '—', text: 'Monsoon is actually great for white-water rafting — river levels are at their highest!' });
    else tips.push({ icon: '—', text: 'Monsoon offers dramatic landscapes and very few tourists. Budget accommodations are easier to find.' });
  }

  if (month && [12, 1, 2].includes(month)) {
    const hasHighAltitude = selectedItems.some(i =>
      ['abc', 'ebc', 'everest', 'annapurna', 'thorong', 'base camp'].some(kw =>
        (i.title || '').toLowerCase().includes(kw)
      )
    );
    if (hasHighAltitude) warnings.push({ icon: '—', text: 'Winter (Dec–Feb): Thorong La pass on Annapurna Circuit may be closed. Everest region is clear but very cold (-20°C at base camp). Extra gear required.' });
    else tips.push({ icon: '—', text: 'Winter is excellent for lower-altitude destinations like Chitwan, Pokhara lakeside, and India circuits — clear skies, minimal crowds.' });
  }

  if (month && [10, 11].includes(month)) {
    tips.push({ icon: '—', text: 'Peak season: Oct–Nov offers the best mountain views, stable weather, and ideal trekking conditions. Book accommodation well in advance.' });
  }

  if (destinations.length >= 2) {
    notes.push({ icon: '—', text: `Multi-destination trip (${destinations.join(' → ')}). We\'ve added ${destinations.length - 1} transit day(s) to your timeline for flights/ground transport.` });
  }

  if (totalDays > 21) {
    notes.push({ icon: '—', text: `Long journey (${Math.ceil(totalDays)} days). Nepal standard visa is 15 days — you\'ll likely need a 30-day visa ($50) or extension ($45 per extra 15 days).` });
  }

  if (groupSize >= 8) {
    notes.push({ icon: '—', text: `Group of ${groupSize}: Private transport is recommended (vs shared). We can arrange a dedicated vehicle for the full journey.` });
  }

  const permitTotalPerPerson = permits.reduce((s, p) => s + (p.perPerson ? p.cost : 0), 0);
  const maxProcessDays = permits.length > 0 ? Math.max(...permits.map(p => p.processDays)) : 0;

  return { permits, warnings, tips, notes, permitTotalPerPerson, maxProcessDays, totalDays: Math.ceil(totalDays) };
}

export default function CustomTour() {
  // ── THE CONTEXT HOOK ──
  const { currency, toggleCurrency, formatPrice } = useContext(CurrencyContext);

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
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
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

  const calc = useMemo(() => {
    if (tripItems.length === 0) return null;

    // Determine if any item has bespoke (non-exact) pricing
    const hasBespoke = tripItems.some(i => isBespokePrice(i.price));

    // Only sum items whose price is a hard exact number; bespoke items contribute 0 to math.
    const basePerPerson = tripItems.reduce((s, i) => {
      if (isBespokePrice(i.price)) return s;
      return s + getPriceAmount(i.price);
    }, 0);
    const baseTotal = basePerPerson * groupSize;

    const discounts = [
      calcGroupDiscount(groupSize),
      calcEarlyBirdDiscount(travelDate, bookingDate),
      calcDurationDiscount(
        tripItems.reduce((s, i) => s + parseDurationToDays(i.duration), 0)
      ),
      calcAdventureBundleDiscount(tripItems),
      calcComboDiscount(tripItems.length),
      calcSeasonDiscount(travelDate),
    ].filter(Boolean);

    const totalDiscountRate = discounts.reduce((s, d) => s + d.rate, 0);
    const cappedRate = Math.min(totalDiscountRate, 0.35);
    // Only apply discounts to the exact-price portion
    const discountAmount = hasBespoke ? 0 : Math.round(baseTotal * cappedRate);
    const finalTotal = Math.round(baseTotal - discountAmount);
    const finalPerPerson = groupSize > 0 ? Math.round(finalTotal / groupSize) : finalTotal;

    const feasibility = getFeasibilityReport(tripItems, travelDate, groupSize);
    const permitTotal = feasibility.permitTotalPerPerson * groupSize;

    return {
      hasBespoke,
      basePerPerson,
      baseTotal,
      discounts,
      totalDiscountRate: cappedRate,
      discountAmount,
      finalTotal,
      finalPerPerson,
      feasibility,
      permitTotal,
      // If any item is bespoke, the "grand total" is only the fixed permit fees
      grandTotal: hasBespoke ? permitTotal : finalTotal + permitTotal,
    };
  }, [tripItems, groupSize, travelDate, bookingDate]);

  // ── DERIVED: total trip days ─────────────────────────────────────────────────
  const totalTripDays = useMemo(() =>
    Math.ceil(tripItems.reduce((s, i) => s + parseDurationToDays(i.duration ?? '1'), 0))
  , [tripItems]);

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

      {/* ── THE SLEEK CURRENCY TOGGLE ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', paddingRight: '5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: '#f1f5f9', borderRadius: '30px', padding: '4px', display: 'flex', gap: '4px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
          <button onClick={() => currency !== 'USD' && toggleCurrency()} style={{ padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: currency === 'USD' ? '#1a5c9e' : 'transparent', color: currency === 'USD' ? 'white' : '#64748b', transition: 'all 0.3s ease' }}>
            USD
          </button>
          <button onClick={() => currency !== 'NPR' && toggleCurrency()} style={{ padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: currency === 'NPR' ? '#1a5c9e' : 'transparent', color: currency === 'NPR' ? 'white' : '#64748b', transition: 'all 0.3s ease' }}>
            NPR
          </button>
        </div>
      </div>
      {/* ─────────────────────────────────── */}

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
                {groupSize >= 12 ? '18% group discount!' : groupSize >= 8 ? '12% group discount!' : groupSize >= 4 ? '7% group discount' : 'Add 4+ for discount'}
              </span>
            </div>

            <div className="builder-input-group">
              <label className="builder-input-label">Travel Date</label>
              <input
                type="date"
                className="builder-date-input"
                value={travelDate}
                onChange={e => setTravelDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="builder-input-group">
              <label className="builder-input-label">Booking Date</label>
              <input
                type="date"
                className="builder-date-input"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
              />
              <span className="builder-input-hint">Earlier booking = more savings</span>
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
                        <span className="builder-type-tag" style={{ backgroundColor: item.type === 'adventure' ? 'rgba(230,57,70,0.1)' : 'rgba(26,92,158,0.1)', color: item.type === 'adventure' ? '#e63946' : '#1a5c9e' }}>
                          {item.type === 'adventure' ? item.sportType || 'Adventure' : 'Tour'}
                        </span>
                        <h4 className="builder-timeline-title">{item.title}</h4>
                        <div className="builder-timeline-meta">
                          <span>{item.destination || item.location}</span>
                          <span>{item.duration} {item.type === 'tour' ? 'days' : ''}</span>
                          {/* ── BESPOKE PRICING ── */}
                          <span>
                            {getPriceDisplayType(item.price) === 'por'
                              ? <em style={{ color: '#1a5c9e', fontStyle: 'normal', fontWeight: 600 }}>Price on Request</em>
                              : getPriceDisplayType(item.price) === 'starting_from'
                                ? <em style={{ color: '#1a5c9e', fontStyle: 'normal', fontWeight: 600 }}>Starting at {formatPrice(getPriceAmount(item.price))}</em>
                                : <>{formatPrice(getPriceAmount(item.price))}/person</>
                            }
                          </span>
                        </div>
                      </div>
                      <button className="builder-remove-btn" onClick={() => removeItem(item.uid)} title="Remove">✕</button>
                    </div>
                  </div>
                </div>
              ))}

              {calc && calc.feasibility.totalDays > tripItems.reduce((s, i) => s + parseDurationToDays(i.duration), 0) && (
                <div className="builder-transit-note">
                  + {Math.round(calc.feasibility.totalDays - tripItems.reduce((s, i) => s + parseDurationToDays(i.duration), 0))} transit day(s) added for multi-destination travel
                </div>
              )}
            </div>
          )}

          {calc && (
            <div className="builder-totals-bar">
              <div className="builder-total-chip">
                <span>Total Duration</span>
                <strong>{calc.feasibility.totalDays} Days</strong>
              </div>
              <div className="builder-total-chip">
                <span>{groupSize} Traveller{groupSize > 1 ? 's' : ''}</span>
                {/* ── BESPOKE PRICING ── */}
                {calc.hasBespoke
                  ? <strong style={{ fontSize: '0.78rem', color: '#1a5c9e' }}>Custom Quote</strong>
                  : <strong>{formatPrice(calc.finalPerPerson)}/person</strong>
                }
              </div>
              <div className="builder-total-chip highlight">
                {calc.hasBespoke
                  ? <>
                      <span style={{ fontSize: '0.72rem', lineHeight: '1.3' }}>Fixed Fees (Permits)</span>
                      <strong>{formatPrice(calc.permitTotal)}</strong>
                    </>
                  : <>
                      <span>Grand Total (est.)</span>
                      <strong>{formatPrice(calc.grandTotal)}</strong>
                    </>
                }
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
  // ── SECOND CONTEXT HOOK FOR THE LEFT SIDEBAR ──
  const { formatPrice } = useContext(CurrencyContext);

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
          {/* ── BESPOKE PRICING ── */}
          {(() => {
            const dt = getPriceDisplayType(item.price);
            const amt = getPriceAmount(item.price);
            if (dt === 'por')
              return <span className="picker-item-price" style={{ fontStyle: 'italic', color: '#1a5c9e' }}>Price on Request</span>;
            if (dt === 'starting_from')
              return <span className="picker-item-price">From {formatPrice(amt)}<small>/person</small></span>;
            return <span className="picker-item-price">{formatPrice(amt)}<small>/person</small></span>;
          })()}
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