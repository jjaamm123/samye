import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft } from 'lucide-react';
import '../App.css';
import Navbar from '../components/Navbar';

// ─── Animation Variants ───────────────────────────────────────────────────────
const cardVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }
  })
};

const fadeSlide = {
  hidden:   { opacity: 0, x: 24 },
  visible:  { opacity: 1, x: 0,  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, x: -24, transition: { duration: 0.25 } }
};

// ─── Country meta (emoji + accent color) ────────────────────────────────────
const COUNTRY_META = {
  Nepal: { emoji: '🇳🇵' },
  Tibet: { emoji: '🏔️' },
  India: { emoji: '🇮🇳' },
};

// ─── Main Gallery Component ───────────────────────────────────────────────────
function Gallery() {
  const [galleryItems, setGalleryItems]         = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);

  // Navigation state
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeCategory, setActiveCategory]     = useState('Scenic Views');

  // Lightbox
  const [lightboxIndex, setLightboxIndex]       = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/gallery`)
      .then(r => {
        const data = r.data;
        const arr = Array.isArray(data)         ? data
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

  // ── Client-side grouping: country → location → items ──────────────────────
  const safeItems = Array.isArray(galleryItems) ? galleryItems : [];

  const grouped = safeItems.reduce((acc, item) => {
    const country  = item.country  || 'Nepal';
    const location = item.location || 'Other';
    if (!acc[country]) acc[country] = {};
    if (!acc[country][location]) acc[country][location] = [];
    acc[country][location].push(item);
    return acc;
  }, {});

  const countries = Object.keys(grouped);

  // ── Items shown in subpage (filtered by location + category) ──────────────
  const subpageItems = selectedLocation
    ? safeItems.filter(item =>
        item.location === selectedLocation &&
        item.category === activeCategory
      )
    : [];

  // Pool of images in subpage for lightbox cycling
  const lightboxPool = subpageItems.filter(i => i.mediaType === 'image');

  // ── Lightbox keyboard nav ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = e => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape')     setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % lightboxPool.length);
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + lightboxPool.length) % lightboxPool.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, lightboxPool.length]);

  // ── Navigate into a sublocation ───────────────────────────────────────────
  const handleSelectLocation = (location) => {
    setActiveCategory('Scenic Views');
    setLightboxIndex(null);
    setSelectedLocation(location);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedLocation(null);
    setLightboxIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Open lightbox for images only ─────────────────────────────────────────
  const openLightbox = (item) => {
    if (item.mediaType !== 'image') return;
    const idx = lightboxPool.findIndex(p => p._id === item._id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper min-h-screen bg-[#fbf9f5]">

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── HERO ── */}
      <div
        className="packages-hero"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80')` }}
      >
        <div className="packages-hero-overlay" />
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

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Loading / Error / Empty */}
        {loading && <p className="text-center text-[#64748b] py-20 text-lg">Loading gallery media...</p>}
        {error   && <p className="text-center text-red-500 py-20 text-lg">{error}</p>}
        {!loading && !error && safeItems.length === 0 && (
          <p className="text-center text-[#64748b] py-20 text-lg">No gallery items yet. Check back soon!</p>
        )}

        <AnimatePresence mode="wait">

          {/* ════════════════════════════════════════════
              MAIN VIEW — Country → Sublocation Folders
          ════════════════════════════════════════════ */}
          {!selectedLocation && !loading && !error && safeItems.length > 0 && (
            <motion.div
              key="main-view"
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-16"
            >
              {countries.map(country => {
                const locationMap   = grouped[country];
                const locationNames = Object.keys(locationMap);
                const meta          = COUNTRY_META[country] || { emoji: '🌏' };
                const totalItems    = Object.values(locationMap).reduce((sum, arr) => sum + arr.length, 0);

                return (
                  <section key={country}>
                    {/* Country Header */}
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#e2d9cc]">
                      <span className="text-4xl">{meta.emoji}</span>
                      <div>
                        <h2 className="font-serif text-3xl text-[#1a1a1a]">{country}</h2>
                        <p className="text-sm text-[#9c826b] mt-0.5">
                          {locationNames.length} {locationNames.length === 1 ? 'location' : 'locations'} · {totalItems} items
                        </p>
                      </div>
                    </div>

                    {/* Sublocation Folder Carousel */}
                    <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {locationNames.map(locationName => {
                        const items    = locationMap[locationName];
                        const coverUrl = (items.find(i => i.mediaType === 'image') || items[0])?.mediaUrl;

                        return (
                          <div
                            key={locationName}
                            onClick={() => handleSelectLocation(locationName)}
                            className="flex-none w-[80%] sm:w-[45%] md:w-[30%] lg:w-[22%] h-64 relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm snap-start border border-[#e2d9cc] hover:shadow-xl transition-shadow duration-300"
                          >
                            {/* Cover image */}
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={locationName}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[#e2d9cc]" />
                            )}

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                            {/* Folder text */}
                            <div className="absolute bottom-4 left-4 z-20">
                              <div className="flex items-center gap-1.5 mb-1">
                                <MapPin size={11} className="text-[#eeddaa]" />
                                <span className="text-[#eeddaa] text-xs uppercase tracking-widest font-semibold">{country}</span>
                              </div>
                              <h3 className="text-white font-serif text-xl leading-snug">{locationName}</h3>
                              <p className="text-gray-300 text-sm mt-0.5">{items.length} {items.length === 1 ? 'Item' : 'Items'}</p>
                            </div>

                            {/* Hover arrow cue */}
                            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                  <polyline points="12 5 19 12 12 19" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </motion.div>
          )}

          {/* ════════════════════════════════════════════
              SUBLOCATION SUBPAGE VIEW
          ════════════════════════════════════════════ */}
          {selectedLocation && (
            <motion.div
              key={`subpage-${selectedLocation}`}
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Back button */}
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-[#9c826b] hover:text-[#6b5c4e] font-medium text-sm mb-10 transition-colors group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                Back to All Destinations
              </button>

              {/* Subpage Header */}
              <div className="text-center mb-10">
                <span className="text-sm font-semibold tracking-widest text-[#9c826b] uppercase">Gallery</span>
                <h2 className="font-serif text-4xl text-[#1a1a1a] mt-2">{selectedLocation}</h2>
                <p className="text-[#64748b] mt-2 text-sm">
                  {safeItems.filter(i => i.location === selectedLocation).length} items in this location
                </p>
              </div>

              {/* Category Pill Filters — Scenic Views & Customer Moments only */}
              <div className="flex justify-center gap-3 mb-10 flex-wrap">
                {['Scenic Views', 'Customer Moments'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setLightboxIndex(null); }}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all border ${
                      activeCategory === cat
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                        : 'bg-white text-[#4a4238] border-[#e2d9cc] hover:border-[#9c826b]'
                    }`}
                  >
                    {cat}
                    <span className="ml-2 text-xs opacity-60">
                      ({safeItems.filter(i => i.location === selectedLocation && i.category === cat).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Empty state */}
              {subpageItems.length === 0 && (
                <p className="text-center text-[#64748b] py-16 text-lg">No media in this category yet.</p>
              )}

              {/* Media Grid — images + videos together */}
              {subpageItems.length > 0 && (
                <motion.div
                  key={`${selectedLocation}-${activeCategory}`}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                >
                  {subpageItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      custom={index}
                      variants={cardVariant}
                      onClick={() => openLightbox(item)}
                      className={`relative rounded-2xl overflow-hidden bg-[#e2d9cc] shadow-sm border border-[#e2d9cc] group ${
                        item.mediaType === 'image' ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300' : ''
                      }`}
                      style={{ aspectRatio: item.mediaType === 'video' ? 'auto' : '1 / 1' }}
                    >
                      {/* Image */}
                      {item.mediaType === 'image' && (
                        <>
                          <img
                            src={item.mediaUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          {/* Hover "View" cue */}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white/90 text-[#1a1a1a] px-4 py-2 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm uppercase tracking-wide">View</span>
                          </div>
                          {/* Bottom caption */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-4 pt-10 pb-4 pointer-events-none">
                            <p className="text-white font-semibold text-sm leading-snug">{item.title}</p>
                            <p className="text-gray-300 text-xs mt-0.5 flex items-center gap-1">
                              <MapPin size={10} /> {item.location}
                            </p>
                          </div>
                        </>
                      )}

                      {/* Video */}
                      {item.mediaType === 'video' && (
                        <video
                          src={item.mediaUrl}
                          controls
                          className="w-full block rounded-2xl"
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && lightboxPool[lightboxIndex] && (
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
              <img
                src={lightboxPool[lightboxIndex].mediaUrl}
                alt={lightboxPool[lightboxIndex].title}
                className="lightbox-image"
              />
              <div style={{ position: 'absolute', bottom: '-48px', color: 'white', textAlign: 'center', width: '100%' }}>
                <h3 style={{ margin: '0 0 4px', fontFamily: "'Playfair Display', serif" }}>
                  {lightboxPool[lightboxIndex].title}
                </h3>
                <p style={{ margin: 0, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.88rem' }}>
                  <MapPin size={13} /> {lightboxPool[lightboxIndex].location}
                </p>
              </div>
              {lightboxPool.length > 1 && (
                <>
                  <button className="lightbox-nav lightbox-nav-prev" onClick={() => setLightboxIndex(i => (i - 1 + lightboxPool.length) % lightboxPool.length)}>‹</button>
                  <button className="lightbox-nav lightbox-nav-next" onClick={() => setLightboxIndex(i => (i + 1) % lightboxPool.length)}>›</button>
                  <span className="lightbox-counter">{lightboxIndex + 1} / {lightboxPool.length}</span>
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