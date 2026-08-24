import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  MapPin, Calendar, Compass, Clock, Map, Tag, Navigation as Nav,
  Shield, Plane, Leaf, ArrowRight, Sparkles, X, Bot, Send,
  Star, Mountain, Users, Award, Globe
} from 'lucide-react';
import '../App.css';
import Navbar from '../components/Navbar';

// â”€â”€ ANIMATION VARIANTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }
  })
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

const cardVariant = {
  hidden:  { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

// â”€â”€ STATIC DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ——— STATIC DATA ————————————————————————————————————————————————————————
const STATS = [
  { number: '500+',  label: 'Expeditions Completed' },
  { number: '15+',   label: 'Years of Expertise' },
  { number: '98%',   label: 'Client Satisfaction' },
  { number: '3',     label: 'Operating Regions' },
  { number: '120+',  label: 'Expert Local Guides' },
  { number: '4.9/5', label: 'Average Trip Rating' },
];

const REVIEWS = [
  {
    text: 'Samye Travels made our Annapurna Circuit trek absolutely seamless. Every permit, every lodge - handled flawlessly. Our guide Raj was outstanding.',
    author: 'Thomas & Claire M.',
    trip: 'Annapurna Circuit - 14 Days',
    initial: 'T',
    stars: 5,
  },
  {
    text: "The Tibet overland tour was a once-in-a-lifetime experience. The logistics of getting all Tibet permits sorted without us lifting a finger was incredible.",
    author: 'Sarah K.',
    trip: 'Lhasa to Kathmandu Overland',
    initial: 'S',
    stars: 5,
  },
  {
    text: 'We did the custom trip builder online and honestly expected it to be a gimmick - it wasn\'t. The discount calculator saved us nearly 18% on a group of 9.',
    author: 'The Henderson Family',
    trip: 'Everest Base Camp + Chitwan',
    initial: 'H',
    stars: 5,
  },
  {
    text: 'Paragliding over Pokhara was the highlight of my Nepal trip. The safety briefing was thorough and the instructor was a true professional. Highly recommend.',
    author: 'Marco R.',
    trip: 'Pokhara Adventure Sports',
    initial: 'M',
    stars: 5,
  },
  {
    text: "From the moment we landed to the day we left, Samye's team was reachable 24/7. That level of support on remote treks is genuinely rare.",
    author: 'Priya & Arjun D.',
    trip: 'Gokyo Lake Trek - 12 Days',
    initial: 'P',
    stars: 5,
  },
  {
    text: 'The India-Nepal combo circuit was spectacular. Two countries, one team managing everything. Communication was flawless throughout.',
    author: 'James L.',
    trip: 'Golden Triangle + Kathmandu',
    initial: 'J',
    stars: 5,
  },
];

// â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AnimatedSection({ children, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

function StarRow({ count = 5 }) {
  return (
    <div className="review-stars">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill="#d4af37" color="#d4af37" />
      ))}
    </div>
  );
}

