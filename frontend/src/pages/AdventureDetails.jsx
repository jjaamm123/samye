// src/pages/AdventureDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December','Flexible'
];

function AdventureDetails() {
  const { id } = useParams();
  const { currency, toggleCurrency, formatPrice } = useContext(CurrencyContext);
  const [adventure, setAdventure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [openDay, setOpenDay] = useState(null);

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
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % (adventure?.gallery?.length || 1));
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + (adventure?.gallery?.length || 1)) % (adventure?.gallery?.length || 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, adventure]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/adventures/${id}`)
      .then(r => {
        setAdventure(r.data);
        setLoading(false);
        setInquiryData(f => ({ ...f, subject: `Enquiry about: ${r.data.title}` }));
      })
      .catch(() => { setError('Could not load adventure details.'); setLoading(false); });
  }, [id]);

  if (loading) return <p className="status-msg">Loading adventure details…</p>;
  if (error)   return <p className="status-msg error">{error}</p>;
  if (!adventure) return <p className="status-msg">Adventure not found.</p>;

  const intensityColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Intense: '#e67e22', Extreme: '#e63946'
  }[adventure.intensity] || '#1a5c9e';

  const gallery = adventure.gallery || [];
  const goNext = () => setActiveSlide(s => (s + 1) % gallery.length);
  const goPrev = () => setActiveSlide(s => (s - 1 + gallery.length) % gallery.length);

  let heroImage = adventure.featuredImage || '';
  if (!heroImage || heroImage.startsWith('/images/'))
    heroImage = 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1920&q=80';

  const handleInquiryChange = e =>
    setInquiryData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleInquirySubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/inquiries', {
      ...inquiryData,
      relatedAdventure: adventure._id
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


      <div className="details-hero" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="details-hero-overlay"></div>
        <div className="details-hero-content">
          <span className="details-hero-tag">{adventure.sportType || 'Adventure'}</span>
          <h1 className="details-hero-title">{adventure.title}</h1>
          <div className="details-hero-pills">
            <span className="details-pill">📍 {adventure.location}</span>
            <span className="details-pill">⏱ {adventure.duration}</span>
            <span className="details-pill" style={{ backgroundColor: intensityColor }}>{adventure.intensity}</span>
          </div>
        </div>
      </div>

      <div className="content-container details-layout">

        <div className="details-main">

          {/* Overview */}
          <div className="details-card">
            <h2 className="details-section-heading">Overview</h2>
            <p className="details-description">{adventure.description}</p>
          </div>

          {/* ── PHASE 1: Included / Excluded ── identical pattern to TourDetails */}
          {(adventure.included?.length > 0 || adventure.excluded?.length > 0) && (
            <div className="details-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">What's Included</h2>
              <div className="inclusions-grid">
                {adventure.included?.length > 0 && (
                  <div className="inclusions-col">
                    <h4 className="inclusions-col-title included">Included</h4>
                    <ul className="inclusions-list">
                      {adventure.included.map((item, i) => (
                        <li key={i} className="inclusions-item included">
                          <span className="inclusions-icon">&#10003;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {adventure.excluded?.length > 0 && (
                  <div className="inclusions-col">
                    <h4 className="inclusions-col-title excluded">Excluded</h4>
                    <ul className="inclusions-list">
                      {adventure.excluded.map((item, i) => (
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

          {/* Safety notes */}
          {adventure.safetyNotes && (
            <div className="details-card safety-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">Safety Information</h2>
              <p className="details-description">{adventure.safetyNotes}</p>
            </div>
          )}

          {/* ── PHASE 1: Accordion itinerary / schedule ── */}
          {adventure.itinerary?.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">
                Schedule
                <span className="itinerary-day-count">{adventure.itinerary.length} Phases</span>
              </h2>

              <div className="accordion-itinerary">
                {adventure.itinerary.map((phase, index) => {
                  const isOpen = openDay === index;
                  return (
                    <div key={index} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                      <button
                        className="accordion-header"
                        onClick={() => setOpenDay(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <div className="accordion-header-left">
                          <span className="accordion-day-badge">{phase.day}</span>
                          <span className="accordion-day-title">{phase.title}</span>
                        </div>
                        <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>›</span>
                      </button>
                      <div className={`accordion-body ${isOpen ? 'open' : ''}`}>
                        {phase.description
                          ? <p className="accordion-description">{phase.description}</p>
                          : <p className="accordion-description empty">No additional detail for this phase.</p>
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
              <h2 className="details-section-heading">Gallery</h2>
              <div className="carousel-wrapper">
                <div className="carousel-slide" onClick={() => setLightboxIndex(activeSlide)}>
                  <img src={gallery[activeSlide]} alt="" className="carousel-image" />
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
                          <img src={img} alt="" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Inquiry form */}
          <div className="details-card" style={{ marginTop: '28px' }}>
            <h2 className="details-section-heading">Enquire About This Adventure</h2>

            {inquiryStatus === 'success' && (
              <div className="admin-alert success" style={{ margin: '0 0 16px' }}>
                ✓ Enquiry sent! We'll get back to you within 24 hours.
              </div>
            )}
            {inquiryStatus === 'error' && (
              <div className="admin-alert error" style={{ margin: '0 0 16px' }}>
                ✗ Something went wrong. Please try the Contact page.
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

              <textarea name="message" value={inquiryData.message} onChange={handleInquiryChange}
                placeholder="Any specific questions about this adventure?" rows="4"
                className="contact-input contact-textarea"></textarea>

              <button type="submit" className="contact-submit-btn">Send Enquiry →</button>
            </form>
          </div>

        </div>

        {/* Sidebar */}
        <div className="details-sidebar">
          <div className="booking-card">
            <div className="booking-price-block">
              <span className="booking-price-label">From</span>
              <div className="booking-price">${adventure.price} <span>/ person</span></div>
            </div>
            <div className="booking-divider"></div>
            <div className="booking-facts">
              <div className="booking-fact-row">
                <span className="fact-label">Sport</span>
                <span className="fact-value">{adventure.sportType}</span>
              </div>
              <div className="booking-fact-row">
                <span className="fact-label">Location</span>
                <span className="fact-value">{adventure.location}</span>
              </div>
              <div className="booking-fact-row">
                <span className="fact-label">Duration</span>
                <span className="fact-value">{adventure.duration}</span>
              </div>
              <div className="booking-fact-row">
                <span className="fact-label">Min Age</span>
                <span className="fact-value">{adventure.minAge || '16+'}</span>
              </div>
              <div className="booking-fact-row">
                <span className="fact-label">Intensity</span>
                <span className="fact-value fact-difficulty" style={{ color: intensityColor }}>
                  {adventure.intensity}
                </span>
              </div>
            </div>
            <div className="booking-divider"></div>
            <button className="booking-cta-btn">Book This Adventure</button>
            <p className="booking-note">Free cancellation up to 48 hours before the activity</p>
          </div>
        </div>

      </div>

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

export default AdventureDetails;