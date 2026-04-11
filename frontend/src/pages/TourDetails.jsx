import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function TourDetails() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
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
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % (tour?.gallery?.length || 1));
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + (tour?.gallery?.length || 1)) % (tour?.gallery?.length || 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, tour]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tours/${id}`)
      .then((response) => { setTour(response.data); setLoading(false); })
      .catch((err) => { console.error("Fetch Error:", err); setError("Could not load tour details."); setLoading(false); });
  }, [id]);

  if (loading) return <p className="status-msg">Loading your itinerary...</p>;
  if (error)   return <p className="status-msg error">{error}</p>;
  if (!tour)   return <p className="status-msg">Tour not found.</p>;

  const difficultyColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Hard: '#e63946', Challenging: '#c0392b'
  }[tour.difficulty] || '#1a5c9e';

  const gallery = tour.gallery || [];

  const goNext = () => setActiveSlide(s => (s + 1) % gallery.length);
  const goPrev = () => setActiveSlide(s => (s - 1 + gallery.length) % gallery.length);

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`} style={{ position: 'fixed' }}>
        <Link to="/" className="details-back-link">← Back to Tours</Link>
        <span className="navbar-brand" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          Samye Travels
        </span>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      <div className="details-hero" style={{ backgroundImage: `url('${tour.featuredImage}')` }}>
        <div className="details-hero-overlay"></div>
        <div className="details-hero-content">
          <span className="details-hero-tag">{tour.destination}</span>
          <h1 className="details-hero-title">{tour.title}</h1>
          <div className="details-hero-pills">
            <span className="details-pill">⏱ {tour.duration} Days</span>
            <span className="details-pill" style={{ backgroundColor: difficultyColor }}>
              {tour.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="content-container details-layout">

        <div className="details-main">

          <div className="details-card">
            <h2 className="details-section-heading">Overview</h2>
            <p className="details-description">{tour.description}</p>
          </div>

          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px' }}>
              <h2 className="details-section-heading">Itinerary</h2>
              <div className="itinerary-timeline">
                {tour.itinerary.map((day, index) => (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-marker">
                      <span className="timeline-day-number">{day.day}</span>
                    </div>
                    <div className="timeline-content">
                      <span className="timeline-day-label">Day {day.day}</span>
                      <p className="timeline-activity">{day.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px', overflow: 'hidden' }}>
              <h2 className="details-section-heading">Tour Gallery</h2>

              <div className="carousel-wrapper">

                <div className="carousel-slide" onClick={() => setLightboxIndex(activeSlide)}>
                  <img
                    src={gallery[activeSlide]}
                    alt={`Gallery ${activeSlide + 1}`}
                    className="carousel-image"
                  />
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
                        <button
                          key={idx}
                          className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`}
                          onClick={() => setActiveSlide(idx)}
                        />
                      ))}
                    </div>
                    <span className="carousel-counter">{activeSlide + 1} / {gallery.length}</span>
                  </div>
                )}

                {gallery.length > 1 && (
                  <div className="carousel-thumbnails">
                    {gallery.map((img, idx) => (
                      <div
                        key={idx}
                        className={`carousel-thumb ${idx === activeSlide ? 'active' : ''}`}
                        onClick={() => setActiveSlide(idx)}
                      >
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
              <div className="booking-price">${tour.price} <span>/ person</span></div>
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
            </div>
            <div className="booking-divider"></div>
            <button className="booking-cta-btn">Book This Tour</button>
            <p className="booking-note">Free cancellation up to 30 days before departure</p>
          </div>
        </div>

      </div>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>

            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>

            <img
              src={gallery[lightboxIndex]}
              alt={`Full view ${lightboxIndex + 1}`}
              className="lightbox-image"
            />

            {gallery.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-nav-prev"
                  onClick={() => setLightboxIndex(i => (i - 1 + gallery.length) % gallery.length)}
                >‹</button>
                <button
                  className="lightbox-nav lightbox-nav-next"
                  onClick={() => setLightboxIndex(i => (i + 1) % gallery.length)}
                >›</button>
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