import Navbar from '../components/Navbar';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function About() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-wrapper">

      <Navbar />


      <div
        className="page-hero"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Who We Are</span>
          <h1 className="page-hero-title">Our Story</h1>
        </div>
      </div>

      <div className="content-container">

        <div className="about-story-grid">

          <div className="about-story-text">
            <span className="about-lead-rule"></span>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '28px' }}>
              <h2 className="section-title" style={{ justifyContent: 'flex-start' }}>
                Himalayan Journeys Since 2010
              </h2>
            </div>
            <p>
              Founded in the heart of the Himalayas, Samye Travels was born from a deep reverence
              for the majestic peaks and rich spiritual heritage of Nepal, Tibet, and India.
            </p>
            <p>
              We believe that travel is not just about seeing new places, but about profound personal
              transformation. Our expert guides are locals who know the hidden trails, the sacred
              monasteries, and the authentic heartbeat of the mountains.
            </p>
            <p>
              Every journey we craft is tailored to honour the landscape, the culture, and — most
              importantly — the traveller. Whether you seek the solitude of a high-altitude trek
              or the warmth of a monastery stay, we'll get you there safely and meaningfully.
            </p>
          </div>

          <div className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
              alt="Himalayan landscape"
            />
            <div className="about-image-accent"></div>
          </div>

        </div>

        <div className="section-header">
          <h2 className="section-title">What We Stand For</h2>
          <p className="section-subtitle">The principles that guide every journey we create</p>
        </div>

        <div className="about-values-grid">
          <div className="about-value-card">
            <span className="about-value-icon">🏔️</span>
            <h3 className="about-value-title">Deep Local Knowledge</h3>
            <p className="about-value-text">
              Every guide is a local expert — born in the mountains, trained in the trails,
              fluent in both language and landscape.
            </p>
          </div>
          <div className="about-value-card">
            <span className="about-value-icon">🙏</span>
            <h3 className="about-value-title">Spiritual Sensitivity</h3>
            <p className="about-value-text">
              We approach sacred spaces with respect and humility, ensuring travellers
              experience authentic cultural and religious heritage.
            </p>
          </div>
          <div className="about-value-card">
            <span className="about-value-icon">🌿</span>
            <h3 className="about-value-title">Responsible Travel</h3>
            <p className="about-value-text">
              We minimise environmental impact, support local communities, and ensure
              that our journeys leave the mountains better than we found them.
            </p>
          </div>
        </div>

      </div>

      {/* Footer — same as homepage */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Samye Travels</span>
            <p>Crafting sacred journeys across Nepal, Tibet & India since 2010.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/#tours">Tours</Link>
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
          <p>© 2025 Samye Travels. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default About;