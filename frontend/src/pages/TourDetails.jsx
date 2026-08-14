// src/pages/TourDetails.jsx
// Luxury editorial redesign — Black Tomato / Scott Dunn inspired layout.
// Sections: Split Hero | Sticky Tabs | Overview | Itinerary | Map | Gallery | Enquire
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link }   from 'react-router-dom';
import axios                  from 'axios';
import { motion }             from 'framer-motion';
import { MapPin, Clock }      from 'lucide-react';
import '../App.css';

import { CurrencyContext }    from '../context/CurrencyContext';
import PriceDisplay           from '../components/PriceDisplay';
import LeadCaptureModal       from '../components/LeadCaptureModal';
import HeroCarousel           from '../components/HeroCarousel';
import StickyTabNav           from '../components/StickyTabNav';
import ExpertSidebar          from '../components/ExpertSidebar';
import TourMap                from '../components/TourMap';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = 'YOUR_WHATSAPP_NUMBER'; // Replace: '9779800000000'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December','Flexible',
];

const TOUR_TABS = [
  { id: 'section-overview',   label: 'Overview'    },
  { id: 'section-itinerary',  label: 'Itinerary'   },
  { id: 'section-map',        label: 'Route Map'   },
  { id: 'section-gallery',    label: 'Gallery'     },
  { id: 'section-enquire',    label: 'Enquire'     },
];

