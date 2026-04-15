import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';


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
    if (hasTrek) warnings.push({ icon: '⚠️', text: 'Monsoon season (Jun–Sep): High-altitude trekking routes are slippery and some passes may be closed. Consider lower-altitude alternatives.' });
    if (hasRafting) tips.push({ icon: '✅', text: 'Monsoon is actually great for white-water rafting — river levels are at their highest!' });
    else tips.push({ icon: '☔', text: 'Monsoon offers dramatic landscapes and very few tourists. Budget accommodations are easier to find.' });
  }

  if (month && [12, 1, 2].includes(month)) {
    const hasHighAltitude = selectedItems.some(i =>
      ['abc', 'ebc', 'everest', 'annapurna', 'thorong', 'base camp'].some(kw =>
        (i.title || '').toLowerCase().includes(kw)
      )
    );
    if (hasHighAltitude) warnings.push({ icon: '❄️', text: 'Winter (Dec–Feb): Thorong La pass on Annapurna Circuit may be closed. Everest region is clear but very cold (-20°C at base camp). Extra gear required.' });
    else tips.push({ icon: '☀️', text: 'Winter is excellent for lower-altitude destinations like Chitwan, Pokhara lakeside, and India circuits — clear skies, minimal crowds.' });
  }

  if (month && [10, 11].includes(month)) {
    tips.push({ icon: '🏆', text: 'Peak season: Oct–Nov offers the best mountain views, stable weather, and ideal trekking conditions. Book accommodation well in advance.' });
  }

  if (destinations.length >= 2) {
    notes.push({ icon: '✈️', text: `Multi-destination trip (${destinations.join(' → ')}). We\'ve added ${destinations.length - 1} transit day(s) to your timeline for flights/ground transport.` });
  }

  if (totalDays > 21) {
    notes.push({ icon: '📋', text: `Long journey (${Math.ceil(totalDays)} days). Nepal standard visa is 15 days — you\'ll likely need a 30-day visa ($50) or extension ($45 per extra 15 days).` });
  }

  if (groupSize >= 8) {
    notes.push({ icon: '🚌', text: `Group of ${groupSize}: Private transport is recommended (vs shared). We can arrange a dedicated vehicle for the full journey.` });
  }

  const permitTotalPerPerson = permits.reduce((s, p) => s + (p.perPerson ? p.cost : 0), 0);
  const maxProcessDays = permits.length > 0 ? Math.max(...permits.map(p => p.processDays)) : 0;

  return { permits, warnings, tips, notes, permitTotalPerPerson, maxProcessDays, totalDays: Math.ceil(totalDays) };
}

