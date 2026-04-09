import { useState, useEffect } from 'react';
import axios from 'axios';
import TourCard from './components/TourCard';
import './App.css';

function App() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tours')
      .then((response) => {
        setTours(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError("Could not connect to the backend server.");
        setLoading(false);
      });
  }, []);

  const nepalTours = tours.filter(tour => tour.destination === 'Nepal');
  const tibetTours = tours.filter(tour => tour.destination === 'Tibet');
  const indiaTours = tours.filter(tour => tour.destination === 'India');

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-brand">Samye Travels</div>
        <div className="navbar-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#tours">Tour Packages</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>
        <a href="#contact" className="navbar-enquire-btn">Enquire Now</a>
      </nav>

      <section className="hero-section" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-eyebrow">Himalayan Journeys Since 2010</span>
          <h1>Samye Travels</h1>
          <p>Your Portal to Spiritual Journeys and High-Altitude Adventures</p>
          <div className="hero-cta-group">
            <a href="#tours" className="hero-btn-primary">Explore Tours</a>
            <a href="#contact" className="hero-btn-secondary">Plan My Journey</a>
          </div>
        </div>
      </section>

      <div className="search-bar-wrapper">
        <div className="floating-search">
          <div className="search-field">
            <label>DESTINATION</label>
            <input type="text" placeholder="Nepal, Tibet, India..." />
          </div>
          <div className="search-divider"></div>
          <div className="search-field">
            <label>TRAVEL DATES</label>
            <input type="text" placeholder="When do you want to go?" />
          </div>
          <div className="search-divider"></div>
          <div className="search-field">
            <label>GROUP SIZE</label>
            <input type="text" placeholder="How many travellers?" />
          </div>
          <button className="search-btn">Search Tours →</button>
        </div>
      </div>

      <div className="stats-strip">
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Journeys Completed</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">15+</span>
          <span className="stat-label">Years of Experience</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">98%</span>
          <span className="stat-label">Happy Travellers</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">3</span>
          <span className="stat-label">Sacred Destinations</span>
        </div>
      </div>

      <div className="content-container" id="tours">
        {loading && <p className="status-msg">Loading your Himalayan adventures...</p>}
        {error && <p className="status-msg error">⚠️ {error}</p>}
        {!loading && !error && tours.length === 0 && (
          <p className="status-msg">No tours found.</p>
        )}

        {nepalTours.length > 0 && (
          <div className="destination-section">
            <div className="section-header">
              <h2 className="section-title">Nepal Tours</h2>
              <p className="section-subtitle">Trekking, temples, and the roof of the world</p>
            </div>
            <div className="tours-grid">
              {nepalTours.map((tour) => <TourCard key={tour._id} tour={tour} />)}
            </div>
          </div>
        )}

        {tibetTours.length > 0 && (
          <div className="destination-section">
            <div className="section-header">
              <h2 className="section-title">Tibet Tours</h2>
              <p className="section-subtitle">Sacred monasteries and high plateau adventures</p>
            </div>
            <div className="tours-grid">
              {tibetTours.map((tour) => <TourCard key={tour._id} tour={tour} />)}
            </div>
          </div>
        )}

        {indiaTours.length > 0 && (
          <div className="destination-section">
            <div className="section-header">
              <h2 className="section-title">India Tours</h2>
              <p className="section-subtitle">Ancient temples, vibrant culture, spiritual heartlands</p>
            </div>
            <div className="tours-grid">
              {indiaTours.map((tour) => <TourCard key={tour._id} tour={tour} />)}
            </div>
          </div>
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Samye Travels</span>
            <p>Crafting sacred journeys across Nepal, Tibet & India since 2010.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#tours">Tours</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <p>info@samyetravels.com</p>
            <p>+977 1 234 5678</p>
            <p>Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Samye Travels. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;