// src/pages/AdventureDetails.jsx
// Luxury editorial redesign — Black Tomato / Scott Dunn inspired layout.
// Sections: Split Hero | Sticky Tabs | Overview | Itinerary | Gallery | Enquire
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link }   from 'react-router-dom';
import axios                  from 'axios';
import { motion }             from 'framer-motion';
import { MapPin, Clock, Activity } from 'lucide-react';
import '../App.css';

import { CurrencyContext }    from '../context/CurrencyContext';
import PriceDisplay           from '../components/PriceDisplay';
import HeroCarousel           from '../components/HeroCarousel';
import StickyTabNav           from '../components/StickyTabNav';
import ExpertSidebar          from '../components/ExpertSidebar';
import Navbar from '../components/Navbar';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December','Flexible',
];

const ADVENTURE_TABS = [
  { id: 'section-overview',   label: 'Overview'    },
  { id: 'section-itinerary',  label: 'Itinerary'   },
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
function AdventureDetails() {
  const { id }                                     = useParams();
  const { currency, toggleCurrency, formatPrice }  = useContext(CurrencyContext);

  const [advData,         setAdvData]         = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [openDay,         setOpenDay]         = useState(0); // first day open by default
  const [lightboxIndex,   setLightboxIndex]   = useState(null);
  const [scrolled,        setScrolled]        = useState(false);

  const [inquiryData, setInquiryData] = useState({
    name: '', email: '', subject: '', message: '',
    travelMonth: 'Flexible', groupSize: '2', budgetRange: 'Standard',
  });
  const [inquiryStatus, setInquiryStatus] = useState(null); // null | 'success' | 'error'

  // Normalize data in case API returns an array for a single item fetch
  const adventure = Array.isArray(advData) ? advData[0] : advData;

  // ── Nav scroll-hide ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Data fetch ───────────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/adventures/${id}`)
      .then(r => {
        setAdvData(r.data);
        setLoading(false);
        const resolvedAdv = Array.isArray(r.data) ? r.data[0] : r.data;
        if (resolvedAdv) {
          setInquiryData(f => ({ ...f, subject: `Enquiry about Adventure: ${resolvedAdv.title}` }));
        }
      })
      .catch(() => { setError('Could not load adventure details.'); setLoading(false); });
  }, [id]);

  // ── Lightbox keyboard nav ────────────────────────────────────────────────────
  const gallery = adventure?.galleryImages || [];
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
    if (!adventure?._id) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
      ...inquiryData,
      relatedAdventure: adventure._id,
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

  // ── Loading / Error states ───────────────────────────────────────────────────
  if (loading) return <Skeleton />;

  if (error || !adventure || Object.keys(adventure).length === 0) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', background:'#f7f2e8', fontFamily:"'Inter',sans-serif", textAlign:'center', padding:'40px 20px' }}>
      <div style={{ fontSize:'3rem', marginBottom:'20px' }}>🧗</div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#050b16', marginBottom:'12px' }}>
        {error ? 'Could Not Load Adventure' : 'Adventure Not Found'}
      </h1>
      <p style={{ color:'#64748b', marginBottom:'28px', maxWidth:'400px' }}>{error || 'This adventure may have been removed.'}</p>
      <Link to="/packages" style={{ padding:'13px 32px', background:'#050b16', color:'#fff',
        textDecoration:'none', fontWeight:'700', fontSize:'0.88rem', letterSpacing:'1px' }}>
        Browse All Packages
      </Link>
    </div>
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const intensityColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Intense: '#e67e22', Extreme: '#e63946',
  }[adventure.intensity] || '#1a5c9e';

  // Adventures use a flat number for price, unlike Tours.
  // We mock the nested structure so PriceDisplay renders nicely.
  const flatPriceObj = { amount: adventure.price, displayType: 'starting_from' };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">

      {/* ── Minimal fixed nav (dark, always visible on details page) ── */}
      <Navbar />

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
          <span className="ed-hero-eyebrow" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {adventure.sportType && (
              <span style={{ padding:'3px 8px', background:'rgba(212,175,55,0.15)', borderRadius:'2px', color:'#d4af37' }}>
                {adventure.sportType}
              </span>
            )}
            {adventure.location || 'Nepal'}
          </span>

          {/* Title */}
          <h1 className="ed-hero-title">{adventure.title}</h1>

          {/* Narrative paragraph (description excerpt) */}
          {adventure.description && (
            <p className="ed-hero-narrative">
              {adventure.description.slice(0, 220)}
              {adventure.description.length > 220 ? '…' : ''}
            </p>
          )}

          {/* Meta row */}
          <div className="ed-hero-meta">
            {adventure.duration && (
              <div className="ed-hero-meta-item">
                <span className="ed-hero-meta-label">Duration</span>
                <span className="ed-hero-meta-value">
                  <Clock size={13} style={{ marginRight:'5px', verticalAlign:'middle', opacity:0.6 }} />
                  {adventure.duration}
                </span>
              </div>
            )}
            {adventure.intensity && (
              <div className="ed-hero-meta-item">
                <span className="ed-hero-meta-label">Intensity</span>
                <span className="ed-hero-meta-value" style={{ color: intensityColor }}>
                  <Activity size={13} style={{ marginRight:'4px', verticalAlign:'middle' }} />
                  {adventure.intensity}
                </span>
              </div>
            )}
            <div className="ed-hero-meta-item">
              <span className="ed-hero-meta-label">Starting from</span>
              <span className="ed-hero-meta-value gold">
                <PriceDisplay price={flatPriceObj} size="md" />
              </span>
            </div>
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
            images={adventure.galleryImages || []}
            heroImage={adventure.heroImage}
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          2 · STICKY TAB NAV
      ═══════════════════════════════════════════ */}
      <StickyTabNav tabs={ADVENTURE_TABS} />

      {/* ═══════════════════════════════════════════
          3 · TWO-COLUMN CONTENT
      ═══════════════════════════════════════════ */}
      <div className="ed-content-wrap">

        {/* ── LEFT: Main content ── */}
        <div className="ed-main">

          {/* ─ OVERVIEW ─────────────────────────────── */}
          <section id="section-overview" className="ed-section">
            <span className="ed-section-label">The Experience</span>
            <h2 className="ed-section-title">Overview</h2>
            <p className="ed-description">{adventure.description}</p>

            {/* Adventure Highlights */}
            {adventure.included?.length > 0 && (
              <div style={{ marginTop:'36px' }}>
                <h3 className="ed-section-title ed-section-title--sm">Adventure Highlights</h3>
                <ul className="ed-highlight-list">
                  {adventure.included.map((item, i) => {
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
            {(adventure.included?.length > 0 || adventure.excluded?.length > 0) && (
              <div style={{ marginTop:'36px' }}>
                <h3 className="ed-section-title ed-section-title--sm">What's Included</h3>
                <div className="ed-inclusions-grid">
                  {adventure.included?.length > 0 && (
                    <div>
                      <h4 className="ed-inclusions-col-title inc">Included</h4>
                      <ul className="ed-inclusions-list">
                        {adventure.included.map((item, i) => {
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
                  {adventure.excluded?.length > 0 && (
                    <div>
                      <h4 className="ed-inclusions-col-title exc">Excluded</h4>
                      <ul className="ed-inclusions-list">
                        {adventure.excluded.map((item, i) => {
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
          {adventure.itinerary?.length > 0 && (
            <section id="section-itinerary" className="ed-section">
              <span className="ed-section-label">The Plan</span>
              <h2 className="ed-section-title">
                Itinerary
              </h2>

              <div className="ed-accordion">
                {adventure.itinerary.map((phase, idx) => {
                  if (!phase) return null;
                  const isOpen = openDay === idx;
                  return (
                    <div key={phase._id || idx} className={`ed-accordion-item ${isOpen ? 'open' : ''}`}>
                      <button
                        className="ed-accordion-header"
                        onClick={() => setOpenDay(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        id={`acc-${idx}`}
                      >
                        <span className="ed-day-number">
                          {phase.day || idx + 1}
                        </span>
                        <span className="ed-day-title">{phase.title}</span>
                        <span className="ed-chevron" aria-hidden="true">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </span>
                      </button>
                      <div className={`ed-accordion-body ${isOpen ? 'open' : ''}`}>
                        <div className="ed-accordion-body-inner">
                          <p className={`ed-accordion-text ${!phase.description ? 'empty' : ''}`}>
                            {phase.description || 'No additional detail for this phase.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                      <img src={img} alt={`${adventure.title} — photo ${i + 1}`} loading="lazy" />
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
            <h2 className="ed-section-title">Enquire About This Adventure</h2>

            <div className="ed-inquiry-block">
              <h3 className="ed-inquiry-title">Send Us a Message</h3>
              <p className="ed-inquiry-sub">
                Our experts respond within 24 hours to help plan your adventure.
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
                  placeholder={`Hi Samye Travels, I'm interested in the ${adventure.title}. I'd love to know more about dates, group sizes, and possible customisations…`}
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
          item={adventure}
          itemType="adventure"
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

    </div>
  );
}

export default AdventureDetails;