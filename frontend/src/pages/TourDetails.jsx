// src/pages/TourDetails.jsx
// Luxury editorial redesign — Black Tomato / Scott Dunn inspired layout.
// Sections: Split Hero | Sticky Tabs | Overview | Itinerary | Map | Gallery | Enquire
import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useParams, Link }   from 'react-router-dom';
import axios                  from 'axios';
import { motion }             from 'framer-motion';
import { MapPin, Clock }      from 'lucide-react';
import '../App.css';

import { CurrencyContext }    from '../context/CurrencyContext';
import PriceDisplay           from '../components/PriceDisplay';
import LeadCaptureModal       from '../components/LeadCaptureModal';
import HeroCarousel           from '../components/HeroCarousel';
import StickyTabNav           from '../components/StickyTabNav';

import TourMap                from '../components/TourMap';
import Navbar from '../components/Navbar';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = 'YOUR_WHATSAPP_NUMBER'; // Replace: '9779800000000'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December','Flexible',
];

const TOUR_TABS = [
  { id: 'section-overview',   label: 'Overview'    },
  { id: 'section-itinerary',  label: 'Itinerary'   },
  { id: 'section-map',        label: 'Route Map'   },
  { id: 'section-gallery',    label: 'Gallery'     },
  { id: 'section-enquire',    label: 'Enquire'     },
];

