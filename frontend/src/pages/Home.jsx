import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Compass, Clock, Map, Tag, Navigation, 
  Shield, Plane, Leaf, ArrowRight, Sparkles, X, ChevronRight, Bot, Send
} from 'lucide-react';
import '../App.css';

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // --- AI CONCIERGE STATE ---
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- MOCK AI LOGIC (To be replaced with real backend LLM call) ---
  const handleAICuration = (e) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setIsThinking(true);
    setAiResult(null);

    // Simulate backend API call delay
    setTimeout(() => {
      const promptLower = userPrompt.toLowerCase();
      
      let match = {
        title: "Bespoke Custom Journey",
        rationale: "Based on your highly specific needs, the best approach is to build a custom itinerary from scratch. I'll forward your preferences to our trip builder.",
        link: "/custom-tour",
        cta: "Open Trip Builder"
      };

      if (promptLower.includes('rafting') || promptLower.includes('extreme') || promptLower.includes('adrenaline')) {
        match = {
          title: "Himalayan Adventure Sports",
          rationale: "Since you're looking for high-octane thrills, I've bypassed our standard tours and matched you with our Adventure Sports catalog. White-water rafting and paragliding fit your criteria perfectly.",
          link: "/packages",
          cta: "View Adventure Expeditions"
        };
      } else if (promptLower.includes('relax') || promptLower.includes('culture') || promptLower.includes('temple')) {
        match = {
          title: "Cultural Heritage Circuits",
          rationale: "You mentioned wanting a relaxed pace focused on culture. I've curated a selection of our guided temple circuits and sacred monastery stays that completely avoid strenuous trekking.",
          link: "/packages",
          cta: "View Cultural Tours"
        };
      } else if (promptLower.includes('everest') || promptLower.includes('annapurna') || promptLower.includes('trek')) {
        match = {
          title: "High-Altitude Treks",
          rationale: "You're looking for the classic Himalayan experience. I've filtered our catalog to highlight our signature base camp treks that align with your timeline.",
          link: "/packages",
          cta: "View Trekking Packages"
        };
      }

      setAiResult(match);
      setIsThinking(false);
    }, 2500); // 2.5s simulated thinking time
  };

  const closeAIModal = () => {
    setIsAIModalOpen(false);
    setTimeout(() => {
      setUserPrompt('');
      setAiResult(null);
      setIsThinking(false);
    }, 300);
  };

  return (
    <div className="app-wrapper">

      <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
        </div>
        <div className="navbar-links">
          <Link to="/" className="active-link">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/custom-tour">Build My Trip</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
      </nav>

      <section className="hero-section" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-eyebrow" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Himalayan Journeys Since 2010
          </span>
          <h1 style={{ fontWeight: '700', letterSpacing: '-1px' }}>Samye Travels</h1>
          <p style={{ fontSize: '1.2rem', fontWeight: '300', maxWidth: '600px', margin: '0 auto 32px' }}>
            Expertly crafted Himalayan expeditions, cultural tours, and bespoke adventure sports across Nepal, Tibet, and India.
          </p>
          <div className="hero-cta-group">
            <Link to="/packages" className="hero-btn-primary">Explore Packages</Link>
            <Link to="/custom-tour" className="hero-btn-secondary">Design Your Itinerary</Link>
          </div>
        </div>
      </section>

      <div className="stats-strip" style={{ borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Expeditions Completed</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">15+</span>
          <span className="stat-label">Years of Expertise</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">98%</span>
          <span className="stat-label">Client Satisfaction</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">3</span>
          <span className="stat-label">Operating Regions</span>
        </div>
      </div>

      {/* ── THE AI CONCIERGE CTA BANNER ── */}
      <div style={{ backgroundColor: '#0f172a', padding: '32px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Bot size={32} color="#eeddaa" />
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '500' }}>Tell us your dream journey.</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem', maxWidth: '500px' }}>
            Skip the browsing. Describe your ideal timeline, pace, and companions, and our AI Concierge will curate the perfect package instantly.
          </p>
          <button 
            onClick={() => setIsAIModalOpen(true)}
            style={{ marginTop: '8px', padding: '12px 28px', backgroundColor: '#1a5c9e', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s', boxShadow: '0 4px 14px rgba(26, 92, 158, 0.39)' }}
          >
            <Sparkles size={18} /> Ask AI Concierge
          </button>
        </div>
      </div>

      <div className="journey-selector-section" style={{ backgroundColor: '#f8fafc' }}>
        <div className="section-header" style={{ marginBottom: '48px' }}>
          <h2 className="section-title" style={{ color: '#0f172a' }}>Our Curated Packages</h2>
          <p className="section-subtitle" style={{ color: '#64748b' }}>
            Choose from our specialized itineraries or build a custom journey.
          </p>
        </div>

        <div className="journey-cards-grid three-col">
          <Link to="/packages" className="journey-card" style={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', overflow: 'hidden' }}>
            <div className="journey-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80')" }}></div>
            <div className="journey-card-overlay"></div>
            <div className="journey-card-content">
              <span className="journey-card-eyebrow">Cultural Heritage</span>
              <h3 className="journey-card-title">Tour Packages</h3>
              <p className="journey-card-desc">Guided treks to Everest Base Camp, sacred monastery stays in Tibet, and temple circuits across India.</p>
              <div className="journey-card-cta">View Itineraries <ArrowRight size={16} className="journey-card-arrow" /></div>
              <div className="journey-card-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Nepal · Tibet · India</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> 5–21 Days</span>
              </div>
            </div>
          </Link>

          <Link to="/packages" className="journey-card" style={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', overflow: 'hidden' }}>
            <div className="journey-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80')" }}></div>
            <div className="journey-card-overlay"></div>
            <div className="journey-card-content">
              <span className="journey-card-eyebrow">High Altitude</span>
              <h3 className="journey-card-title">Adventure Sports</h3>
              <p className="journey-card-desc">White-water rafting, paragliding over Pokhara, bungee jumps, zip-lines, and Himalayan climbing.</p>
              <div className="journey-card-cta">View Activities <ArrowRight size={16} className="journey-card-arrow" /></div>
              <div className="journey-card-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Compass size={14} /> Nepal · India</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Half-day – 3 Days</span>
              </div>
            </div>
          </Link>

          <Link to="/custom-tour" className="journey-card journey-card-custom" style={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', overflow: 'hidden' }}>
            <div className="journey-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')" }}></div>
            <div className="journey-card-overlay"></div>
            <div className="journey-card-content">
              <span className="journey-card-eyebrow">Bespoke</span>
              <h3 className="journey-card-title">Tailored Itineraries</h3>
              <p className="journey-card-desc">Combine tours and adventure sports into a personalized itinerary with instant feasibility reporting.</p>
              <div className="journey-card-cta">Start Builder <ArrowRight size={16} className="journey-card-arrow" /></div>
              <div className="journey-card-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Map size={14} /> Fully Customisable</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={14} /> Dynamic Pricing</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="why-us-strip" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="why-us-inner">
          <div className="why-us-item">
            <span className="why-us-icon" style={{ color: '#1a5c9e' }}><Navigation size={28} strokeWidth={1.5} /></span>
            <div>
              <strong style={{ color: '#0f172a' }}>Expert Local Guides</strong>
              <p style={{ color: '#64748b' }}>Every guide is a mountain native with 10+ years on the trail.</p>
            </div>
          </div>
          <div className="why-us-item">
            <span className="why-us-icon" style={{ color: '#1a5c9e' }}><Shield size={28} strokeWidth={1.5} /></span>
            <div>
              <strong style={{ color: '#0f172a' }}>Safety Protocols</strong>
              <p style={{ color: '#64748b' }}>Certified safety equipment and strict evacuation procedures.</p>
            </div>
          </div>
          <div className="why-us-item">
            <span className="why-us-icon" style={{ color: '#1a5c9e' }}><Plane size={28} strokeWidth={1.5} /></span>
            <div>
              <strong style={{ color: '#0f172a' }}>End-to-End Logistics</strong>
              <p style={{ color: '#64748b' }}>Permits, domestic transport, and premium accommodation handled.</p>
            </div>
          </div>
          <div className="why-us-item">
            <span className="why-us-icon" style={{ color: '#1a5c9e' }}><Leaf size={28} strokeWidth={1.5} /></span>
            <div>
              <strong style={{ color: '#0f172a' }}>Sustainable Travel</strong>
              <p style={{ color: '#64748b' }}>Strict leave-no-trace ethics supporting local mountain economies.</p>
            </div>
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
            <Link to="/packages">Packages</Link>
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

      {/* ── THE AI CONCIERGE MODAL ── */}
      {isAIModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', fontWeight: '600', fontSize: '1.1rem' }}>
                <Bot size={22} color="#1a5c9e" /> AI Concierge
              </div>
              <button onClick={closeAIModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>
                <X size={24} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '32px 24px', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
              
              {!aiResult && !isThinking && (
                <form onSubmit={handleAICuration} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: '1.4rem', color: '#0f172a' }}>Describe your ideal trip</h3>
                  <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
                    Be as specific or vague as you like. Mention your companions, preferred pace, dates, or specific destinations like Everest or Pokhara.
                  </p>
                  
                  <textarea 
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="e.g., I have 10 days in November. I'm traveling with my wife and we want a mix of culture and light trekking, but nothing too extreme..."
                    style={{ flex: 1, minHeight: '150px', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1.05rem', fontFamily: 'inherit', resize: 'none', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => e.target.style.borderColor = '#1a5c9e'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    autoFocus
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button 
                      type="submit"
                      disabled={!userPrompt.trim()}
                      style={{ padding: '14px 28px', backgroundColor: userPrompt.trim() ? '#1a5c9e' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: userPrompt.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                    >
                      Curate My Journey <Send size={18} />
                    </button>
                  </div>
                </form>
              )}

              {isThinking && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', padding: '40px 0' }}>
                  <Sparkles size={48} color="#1a5c9e" style={{ animation: 'pulse 1.5s infinite ease-in-out' }} />
                  <h3 style={{ marginTop: '24px', color: '#0f172a', fontSize: '1.25rem' }}>Curating your perfect itinerary...</h3>
                  <p style={{ color: '#64748b' }}>Analyzing database for best matches</p>
                </div>
              )}

              {aiResult && !isThinking && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, animation: 'fadeIn 0.5s ease-out' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '12px' }}>
                      <Sparkles size={24} color="#0284c7" />
                    </div>
                    <div>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', color: '#64748b' }}>AI Recommendation</span>
                      <h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', color: '#0f172a' }}>{aiResult.title}</h3>
                    </div>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
                    <p style={{ margin: 0, color: '#334155', lineHeight: '1.6', fontSize: '1.05rem' }}>
                      "{aiResult.rationale}"
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => { setAiResult(null); setUserPrompt(''); }}
                      style={{ padding: '14px 24px', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', flex: 1, transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      Try Another Prompt
                    </button>
                    <button 
                      onClick={() => { closeAIModal(); navigate(aiResult.link); }}
                      style={{ padding: '14px 24px', backgroundColor: '#1a5c9e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                    >
                      {aiResult.cta} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Quick inline keyframes for the thinking animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}

export default Home;