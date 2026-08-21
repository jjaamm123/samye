import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* ── Brand Column ── */}
        <div className="footer-brand">
          <span className="footer-logo">Samye Travels</span>
          <p>
            Crafting extraordinary journeys across Nepal, Tibet, and India since 2010.
            Your adventure, tailored perfectly to you.
          </p>
        </div>

        {/* ── Navigation Links ── */}
        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/custom-tour">Build My Trip</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* ── Contact Info ── */}
        <div className="footer-contact">
          <h4>Get in Touch</h4>
          <p>📧 info@samyetravels.com</p>
          <p>📞 +977 98XXXXXXXX</p>
          <p>📍 Thamel, Kathmandu, Nepal</p>
          <p style={{ marginTop: '16px', fontSize: '0.85rem' }}>
            <a
              href="https://wa.me/9779800000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#d4af37', textDecoration: 'none' }}
            >
              💬 WhatsApp Us
            </a>
          </p>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        © {currentYear} Samye Travels. All rights reserved.&nbsp;|&nbsp;Crafted with ♥ in Nepal
      </div>
    </footer>
  );
}
