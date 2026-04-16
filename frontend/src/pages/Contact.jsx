import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'; 
import '../App.css';

function Contact() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState(null); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.state) {
      const { tripItems, groupSize, travelDate, grandTotal } = location.state;
      const itemsList = tripItems.map(item => `- ${item.title}`).join('\n');
      const dateStr = travelDate ? travelDate : 'Not specified';
      const autoMessage = `Hi Samye Travels team! I would like to enquire about a custom trip.\n\nGroup Size: ${groupSize}\nExpected Start Date: ${dateStr}\n\nSelected Packages:\n${itemsList}\n\nEstimated Grand Total: $${grandTotal.toLocaleString()}.\n\nPlease let me know the next steps!`;

      setFormData(prev => ({ ...prev, message: autoMessage }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    axios.post('http://localhost:5000/api/inquiries', formData)
      .then((response) => {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' }); 
        
        setTimeout(() => setSubmitStatus(null), 5000); 
      })
      .catch((err) => {
        console.error(err);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 5000);
      });
  };

  return (
    <div className="app-wrapper">
      <nav className={`top-navbar ${scrolled ? 'scrolled' : 'static'}`}>
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/tours">Tour Packages</Link>
          <Link to="/adventures">Adventure Sports</Link>
          <Link to="/custom-tour">Build My Trip</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact" className="active-link">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      <div className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Get In Touch</span>
          <h1 className="page-hero-title">Contact Us</h1>
        </div>
      </div>

      <div className="content-container">
        <div className="contact-layout">
          
          <div className="contact-info-panel">
            <h3 className="contact-info-heading">Samye Travels</h3>
            <p className="contact-info-subheading">Headquarters</p>
            <div className="contact-info-divider"></div>
            
            <span className="contact-info-label">Address</span>
            <p className="contact-info-value">Thamel, Kathmandu<br />Bagmati Province, Nepal</p>
            
            <span className="contact-info-label">Phone</span>
            <p className="contact-info-value">+977 1-4412345<br />+977 9841234567</p>
            
            <span className="contact-info-label">Email</span>
            <p className="contact-info-value">namaste@samyetravels.com</p>
          </div>

          <div className="contact-form-card">
            <h2 className="contact-form-title">Send a Message</h2>

            {location.state && submitStatus !== 'success' && (
              <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #2ecc71', borderRadius: '6px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>📋</span>
                <div>
                  <strong style={{ color: '#27ae60', display: 'block', fontSize: '0.95rem', marginBottom: '2px' }}>Custom Trip Attached ✓</strong>
                  <span style={{ color: '#2c3e50', fontSize: '0.85rem' }}>We've auto-filled your trip details in the message below!</span>
                </div>
              </div>
            )}

            {submitStatus === 'success' && (
              <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #2ecc71', color: '#27ae60', borderRadius: '6px', padding: '16px', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                Message sent successfully! Our team will contact you shortly.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{ backgroundColor: '#fde8e8', border: '1px solid #e63946', color: '#c0392b', borderRadius: '6px', padding: '16px', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                Failed to send message. Please try again or email us directly.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="contact-input" required disabled={submitStatus === 'submitting'} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="contact-input" required disabled={submitStatus === 'submitting'} />
              </div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number (Optional)" className="contact-input" disabled={submitStatus === 'submitting'} />
              
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" className="contact-input contact-textarea" required disabled={submitStatus === 'submitting'}></textarea>
              
              <button type="submit" className="contact-submit-btn" disabled={submitStatus === 'submitting'}>
                {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'}
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
            <Link to="/tours">Tours</Link>
            <Link to="/adventures">Adventures</Link>
            <Link to="/custom-tour">Build My Trip</Link>
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

export default Contact;