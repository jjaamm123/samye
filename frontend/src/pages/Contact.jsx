import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Contact() {
  const [scrolled, setScrolled] = useState(false);

  // Form submit state — replaces window.alert
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | null

  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /*
    This currently just shows a success message.
    To wire it up to a real backend: replace the setTimeout with an
    axios.post('http://localhost:5000/api/contact', formData) call.
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="navbar-brand">Samye Travels</Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/#tours">Tour Packages</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact" className="active-link">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      {/* Page hero */}
      <div
        className="page-hero"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">We'd love to hear from you</span>
          <h1 className="page-hero-title">Get in Touch</h1>
        </div>
      </div>

      <div className="content-container">

        {/*
          CHANGE: Layout is now a 1:2 grid (info panel | form).
          Before: both sides were inline-styled divs with hardcoded padding/colors.
          Now: .contact-layout grid with dedicated CSS classes.
        */}
        <div className="contact-layout">

          {/* LEFT: Dark info panel */}
          <div className="contact-info-panel">
            <p className="contact-info-heading">Samye Travels</p>
            <p className="contact-info-subheading">Headquarters</p>

            <div className="contact-info-block">
              <span className="contact-info-label">Address</span>
              <p className="contact-info-value">
                Thamel Marg<br />
                Kathmandu 44600<br />
                Nepal
              </p>
            </div>

            <div className="contact-info-divider"></div>

            <div className="contact-info-block">
              <span className="contact-info-label">Email</span>
              <p className="contact-info-value">namaste@samyetravels.com</p>
            </div>

            <div className="contact-info-block">
              <span className="contact-info-label">Phone</span>
              <p className="contact-info-value">+977 1-4412345</p>
            </div>

            <div className="contact-info-divider"></div>

            <div className="contact-info-block">
              <span className="contact-info-label">Office Hours</span>
              <p className="contact-info-value">
                Sunday – Friday<br />
                9:00 AM – 6:00 PM NST
              </p>
            </div>
          </div>

          {/* RIGHT: Form card */}
          <div className="contact-form-card">
            <h2 className="contact-form-title">Start Planning Your Journey</h2>

            {/* Inline success message — replaces window.alert */}
            {submitStatus === 'success' && (
              <div className="admin-alert success" style={{ marginBottom: '20px', marginLeft: 0, marginRight: 0 }}>
                ✓ Message sent! We'll get back to you within 24 hours.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>

              {/* Two-column row: Name + Email */}
              <div className="contact-form-row">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="contact-input"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="contact-input"
                />
              </div>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject — e.g. Enquiry about Nepal Trek"
                required
                className="contact-input"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your dream journey — destinations, group size, dates, anything you have in mind..."
                rows="5"
                required
                className="contact-input contact-textarea"
              ></textarea>

              <button type="submit" className="contact-submit-btn">
                Send Message →
              </button>

            </form>
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

export default Contact;