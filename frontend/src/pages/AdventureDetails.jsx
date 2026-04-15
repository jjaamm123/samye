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

  const [showModal, setShowModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    travelDates: '',
    groupSize: 1
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryLength = adventure?.gallery?.length || 1;

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % galleryLength);
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + galleryLength) % galleryLength);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, galleryLength]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/adventures/${id}`)
      .then(res => { setAdventure(res.data); setLoading(false); })
      .catch(err => { console.error(err); setError("Could not load adventure details."); setLoading(false); });
  }, [id]);

  const handleInputChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const finalBookingData = {
      ...bookingForm,
      tourId: adventure?._id,
      tourTitle: adventure?.title 
    };

    axios.post('http://localhost:5000/api/bookings', finalBookingData)
      .then(() => {
        setSubmitStatus('success');
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus(null);
          setBookingForm({ customerName: '', customerEmail: '', travelDates: '', groupSize: 1 });
        }, 2500);
      })
      .catch((err) => {
        console.error(err);
        setSubmitStatus('error');
      });
  };

  if (loading) return <p className="status-msg">Loading adventure details...</p>;
  if (error)   return <p className="status-msg error">{error}</p>;
  if (!adventure) return <p className="status-msg">Adventure not found.</p>;

  const intensityColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Intense: '#e67e22', Extreme: '#e63946'
  }[adventure.intensity] || '#1a5c9e';

  const safeGallery = adventure.gallery || [];
  const goNext = () => setActiveSlide(s => (s + 1) % safeGallery.length);
  const goPrev = () => setActiveSlide(s => (s - 1 + safeGallery.length) % safeGallery.length);

  const heroImage = adventure.featuredImage || 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="app-wrapper">

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#f7f2e8', padding: '40px', borderRadius: '8px',
            width: '90%', maxWidth: '500px', position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
            >
              ✕
            </button>

            <h2 style={{ color: '#1a5c9e', marginTop: 0 }}>Book Your Adventure</h2>
            <p style={{ color: '#555', marginBottom: '25px' }}>Requesting: <strong>{adventure.title}</strong></p>

            {submitStatus === 'success' ? (
              <div style={{ backgroundColor: '#2ecc71', color: 'white', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
                <h3>Request Sent!</h3>
                <p>Our adrenaline experts will contact you shortly to finalize details.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="customerName" value={bookingForm.customerName} onChange={handleInputChange} placeholder="Full Name" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="email" name="customerEmail" value={bookingForm.customerEmail} onChange={handleInputChange} placeholder="Email Address" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" name="travelDates" value={bookingForm.travelDates} onChange={handleInputChange} placeholder="Preferred Dates (e.g. Mid-October)" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ color: '#555' }}>Number of Participants:</label>
                  <input type="number" name="groupSize" value={bookingForm.groupSize} onChange={handleInputChange} min="1" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', width: '80px' }} />
                </div>

                {submitStatus === 'error' && <p style={{ color: '#e63946', margin: 0 }}>Failed to send request. Please try again.</p>}
                
                <button type="submit" className="booking-cta-btn" style={{ marginTop: '10px', fontSize: '1.1rem' }}>Submit Booking Request</button>
              </form>
            )}
          </div>
        </div>
      )}

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`} style={{ position: 'fixed', zIndex: 1000 }}>
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

          {safeGallery.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px', overflow: 'hidden' }}>
              <h2 className="details-section-heading">Gallery</h2>
              <div className="carousel-wrapper">
                <div className="carousel-slide" onClick={() => setLightboxIndex(activeSlide)}>
                  <img src={safeGallery[activeSlide]} alt={`Gallery ${activeSlide + 1}`} className="carousel-image" />
                  <div className="carousel-expand-hint">⛶ Click to enlarge</div>
                </div>
                {safeGallery.length > 1 && (
                  <>
                    <button className="carousel-btn carousel-btn-prev" onClick={goPrev}>‹</button>
                    <button className="carousel-btn carousel-btn-next" onClick={goNext}>›</button>
                  </>
                )}
                {safeGallery.length > 1 && (
                  <div className="carousel-footer">
                    <div className="carousel-dots">
                      {safeGallery.map((_, idx) => (
                        <button key={idx} className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />
                      ))}
                    </div>
                    <span className="carousel-counter">{activeSlide + 1} / {safeGallery.length}</span>
                  </div>
                )}
                {safeGallery.length > 1 && (
                  <div className="carousel-thumbnails">
                    {safeGallery.map((img, idx) => (
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
            
            <button className="booking-cta-btn" onClick={() => setShowModal(true)}>Book This Adventure</button>
            
            <p className="booking-note">Free cancellation up to 48 hours before the activity</p>
          </div>
        </div>

      </div>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)} style={{ zIndex: 3000 }}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>
            <img src={safeGallery[lightboxIndex]} alt={`Full view ${lightboxIndex + 1}`} className="lightbox-image" />
            {safeGallery.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-nav-prev" onClick={() => setLightboxIndex(i => (i - 1 + safeGallery.length) % safeGallery.length)}>‹</button>
                <button className="lightbox-nav lightbox-nav-next" onClick={() => setLightboxIndex(i => (i + 1) % safeGallery.length)}>›</button>
                <span className="lightbox-counter">{lightboxIndex + 1} / {safeGallery.length}</span>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default AdventureDetails;