// ── Skeleton loader ────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: '#050b16', minHeight: '100vh' }}>
      <style>{`
        @keyframes shimmer { from{background-position:-600px 0}to{background-position:600px 0} }
        .sk{ background:linear-gradient(90deg,#1e293b 25%,#273449 50%,#1e293b 75%);
             background-size:600px 100%;animation:shimmer 1.4s ease-in-out infinite;border-radius:4px; }
      `}</style>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'100vh' }}>
        <div style={{ padding:'120px 80px 80px', display:'flex', flexDirection:'column', gap:'24px' }}>
          <div className="sk" style={{ height:'12px', width:'120px' }}/>
          <div className="sk" style={{ height:'52px', width:'80%' }}/>
          <div className="sk" style={{ height:'52px', width:'60%' }}/>
          <div className="sk" style={{ height:'16px', width:'90%', marginTop:'8px' }}/>
          <div className="sk" style={{ height:'16px', width:'75%' }}/>
        </div>
        <div style={{ background:'#0a0f1a' }}/>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function TourDetails() {
  const { id }                                     = useParams();
  const { currency, toggleCurrency, formatPrice }  = useContext(CurrencyContext);

  const [tourData,        setTourData]        = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [openDay,         setOpenDay]         = useState(0); // first day open by default
  const [lightboxIndex,   setLightboxIndex]   = useState(null);
  const [modalOpen,       setModalOpen]       = useState(false);
  const [scrolled,        setScrolled]        = useState(false);

  const [inquiryData, setInquiryData] = useState({
    name: '', email: '', subject: '', message: '',
    travelMonth: 'Flexible', groupSize: '2', budgetRange: 'Standard',
  });
  const [inquiryStatus, setInquiryStatus] = useState(null); // null | 'success' | 'error'

  // Normalize tour data in case API returns an array for a single item fetch
  const tour = Array.isArray(tourData) ? tourData[0] : tourData;

  // ── Nav scroll-hide ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Data fetch ───────────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/tours/${id}`)
      .then(r => {
        setTourData(r.data);
        setLoading(false);
        const resolvedTour = Array.isArray(r.data) ? r.data[0] : r.data;
        if (resolvedTour) {
          setInquiryData(f => ({ ...f, subject: `Enquiry about: ${resolvedTour.title}` }));
        }
      })
      .catch(() => { setError('Could not load tour details.'); setLoading(false); });
  }, [id]);

  // ── Lightbox keyboard nav ────────────────────────────────────────────────────
  const gallery = tour?.galleryImages || [];
  useEffect(() => {
    const handleKey = e => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape')     setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, gallery.length]);

  // ── Inquiry form handlers ────────────────────────────────────────────────────
  const handleInquiryChange = e =>
    setInquiryData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleInquirySubmit = e => {
    e.preventDefault();
    if (!tour?._id) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
      ...inquiryData,
      relatedTour: tour._id,
    })
      .then(() => {
        setInquiryStatus('success');
        setInquiryData(f => ({ ...f, name: '', email: '', message: '' }));
        setTimeout(() => setInquiryStatus(null), 6000);
      })
      .catch(() => setInquiryStatus('error'));
  };

  const scrollToEnquire = useCallback(() => {
    const el = document.getElementById('section-enquire');
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, []);

  // ── Route chain from itinerary titles ──────────────────────────────────────
  const routeStops = (() => {
    const stops = [];
    if (tour?.destination) stops.push(tour.destination);
    const itinTitles = tour?.itinerary
      ?.slice(0, 4)
      ?.map(d => d?.title)
      ?.filter(Boolean) || [];
    return stops.concat(itinTitles).slice(0, 5);
  })();

  // ── Loading / Error states ───────────────────────────────────────────────────
  if (loading) return <Skeleton />;

  if (error || !tour || Object.keys(tour).length === 0) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', background:'#f7f2e8', fontFamily:"'Inter',sans-serif", textAlign:'center', padding:'40px 20px' }}>
      <div style={{ fontSize:'3rem', marginBottom:'20px' }}>🏔️</div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#050b16', marginBottom:'12px' }}>
        {error ? 'Could Not Load Tour' : 'Tour Not Found'}
      </h1>
      <p style={{ color:'#64748b', marginBottom:'28px', maxWidth:'400px' }}>{error || 'This tour may have been removed.'}</p>
      <Link to="/packages" style={{ padding:'13px 32px', background:'#050b16', color:'#fff',
        textDecoration:'none', fontWeight:'700', fontSize:'0.88rem', letterSpacing:'1px' }}>
        Browse All Packages
      </Link>
    </div>
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const difficultyColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Challenging: '#e67e22', Hard: '#e63946',
  }[tour.difficulty] || '#1a5c9e';

  const isPOR = tour.price && typeof tour.price === 'object' && tour.price.displayType === 'por';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">

      {/* ── Minimal fixed nav (dark, always visible on details page) ── */}
      <nav
        className="top-navbar"
        style={{
          position: 'fixed',
          background: scrolled ? 'rgba(5,11,22,0.97)' : 'rgba(5,11,22,0.6)',
          backdropFilter: scrolled ? 'blur(8px)' : 'blur(4px)',
          transition: 'background 0.4s ease, padding 0.4s ease',
          padding: scrolled ? '12px 60px' : '20px 60px',
        }}
      >
        <Link to="/packages" className="details-back-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          All Packages
        </Link>
        <span className="navbar-brand" style={{ position:'absolute', left:'50%', transform:'translateX(-50%)' }}>
          Samye Travels
        </span>
        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          <button
            onClick={toggleCurrency}
            style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)',
              color:'#fff', padding:'7px 14px', borderRadius:'2px', cursor:'pointer',
              fontWeight:'600', fontSize:'0.8rem', letterSpacing:'1px', fontFamily:"'Inter',sans-serif" }}
          >
            {currency}
          </button>
          <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          1 · SPLIT HERO
      ═══════════════════════════════════════════ */}
      <section className="ed-split-hero">

        {/* ── LEFT: Editorial text panel ── */}
        <motion.div
          className="ed-hero-left"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <span className="ed-hero-eyebrow">
            {tour.destination || 'Nepal'}
          </span>

          {/* Title */}
          <h1 className="ed-hero-title">{tour.title}</h1>

          {/* Narrative paragraph (description excerpt) */}
          {tour.description && (
            <p className="ed-hero-narrative">
              {tour.description.slice(0, 220)}
              {tour.description.length > 220 ? '…' : ''}
            </p>
          )}

          {/* Route chain */}
          {routeStops?.length > 0 && (
            <div className="ed-route-chain">
              {routeStops.map((stop, i) => {
                if (!stop) return null;
                return (
                  <span key={stop._id || i} style={{ display:'inline-flex', alignItems:'center', gap:'6px' }}>
                    <span className="ed-route-stop">
                      <MapPin size={11} className="ed-route-pin" style={{ color:'#d4af37' }} />
                      {stop}
                    </span>
                    {i < routeStops.length - 1 && (
                      <span className="ed-route-arrow">→</span>
                    )}
                  </span>
                );
              })}
            </div>
          )}

          {/* Meta row */}
          <div className="ed-hero-meta">
            {tour.duration && (
              <div className="ed-hero-meta-item">
                <span className="ed-hero-meta-label">Duration</span>
                <span className="ed-hero-meta-value">
                  <Clock size={13} style={{ marginRight:'5px', verticalAlign:'middle', opacity:0.6 }} />
                  {tour.duration} Days
                </span>
              </div>
            )}
            {tour.difficulty && (
              <div className="ed-hero-meta-item">
                <span className="ed-hero-meta-label">Difficulty</span>
                <span className="ed-hero-meta-value" style={{ color: difficultyColor }}>
                  {tour.difficulty}
                </span>
              </div>
            )}
            <div className="ed-hero-meta-item">
              <span className="ed-hero-meta-label">
                {isPOR ? 'Pricing' : 'Starting from'}
              </span>
              <span className="ed-hero-meta-value gold">
                <PriceDisplay price={tour.price} size="md" />
              </span>
            </div>

            {/* Download Itinerary CTA */}
            <button
              onClick={() => setModalOpen(true)}
              style={{
                marginLeft:'auto', padding:'10px 20px',
                background:'transparent', border:'1px solid rgba(212,175,55,0.4)',
                color:'#d4af37', fontFamily:"'Inter',sans-serif",
                fontSize:'0.75rem', fontWeight:'700', letterSpacing:'1.2px',
                textTransform:'uppercase', cursor:'pointer',
                transition:'all 0.2s ease', borderRadius:'2px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(212,175,55,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
            >
              Download Itinerary
            </button>
          </div>
        </motion.div>

        {/* ── RIGHT: Image carousel ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          style={{ position:'relative' }}
        >
          <HeroCarousel
            images={tour.galleryImages || []}
            heroImage={tour.heroImage}
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          2 · STICKY TAB NAV
      ═══════════════════════════════════════════ */}
      <StickyTabNav tabs={TOUR_TABS} />

      {/* ═══════════════════════════════════════════
          3 · TWO-COLUMN CONTENT
      ═══════════════════════════════════════════ */}
      <div className="ed-content-wrap">

        {/* ── LEFT: Main content ── */}
        <div className="ed-main">

          {/* ─ OVERVIEW ─────────────────────────────── */}
          <section id="section-overview" className="ed-section">
            <span className="ed-section-label">About This Journey</span>
            <h2 className="ed-section-title">Overview</h2>
            <p className="ed-description">{tour.description}</p>

            {/* Journey Highlights = Included items with diamond markers */}
            {tour.included?.length > 0 && (
              <div style={{ marginTop:'36px' }}>
                <h3 className="ed-section-title ed-section-title--sm">Journey Highlights</h3>
                <ul className="ed-highlight-list">
                  {tour.included.map((item, i) => {
                    if (!item) return null;
                    return (
                      <li key={item._id || i} className="ed-highlight-item">
                        <span className="ed-diamond" aria-hidden="true" />
                        <span className="ed-highlight-text">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* What's NOT included */}
            {(tour.included?.length > 0 || tour.excluded?.length > 0) && (
              <div style={{ marginTop:'36px' }}>
                <h3 className="ed-section-title ed-section-title--sm">What's Included</h3>
                <div className="ed-inclusions-grid">
                  {tour.included?.length > 0 && (
                    <div>
                      <h4 className="ed-inclusions-col-title inc">Included</h4>
                      <ul className="ed-inclusions-list">
                        {tour.included.map((item, i) => {
                          if (!item) return null;
                          return (
                            <li key={item._id || i} className="ed-inclusions-item">
                              <span className="ed-inc-icon inc">✓</span>
                              <span>{item}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {tour.excluded?.length > 0 && (
                    <div>
                      <h4 className="ed-inclusions-col-title exc">Excluded</h4>
                      <ul className="ed-inclusions-list">
                        {tour.excluded.map((item, i) => {
                          if (!item) return null;
                          return (
                            <li key={item._id || i} className="ed-inclusions-item">
                              <span className="ed-inc-icon exc">✕</span>
                              <span>{item}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* ─ ITINERARY ────────────────────────────── */}
          {tour.itinerary?.length > 0 && (
            <section id="section-itinerary" className="ed-section">
              <span className="ed-section-label">Day by Day</span>
              <h2 className="ed-section-title">
                Itinerary
                <span style={{ marginLeft:'16px', fontSize:'1rem', fontWeight:'400',
                  color:'#888', fontFamily:"'Inter',sans-serif", fontStyle:'normal' }}>
                  {tour.itinerary.length} Days
                </span>
              </h2>

              <div className="ed-accordion">
                {tour.itinerary.map((day, idx) => {
                  if (!day) return null;
                  const isOpen = openDay === idx;
                  return (
                    <div key={day._id || idx} className={`ed-accordion-item ${isOpen ? 'open' : ''}`}>
                      <button
                        className="ed-accordion-header"
                        onClick={() => setOpenDay(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        id={`acc-${idx}`}
                      >
                        <span className="ed-day-number">
                          {day.day || idx + 1}
                        </span>
                        <span className="ed-day-title">{day.title}</span>
                        <span className="ed-chevron" aria-hidden="true">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </span>
                      </button>
                      <div className={`ed-accordion-body ${isOpen ? 'open' : ''}`}>
                        <div className="ed-accordion-body-inner">
                          <p className={`ed-accordion-text ${!day.description ? 'empty' : ''}`}>
                            {day.description || 'No additional detail for this day.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─ ROUTE MAP ────────────────────────────── */}
          {tour.itinerary?.length > 0 && (
            <section id="section-map" className="ed-section">
              <span className="ed-section-label">Visual Route</span>
              <h2 className="ed-section-title">Route Map</h2>
              <p className="ed-description" style={{ marginBottom:'28px' }}>
                Follow your journey stop by stop — hover any numbered marker to preview that day.
              </p>
              <TourMap itinerary={tour.itinerary} />
            </section>
          )}

          {/* ─ GALLERY ──────────────────────────────── */}
          {gallery?.length > 0 && (
            <section id="section-gallery" className="ed-section">
              <span className="ed-section-label">Visual Story</span>
              <h2 className="ed-section-title">Gallery</h2>
              <div className="ed-gallery-grid">
                {gallery.map((img, i) => {
                  if (!img) return null;
                  return (
                    <div
                      key={img._id || i}
                      className="ed-gallery-thumb"
                      onClick={() => setLightboxIndex(i)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View image ${i + 1}`}
                      onKeyDown={e => e.key === 'Enter' && setLightboxIndex(i)}
                    >
                      <img src={img} alt={`${tour.title} — photo ${i + 1}`} loading="lazy" />
                      <div className="ed-gallery-thumb-overlay">
                        <span className="ed-gallery-expand">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                            <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                          </svg>
                          Enlarge
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─ ENQUIRE ──────────────────────────────── */}
          <section id="section-enquire" className="ed-section">
            <span className="ed-section-label">Start Planning</span>
            <h2 className="ed-section-title">Enquire About This Tour</h2>

            <div className="ed-inquiry-block">
              <h3 className="ed-inquiry-title">Send Us a Message</h3>
              <p className="ed-inquiry-sub">
                Our travel experts respond within 24 hours with a personalised proposal.
              </p>

              {inquiryStatus === 'success' && (
                <div className="admin-alert success" style={{ margin:'0 0 20px' }}>
                  ✓ Enquiry sent! We'll get back to you within 24 hours.
                </div>
              )}
              {inquiryStatus === 'error' && (
                <div className="admin-alert error" style={{ margin:'0 0 20px' }}>
                  ✗ Something went wrong. Please try the Contact page.
                </div>
              )}

              <form className="inquiry-form" onSubmit={handleInquirySubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div className="inquiry-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <input name="name" value={inquiryData.name} onChange={handleInquiryChange}
                    placeholder="Your Name" required className="contact-input" />
                  <input type="email" name="email" value={inquiryData.email} onChange={handleInquiryChange}
                    placeholder="Your Email" required className="contact-input" />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px' }}>
                  <div className="contact-select-group">
                    <label className="contact-select-label">Travel Month</label>
                    <select name="travelMonth" value={inquiryData.travelMonth}
                      onChange={handleInquiryChange} className="contact-input contact-select">
                      {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="contact-select-group">
                    <label className="contact-select-label">Group Size</label>
                    <select name="groupSize" value={inquiryData.groupSize}
                      onChange={handleInquiryChange} className="contact-input contact-select">
                      <option value="1">Solo (1)</option>
                      <option value="2">Couple (2)</option>
                      <option value="3-5">Small Group (3–5)</option>
                      <option value="6+">Large Group (6+)</option>
                    </select>
                  </div>
                  <div className="contact-select-group">
                    <label className="contact-select-label">Budget Range</label>
                    <select name="budgetRange" value={inquiryData.budgetRange}
                      onChange={handleInquiryChange} className="contact-input contact-select">
                      <option>Standard</option>
                      <option>Premium</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                </div>

                <textarea
                  name="message"
                  value={inquiryData.message}
                  onChange={handleInquiryChange}
                  placeholder={`Hi Samye Travels, I'm interested in the ${tour.title}. I'd love to know more about dates, group sizes, and possible customisations…`}
                  rows="5"
                  className="contact-input contact-textarea"
                />

                <button type="submit" className="contact-submit-btn">
                  Send Enquiry →
                </button>
              </form>
            </div>
          </section>

        </div>{/* end ed-main */}

        {/* ── RIGHT: Sticky expert sidebar ── */}
        <ExpertSidebar
          item={tour}
          itemType="tour"
          onEnquireClick={scrollToEnquire}
          formatPrice={formatPrice}
        />

      </div>{/* end ed-content-wrap */}

      {/* ═══════════════════════════════════════════
          LIGHTBOX PORTAL
      ═══════════════════════════════════════════ */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>
            <img src={gallery[lightboxIndex]} alt="" className="lightbox-image" />
            {gallery.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-nav-prev"
                  onClick={() => setLightboxIndex(i => (i - 1 + gallery.length) % gallery.length)}>‹</button>
                <button className="lightbox-nav lightbox-nav-next"
                  onClick={() => setLightboxIndex(i => (i + 1) % gallery.length)}>›</button>
                <span className="lightbox-counter">{lightboxIndex + 1} / {gallery.length}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          LEAD CAPTURE MODAL (itinerary download)
      ═══════════════════════════════════════════ */}
      {modalOpen && (
        <LeadCaptureModal
          tour={tour}
          onClose={() => setModalOpen(false)}
        />
      )}

    </div>
  );
}

export default TourDetails;