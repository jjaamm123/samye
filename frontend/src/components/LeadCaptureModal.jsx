// src/components/LeadCaptureModal.jsx
// Gated itinerary modal — captures visitor leads before revealing full itinerary details.
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function LeadCaptureModal({ tour, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [status, setStatus]     = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  // Auto-focus the first field when modal mounts
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e) =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/leads`, {
        name:      formData.name,
        email:     formData.email,
        whatsapp:  formData.whatsapp,
        tourId:    tour._id,
        tourTitle: tour.title,
      });
      setStatus('success');
    } catch (err) {
      console.error('Lead capture error:', err);
      setErrorMsg('Something went wrong. Please try again or contact us directly.');
      setStatus('error');
    }
  };

  // Simulate an itinerary "download" by opening a print-friendly tour URL
  const handleDownload = () => {
    window.open(`/tour/${tour._id}?print=1`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9999,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '20px',
        background:      'rgba(10, 15, 30, 0.82)',
        backdropFilter:  'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation:       'lcm-fadein 0.22s ease',
      }}
    >
      <style>{`
        @keyframes lcm-fadein  { from { opacity: 0; }               to { opacity: 1; } }
        @keyframes lcm-slidein { from { opacity: 0; transform: translateY(28px) scale(0.97); }
                                  to  { opacity: 1; transform: translateY(0)    scale(1);    } }
        @keyframes lcm-success { from { opacity: 0; transform: scale(0.85); }
                                  to  { opacity: 1; transform: scale(1);    } }
        .lcm-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.13);
          border-radius: 10px;
          color: #f1f5f9;
          font-size: 0.92rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .lcm-input::placeholder { color: rgba(255,255,255,0.35); }
        .lcm-input:focus {
          border-color: #eebb66;
          background: rgba(255,255,255,0.11);
        }
        .lcm-submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #c9932b 0%, #e8b84b 100%);
          color: #1a1208;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.15s;
        }
        .lcm-submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .lcm-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .lcm-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: linear-gradient(135deg, #c9932b 0%, #e8b84b 100%);
          color: #1a1208;
          border: none;
          border-radius: 10px;
          font-size: 0.98rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 8px;
        }
        .lcm-download-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .lcm-close-btn {
          position: absolute;
          top: 16px; right: 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.65);
          border-radius: 50%;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1rem;
          transition: background 0.2s, color 0.2s;
        }
        .lcm-close-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
      `}</style>

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lcm-title"
        style={{
          position:        'relative',
          background:      'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
          border:          '1px solid rgba(255,255,255,0.1)',
          borderRadius:    '18px',
          padding:         '44px 40px 36px',
          maxWidth:        '480px',
          width:           '100%',
          boxShadow:       '0 32px 80px rgba(0,0,0,0.6)',
          animation:       'lcm-slidein 0.3s cubic-bezier(0.22,1,0.36,1)',
          fontFamily:      "'Inter', 'Lato', sans-serif",
        }}
      >
        {/* Close button */}
        <button className="lcm-close-btn" onClick={onClose} aria-label="Close modal">✕</button>

        {/* ── SUCCESS STATE ── */}
        {status === 'success' ? (
          <div style={{ textAlign: 'center', animation: 'lcm-success 0.35s ease' }}>
            {/* Animated checkmark */}
            <div style={{
              width: '68px', height: '68px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(46,204,113,0.2), rgba(46,204,113,0.08))',
              border:     '2px solid rgba(46,204,113,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px' }}>
              You're all set!
            </h2>
            <p style={{ color: 'rgba(241,245,249,0.65)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Your details have been received. Click below to view and download
              the full itinerary for <strong style={{ color: '#e8b84b' }}>{tour.title}</strong>.
            </p>
            <button className="lcm-download-btn" onClick={handleDownload}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Itinerary PDF
            </button>
            <p style={{ marginTop: '16px', color: 'rgba(241,245,249,0.4)', fontSize: '0.78rem' }}>
              Our team will also reach out within 24 hours.
            </p>
          </div>
        ) : (
          /* ── FORM STATE ── */
          <>
            {/* Icon + headline */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(201,147,43,0.25), rgba(232,184,75,0.1))',
                border:     '1px solid rgba(201,147,43,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="#e8b84b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h2 id="lcm-title" style={{
                color: '#f1f5f9', fontSize: '1.3rem', fontWeight: '800',
                margin: '0 0 8px', lineHeight: 1.25,
              }}>
                Unlock the Full Itinerary
              </h2>
              <p style={{ color: 'rgba(241,245,249,0.55)', fontSize: '0.87rem', lineHeight: 1.6, margin: 0 }}>
                Enter your details to instantly download the complete day-by-day itinerary
                and pricing breakdown for{' '}
                <strong style={{ color: '#e8b84b', fontWeight: '600' }}>{tour.title}</strong>.
              </p>
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div style={{
                background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)',
                borderRadius: '8px', padding: '11px 14px', marginBottom: '16px',
                color: '#fb7185', fontSize: '0.85rem',
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Name */}
                <div>
                  <label htmlFor="lcm-name" style={{ display: 'block', color: 'rgba(241,245,249,0.6)', fontSize: '0.78rem', marginBottom: '5px', fontWeight: '500', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Full Name *
                  </label>
                  <input
                    id="lcm-name"
                    ref={firstInputRef}
                    className="lcm-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="lcm-email" style={{ display: 'block', color: 'rgba(241,245,249,0.6)', fontSize: '0.78rem', marginBottom: '5px', fontWeight: '500', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Email Address *
                  </label>
                  <input
                    id="lcm-email"
                    className="lcm-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="lcm-whatsapp" style={{ display: 'block', color: 'rgba(241,245,249,0.6)', fontSize: '0.78rem', marginBottom: '5px', fontWeight: '500', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    WhatsApp Number
                    <span style={{ color: 'rgba(241,245,249,0.35)', fontWeight: '400', marginLeft: '5px', textTransform: 'none' }}>(optional)</span>
                  </label>
                  <input
                    id="lcm-whatsapp"
                    className="lcm-input"
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="+977 98XXXXXXXX"
                    autoComplete="tel"
                  />
                </div>

                {/* Submit */}
                <button
                  id="lcm-submit-btn"
                  type="submit"
                  className="lcm-submit-btn"
                  disabled={status === 'loading'}
                  style={{ marginTop: '4px' }}
                >
                  {status === 'loading' ? 'Sending...' : '📄 Get My Free Itinerary'}
                </button>
              </div>
            </form>

            {/* Privacy note */}
            <p style={{ textAlign: 'center', marginTop: '14px', color: 'rgba(241,245,249,0.3)', fontSize: '0.75rem', lineHeight: 1.5 }}>
              🔒 We respect your privacy. No spam, ever.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LeadCaptureModal;
