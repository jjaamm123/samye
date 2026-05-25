import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab state: 'scenic', 'customer', 'video'
  const [activeTab, setActiveTab] = useState('scenic');
  const [scrolled, setScrolled] = useState(false);

  // Lightbox / Carousel state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Scroll effect for Navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch Gallery Data
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/gallery`)
      .then(r => {
        setGalleryItems(r.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load gallery media.');
        setLoading(false);
      });
  }, []);

  // Categorize Data
  const scenicImages = galleryItems.filter(i => i.mediaType === 'image' && i.category === 'Scenic Views');
  const customerImages = galleryItems.filter(i => i.mediaType === 'image' && i.category === 'Customer Moments');
  const videos = galleryItems.filter(i => i.mediaType === 'video');

  // Determine which array is currently being viewed
  const currentArray = activeTab === 'scenic' ? scenicImages : activeTab === 'customer' ? customerImages : videos;

  // Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKey = e => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % currentArray.length);
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + currentArray.length) % currentArray.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, currentArray]);

  return (
    <div className="app-wrapper">
      
      {/* ─── NAVBAR ─── */}
      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`} style={{ position: 'fixed' }}>
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/custom-tour">Build My Trip</Link>
          <Link to="/gallery" className="active-link">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <div className="packages-hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80')` }}>
        <div className="packages-hero-overlay"></div>
        <div className="packages-hero-content">
          <span className="packages-hero-eyebrow" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Visual Journey
          </span>
          <h1 className="packages-hero-title" style={{ fontWeight: '700', letterSpacing: '-1px' }}>Our Gallery</h1>
          <p className="packages-hero-sub" style={{ fontSize: '1.2rem', fontWeight: '300' }}>
            Moments frozen in time. Explore breathtaking landscapes, thrilling adventures, and the smiles of our past travelers.
          </p>
        </div>
      </div>

      <div className="content-container" style={{ padding: '60px 5%' }}>
        
        {/* ─── TABS ─── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => { setActiveTab('scenic'); setLightboxIndex(null); }}
            className={`packages-filter-pill ${activeTab === 'scenic' ? 'active' : ''}`}
            style={{ padding: '10px 24px', fontSize: '1rem', border: activeTab === 'scenic' ? '1px solid #1a5c9e' : '1px solid #e2e8f0' }}
          >
            Scenic Views ({scenicImages.length})
          </button>
          <button 
            onClick={() => { setActiveTab('customer'); setLightboxIndex(null); }}
            className={`packages-filter-pill ${activeTab === 'customer' ? 'active' : ''}`}
            style={{ padding: '10px 24px', fontSize: '1rem', border: activeTab === 'customer' ? '1px solid #1a5c9e' : '1px solid #e2e8f0' }}
          >
            Customer Moments ({customerImages.length})
          </button>
          <button 
            onClick={() => { setActiveTab('video'); setLightboxIndex(null); }}
            className={`packages-filter-pill ${activeTab === 'video' ? 'active' : ''}`}
            style={{ padding: '10px 24px', fontSize: '1rem', border: activeTab === 'video' ? '1px solid #1a5c9e' : '1px solid #e2e8f0' }}
          >
            Videos ({videos.length})
          </button>
        </div>

        {/* ─── STATUS MESSAGES ─── */}
        {loading && <p className="status-msg" style={{ textAlign: 'center', color: '#64748b' }}>Loading gallery media...</p>}
        {error && <p className="status-msg error" style={{ textAlign: 'center' }}>{error}</p>}
        {!loading && !error && currentArray.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px', fontSize: '1.1rem' }}>
            More memories coming soon!
          </p>
        )}

        {/* ─── MEDIA GRID ─── */}
        {!loading && !error && currentArray.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            alignItems: 'start'
          }}>
            {currentArray.map((item, index) => (
              <div 
                key={item._id} 
                className="gallery-card"
                onClick={() => item.mediaType === 'image' && setLightboxIndex(index)}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  cursor: item.mediaType === 'image' ? 'zoom-in' : 'default',
                  aspectRatio: item.mediaType === 'video' ? 'auto' : '1 / 1',
                  backgroundColor: '#f1f5f9'
                }}
              >
                {item.mediaType === 'image' ? (
                  <img 
                    src={item.mediaUrl} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ) : (
                  <video 
                    src={item.mediaUrl} 
                    controls 
                    style={{ width: '100%', display: 'block', borderRadius: '12px' }} 
                  />
                )}
                
                {/* Overlay text for images */}
                {item.mediaType === 'image' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '30px 20px 15px',
                    color: 'white',
                    pointerEvents: 'none'
                  }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 'bold', fontSize: '1.1rem' }}>{item.title}</p>
                    <p style={{ margin: '0', fontSize: '0.85rem', color: '#cbd5e1' }}>📍 {item.location}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ─── LIGHTBOX CAROUSEL (IMAGES ONLY) ─── */}
      {lightboxIndex !== null && activeTab !== 'video' && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>
            <img src={currentArray[lightboxIndex].mediaUrl} alt={currentArray[lightboxIndex].title} className="lightbox-image" />
            
            <div style={{ position: 'absolute', bottom: '-40px', color: 'white', textAlign: 'center', width: '100%' }}>
              <h3 style={{ margin: '0 0 5px' }}>{currentArray[lightboxIndex].title}</h3>
              <p style={{ margin: '0', color: '#cbd5e1' }}>📍 {currentArray[lightboxIndex].location}</p>
            </div>

            {currentArray.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-nav-prev" onClick={() => setLightboxIndex(i => (i - 1 + currentArray.length) % currentArray.length)}>‹</button>
                <button className="lightbox-nav lightbox-nav-next" onClick={() => setLightboxIndex(i => (i + 1) % currentArray.length)}>›</button>
                <span className="lightbox-counter">{lightboxIndex + 1} / {currentArray.length}</span>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Gallery;