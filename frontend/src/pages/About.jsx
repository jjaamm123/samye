import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Navbar from '../components/Navbar';

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
              Every journey we craft is tailored to honour the landscape, the culture, and � most
              importantly � the traveller. Whether you seek the solitude of a high-altitude trek
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
            <span className="about-value-icon text-[#9c826b] mb-4 inline-block"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></span>
            <h3 className="about-value-title">Deep Local Knowledge</h3>
            <p className="about-value-text">
              Every guide is a local expert - born in the mountains, trained in the trails,
              fluent in both language and landscape.
            </p>
          </div>
          <div className="about-value-card">
            <span className="about-value-icon text-[#9c826b] mb-4 inline-block"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></span>
            <h3 className="about-value-title">Spiritual Sensitivity</h3>
            <p className="about-value-text">
              We approach sacred spaces with respect and humility, ensuring travellers
              experience authentic cultural and religious heritage.
            </p>
          </div>
          <div className="about-value-card">
            <span className="about-value-icon text-[#9c826b] mb-4 inline-block"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
            <h3 className="about-value-title">Responsible Travel</h3>
            <p className="about-value-text">
              We minimise environmental impact, support local communities, and ensure
              that our journeys leave the mountains better than we found them.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default About;
