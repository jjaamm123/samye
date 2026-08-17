import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import '../App.css';
import Navbar from '../components/Navbar';

const cardVariant = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.07
    }
  })
};

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab state: 'scenic', 'customer', 'video'
  const [activeTab, setActiveTab] = useState('scenic');
  const [scrolled, setScrolled] = useState(false);

  // Lightbox / Carousel state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Grid ref for stagger trigger
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: false, margin: '-40px' });

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
        const data = r.data;
        console.log('API Response [gallery]:', data);
        // Handles bare array OR envelopes: { gallery:[...] } / { data:[...] }
        const arr = Array.isArray(data)           ? data
                  : Array.isArray(data?.gallery)   ? data.gallery
                  : Array.isArray(data?.data)      ? data.data
                  : [];
        setGalleryItems(arr);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load gallery media.');
        setLoading(false);
      });
  }, []);

  // Safe array guard — prevents "X.filter is not a function" if API returns
  // a non-array (object envelope, null, server error, etc.)
  const safeItems     = Array.isArray(galleryItems) ? galleryItems : [];

  // Categorize Data
  const scenicImages   = safeItems.filter(i => i.mediaType === 'image' && i.category === 'Scenic Views');
  const customerImages = safeItems.filter(i => i.mediaType === 'image' && i.category === 'Customer Moments');
  const videos         = safeItems.filter(i => i.mediaType === 'video');

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
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <div className="packages-hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80')` }}>
        <div className="packages-hero-overlay"></div>
        <motion.div
          className="packages-hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="packages-hero-eyebrow" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Visual Journey
          </span>
          <h1 className="packages-hero-title" style={{ fontWeight: '700', letterSpacing: '-1px' }}>Our Gallery</h1>
          <p className="packages-hero-sub" style={{ fontSize: '1.2rem', fontWeight: '300' }}>
            Moments frozen in time. Explore breathtaking landscapes, thrilling adventures, and the smiles of our past travelers.
          </p>
        </motion.div>
      </div>

      <div className="content-container" style={{ padding: '60px 5%' }}>
        
        {/* ─── TABS ─── */}
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { id: 'scenic', label: `Scenic Views (${scenicImages.length})` },
            { id: 'customer', label: `Customer Moments (${customerImages.length})` },
            { id: 'video', label: `Videos (${videos.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setLightboxIndex(null); }}
              className={`packages-filter-pill ${activeTab === tab.id ? 'active' : ''}`}
              style={{ padding: '10px 24px', fontSize: '1rem', border: activeTab === tab.id ? '1px solid #1a5c9e' : '1px solid #e2e8f0' }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* ─── STATUS MESSAGES ─── */}
        {loading && <p className="status-msg" style={{ textAlign: 'center', color: '#64748b' }}>Loading gallery media...</p>}
        {error && <p className="status-msg error" style={{ textAlign: 'center' }}>{error}</p>}
        {!loading && !error && currentArray.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px', fontSize: '1.1rem' }}>
            More memories coming soon.
          </p>
        )}

        {/* ─── STAGGERED MEDIA GRID ─── */}
        {!loading && !error && currentArray.length > 0 && (
          <motion.div
            ref={gridRef}
            key={activeTab}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              alignItems: 'start'
            }}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {currentArray.map((item, index) => (
              <motion.div
                key={item._id}
                custom={index}
                variants={cardVariant}
                className="gallery-card"
                onClick={() => item.mediaType === 'image' && setLightboxIndex(index)}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: item.mediaType === 'image' ? 'none' : 'default',
                  aspectRatio: item.mediaType === 'video' ? 'auto' : '1 / 1',
                  backgroundColor: '#f1f5f9'
                }}
                whileHover={item.mediaType === 'image' ? {
                  boxShadow: '0 16px 48px rgba(5,11,22,0.16)',
                  y: -4,
                  transition: { duration: 0.3, ease: 'easeOut' }
                } : {}}
              >
                {item.mediaType === 'image' ? (
                  <motion.img
                    src={item.mediaUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
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
                    background: 'linear-gradient(to top, rgba(0,0,0,0.82), transparent)',
                    padding: '36px 20px 16px',
                    color: 'white',
                    pointerEvents: 'none'
                  }}>
                    <p style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '1rem', fontFamily: "'Inter', sans-serif" }}>{item.title}</p>
                    <p style={{ margin: '0', fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {item.location}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* ─── GLASSMORPHISM LIGHTBOX ─── */}
      <AnimatePresence>
        {lightboxIndex !== null && activeTab !== 'video' && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>
              <img src={currentArray[lightboxIndex].mediaUrl} alt={currentArray[lightboxIndex].title} className="lightbox-image" />
              
              <div style={{ position: 'absolute', bottom: '-48px', color: 'white', textAlign: 'center', width: '100%' }}>
                <h3 style={{ margin: '0 0 4px', fontFamily: "'Playfair Display', serif" }}>{currentArray[lightboxIndex].title}</h3>
                <p style={{ margin: '0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.88rem' }}>
                  <MapPin size={13} /> {currentArray[lightboxIndex].location}
                </p>
              </div>

              {currentArray.length > 1 && (
                <>
                  <button className="lightbox-nav lightbox-nav-prev" onClick={() => setLightboxIndex(i => (i - 1 + currentArray.length) % currentArray.length)}>‹</button>
                  <button className="lightbox-nav lightbox-nav-next" onClick={() => setLightboxIndex(i => (i + 1) % currentArray.length)}>›</button>
                  <span className="lightbox-counter">{lightboxIndex + 1} / {currentArray.length}</span>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Gallery;