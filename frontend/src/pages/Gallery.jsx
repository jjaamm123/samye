import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Gallery() {
  const [scrolled, setScrolled] = useState(false);

  // Filter state — 'All' shows every photo
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /*
    CHANGE: Photos now have metadata (label + category) instead of just a URL.
    This powers the filter buttons and the hover overlay labels.
    Replace URLs with your own photos later — just keep the same object shape.
  */
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      label: "Annapurna Range",
      category: "Nepal"
    },
    {
      url: "https://images.unsplash.com/photo-1551114671-fa2b87f4c7d0?auto=format&fit=crop&w=800&q=80",
      label: "Potala Palace",
      category: "Tibet"
    },
    {
      url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
      label: "Amber Fort, Rajasthan",
      category: "India"
    },
    {
      url: "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?auto=format&fit=crop&w=800&q=80",
      label: "Himalayan Trek",
      category: "Nepal"
    },
    {
      url: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=800&q=80",
      label: "Mountain Village",
      category: "Nepal"
    },
    {
      url: "https://images.unsplash.com/photo-1605640840428-583c4b572240?auto=format&fit=crop&w=800&q=80",
      label: "Prayer Flags",
      category: "Tibet"
    },
  ];

  const categories = ['All', 'Nepal', 'Tibet', 'India'];

  // Filter photos based on active category
  const visiblePhotos = activeFilter === 'All'
    ? photos
    : photos.filter(p => p.category === activeFilter);

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="navbar-brand">Samye Travels</Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/#tours">Tour Packages</Link>
          <Link to="/gallery" className="active-link">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      {/* Page hero */}
      <div
        className="page-hero"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">Visual Journey</span>
          <h1 className="page-hero-title">Glimpses of the Himalayas</h1>
        </div>
      </div>

      <div className="content-container">

        {/*
          NEW: Category filter pills.
          Clicking a button updates activeFilter state, which filters visiblePhotos.
        */}
        <div className="gallery-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`gallery-filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/*
          CHANGE: Grid is now CSS masonry-style (3 columns, first + fourth item span 2 rows).
          Before: plain auto-fit grid, all photos same height — looked like a plain photo dump.
          Now: varied heights create visual rhythm like a professional gallery.
          Hover overlay reveals the photo label.
        */}
        <div className="gallery-grid">
          {visiblePhotos.map((photo, index) => (
            <div className="gallery-item" key={index}>
              <img src={photo.url} alt={photo.label} />
              <div className="gallery-item-overlay">
                <span className="gallery-item-label">{photo.label}</span>
              </div>
            </div>
          ))}
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

export default Gallery;