// src/components/HeroCarousel.jsx
// Full-height editorial image carousel for the split hero right panel.
// Receives `images` array from galleryImages; falls back to heroImage as single slide.
import { useState, useEffect, useCallback } from 'react';

function HeroCarousel({ images = [], heroImage = '' }) {
  // Build slide list: prefer gallery images, fall back to hero
  const slides = images.length > 0 ? images : (heroImage ? [heroImage] : []);

  const [active, setActive]     = useState(0);
  const [liked, setLiked]       = useState(false);
  const [direction, setDirection] = useState('next'); // for animation hint

  const goTo = useCallback((idx) => {
    setActive(idx);
  }, []);

  const goNext = useCallback(() => {
    setDirection('next');
    setActive(i => (i + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setDirection('prev');
    setActive(i => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext, slides.length]);

  if (!slides.length) {
    return (
      <div className="hc-root" style={{ background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>No Images</span>
      </div>
    );
  }

  return (
    <div className="hc-root" aria-label="Tour image carousel">

      {/* ── Slide layers (cross-fade) ── */}
      {slides.map((src, i) => (
        <div
          key={src + i}
          className="hc-slide"
          aria-hidden={i !== active}
          style={{
            backgroundImage:  `url('${src}')`,
            opacity:          i === active ? 1 : 0,
            transition:       'opacity 0.85s cubic-bezier(0.4,0,0.2,1)',
            position:         'absolute',
            inset:            0,
            backgroundSize:   'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* ── Subtle gradient overlay at bottom ── */}
      <div className="hc-gradient" />

      {/* ── Wishlist / Heart button ── */}
      <button
        className={`hc-wish ${liked ? 'hc-wish--active' : ''}`}
        onClick={() => setLiked(l => !l)}
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        title={liked ? 'Saved to wishlist' : 'Save to wishlist'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* ── Prev / Next arrows (only if multiple slides) ── */}
      {slides.length > 1 && (
        <>
          <button className="hc-arrow hc-arrow--prev" onClick={goPrev} aria-label="Previous image">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button className="hc-arrow hc-arrow--next" onClick={goNext} aria-label="Next image">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          {/* ── Dot indicators ── */}
          <div className="hc-dots" role="tablist" aria-label="Slide indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to image ${i + 1}`}
                className={`hc-dot ${i === active ? 'hc-dot--active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          {/* ── Slide counter (top-left) ── */}
          <div className="hc-counter" aria-live="polite">
            {active + 1} <span style={{ opacity: 0.5, margin: '0 3px' }}>/</span> {slides.length}
          </div>
        </>
      )}
    </div>
  );
}

export default HeroCarousel;
