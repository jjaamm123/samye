import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function AdventureDetails() {
  const { id } = useParams();
  const [adventure, setAdventure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
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
      .then(res => { setAdventure(res.data); setLoading(false); })
      .catch(err => { console.error(err); setError("Could not load adventure details."); setLoading(false); });
  }, [id]);

  if (loading) return <p className="status-msg">Loading adventure details...</p>;
  if (error)   return <p className="status-msg error">{error}</p>;
  if (!adventure) return <p className="status-msg">Adventure not found.</p>;

  const intensityColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Intense: '#e67e22', Extreme: '#e63946'
  }[adventure.intensity] || '#1a5c9e';

  const gallery = adventure.gallery || [];
  const goNext = () => setActiveSlide(s => (s + 1) % gallery.length);
  const goPrev = () => setActiveSlide(s => (s - 1 + gallery.length) % gallery.length);

  let heroImage = adventure.featuredImage || '';
  if (!heroImage || heroImage.startsWith('/images/')) {
    heroImage = 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1920&q=80';
  }

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`} style={{ position: 'fixed' }}>
        <Link to="/adventures" className="details-back-link">← Back to Adventures</Link>
        <span className="navbar-brand" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          Samye Travels
        </span>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      <div className="details-hero" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="details-hero-overlay"></div>
        <div className="details-hero-content">
          <span className="details-hero-tag">{adventure.sportType || 'Adventure Sports'}</span>
          <h1 className="details-hero-title">{adventure.title}</h1>
          <div className="details-hero-pills">
            <span className="details-pill">📍 {adventure.location}</span>
            <span className="details-pill">⏱ {adventure.duration}</span>
            <span className="details-pill" style={{ backgroundColor: intensityColor }}>
              {adventure.intensity}
            </span>
          </div>
        </div>
      </div>

      <div className="content-container details-layout">

        <div className="details-main">

          <div className="details-card">
            <h2 className="details-section-heading">Overview</h2>
            <p className="details-description">{adventure.description}</p>
          </div>

          {adventure.included && adventure.included.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">What's Included</h2>
              <div className="included-grid">
                {adventure.included.map((item, i) => (
                  <div className="included-item" key={i}>
                    <span className="included-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adventure.safetyNotes && (
            <div className="details-card safety-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">Safety Information</h2>
              <p className="details-description">{adventure.safetyNotes}</p>
            </div>
          )}

          {adventure.itinerary && adventure.itinerary.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">Schedule</h2>
              <div className="itinerary-timeline">
                {adventure.itinerary.map((item, index) => (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-marker">
                      <span className="timeline-day-number">{item.day || index + 1}</span>
                    </div>
                    <div className="timeline-content">
                      <span className="timeline-day-label">{item.time || `Phase ${index + 1}`}</span>
                      <p className="timeline-activity">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px', overflow: 'hidden' }}>
              <h2 className="details-section-heading">Gallery</h2>
              <div className="carousel-wrapper">
                <div className="carousel-slide" onClick={() => setLightboxIndex(activeSlide)}>
                  <img src={gallery[activeSlide]} alt={`Gallery ${activeSlide + 1}`} className="carousel-image" />
                  <div className="carousel-expand-hint">⛶ Click to enlarge</div>
                </div>
                {gallery.length > 1 && (
                  <>
                    <button className="carousel-btn carousel-btn-prev" onClick={goPrev}>‹</button>
                    <button className="carousel-btn carousel-btn-next" onClick={goNext}>›</button>
                  </>
                )}
                {gallery.length > 1 && (
                  <div className="carousel-footer">
                    <div className="carousel-dots">
                      {gallery.map((_, idx) => (
                        <button key={idx} className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />
                      ))}
                    </div>
                    <span className="carousel-counter">{activeSlide + 1} / {gallery.length}</span>
                  </div>
                )}
                {gallery.length > 1 && (
                  <div className="carousel-thumbnails">
                    {gallery.map((img, idx) => (
                      <div key={idx} className={`carousel-thumb ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}>
                        <img src={img} alt={`Thumb ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

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
            <img src={gallery[lightboxIndex]} alt={`Full view ${lightboxIndex + 1}`} className="lightbox-image" />
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