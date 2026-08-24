import Navbar from '../components/Navbar';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December','Flexible'
];

function Contact() {
  const [scrolled, setScrolled] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 

  const [formData, setFormData] = useState({
    name:        '',
    email:       '',
    subject:     '',
    message:     '',
    travelMonth: 'Flexible',
    groupSize:   '2',
    budgetRange: 'Standard',
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = e =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/api/inquiries`, formData)
      .then(() => {
        setSubmitStatus('success');
        setFormData({
          name: '', email: '', subject: '', message: '',
          travelMonth: 'Flexible', groupSize: '2', budgetRange: 'Standard'
        });
        setTimeout(() => setSubmitStatus(null), 5000);
      })
      .catch(err => {
        console.error(err);
        setSubmitStatus('error');
      });
  };

  return (
    <div className="app-wrapper">

      <Navbar />

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
        <div className="contact-layout">

          <div className="contact-info-panel">
            <p className="contact-info-heading">Samye Travels</p>
            <p className="contact-info-subheading">Headquarters</p>

            <div className="contact-info-block">
              <span className="contact-info-label">Address</span>
              <p className="contact-info-value">Thamel Marg<br />Kathmandu 44600<br />Nepal</p>
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
              <p className="contact-info-value">Sunday â€“ Friday<br />9:00 AM â€“ 6:00 PM NST</p>
            </div>
          </div>

          <div className="contact-form-card">
            <h2 className="contact-form-title">Start Planning Your Journey</h2>

            {submitStatus === 'success' && (
              <div className="admin-alert success" style={{ marginBottom: '20px' }}>
                âœ“ Message sent! We'll get back to you within 24 hours.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="admin-alert error" style={{ marginBottom: '20px' }}>
                âœ— Something went wrong. Please try again or email us directly.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>

              <div className="contact-form-row">
                <input name="name" value={formData.name} onChange={handleChange}
                  placeholder="Your Name" required className="contact-input" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="Your Email" required className="contact-input" />
              </div>

              <input name="subject" value={formData.subject} onChange={handleChange}
                placeholder="Subject - e.g. Enquiry about Nepal Trek" required className="contact-input" />

              <div className="contact-form-row contact-form-row-3">

                <div className="contact-select-group">
                  <label className="contact-select-label">When do you want to travel?</label>
                  <select
                    name="travelMonth"
                    value={formData.travelMonth}
                    onChange={handleChange}
                    className="contact-input contact-select"
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="contact-select-group">
                  <label className="contact-select-label">Group size</label>
                  <select
                    name="groupSize"
                    value={formData.groupSize}
                    onChange={handleChange}
                    className="contact-input contact-select"
                  >
                    <option value="1">Solo (1)</option>
                    <option value="2">Couple (2)</option>
                    <option value="3-5">Small Group (3-5)</option>
                    <option value="6+">Large Group (6+)</option>
                  </select>
                </div>

                <div className="contact-select-group">
                  <label className="contact-select-label">Budget range</label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className="contact-input contact-select"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your dream journey - destinations, specific treks, anything you have in mind..."
                rows="5"
                required
                className="contact-input contact-textarea"
              ></textarea>

              <button type="submit" className="contact-submit-btn flex items-center justify-center gap-2">
                Send Message
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>

            </form>
          </div>

        </div>
      </div>


    </div>
  );
}

export default Contact;
