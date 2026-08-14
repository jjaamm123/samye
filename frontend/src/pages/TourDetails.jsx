// src/pages/TourDetails.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CurrencyContext } from '../context/CurrencyContext';
import PriceDisplay, { getPriceDisplayType } from '../components/PriceDisplay';
import LeadCaptureModal from '../components/LeadCaptureModal';
import '../App.css';

// ── WhatsApp config — replace with your actual number (international format, no +) ──
const WHATSAPP_NUMBER = 'YOUR_WHATSAPP_NUMBER'; // e.g. '9779800000000'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December','Flexible'
];

function TourDetails() {
  const { currency, toggleCurrency, formatPrice } = useContext(CurrencyContext);

  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  // Lead capture modal visibility
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Carousel
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Accordion: which day index is open (null = all closed)
  const [openDay, setOpenDay] = useState(null);

  // Phase 1: Quick inquiry form state (pre-filled with tour context)
  const [inquiryData, setInquiryData] = useState({
    name: '', email: '', subject: '', message: '',
    travelMonth: 'Flexible', groupSize: '2', budgetRange: 'Standard'
  });
  const [inquiryStatus, setInquiryStatus] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKey = e => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % (tour?.galleryImages?.length || 1));
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + (tour?.galleryImages?.length || 1)) % (tour?.galleryImages?.length || 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, tour]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/tours/${id}`)
      .then(r => {
        setTour(r.data);
        setLoading(false);
        // Pre-fill subject with tour name
        setInquiryData(f => ({ ...f, subject: `Enquiry about: ${r.data.title}` }));
      })
      .catch(() => { setError('Could not load tour details.'); setLoading(false); });
  }, [id]);

  // Smooth scroll function for the booking button
  const scrollToForm = () => {
    document.getElementById('inquiry-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return (
    <div className="page-loading-screen">
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
          border-radius: 6px;
        }
      `}</style>
      <div style={{ width: '100%', height: '55vh', background: '#1e293b' }} />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton" style={{ height: '28px', width: '60%' }} />
          <div className="skeleton" style={{ height: '16px', width: '90%' }} />
          <div className="skeleton" style={{ height: '16px', width: '80%' }} />
          <div className="skeleton" style={{ height: '16px', width: '75%' }} />
          <div className="skeleton" style={{ height: '200px', marginTop: '12px' }} />
        </div>
        <div className="skeleton" style={{ height: '320px', borderRadius: '12px' }} />
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#f8fafc', fontFamily: "'Inter', sans-serif", textAlign: 'center' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(230,57,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h1 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px', fontFamily: "'Playfair Display', serif" }}>Could Not Load Tour</h1>
      <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px' }}>{error}</p>
      <a href="/packages" style={{ padding: '11px 26px', background: '#1a5c9e', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>Browse All Packages</a>
    </div>
  );

  if (!tour) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#f8fafc', fontFamily: "'Inter', sans-serif", textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px', fontFamily: "'Playfair Display', serif" }}>Tour Not Found</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>This tour may have been removed or the link may be incorrect.</p>
      <a href="/packages" style={{ padding: '11px 26px', background: '#1a5c9e', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>Browse All Packages</a>
    </div>
  );

  const difficultyColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Hard: '#e63946', Challenging: '#c0392b'
  }[tour.difficulty] || '#1a5c9e';

  const gallery = tour.galleryImages || [];
  const goNext = () => setActiveSlide(s => (s + 1) % gallery.length);
  const goPrev = () => setActiveSlide(s => (s - 1 + gallery.length) % gallery.length);

  const handleInquiryChange = e =>
    setInquiryData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleInquirySubmit = e => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
      ...inquiryData,
      relatedTour: tour._id
    })
      .then(() => {
        setInquiryStatus('success');
        setInquiryData(f => ({ ...f, name: '', email: '', message: '' }));
        setTimeout(() => setInquiryStatus(null), 5000);
      })
      .catch(() => setInquiryStatus('error'));
  };

  return (
    <div className="app-wrapper">

      {/* Navbar */}
      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`} style={{ position: 'fixed' }}>
        <Link to="/packages" className="details-back-link">← Back to Packages</Link>
        <span className="navbar-brand" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          Samye Travels
        </span>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={toggleCurrency} 
            style={{
              background: 'rgba(255,255,255,0.2)', border: '1px solid white', 
              color: 'white', padding: '6px 12px', borderRadius: '20px', 
              cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            {currency === 'USD' ? 'USD' : 'NPR'}
          </button>
          <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.div
        className="details-hero"
        style={{ backgroundImage: `url('${tour.heroImage || tour.featuredImage}')` }}
      >
        <div className="details-hero-overlay"></div>
        <motion.div
          className="details-hero-content"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="details-hero-tag">{tour.package}</span>
          <h1 className="details-hero-title">{tour.title}</h1>
          <div className="details-hero-pills">
            <span className="details-pill">{tour.duration} Days</span>
            <span className="details-pill" style={{ backgroundColor: difficultyColor }}>{tour.difficulty}</span>
          </div>
        </motion.div>
      </motion.div>

      <div className="content-container details-layout">

        {/* ── LEFT COLUMN ── */}
        <div className="details-main">

          {/* Overview */}
          <div className="details-card">
            <h2 className="details-section-heading">Overview</h2>
            <p className="details-description">{tour.description}</p>

            {/* ── Gated Itinerary CTA ── */}
            <button
              id="open-itinerary-modal-btn"
              onClick={() => setShowLeadModal(true)}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '9px',
                marginTop:      '20px',
                padding:        '12px 22px',
                background:     'linear-gradient(135deg, #0f4c8a 0%, #1a5c9e 100%)',
                color:          '#fff',
                border:         '1px solid rgba(255,255,255,0.12)',
                borderRadius:   '10px',
                fontSize:       '0.92rem',
                fontWeight:     '700',
                fontFamily:     "'Inter', sans-serif",
                cursor:         'pointer',
                letterSpacing:  '0.01em',
                boxShadow:      '0 4px 14px rgba(26,92,158,0.35)',
                transition:     'opacity 0.2s, transform 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e  => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)';    }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Download Complete Itinerary &amp; Pricing
            </button>
          </div>

          {(tour.included?.length > 0 || tour.excluded?.length > 0) && (
            <div className="details-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">What's Included</h2>
              <div className="inclusions-grid">

                {tour.included?.length > 0 && (
                  <div className="inclusions-col">
                    <h4 className="inclusions-col-title included">Included</h4>
                    <ul className="inclusions-list">
                      {tour.included.map((item, i) => (
                        <li key={i} className="inclusions-item included">
                          <span className="inclusions-icon">&#10003;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tour.excluded?.length > 0 && (
                  <div className="inclusions-col">
                    <h4 className="inclusions-col-title excluded">Excluded</h4>
                    <ul className="inclusions-list">
                      {tour.excluded.map((item, i) => (
                        <li key={i} className="inclusions-item excluded">
                          <span className="inclusions-icon">&#10005;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          )}

          {tour.itinerary?.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">
                Itinerary
                <span className="itinerary-day-count">{tour.itinerary.length} Days</span>
              </h2>

              <div className="accordion-itinerary">
                {tour.itinerary.map((day, index) => {
                  const isOpen = openDay === index;
                  return (
                    <div
                      key={index}
                      className={`accordion-item ${isOpen ? 'open' : ''}`}
                    >
                      <button
                        className="accordion-header"
                        onClick={() => setOpenDay(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <div className="accordion-header-left">
                          <span className="accordion-day-badge">
                            {day.day}
                          </span>
                          <span className="accordion-day-title">{day.title}</span>
                        </div>
                        <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>›</span>
                      </button>

                      <div className={`accordion-body ${isOpen ? 'open' : ''}`}>
                        {day.description
                          ? <p className="accordion-description">{day.description}</p>
                          : <p className="accordion-description empty">No additional detail for this day.</p>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gallery carousel */}
          {gallery.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px', overflow: 'hidden' }}>
              <h2 className="details-section-heading">Tour Gallery</h2>
              <div className="carousel-wrapper">
                <div className="carousel-slide" onClick={() => setLightboxIndex(activeSlide)}>
                  <img src={gallery[activeSlide]} alt={`Gallery ${activeSlide + 1}`} className="carousel-image" />
                  <div className="carousel-expand-hint">Click to enlarge</div>
                </div>
                {gallery.length > 1 && (
                  <>
                    <button className="carousel-btn carousel-btn-prev" onClick={goPrev}>‹</button>
                    <button className="carousel-btn carousel-btn-next" onClick={goNext}>›</button>
                    <div className="carousel-footer">
                      <div className="carousel-dots">
                        {gallery.map((_, idx) => (
                          <button key={idx} className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />
                        ))}
                      </div>
                      <span className="carousel-counter">{activeSlide + 1} / {gallery.length}</span>
                    </div>
                    <div className="carousel-thumbnails">
                      {gallery.map((img, idx) => (
                        <div key={idx} className={`carousel-thumb ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>
                          <img src={img} alt={`Thumb ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Contact Form with ID and Dynamic Placeholder */}
          <div className="details-card" id="inquiry-form-section" style={{ marginTop: '28px' }}>
            <h2 className="details-section-heading">Enquire About This Tour</h2>

            {inquiryStatus === 'success' && (
              <div className="admin-alert success" style={{ margin: '0 0 16px' }}>
                ✓ Enquiry sent! We'll get back to you within 24 hours.
              </div>
            )}
            {inquiryStatus === 'error' && (
              <div className="admin-alert error" style={{ margin: '0 0 16px' }}>
                ✗ Something went wrong. Please try the Contact page instead.
              </div>
            )}

            <form className="inquiry-form" onSubmit={handleInquirySubmit}>
              <div className="inquiry-form-row">
                <input name="name" value={inquiryData.name} onChange={handleInquiryChange}
                  placeholder="Your Name" required className="contact-input" />
                <input type="email" name="email" value={inquiryData.email} onChange={handleInquiryChange}
                  placeholder="Your Email" required className="contact-input" />
              </div>

              <div className="inquiry-form-row inquiry-form-row-3">
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
                placeholder={`Hi Samye Travels, I am interested in booking the ${tour.title}. Could you please provide more information about availability, customizing the itinerary, or...`} 
                rows="5"
                className="contact-input contact-textarea">
              </textarea>

              <button type="submit" className="contact-submit-btn">Send Enquiry →</button>
            </form>
          </div>

        </div>

        {/* ── RIGHT: Booking sidebar ── */}
        <div className="details-sidebar">
          <div className="booking-card">
            {/* Dynamic price block — respects displayType */}
            <div className="booking-price-block">
              {getPriceDisplayType(tour.price) === 'por' ? (
                <>
                  <span className="booking-price-label">Pricing</span>
                  <div className="booking-price" style={{ fontSize: '1.2rem' }}>
                    <PriceDisplay price={tour.price} size="lg" />
                  </div>
                </>
              ) : (
                <>
                  <span className="booking-price-label">From</span>
                  <div className="booking-price">
                    <PriceDisplay price={tour.price} size="lg" />
                    <span> / person</span>
                  </div>
                </>
              )}
            </div>
            <div className="booking-divider"></div>
            <div className="booking-facts">
              <div className="booking-fact-row">
                <span className="fact-label">Destination</span>
                <span className="fact-value">{tour.destination}</span>
              </div>
              <div className="booking-fact-row">
                <span className="fact-label">Duration</span>
                <span className="fact-value">{tour.duration} Days</span>
              </div>
              <div className="booking-fact-row">
                <span className="fact-label">Difficulty</span>
                <span className="fact-value fact-difficulty" style={{ color: difficultyColor }}>
                  {tour.difficulty}
                </span>
              </div>
              {tour.itinerary?.length > 0 && (
                <div className="booking-fact-row">
                  <span className="fact-label">Itinerary Days</span>
                  <span className="fact-value">{tour.itinerary.length}</span>
                </div>
              )}
            </div>
            <div className="booking-divider"></div>

            {/* ── Conditional primary CTA ── */}
            {getPriceDisplayType(tour.price) === 'por' ? (
              <a
                id="whatsapp-consult-btn"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi Samye Travels! I'm interested in the "${tour.title}" tour and would like to know more about pricing and availability.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '9px',
                  width:          '100%',
                  padding:        '14px 20px',
                  background:     'linear-gradient(135deg, #128c3e 0%, #25d366 100%)',
                  color:          '#fff',
                  borderRadius:   '10px',
                  fontFamily:     "'Inter', sans-serif",
                  fontSize:       '0.97rem',
                  fontWeight:     '700',
                  textDecoration: 'none',
                  letterSpacing:  '0.02em',
                  boxSizing:      'border-box',
                  boxShadow:      '0 4px 16px rgba(37,211,102,0.3)',
                  transition:     'opacity 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={e  => e.currentTarget.style.opacity = '1'}
              >
                {/* WhatsApp SVG icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Consult a Travel Expert
              </a>
            ) : (
              <button
                id="book-tour-btn"
                className="booking-cta-btn"
                onClick={scrollToForm}
              >
                Book This Tour
              </button>
            )}

            <p className="booking-note">Free cancellation up to 30 days before departure</p>
          </div>
        </div>

      </div>

      {/* Lead Capture Modal */}
      {showLeadModal && tour && (
        <LeadCaptureModal
          tour={tour}
          onClose={() => setShowLeadModal(false)}
        />
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>
            <img src={gallery[lightboxIndex]} alt="" className="lightbox-image" />
            {gallery.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-nav-prev" onClick={() => setLightboxIndex(i => (i - 1 + gallery.length) % gallery.length)}>‹</button>
                <button className="lightbox-nav lightbox-nav-next" onClick={() => setLightboxIndex(i => (i + 1) % gallery.length)}>›</button>
                <span className="lightbox-counter">{lightboxIndex + 1} / {gallery.length}</span>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default TourDetails;