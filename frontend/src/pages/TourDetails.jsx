import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function TourDetails() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="status-msg">Loading your itinerary...</p>;
  if (error)   return <p className="status-msg error">{error}</p>;
  if (!tour)   return <p className="status-msg">Tour not found.</p>;

  let imageUrl = tour.featuredImage;
  if (imageUrl.startsWith('/images/')) {
    if (tour.destination === 'Nepal')       imageUrl = "public/images/cards/heritage.jpg";
    else if (tour.destination === 'Tibet')  imageUrl = "public/images/cards/tibet.jpg";
    else                                    imageUrl = "public/images/cards/sunrise.jpg";
  }

  const difficultyColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Hard: '#e63946', Challenging: '#c0392b'
  }[tour.difficulty] || '#1a5c9e';

  return (
    <div className="app-wrapper">

      <nav className="top-navbar scrolled" style={{ position: 'relative' }}>
        <Link to="/" className="details-back-link">← Back to Tours</Link>
        <span className="navbar-brand" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <div className="navbar-links">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#tours">Tour Packages</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
            </div>
        </span>
        <a href="#contact" className="navbar-enquire-btn">Enquire Now</a>

      </nav>


      <div className="details-hero" style={{ backgroundImage: `url(${imageUrl})` }}>
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
                <span
                  className="fact-value fact-difficulty"
                  style={{ color: difficultyColor }}
                >
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
    </div>
  );
}

export default TourDetails;