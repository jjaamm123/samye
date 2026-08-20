import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css'; // Relies on existing .top-navbar classes, with some custom mega-menu styles inline

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const isActive = (path) => {
    const base = `text-sm font-medium transition-colors hover:text-white ${isScrolled ? 'text-white' : 'text-gray-200'}`;
    const active = location.pathname === path ? ' active-link border-b-2 border-[#9c826b]' : '';
    return base + active;
  };

  const themes = ['Adventure & Active', 'Nature & Discovery', 'Culture & Lifestyle', 'Leisure & Scenic'];
  const subThemes = ['Walking and Hiking Vacations', 'Adventure Vacations', 'Wildlife Vacations', 'Leisure Vacations', 'Cultural Vacations', 'Foodie Vacations'];
  const travelStyles = ['Family', 'Group', 'Solo', 'Couples', 'Honeymoon', 'Anniversary', 'Tailor-Made'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const locations = ['Nepal', 'Tibet', 'India'];

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 flex items-center justify-between px-4 md:px-8 ${isScrolled ? 'bg-[#0a0f16] shadow-md py-3' : 'bg-transparent py-5'} ${isScrolled ? 'text-white' : 'text-gray-200'}`}>
      <div className="navbar-brand">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
      </div>
      
      {/* Desktop Navigation */}
      <div className="navbar-links hidden md:flex md:items-center md:gap-8 relative">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/about" className={isActive('/about')}>About Us</Link>

        {/* Mega Menu Trigger */}
        <div 
          className="nav-dropdown-wrapper h-full flex items-center px-2"
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          <Link to="/packages" className={`${isActive('/packages')} flex items-center gap-1`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Packages
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isMegaMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Link>

          {/* Mega Menu Content */}
          {isMegaMenuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
                gap: '32px',
                zIndex: 1000,
                cursor: 'default',
                color: '#0f172a'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '16px', fontWeight: '600' }}>Theme</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {themes.map(t => (
                    <Link key={t} to={`/packages?experienceTheme=${encodeURIComponent(t)}`} style={{ fontSize: '0.95rem', color: '#334155', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#1a5c9e'} onMouseLeave={e => e.target.style.color = '#334155'}>{t}</Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '16px', fontWeight: '600' }}>Sub-Theme</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {subThemes.map(t => (
                    <Link key={t} to={`/packages?subTheme=${encodeURIComponent(t)}`} style={{ fontSize: '0.95rem', color: '#334155', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#1a5c9e'} onMouseLeave={e => e.target.style.color = '#334155'}>{t}</Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '16px', fontWeight: '600' }}>Style & Season</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {travelStyles.slice(0, 4).map(t => (
                    <Link key={t} to={`/packages?travelStyle=${encodeURIComponent(t)}`} style={{ fontSize: '0.95rem', color: '#334155', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#1a5c9e'} onMouseLeave={e => e.target.style.color = '#334155'}>{t}</Link>
                  ))}
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  {seasons.map(s => (
                    <Link key={s} to={`/packages?season=${encodeURIComponent(s)}`} style={{ fontSize: '0.95rem', color: '#334155', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#1a5c9e'} onMouseLeave={e => e.target.style.color = '#334155'}>{s}</Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '16px', fontWeight: '600' }}>Destinations</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {locations.map(t => (
                    <Link key={t} to={`/packages?destination=${encodeURIComponent(t)}`} style={{ fontSize: '0.95rem', color: '#334155', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#1a5c9e'} onMouseLeave={e => e.target.style.color = '#334155'}>{t}</Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Link to="/custom-tour" className={isActive('/custom-tour')}>Build My Trip</Link>
        <Link to="/gallery" className={isActive('/gallery')}>Gallery</Link>
        <Link to="/contact" className={isActive('/contact')}>Contact</Link>
      </div>

      <Link to="/contact" className="hidden md:block bg-[#9c826b] hover:bg-[#856d57] text-white px-6 py-2.5 rounded-md font-medium transition-colors">Enquire Now</Link>

      {/* Mobile Hamburger Icon */}
      <button 
        className="block md:hidden hover:text-white transition-colors focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f16] shadow-lg absolute top-full left-0 w-full z-40 border-t border-gray-800 text-white">
          <div className="flex flex-col gap-6 p-6">
            <Link to="/" className={isActive('/')} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className={isActive('/about')} onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/packages" className={isActive('/packages')} onClick={() => setIsMobileMenuOpen(false)}>Packages</Link>
            <Link to="/custom-tour" className={isActive('/custom-tour')} onClick={() => setIsMobileMenuOpen(false)}>Build My Trip</Link>
            <Link to="/gallery" className={isActive('/gallery')} onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
            <Link to="/contact" className={isActive('/contact')} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link to="/contact" className="bg-[#9c826b] hover:bg-[#856d57] text-white text-center w-full block mt-2 px-6 py-3 rounded-md font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Enquire Now</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