export default function CustomTour() {
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
    axios.get('http://localhost:5000/api/tours')
      .then(r => setTours(r.data))
      .catch(() => {})
      .finally(() => setLoadingTours(false));
    axios.get('http://localhost:5000/api/adventures')
      .then(r => setAdventures(r.data))
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

    const basePerPerson = tripItems.reduce((s, i) => s + Number(i.price || 0), 0);
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
    const discountAmount = baseTotal * cappedRate;
    const finalTotal = Math.round(baseTotal - discountAmount);
    const finalPerPerson = groupSize > 0 ? Math.round(finalTotal / groupSize) : finalTotal;

    const feasibility = getFeasibilityReport(tripItems, travelDate, groupSize);
    const permitTotal = feasibility.permitTotalPerPerson * groupSize;

    return {
      basePerPerson,
      baseTotal,
      discounts,
      totalDiscountRate: cappedRate,
      discountAmount,
      finalTotal,
      finalPerPerson,
      feasibility,
      permitTotal,
      grandTotal: finalTotal + permitTotal,
    };
  }, [tripItems, groupSize, travelDate, bookingDate]);

  const filteredTours = tours.filter(t =>
    !pickerSearch || t.title?.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    t.destination?.toLowerCase().includes(pickerSearch.toLowerCase())
  );
  const filteredAdventures = adventures.filter(a =>
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
          <Link to="/tours">Tour Packages</Link>
          <Link to="/adventures">Adventure Sports</Link>
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
          <span className="page-hero-eyebrow">Design Your Perfect Journey</span>
          <h1 className="page-hero-title">Build My Custom Trip</h1>
        </div>
      </div>

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
              🏔️ Tours ({filteredTours.length})
            </button>
            <button
              className={`builder-picker-tab ${pickerTab === 'adventures' ? 'active' : ''}`}
              onClick={() => setPickerTab('adventures')}
            >
              🏄 Adventures ({filteredAdventures.length})
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
              <span className="builder-empty-icon">🗺️</span>
              <p>Your trip is empty. Add packages from the left panel to get started.</p>
            </div>
          ) : (
            <div className="builder-timeline">
              {tripItems.map((item, index) => (
                <div className="builder-timeline-item" key={item.uid}>
                  <div className="builder-timeline-connector">
                    <div className="builder-timeline-dot" style={{ backgroundColor: item.type === 'adventure' ? '#e63946' : '#1a5c9e' }}>
                      {item.type === 'adventure' ? '🏄' : '🏔️'}
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
                          <span>📍 {item.destination || item.location}</span>
                          <span>⏱ {item.duration} {item.type === 'tour' ? 'days' : ''}</span>
                          <span>💰 ${item.price}/person</span>
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
                <span>📅 Total Duration</span>
                <strong>{calc.feasibility.totalDays} Days</strong>
              </div>
              <div className="builder-total-chip">
                <span>👥 {groupSize} Traveller{groupSize > 1 ? 's' : ''}</span>
                <strong>${calc.finalPerPerson.toLocaleString()}/person</strong>
              </div>
              <div className="builder-total-chip highlight">
                <span>Grand Total (est.)</span>
                <strong>${calc.grandTotal.toLocaleString()}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="builder-summary">

          {tripItems.length === 0 ? (
            <div className="builder-summary-empty">
              <p>Add packages to your trip to see cost breakdown and feasibility analysis.</p>
            </div>
          ) : calc && (
            <>
              <div className="builder-summary-card">
                <h3 className="builder-summary-heading">💰 Cost Breakdown</h3>

                <div className="builder-cost-row">
                  <span>Base cost ({tripItems.length} pkg × {groupSize} people)</span>
                  <span>${calc.baseTotal.toLocaleString()}</span>
                </div>

                {tripItems.map(item => (
                  <div className="builder-cost-row sub" key={item.uid}>
                    <span className="builder-cost-pkg-name">{item.title}</span>
                    <span>${(item.price * groupSize).toLocaleString()}</span>
                  </div>
                ))}

                <div className="builder-cost-divider"></div>

                {calc.discounts.length > 0 && (
                  <>
                    <div className="builder-cost-section-label">Applied Discounts</div>
                    {calc.discounts.map((d, i) => (
                      <div key={i} className={`builder-discount-row ${d.rate < 0 ? 'surcharge' : ''}`}>
                        <div>
                          <span className="builder-discount-label">{d.label}</span>
                          <span className="builder-discount-desc">{d.desc}</span>
                        </div>
                        <span className="builder-discount-pct">
                          {d.rate < 0 ? `+${Math.abs(d.rate * 100).toFixed(0)}%` : `−${(d.rate * 100).toFixed(0)}%`}
                        </span>
                      </div>
                    ))}
                    <div className="builder-cost-row total-discount">
                      <span>Total discount</span>
                      <span className="builder-savings">−${Math.round(calc.discountAmount).toLocaleString()}</span>
                    </div>
                  </>
                )}

                <div className="builder-cost-divider"></div>

                <div className="builder-cost-row final">
                  <span>Package Total</span>
                  <span>${calc.finalTotal.toLocaleString()}</span>
                </div>

                {calc.feasibility.permits.length > 0 && (
                  <>
                    <div className="builder-cost-section-label">Estimated Permits & Fees</div>
                    {calc.feasibility.permits.map((p, i) => (
                      <div className="builder-cost-row sub" key={i}>
                        <span>{p.name}</span>
                        <span>${(p.cost * groupSize).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="builder-cost-row">
                      <span>Permits subtotal</span>
                      <span>${calc.permitTotal.toLocaleString()}</span>
                    </div>
                  </>
                )}

                <div className="builder-cost-divider thick"></div>

                <div className="builder-cost-row grand-total">
                  <span>Estimated Grand Total</span>
                  <span>${calc.grandTotal.toLocaleString()}</span>
                </div>
                <div className="builder-cost-per-person">
                  ≈ ${calc.finalPerPerson.toLocaleString()} / person (excl. permits)
                </div>
              </div>

              <div className="builder-summary-card">
                <h3 className="builder-summary-heading">🏷️ Available Discounts</h3>
                <p className="builder-discount-info-note">Discounts stack additively, capped at 35% off base price.</p>
                <div className="builder-discount-info-grid">
                  {[
                    { label: 'Group (4–7)',   value: '7%',  active: groupSize >= 4 && groupSize <= 7 },
                    { label: 'Group (8–11)',  value: '12%', active: groupSize >= 8 && groupSize <= 11 },
                    { label: 'Group (12+)',   value: '18%', active: groupSize >= 12 },
                    { label: 'Early Bird 30d', value: '3%', active: calc.discounts.some(d => d.label.includes('30')) },
                    { label: 'Early Bird 60d', value: '6%', active: calc.discounts.some(d => d.label.includes('60')) },
                    { label: 'Early Bird 90d', value: '10%',active: calc.discounts.some(d => d.label.includes('90')) },
                    { label: 'Early Bird 120d','value': '15%',active: calc.discounts.some(d => d.label.includes('120')) },
                    { label: '10+ days',      value: '4%',  active: calc.feasibility.totalDays >= 10 },
                    { label: '14+ days',      value: '7%',  active: calc.feasibility.totalDays >= 14 },
                    { label: '21+ days',      value: '10%', active: calc.feasibility.totalDays >= 21 },
                    { label: 'Tour + Adventure bundle', value: '8%', active: calc.discounts.some(d => d.label.includes('Bundle')) },
                    { label: '3+ packages',   value: '5%',  active: tripItems.length >= 3 },
                    { label: '5+ packages',   value: '10%', active: tripItems.length >= 5 },
                    { label: 'Spring season', value: '5%',  active: calc.discounts.some(d => d.label.includes('Spring')) },
                    { label: 'Monsoon season','value': '12%',active: calc.discounts.some(d => d.label.includes('Monsoon')) },
                    { label: 'Peak season',   value: '+5%', active: calc.discounts.some(d => d.label.includes('Peak')), surcharge: true },
                  ].map((item, i) => (
                    <div key={i} className={`builder-discount-chip ${item.active ? 'active' : ''} ${item.surcharge ? 'surcharge' : ''}`}>
                      <span className="builder-discount-chip-value">{item.value}</span>
                      <span className="builder-discount-chip-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="builder-summary-card">
                <h3 className="builder-summary-heading">🗺️ Feasibility Report</h3>

                {calc.feasibility.permits.length > 0 && (
                  <div className="builder-feasibility-section">
                    <div className="builder-feasibility-section-title">Required Permits</div>
                    {calc.feasibility.permits.map((p, i) => (
                      <div className="builder-permit-item" key={i}>
                        <div className="builder-permit-header">
                          <span className="builder-permit-name">{p.name}</span>
                          <span className="builder-permit-cost">${p.cost}/person</span>
                        </div>
                        <p className="builder-permit-note">{p.note}</p>
                        {p.processDays > 0 && (
                          <span className="builder-permit-days">⏳ Allow {p.processDays} day{p.processDays > 1 ? 's' : ''} processing time</span>
                        )}
                      </div>
                    ))}
                    {calc.feasibility.maxProcessDays > 0 && (
                      <div className="builder-permit-lead-time">
                        📌 Book at least <strong>{calc.feasibility.maxProcessDays + 7} days</strong> before your travel date to process all permits.
                      </div>
                    )}
                  </div>
                )}

                {calc.feasibility.warnings.length > 0 && (
                  <div className="builder-feasibility-section">
                    <div className="builder-feasibility-section-title">Warnings</div>
                    {calc.feasibility.warnings.map((w, i) => (
                      <div className="builder-feasibility-item warning" key={i}>
                        <span>{w.icon}</span><p>{w.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {calc.feasibility.notes.length > 0 && (
                  <div className="builder-feasibility-section">
                    <div className="builder-feasibility-section-title">Logistics Notes</div>
                    {calc.feasibility.notes.map((n, i) => (
                      <div className="builder-feasibility-item note" key={i}>
                        <span>{n.icon}</span><p>{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {calc.feasibility.tips.length > 0 && (
                  <div className="builder-feasibility-section">
                    <div className="builder-feasibility-section-title">Seasonal Tips</div>
                    {calc.feasibility.tips.map((t, i) => (
                      <div className="builder-feasibility-item tip" key={i}>
                        <span>{t.icon}</span><p>{t.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {calc.feasibility.permits.length === 0 && calc.feasibility.warnings.length === 0 && calc.feasibility.notes.length === 0 && (
                  <div className="builder-feasibility-item tip">
                    <span>✅</span><p>No major feasibility concerns detected for your current selection. Add a travel date for a seasonal analysis.</p>
                  </div>
                )}
              </div>

              <Link 
                to="/contact" 
                state={{ 
                  tripItems: tripItems, 
                  groupSize: groupSize, 
                  travelDate: travelDate, 
                  grandTotal: calc.grandTotal 
                }} 
                className="builder-enquire-cta"
              >
                Send This Trip to Our Team →
              </Link>
              <p className="builder-cta-note">We'll review your custom itinerary and get back within 24 hours with a confirmed quote.</p>
            </>
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
          <span>⏱ {meta}</span>
          <span className="picker-item-price">${item.price}<small>/person</small></span>
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