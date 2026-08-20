import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css'; // Relies on existing .top-navbar classes, with some custom mega-menu styles inline

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMegaMenuOpen(false);
  }, [location.pathname, location.search]);

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  const themes = ['Adventure & Active', 'Nature & Discovery', 'Culture & Lifestyle', 'Leisure & Scenic'];
  const subThemes = ['Walking and Hiking Vacations', 'Adventure Vacations', 'Wildlife Vacations', 'Leisure Vacations', 'Cultural Vacations', 'Foodie Vacations'];
  const travelStyles = ['Family', 'Group', 'Solo', 'Couples', 'Honeymoon', 'Anniversary', 'Tailor-Made'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const locations = ['Nepal', 'Tibet', 'India'];

  return (
    <nav className={`top-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Samye Travels</Link>
      </div>
      
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/about" className={isActive('/about')}>About Us</Link>

        {/* Mega Menu Trigger */}
        <div 
          className="nav-dropdown-wrapper"
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
          style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 10px' }}
        >
          <Link to="/packages" className={isActive('/packages')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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

      <Link to="/contact" className="navbar-enquire-btn">Enquire Now</Link>
    </nav>
  );
}