// ── Skeleton loader ────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: '#050b16', minHeight: '100vh' }}>
      <style>{`
        @keyframes shimmer { from{background-position:-600px 0}to{background-position:600px 0} }
        .sk{ background:linear-gradient(90deg,#1e293b 25%,#273449 50%,#1e293b 75%);
             background-size:600px 100%;animation:shimmer 1.4s ease-in-out infinite;border-radius:4px; }
      `}</style>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'100vh' }}>
        <div style={{ padding:'120px 80px 80px', display:'flex', flexDirection:'column', gap:'24px' }}>
          <div className="sk" style={{ height:'12px', width:'120px' }}/>
          <div className="sk" style={{ height:'52px', width:'80%' }}/>
          <div className="sk" style={{ height:'52px', width:'60%' }}/>
          <div className="sk" style={{ height:'16px', width:'90%', marginTop:'8px' }}/>
          <div className="sk" style={{ height:'16px', width:'75%' }}/>
        </div>
        <div style={{ background:'#0a0f1a' }}/>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function TourDetails() {
  const { id }                                     = useParams();
  const galleryRef = useRef(null);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const { current } = galleryRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const { currency, toggleCurrency, formatPrice }  = useContext(CurrencyContext);

  const [tourData,        setTourData]        = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [openDay,         setOpenDay]         = useState(0); // first day open by default
  const [lightboxIndex,   setLightboxIndex]   = useState(null);
  const [modalOpen,       setModalOpen]       = useState(false);
  const [scrolled,        setScrolled]        = useState(false);

  const [inquiryData, setInquiryData] = useState({
    name: '', email: '', subject: '', message: '',
    travelMonth: 'Flexible', groupSize: '2', budgetRange: 'Standard',
  });
  const [inquiryStatus, setInquiryStatus] = useState(null); // null | 'success' | 'error'

  // Normalize tour data in case API returns an array for a single item fetch
  const tour = Array.isArray(tourData) ? tourData[0] : tourData;

  // ── Nav scroll-hide ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Data fetch ───────────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/tours/${id}`)
      .then(r => {
        setTourData(r.data);
        setLoading(false);
        const resolvedTour = Array.isArray(r.data) ? r.data[0] : r.data;
        if (resolvedTour) {
          setInquiryData(f => ({ ...f, subject: `Enquiry about: ${resolvedTour.title}` }));
        }
      })
      .catch(() => { setError('Could not load tour details.'); setLoading(false); });
  }, [id]);

  // ── Lightbox keyboard nav ────────────────────────────────────────────────────
  const gallery = tour?.galleryImages || [];
  useEffect(() => {
    const handleKey = e => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape')     setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, gallery.length]);

  // ── Inquiry form handlers ────────────────────────────────────────────────────
  const handleInquiryChange = e =>
    setInquiryData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleInquirySubmit = e => {
    e.preventDefault();
    if (!tour?._id) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
      ...inquiryData,
      relatedTour: tour._id,
    })
      .then(() => {
        setInquiryStatus('success');
        setInquiryData(f => ({ ...f, name: '', email: '', message: '' }));
        setTimeout(() => setInquiryStatus(null), 6000);
      })
      .catch(() => setInquiryStatus('error'));
  };

  const scrollToEnquire = useCallback(() => {
    const el = document.getElementById('section-enquire');
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, []);

  // ── Route chain from itinerary titles ──────────────────────────────────────
  const routeStops = (() => {
    const stops = [];
    if (tour?.destination) stops.push(tour.destination);
    const itinTitles = tour?.itinerary
      ?.slice(0, 4)
      ?.map(d => d?.title)
      ?.filter(Boolean) || [];
    return stops.concat(itinTitles).slice(0, 5);
  })();

  // ── Loading / Error states ───────────────────────────────────────────────────
  if (loading) return <Skeleton />;

  if (error || !tour || Object.keys(tour).length === 0) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', background:'#f7f2e8', fontFamily:"'Inter',sans-serif", textAlign:'center', padding:'40px 20px' }}>
      <div style={{ marginBottom:'20px', display: 'flex', justifyContent: 'center' }}>
        <svg className="w-12 h-12 text-[#9c826b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21h18M5 21l7-14 7 14M8 15l4-8 4 8"></path></svg>
      </div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#050b16', marginBottom:'12px' }}>
        {error ? 'Could Not Load Tour' : 'Tour Not Found'}
      </h1>
      <p style={{ color:'#64748b', marginBottom:'28px', maxWidth:'400px' }}>{error || 'This tour may have been removed.'}</p>
      <Link to="/packages" style={{ padding:'13px 32px', background:'#050b16', color:'#fff',
        textDecoration:'none', fontWeight:'700', fontSize:'0.88rem', letterSpacing:'1px' }}>
        Browse All Packages
      </Link>
    </div>
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const difficultyColor = {
    Easy: '#2ecc71', Moderate: '#f39c12', Challenging: '#e67e22', Hard: '#e63946',
  }[tour.difficulty] || '#1a5c9e';

  const isPOR = tour.price && typeof tour.price === 'object' && tour.price.displayType === 'por';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">

      {/* ── Minimal fixed nav (dark, always visible on details page) ── */}
      <Navbar />

      {/* ═══════════════════════════════════════════
          1 · SPLIT HERO
      ═══════════════════════════════════════════ */}
      <section className="ed-split-hero">

        {/* ── LEFT: Editorial text panel ── */}
        <motion.div
          className="ed-hero-left"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <span className="ed-hero-eyebrow">
            {tour.destination || 'Nepal'}
          </span>

          {/* Title */}
          <h1 className="ed-hero-title text-3xl md:text-4xl lg:text-5xl font-serif mb-4">{tour.title}</h1>

          {/* Narrative paragraph (description excerpt) */}
          {tour.description && (
            <p className="ed-hero-narrative">
              {tour.description.slice(0, 220)}
              {tour.description.length > 220 ? '…' : ''}
            </p>
          )}

          {/* Route chain */}
          {routeStops?.length > 0 && (
            <div className="ed-route-chain">
              {routeStops.map((stop, i) => {
                if (!stop) return null;
                return (
                  <span key={stop._id || i} style={{ display:'inline-flex', alignItems:'center', gap:'6px' }}>
                    <span className="ed-route-stop">
                      <MapPin size={11} className="ed-route-pin" style={{ color:'#d4af37' }} />
                      {stop}
                    </span>
                    {i < routeStops.length - 1 && (
                      <span className="ed-route-arrow"><svg className="w-3 h-3 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
                    )}
                  </span>
                );
              })}
            </div>
          )}

          {/* Meta row */}
          <div className="ed-hero-meta">
            {tour.duration && (
              <div className="ed-hero-meta-item">
                <span className="ed-hero-meta-label">Duration</span>
                <span className="ed-hero-meta-value">
                  <Clock size={13} style={{ marginRight:'5px', verticalAlign:'middle', opacity:0.6 }} />
                  {tour.duration}
                </span>
              </div>
            )}
            {tour.difficulty && (
              <div className="ed-hero-meta-item">
                <span className="ed-hero-meta-label">Difficulty</span>
                <span className="ed-hero-meta-value" style={{ color: difficultyColor }}>
                  {tour.difficulty}
                </span>
              </div>
            )}
            <div className="ed-hero-meta-item">
              <span className="ed-hero-meta-label">
                {isPOR ? 'Pricing' : 'Starting from'}
              </span>
              <span className="ed-hero-meta-value gold">
                <PriceDisplay price={tour.price} size="md" />
              </span>
            </div>

            {/* Download Itinerary CTA */}
            <button
              onClick={() => setModalOpen(true)}
              style={{
                marginLeft:'auto', padding:'10px 20px',
                background:'transparent', border:'1px solid rgba(212,175,55,0.4)',
                color:'#d4af37', fontFamily:"'Inter',sans-serif",
                fontSize:'0.75rem', fontWeight:'700', letterSpacing:'1.2px',
                textTransform:'uppercase', cursor:'pointer',
                transition:'all 0.2s ease', borderRadius:'2px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(212,175,55,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
            >
              Download Itinerary
            </button>
          </div>
        </motion.div>

        {/* ── RIGHT: Image carousel ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          style={{ position:'relative' }}
        >
          <HeroCarousel
            images={tour.galleryImages || []}
            heroImage={tour.heroImage}
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          2 · STICKY TAB NAV
      ═══════════════════════════════════════════ */}
      <StickyTabNav tabs={TOUR_TABS} />

      {/* ═══════════════════════════════════════════
          3 · TWO-COLUMN CONTENT & ENQUIRY
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* ========================================== */}
        {/* LEFT COLUMN */}
        {/* ========================================== */}
        <div className="lg:col-span-8 space-y-8 lg:space-y-10 order-last lg:order-first">
          
          {/* Overview & Highlights */}
          <section id="section-overview">
            <h2 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">Overview</h2>
            <p className="text-[#4a4238] leading-relaxed text-lg mb-8 whitespace-pre-wrap">{tour.description}</p>
            
            {tour.included?.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-[#1a1a1a] mb-6">Journey Highlights</h3>
                <ul className="space-y-4">
                  {tour.included.map((item, i) => {
                    if (!item) return null;
                    return (
                      <li key={item._id || i} className="flex items-start gap-4">
                        <span className="text-[#d4af37] mt-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                        <span className="text-[#4a4238] leading-relaxed">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>

          {/* Itinerary Accordion */}
          {tour.itinerary?.length > 0 && (
            <section id="section-itinerary">
              <h2 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">
                Itinerary <span className="text-lg md:text-xl text-[#888] ml-3 font-sans font-normal">{tour.itinerary.length} Days</span>
              </h2>
              <div className="space-y-4">
                {tour.itinerary.map((day, idx) => {
                  if (!day) return null;
                  const isOpen = openDay === idx;
                  return (
                    <div key={day._id || idx} className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e2d9cc] shadow-sm overflow-hidden transition-all duration-300">
                      <button
                        className="w-full text-left flex items-center justify-between focus:outline-none cursor-pointer"
                        onClick={() => setOpenDay(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-[#9c826b] font-semibold text-sm tracking-widest uppercase">Day {day.day || idx + 1}</span>
                          <span className="font-serif text-xl text-[#1a1a1a]">{day.title}</span>
                        </div>
                        <span className="text-[#9c826b] transform transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </span>
                      </button>
                      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ overflow: 'hidden' }}>
                        <div className="pt-4">
                          <p className="text-[#4a4238] leading-relaxed whitespace-pre-wrap">
                            {day.description || 'No additional detail for this day.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Embedded Google Map */}
          {(tour.location || tour.destination) && (
            <section id="section-map">
              <h2 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">Route Map</h2>
              <div className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-sm border border-[#e2d9cc]">
                <iframe
                  title="Tour Location Map"
                  className="w-full h-full" style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(tour.location || tour.destination || 'Nepal')}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </section>
          )}

          {/* Travel Tips / Practical Info */}
          {(tour.included?.length > 0 || tour.excluded?.length > 0) && (
            <section>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-6 border-b border-[#e2d9cc] pb-4">Good to Know</h2>
              <div className="bg-[#f4efe6] p-6 sm:p-8 rounded-2xl border border-[#e2d9cc] grid grid-cols-1 sm:grid-cols-2 gap-8">
                {tour.included?.length > 0 && (
                  <div>
                    <h4 className="font-serif text-xl text-[#1a1a1a] mb-4">Included</h4>
                    <ul className="space-y-3">
                      {tour.included.map((item, i) => {
                        if (!item) return null;
                        return (
                          <li key={item._id || i} className="flex items-start gap-3">
                            <span className="text-[#84a98c] font-bold mt-0.5">?</span>
                            <span className="text-[#4a4238]">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {tour.excluded?.length > 0 && (
                  <div>
                    <h4 className="font-serif text-xl text-[#1a1a1a] mb-4">Not Included</h4>
                    <ul className="space-y-3">
                      {tour.excluded.map((item, i) => {
                        if (!item) return null;
                        return (
                          <li key={item._id || i} className="flex items-start gap-3">
                            <span className="text-[#9c826b] font-bold mt-0.5">?</span>
                            <span className="text-[#4a4238]">{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN (STICKY CARDS) */}
        {/* ========================================== */}
        <div className="lg:col-span-4 space-y-6 order-first lg:order-last lg:sticky lg:top-24 lg:self-start">
          
          {/* Card 1: Pricing & Action Card */}
          <div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e2d9cc] shadow-sm">
            <h3 className="font-serif italic text-2xl text-[#1a1a1a] mb-2">{tour.title}</h3>
            
            <div className="mb-6 mt-4">
              {(tour.price?.displayType === 'price_on_request' || tour.price?.displayType === 'por') ? (
                <div className="text-3xl font-serif text-[#1a1a1a]">
                  Price on Request
                </div>
              ) : (
                <>
                  <span className="block text-sm text-[#888] uppercase tracking-wide mb-1">Starting from</span>
                  <div className="text-3xl font-serif text-[#1a1a1a]">
                    USD {tour.price?.amount ?? tour.price}
                  </div>
                  {tour.localPrice && (
                    <div className="text-sm text-[#888] mt-1">NPR {tour.localPrice}</div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={scrollToEnquire}
                className="flex-1 bg-[#1a5c9e] hover:bg-[#246ab5] text-white font-medium py-3.5 rounded-xl transition text-center shadow-sm cursor-pointer"
              >
                Enquire Now
              </button>
              <button 
                className="w-14 h-14 flex items-center justify-center bg-white border border-[#e2d9cc] text-[#1a5c9e] hover:bg-[#fbf9f5] rounded-xl transition shadow-sm shrink-0 cursor-pointer"
                onClick={() => {
                  const saved = JSON.parse(localStorage.getItem('samye_wishlist') || '[]');
                  if (saved.includes(tour._id)) {
                    localStorage.setItem('samye_wishlist', JSON.stringify(saved.filter(id => id !== tour._id)));
                    alert('Removed from wishlist');
                  } else {
                    localStorage.setItem('samye_wishlist', JSON.stringify([...saved, tour._id]));
                    alert('Added to wishlist');
                  }
                }}
                aria-label="Save to Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Card 2: Categorization & Tags Card */}
          <div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e2d9cc] shadow-sm">
            <h4 className="font-serif text-xl text-[#1a1a1a] mb-5 border-b border-[#e2d9cc] pb-3">Experience Style</h4>
            <div className="flex flex-wrap gap-2">
              {[...(tour.experienceTheme || []), ...(tour.subTheme || []), ...(tour.travelStyle || [])].filter(Boolean).map((tag, i) => (
                <span key={i} className="bg-[#eae3d5] text-[#4a4238] px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* BELOW-THE-GRID SECTIONS */}
      {/* ========================================== */}
      
      {/* Full-Width Visual Story / Gallery */}
      <div id="section-gallery" className="max-w-7xl mx-auto px-4 py-16 border-t border-[#e2d9cc]">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold tracking-widest text-[#9c826b] uppercase">Visual Story</span>
          <h2 className="font-serif text-4xl text-[#1a1a1a] mt-3">Tour Gallery</h2>
        </div>
        <div className="relative group">
          <div ref={galleryRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
            {(tour.galleryImages?.length > 0 ? tour.galleryImages : [tour.cardImage, tour.heroImage]).filter(Boolean).map((img, i) => (
              <div 
                key={i} 
                className="flex-none w-[85%] sm:w-[60%] md:w-[45%] lg:w-[35%] snap-center rounded-2xl overflow-hidden shadow-sm border border-[#e2d9cc] relative cursor-pointer group/item"
                onClick={() => setLightboxIndex(i)}
              >
                <img src={img} alt={`Gallery ${i+1}`} className="w-full h-72 sm:h-80 md:h-96 object-cover transition-transform duration-700 group-hover/item:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/90 text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm">
                    View Image
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={() => scrollGallery('left')} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#9c826b] w-12 h-12 rounded-full items-center justify-center shadow-lg transition-all focus:outline-none border border-[#e2d9cc] opacity-0 group-hover:opacity-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <button onClick={() => scrollGallery('right')} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#9c826b] w-12 h-12 rounded-full items-center justify-center shadow-lg transition-all focus:outline-none border border-[#e2d9cc] opacity-0 group-hover:opacity-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      {/* Centered Enquiry Section */}
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16" id="enquiry-section">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold tracking-widest text-[#9c826b] uppercase">Start Planning</span>
            <h2 className="font-serif text-4xl text-[#1a1a1a] mt-3">Enquire About This Tour</h2>
            <p className="text-[#64748b] mt-4">Our travel experts respond within 24 hours with a personalised proposal.</p>
          </div>
          
          <div className="bg-[#f4efe6] p-6 sm:p-8 md:p-10 rounded-2xl shadow-md border border-[#e2d9cc]">
            {inquiryStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Enquiry sent! We'll get back to you within 24 hours.
              </div>
            )}
            {inquiryStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                Something went wrong. Please try the Contact page.
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Your Name</label>
                  <input name="name" value={inquiryData.name} onChange={handleInquiryChange} required className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5c9e]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Your Email</label>
                  <input type="email" name="email" value={inquiryData.email} onChange={handleInquiryChange} required className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5c9e]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Travel Month</label>
                  <select name="travelMonth" value={inquiryData.travelMonth} onChange={handleInquiryChange} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5c9e]">
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Group Size</label>
                  <select name="groupSize" value={inquiryData.groupSize} onChange={handleInquiryChange} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5c9e]">
                    <option value="1">Solo (1)</option>
                    <option value="2">Couple (2)</option>
                    <option value="3-5">Small Group (3–5)</option>
                    <option value="6+">Large Group (6+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a4238] mb-2">Budget Range</label>
                  <select name="budgetRange" value={inquiryData.budgetRange} onChange={handleInquiryChange} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5c9e]">
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a4238] mb-2">Message</label>
                <textarea
                  name="message"
                  value={inquiryData.message}
                  onChange={handleInquiryChange}
                  placeholder={`Hi Samye Travels, I'm interested in the ${tour.title}. I'd love to know more about dates, group sizes, and possible customisations...`}
                  rows="5"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a5c9e] resize-y"
                />
              </div>

              <button type="submit" className="w-full bg-[#1a5c9e] hover:bg-[#246ab5] text-white font-medium py-4 rounded-xl transition shadow-sm text-lg mt-2 cursor-pointer">
                Send Enquiry →
              </button>
            </form>
          </div>
        </div>

      {/* -------------------------------------------
          LIGHTBOX PORTAL
      ═══════════════════════════════════════════ */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close p-2" onClick={() => setLightboxIndex(null)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <img src={gallery[lightboxIndex]} alt="" className="lightbox-image" />
            {gallery.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-nav-prev p-2"
                  onClick={() => setLightboxIndex(i => (i - 1 + gallery.length) % gallery.length)}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button className="lightbox-nav lightbox-nav-next p-2"
                  onClick={() => setLightboxIndex(i => (i + 1) % gallery.length)}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
                <span className="lightbox-counter">{lightboxIndex + 1} / {gallery.length}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          LEAD CAPTURE MODAL (itinerary download)
      ═══════════════════════════════════════════ */}
      {modalOpen && (
        <LeadCaptureModal
          tour={tour}
          onClose={() => setModalOpen(false)}
        />
      )}

    </div>
  );
}

export default TourDetails;