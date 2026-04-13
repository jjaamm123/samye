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

  const galleryLength = tour?.gallery?.length || 1;

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
    axios.get(`http://localhost:5000/api/tours/${id}`)
      .then((response) => { 
        setTour(response.data); 
        setLoading(false); 
      })
      .catch((err) => { 
        console.error("Fetch Error:", err); 
        setError("Could not load tour details."); 
        setLoading(false); 
      });
  }, [id]);

  const handleInputChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };
  if (loading) return <p className="status-msg">Loading your itinerary...</p>;
  if (error)   return <p className="status-msg error">{error}</p>;
  if (!tour)   return <p className="status-msg">Tour not found.</p>;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const finalBookingData = {
      ...bookingForm,
      tourId: tour?._id,
      tourTitle: tour?.title
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

  const difficultyColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Hard: '#e63946', Challenging: '#c0392b'
  }[tour?.difficulty] || '#1a5c9e';

  const safeGallery = tour?.gallery || [];

  const goNext = () => setActiveSlide(s => (s + 1) % safeGallery.length);
  const goPrev = () => setActiveSlide(s => (s - 1 + safeGallery.length) % safeGallery.length);

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

            <h2 style={{ color: '#1a5c9e', marginTop: 0 }}>Book Your Journey</h2>
            <p style={{ color: '#555', marginBottom: '25px' }}>Requesting: <strong>{tour.title}</strong></p>

            {submitStatus === 'success' ? (
              <div style={{ backgroundColor: '#2ecc71', color: 'white', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
                <h3>Request Sent!</h3>
                <p>Our travel experts will contact you shortly to finalize your itinerary.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" name="customerName" value={bookingForm.customerName} onChange={handleInputChange} placeholder="Full Name" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="email" name="customerEmail" value={bookingForm.customerEmail} onChange={handleInputChange} placeholder="Email Address" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" name="travelDates" value={bookingForm.travelDates} onChange={handleInputChange} placeholder="Preferred Dates (e.g. Mid-October)" required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ color: '#555' }}>Number of Travellers:</label>
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

          {safeGallery.length > 0 && (
            <div className="details-card" style={{ marginTop: '28px', overflow: 'hidden' }}>
              <h2 className="details-section-heading">Tour Gallery</h2>

              <div className="carousel-wrapper">

                <div className="carousel-slide" onClick={() => setLightboxIndex(activeSlide)}>
                  <img
                    src={safeGallery[activeSlide]}
                    alt={`Gallery ${activeSlide + 1}`}
                    className="carousel-image"
                  />
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
                        <button
                          key={idx}
                          className={`carousel-dot ${idx === activeSlide ? 'active' : ''}`}
                          onClick={() => setActiveSlide(idx)}
                        />
                      ))}
                    </div>
                    <span className="carousel-counter">{activeSlide + 1} / {safeGallery.length}</span>
                  </div>
                )}

                {safeGallery.length > 1 && (
                  <div className="carousel-thumbnails">
                    {safeGallery.map((img, idx) => (
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
            
            <button className="booking-cta-btn" onClick={() => setShowModal(true)}>Book This Tour</button>
            
            <p className="booking-note">Free cancellation up to 30 days before departure</p>
          </div>
        </div>

      </div>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)} style={{ zIndex: 3000 }}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>

            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>

            <img
              src={safeGallery[lightboxIndex]}
              alt={`Full view ${lightboxIndex + 1}`}
              className="lightbox-image"
            />

            {safeGallery.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-nav-prev"
                  onClick={() => setLightboxIndex(i => (i - 1 + safeGallery.length) % safeGallery.length)}
                >‹</button>
                <button
                  className="lightbox-nav lightbox-nav-next"
                  onClick={() => setLightboxIndex(i => (i + 1) % safeGallery.length)}
                >›</button>
                <span className="lightbox-counter">{lightboxIndex + 1} / {safeGallery.length}</span>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default TourDetails;