import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
        </div>
        <div className="navbar-links">
          <Link to="/" className="active-link">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/tours">Tour Packages</Link>
          <Link to="/adventures">Adventure Sports</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      <section className="hero-section" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-eyebrow">Himalayan Journeys Since 2010</span>
          <h1>Samye Travels</h1>
          <p>Your Portal to Spiritual Journeys and High-Altitude Adventures</p>
          <div className="hero-cta-group">
            {/* CTAs now go to the dedicated pages instead of scrolling down */}
            <Link to="/tours" className="hero-btn-primary">Explore Tours</Link>
            <Link to="/adventures" className="hero-btn-secondary">Adventure Sports</Link>
          </div>
        </div>
      </section>

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

      <div className="journey-selector-section">
        <div className="section-header" style={{ marginBottom: '48px' }}>
          <h2 className="section-title">Choose Your Journey</h2>
          <p className="section-subtitle">Two ways to experience the Himalayas — pick what calls to you</p>
        </div>

        <div className="journey-cards-grid">

          <Link to="/tours" className="journey-card">
            <div
              className="journey-card-bg"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80')" }}
            ></div>
            <div className="journey-card-overlay"></div>
            <div className="journey-card-content">
              <span className="journey-card-eyebrow">Cultural & Spiritual</span>
              <h3 className="journey-card-title">Tour Packages</h3>
              <p className="journey-card-desc">
                Guided treks to Everest Base Camp, sacred monastery stays in Tibet,
                and temple circuits across India. Crafted for the curious soul.
              </p>
              <div className="journey-card-cta">
                Explore All Tours <span className="journey-card-arrow">→</span>
              </div>
              <div className="journey-card-meta">
                <span>🏔️ Nepal · Tibet · India</span>
                <span>📅 5 – 21 Days</span>
              </div>
            </div>
          </Link>

          <Link to="/adventures" className="journey-card">
            <div
              className="journey-card-bg"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605540840428-583c4b572240?auto=format&fit=crop&w=1200&q=80')" }}
            ></div>
            <div className="journey-card-overlay"></div>
            <div className="journey-card-content">
              <span className="journey-card-eyebrow">Adrenaline & Thrill</span>
              <h3 className="journey-card-title">Adventure Sports</h3>
              <p className="journey-card-desc">
                White-water rafting the Trishuli, paragliding over Pokhara,
                bungee jumps, zip-lines, and more. For those who seek the rush.
              </p>
              <div className="journey-card-cta">
                Explore All Adventures <span className="journey-card-arrow">→</span>
              </div>
              <div className="journey-card-meta">
                <span>🏄 Nepal · India</span>
                <span>⏱ Half-day – 3 Days</span>
              </div>
            </div>
          </Link>

        </div>
      </div>

      <div className="why-us-strip">
        <div className="why-us-inner">
          <div className="why-us-item">
            <span className="why-us-icon">🧭</span>
            <div>
              <strong>Expert Local Guides</strong>
              <p>Every guide is a mountain native with 10+ years on the trail</p>
            </div>
          </div>
          <div className="why-us-item">
            <span className="why-us-icon">🛡️</span>
            <div>
              <strong>Safety First</strong>
              <p>Certified safety equipment and evacuation protocols on every trip</p>
            </div>
          </div>
          <div className="why-us-item">
            <span className="why-us-icon">✈️</span>
            <div>
              <strong>End-to-End Planning</strong>
              <p>Permits, transport, accommodation — all handled for you</p>
            </div>
          </div>
          <div className="why-us-item">
            <span className="why-us-icon">🌿</span>
            <div>
              <strong>Responsible Travel</strong>
              <p>Leave-no-trace ethic, supporting local communities</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Samye Travels</span>
            <p>Crafting sacred journeys across Nepal, Tibet & India since 2010.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/tours">Tours</Link>
            <Link to="/adventures">Adventures</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <p>namaste@samyetravels.com</p>
            <p>+977 1-4412345</p>
            <p>Thamel, Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Samye Travels. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;