// â”€â”€ COMPONENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Home() {
  const [scrolled, setScrolled]       = useState(false);
  const navigate                       = useNavigate();

  // â”€â”€ AI CONCIERGE STATE (unchanged logic) â”€â”€
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [userPrompt, setUserPrompt]       = useState('');
  const [isThinking, setIsThinking]       = useState(false);
  const [aiResult, setAiResult]           = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // â”€â”€ MOCK AI LOGIC (unchanged) â”€â”€
  const handleAICuration = (e) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    setIsThinking(true);
    setAiResult(null);

    setTimeout(() => {
      const p = userPrompt.toLowerCase();
      let match = {
        title: 'Bespoke Custom Journey',
        rationale: "Based on your specific needs, the best approach is to build a custom itinerary from scratch. I'll forward your preferences to our trip builder.",
        link: '/custom-tour',
        cta: 'Open Trip Builder',
      };
      if (p.includes('rafting') || p.includes('extreme') || p.includes('adrenaline')) {
        match = {
          title: 'Himalayan Adventure Sports',
          rationale: "You're looking for high-octane thrills. I've matched you with our Adventure Sports catalog â€” white-water rafting and paragliding fit perfectly.",
          link: '/packages',
          cta: 'View Adventure Expeditions',
        };
      } else if (p.includes('relax') || p.includes('culture') || p.includes('temple')) {
        match = {
          title: 'Cultural Heritage Circuits',
          rationale: "You mentioned a relaxed pace with cultural focus. I've curated our guided temple circuits and sacred monastery stays.",
          link: '/packages',
          cta: 'View Cultural Tours',
        };
      } else if (p.includes('everest') || p.includes('annapurna') || p.includes('trek')) {
        match = {
          title: 'High-Altitude Treks',
          rationale: "You're looking for the classic Himalayan experience. I've filtered our catalog to highlight signature base camp treks.",
          link: '/packages',
          cta: 'View Trekking Packages',
        };
      }
      setAiResult(match);
      setIsThinking(false);
    }, 2500);
  };

  const closeAIModal = () => {
    setIsAIModalOpen(false);
    setTimeout(() => { setUserPrompt(''); setAiResult(null); setIsThinking(false); }, 300);
  };

  return (
    <div className="app-wrapper">

      {/* â”€â”€ NAVBAR â”€â”€ */}
      <Navbar />

      {/* â”€â”€ HERO â”€â”€ */}
      <section className="hero-section" id="home">
        <div className="hero-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <motion.span
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            Himalayan Journeys Since 2010
          </motion.span>
          <h1>Samye Travels</h1>
          <p>
            Expertly crafted Himalayan expeditions, cultural tours, and bespoke adventure
            sports across Nepal, Tibet &amp; India.
          </p>
          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Link to="/packages" className="hero-btn-primary">Explore Packages</Link>
            <Link to="/custom-tour" className="hero-btn-secondary">Design Your Itinerary</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           STATS CAROUSEL  (Swiper auto-play, 4 slides visible)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="stats-carousel-section">
        <Swiper
          modules={[Autoplay, Pagination, A11y]}
          slidesPerView={2}
          spaceBetween={0}
          loop
          autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          breakpoints={{
            600:  { slidesPerView: 3 },
            900:  { slidesPerView: 4 },
            1200: { slidesPerView: 6 },
          }}
          style={{ paddingBottom: '40px' }}
        >
          {STATS.map((s, i) => (
            <SwiperSlide key={i}>
              <div className="stat-swiper-slide">
                <span className="stat-swiper-number">{s.number}</span>
                <span className="stat-swiper-label">{s.label}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* â”€â”€ AI CONCIERGE BANNER â”€â”€ */}
      <motion.div
        style={{
          backgroundColor: '#0f172a', padding: '36px 20px',
          textAlign: 'center', color: 'white',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Bot size={32} color="#d4af37" />
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '600', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.5px' }}>
            Tell us your dream journey.
          </h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.05rem', maxWidth: '500px', lineHeight: 1.6 }}>
            Skip the browsing. Describe your ideal timeline, pace, and companions - our AI Concierge will curate the perfect package instantly.
          </p>
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="btn-sweep"
            style={{
              marginTop: '8px', padding: '13px 30px',
              backgroundColor: '#1a5c9e', color: 'white', border: 'none',
              borderRadius: '30px', fontSize: '0.95rem', fontWeight: '600',
              gap: '8px', boxShadow: '0 4px 16px rgba(26,92,158,0.42)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Sparkles size={17} style={{ flexShrink: 0 }} /> Ask AI Concierge
          </button>
        </div>
      </motion.div>

      {/* â”€â”€ PACKAGE CARDS (staggered scroll-reveal) â”€â”€ */}
      <div className="journey-selector-section" style={{ backgroundColor: '#f8fafc' }}>
        <motion.div
          className="section-header"
          style={{ marginBottom: '48px' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="section-title" style={{ color: '#0f172a' }}>Our Curated Packages</h2>
          <p className="section-subtitle" style={{ color: '#64748b' }}>
            Choose from our specialized itineraries or craft a completely bespoke journey.
          </p>
        </motion.div>

        <motion.div
          className="journey-cards-grid three-col"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* CARD 1 */}
          <motion.div variants={cardVariant}>
            <Link
              to="/packages"
              className="journey-card"
              style={{ borderRadius: '10px', overflow: 'hidden', display: 'block', textDecoration: 'none' }}
            >
              <div className="journey-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80')" }} />
              <div className="journey-card-overlay" />
              <div className="journey-card-content">
                <span className="journey-card-eyebrow">Cultural Heritage</span>
                <h3 className="journey-card-title">Tour Packages</h3>
                <p className="journey-card-desc">
                  Guided treks to Everest Base Camp, sacred monastery stays in Tibet, and temple circuits across India.
                </p>
                <div className="journey-card-cta">
                  View Itineraries <ArrowRight size={15} className="journey-card-arrow" />
                </div>
                <div className="journey-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={13} /> Nepal · Tibet · India</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={13} /> 5-21 Days</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* CARD 2 */}
          <motion.div variants={cardVariant}>
            <Link
              to="/packages"
              className="journey-card"
              style={{ borderRadius: '10px', overflow: 'hidden', display: 'block', textDecoration: 'none' }}
            >
              <div className="journey-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80')" }} />
              <div className="journey-card-overlay" />
              <div className="journey-card-content">
                <span className="journey-card-eyebrow">High Altitude</span>
                <h3 className="journey-card-title">Adventure Sports</h3>
                <p className="journey-card-desc">
                  White-water rafting, paragliding over Pokhara, bungee jumps, zip-lines, and Himalayan climbing expeditions.
                </p>
                <div className="journey-card-cta">
                  View Activities <ArrowRight size={15} className="journey-card-arrow" />
                </div>
                <div className="journey-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Compass size={13} /> Nepal · India</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={13} /> Half-day - 3 Days</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* CARD 3 */}
          <motion.div variants={cardVariant}>
            <Link
              to="/custom-tour"
              className="journey-card journey-card-custom"
              style={{ borderRadius: '10px', overflow: 'hidden', display: 'block', textDecoration: 'none' }}
            >
              <div className="journey-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')" }} />
              <div className="journey-card-overlay" />
              <div className="journey-card-content">
                <span className="journey-card-eyebrow">Bespoke</span>
                <h3 className="journey-card-title">Tailored Itineraries</h3>
                <p className="journey-card-desc">
                  Combine tours and adventure sports into a personalized itinerary with instant feasibility reporting and live discount stacking.
                </p>
                <div className="journey-card-cta">
                  Start Builder <ArrowRight size={15} className="journey-card-arrow" />
                </div>
                <div className="journey-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Map size={13} /> Fully Customisable</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Tag size={13} /> Dynamic Pricing</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* â”€â”€ WHY US STRIP â”€â”€ */}
      <AnimatedSection
        style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}
        className="why-us-strip"
      >
        <div className="why-us-inner">
          {[
            { icon: <Nav size={26} strokeWidth={1.5} />,    title: 'Expert Local Guides',       desc: 'Every guide is a mountain native with 10+ years on the trail.' },
            { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Certified Safety',          desc: 'Strict evacuation protocols and certified safety equipment on all trips.' },
            { icon: <Plane size={26} strokeWidth={1.5} />,  title: 'End-to-End Logistics',      desc: 'Permits, domestic transport, and premium accommodation â€” all handled.' },
            { icon: <Leaf size={26} strokeWidth={1.5} />,   title: 'Sustainable Travel',        desc: 'Leave-no-trace ethics supporting local Himalayan economies.' },
          ].map((item, i) => (
            <motion.div key={i} className="why-us-item" variants={fadeUp} custom={i}>
              <span className="why-us-icon" style={{ color: '#1a5c9e' }}>{item.icon}</span>
              <div>
                <strong style={{ color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>{item.title}</strong>
                <p style={{ color: '#64748b', marginTop: '4px' }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           TESTIMONIALS CAROUSEL  (3 cards, auto-play, draggable)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="reviews-section">
        <motion.div
          className="reviews-section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2>What Our Travellers Say</h2>
          <p>Honest reflections from people who've journeyed with us.</p>
        </motion.div>

        <Swiper
          className="reviews-swiper"
          modules={[Autoplay, Pagination, Navigation, A11y]}
          slidesPerView={1}
          spaceBetween={24}
          loop
          grabCursor
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            680:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {REVIEWS.map((r, i) => (
            <SwiperSlide key={i} style={{ height: 'auto' }}>
              <div className="review-card">
                <StarRow count={r.stars} />
                <p className="review-text">{r.text}</p>
                <div className="review-author">
                  <div className="review-avatar">{r.initial}</div>
                  <div className="review-author-info">
                    <span className="review-author-name">{r.author}</span>
                    <span className="review-author-trip">
                      <Mountain size={11} style={{ flexShrink: 0 }} /> {r.trip}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* â”€â”€ FOOTER â”€â”€ */}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
           AI CONCIERGE MODAL  (logic unchanged)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isAIModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(15,23,42,0.82)',
            zIndex: 9999, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '20px',
            backdropFilter: 'blur(14px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: 'white', borderRadius: '16px', width: '100%',
              maxWidth: '600px', overflow: 'hidden', position: 'relative',
              boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', fontWeight: '600', fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" }}>
                <Bot size={22} color="#1a5c9e" /> AI Concierge
              </div>
              <button
                onClick={closeAIModal}
                style={{ background: 'none', border: 'none', color: '#64748b', transition: 'color 0.2s', padding: '4px' }}
                onMouseOver={e => e.currentTarget.style.color = '#0f172a'}
                onMouseOut={e  => e.currentTarget.style.color = '#64748b'}
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '32px 24px', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>

              {!aiResult && !isThinking && (
                <form onSubmit={handleAICuration} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: '1.35rem', color: '#0f172a', fontFamily: "'Playfair Display', serif" }}>
                    Describe your ideal trip
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '22px', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Mention your group size, preferred pace, dates, or specific destinations like Everest or Pokhara.
                  </p>
                  <textarea
                    value={userPrompt}
                    onChange={e => setUserPrompt(e.target.value)}
                    placeholder="e.g., I have 10 days in November. Traveling with my wife, want culture + light trekking, nothing extremeâ€¦"
                    style={{
                      flex: 1, minHeight: '150px', padding: '14px 16px',
                      borderRadius: '10px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.97rem', fontFamily: "'Inter', sans-serif",
                      resize: 'none', outline: 'none',
                      transition: 'border-color 0.2s',
                      color: '#0f172a', lineHeight: 1.6,
                    }}
                    onFocus={e => e.target.style.borderColor = '#1a5c9e'}
                    onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
                    autoFocus
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
                    <button
                      type="submit"
                      disabled={!userPrompt.trim()}
                      className="btn-sweep"
                      style={{
                        padding: '13px 28px',
                        backgroundColor: userPrompt.trim() ? '#1a5c9e' : '#cbd5e1',
                        color: 'white', border: 'none', borderRadius: '8px',
                        fontSize: '0.95rem', fontWeight: '600',
                        gap: '8px', fontFamily: "'Inter', sans-serif",
                        transition: 'background 0.2s',
                      }}
                    >
                      Curate My Journey <Send size={16} />
                    </button>
                  </div>
                </form>
              )}

              {isThinking && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '48px 0' }}>
                  <Sparkles size={44} color="#1a5c9e" style={{ animation: 'pulseSpin 1.6s infinite ease-in-out' }} />
                  <h3 style={{ marginTop: '22px', color: '#0f172a', fontSize: '1.2rem', fontFamily: "'Playfair Display', serif" }}>
                    Curating your perfect itinerary...
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Analysing database for best match</p>
                </div>
              )}

              {aiResult && !isThinking && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'fadeInUp 0.45s ease-out' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
                    <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '10px', flexShrink: 0 }}>
                      <Sparkles size={22} color="#0284c7" />
                    </div>
                    <div>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px', color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>
                        AI Recommendation
                      </span>
                      <h3 style={{ margin: '4px 0 0', fontSize: '1.4rem', color: '#0f172a', fontFamily: "'Playfair Display', serif" }}>
                        {aiResult.title}
                      </h3>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
                    <p style={{ margin: 0, color: '#334155', lineHeight: 1.65, fontSize: '0.97rem', fontStyle: 'italic' }}>
                      "{aiResult.rationale}"
                    </p>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => { setAiResult(null); setUserPrompt(''); }}
                      style={{ padding: '13px 20px', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', flex: 1, fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                      onMouseOut={e  => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      Try Another Prompt
                    </button>
                    <button
                      onClick={() => { closeAIModal(); navigate(aiResult.link); }}
                      className="btn-sweep"
                      style={{ padding: '13px 20px', backgroundColor: '#1a5c9e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', flex: 2, gap: '8px', fontFamily: "'Inter', sans-serif" }}
                    >
                      {aiResult.cta} <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes pulseSpin {
          0%   { transform: scale(0.9) rotate(0deg);   opacity: 0.5; }
          50%  { transform: scale(1.1) rotate(180deg); opacity: 1;   }
          100% { transform: scale(0.9) rotate(360deg); opacity: 0.5; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
