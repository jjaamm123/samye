// src/pages/TourDetails.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CurrencyContext } from '../context/CurrencyContext';
import '../App.css';

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

  if (loading) return <p className="status-msg">Loading your itinerary…</p>;
  if (error)   return <p className="status-msg error">{error}</p>;
  if (!tour)   return <p className="status-msg">Tour not found.</p>;

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
      <div className="details-hero" style={{ backgroundImage: `url('${tour.heroImage || tour.featuredImage}')` }}>
        <div className="details-hero-overlay"></div>
        <div className="details-hero-content">
          <span className="details-hero-tag">{tour.package}</span>
          <h1 className="details-hero-title">{tour.title}</h1>
          <div className="details-hero-pills">
            <span className="details-pill">{tour.duration} Days</span>
            <span className="details-pill" style={{ backgroundColor: difficultyColor }}>{tour.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="content-container details-layout">

        {/* ── LEFT COLUMN ── */}
        <div className="details-main">

          {/* Overview */}
          <div className="details-card">
            <h2 className="details-section-heading">Overview</h2>
            <p className="details-description">{tour.description}</p>
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
            <div className="booking-price-block">
              <span className="booking-price-label">From</span>
              <div className="booking-price">{formatPrice(tour.price)} <span>/ person</span></div>
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
            <button className="booking-cta-btn" onClick={scrollToForm}>Book This Tour</button>
            <p className="booking-note">Free cancellation up to 30 days before departure</p>
          </div>
        </div>

      </div>

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