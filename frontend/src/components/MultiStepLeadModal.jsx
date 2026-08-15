// src/components/MultiStepLeadModal.jsx
// Progressive Disclosure Lead Capture modal — 3 steps + success state.
//
// Step 1: Trip Goal (pill selector)
// Step 2: Logistics (dates + group size)
// Step 3: Contact (name, email, whatsapp) → POST /api/leads
// Success: confirmation + WhatsApp CTA
import { useState, useEffect } from 'react';
import axios from 'axios';

// ── Replace with your WhatsApp number (digits only, with country code) ────────
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '9779800000000';

// ── Palette (matches brand) ───────────────────────────────────────────────────
const NAVY  = '#050b16';
const LAPIS = '#1a5c9e';
const GOLD  = '#d4af37';
const BORDER = '#e5e7eb';
const STONE  = '#fafaf9';

// ── Goals configuration ───────────────────────────────────────────────────────
const GOALS = [
  { id: 'Trekking', label: 'Trekking', emoji: '🏔️', desc: 'High-altitude trails & summits' },
  { id: 'Culture',  label: 'Culture',  emoji: '🏯', desc: 'Monasteries, temples & heritage' },
  { id: 'Luxury',   label: 'Luxury',   emoji: '✨', desc: 'Premium lodges & curated comfort' },
  { id: 'Thrill',   label: 'Thrill',   emoji: '🪂', desc: 'Rafting, paragliding & adrenaline' },
];

// ── Reusable input style ──────────────────────────────────────────────────────
const INPUT_STYLE = {
  width: '100%',
  padding: '11px 14px',
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: '4px',
  fontSize: '0.9rem',
  fontFamily: "'Inter', sans-serif",
  color: NAVY,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

// ── Step indicator dots ───────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{
          width: i < current ? '20px' : '8px',
          height: '8px',
          borderRadius: '4px',
          background: i < current ? LAPIS : i === current - 1 ? LAPIS : '#d1d5db',
          transition: 'all 0.35s ease',
        }} />
      ))}
    </div>
  );
}

// ── SuccessState ──────────────────────────────────────────────────────────────
function SuccessState({ tripName, onClose }) {
  const waText = encodeURIComponent(
    `Hi Samye Travels! I just submitted my custom expedition enquiry (${tripName || 'my bespoke trip'}). I'd love to chat with your experts.`
  );

  return (
    <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
      {/* Animated check circle */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(46,204,113,0.18), rgba(46,204,113,0.07))',
        border: '2px solid rgba(46,204,113,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        animation: 'sc-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 style={{
        margin: '0 0 10px',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.4rem', fontWeight: '700', color: NAVY,
      }}>
        Blueprint Received.
      </h2>
      <p style={{
        margin: '0 0 28px',
        fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.65,
        fontFamily: "'Inter', sans-serif",
      }}>
        Your bespoke blueprint is in the hands of our experts. Expect a personalised proposal within 24 hours.
      </p>

      {/* WhatsApp CTA */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '13px 26px',
          background: '#25d366',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          textDecoration: 'none',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.87rem', fontWeight: '700',
          letterSpacing: '0.04em',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      >
        {/* WhatsApp SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Chat with our experts on WhatsApp now
      </a>

      <button
        onClick={onClose}
        style={{
          display: 'block', margin: '20px auto 0',
          background: 'none', border: 'none',
          color: '#9ca3af', fontSize: '0.8rem',
          cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          textDecoration: 'underline',
        }}
      >
        Close
      </button>
    </div>
  );
}

// ── MultiStepLeadModal ────────────────────────────────────────────────────────
function MultiStepLeadModal({ isOpen, onClose, selectedTours, tripName }) {
  const TOTAL_STEPS = 3;

  const [currentStep,  setCurrentStep]  = useState(1);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');

  const [formData, setFormData] = useState({
    tripGoal:        '',
    travelDates:     '',
    groupSize:       2,
    name:            '',
    email:           '',
    whatsapp:        '',
    selectedTourIds: [],
  });

  // Sync selectedTourIds whenever selectedTours changes
  useEffect(() => {
    setFormData(f => ({
      ...f,
      selectedTourIds: (selectedTours ?? []).map(t => t._id).filter(Boolean),
    }));
  }, [selectedTours]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setIsSuccess(false);
        setErrorMsg('');
        setFormData(f => ({ ...f, tripGoal: '', travelDates: '', groupSize: 2, name: '', email: '', whatsapp: '' }));
      }, 300);
    }
  }, [isOpen]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else        document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC key closes
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!isOpen) return null;

  const setField = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  // ── Step validation ──────────────────────────────────────────────────────────
  const canAdvance = (() => {
    if (currentStep === 1) return !!formData.tripGoal;
    if (currentStep === 2) return !!formData.travelDates && Number(formData.groupSize) >= 1;
    if (currentStep === 3) return !!formData.name && !!formData.email;
    return false;
  })();

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!canAdvance || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        name:            formData.name,
        email:           formData.email,
        whatsapp:        formData.whatsapp,
        tripGoal:        formData.tripGoal,
        travelDates:     formData.travelDates,
        groupSize:       Number(formData.groupSize),
        selectedTourIds: formData.selectedTourIds,
        // Primary tour for the Lead schema tourId/tourTitle fields
        tourId:          formData.selectedTourIds[0] ?? null,
        tourTitle:       (selectedTours ?? []).map(t => t.title).join(', '),
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/leads`, payload);
      setIsSuccess(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      setErrorMsg(
        err?.response?.data?.message ||
        'Something went wrong. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step content ─────────────────────────────────────────────────────────────
  const renderStep = () => {
    if (isSuccess) {
      return <SuccessState tripName={tripName} onClose={onClose} />;
    }

    if (currentStep === 1) {
      return (
        <div>
          <h2 style={{ margin: '0 0 6px', fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem', color: NAVY }}>
            What's the spirit of your journey?
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: '#64748b',
            fontFamily: "'Inter', sans-serif", lineHeight: 1.55 }}>
            Choose the experience that resonates most. This helps us tailor your proposal.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {GOALS.map(g => {
              const active = formData.tripGoal === g.id;
              return (
                <button
                  key={g.id}
                  id={`goal-${g.id.toLowerCase()}`}
                  onClick={() => setField('tripGoal', g.id)}
                  style={{
                    padding: '16px 14px',
                    background: active ? NAVY : '#fff',
                    border: `1.5px solid ${active ? NAVY : BORDER}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '8px' }}>
                    {g.emoji}
                  </span>
                  <span style={{
                    display: 'block', fontWeight: '700', fontSize: '0.9rem',
                    color: active ? '#fff' : NAVY,
                    fontFamily: "'Inter', sans-serif", marginBottom: '4px',
                  }}>
                    {g.label}
                  </span>
                  <span style={{
                    display: 'block', fontSize: '0.72rem',
                    color: active ? 'rgba(255,255,255,0.65)' : '#94a3b8',
                    fontFamily: "'Inter', sans-serif", lineHeight: 1.4,
                  }}>
                    {g.desc}
                  </span>
                  {active && (
                    <span style={{
                      position: 'absolute', top: '10px', right: '10px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: GOLD, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.6rem', color: NAVY, fontWeight: '900',
                    }}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div>
          <h2 style={{ margin: '0 0 6px', fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem', color: NAVY }}>
            Logistics
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: '#64748b',
            fontFamily: "'Inter', sans-serif", lineHeight: 1.55 }}>
            Help us understand your timeline and group so we can plan the perfect itinerary.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.75rem',
                fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#374151', fontFamily: "'Inter', sans-serif" }}>
                Preferred Travel Dates *
              </label>
              <input
                id="logistics-dates"
                type="text"
                placeholder="e.g. October 2026, or Oct 10 – Oct 24"
                value={formData.travelDates}
                onChange={e => setField('travelDates', e.target.value)}
                style={INPUT_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = LAPIS; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.75rem',
                fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#374151', fontFamily: "'Inter', sans-serif" }}>
                Group Size *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <button
                  id="logistics-size-dec"
                  onClick={() => setField('groupSize', Math.max(1, Number(formData.groupSize) - 1))}
                  style={{
                    width: '44px', height: '44px',
                    border: `1px solid ${BORDER}`, borderRight: 'none',
                    background: STONE, borderRadius: '4px 0 0 4px',
                    fontSize: '1.1rem', cursor: 'pointer', color: NAVY,
                    fontFamily: "'Inter', sans-serif", fontWeight: '700',
                  }}
                >−</button>
                <input
                  id="logistics-size-val"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.groupSize}
                  onChange={e => setField('groupSize', Math.max(1, Number(e.target.value)))}
                  style={{
                    ...INPUT_STYLE,
                    borderRadius: 0,
                    textAlign: 'center',
                    width: '80px',
                    fontWeight: '700',
                    padding: '11px 8px',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = LAPIS; }}
                  onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
                />
                <button
                  id="logistics-size-inc"
                  onClick={() => setField('groupSize', Number(formData.groupSize) + 1)}
                  style={{
                    width: '44px', height: '44px',
                    border: `1px solid ${BORDER}`, borderLeft: 'none',
                    background: STONE, borderRadius: '0 4px 4px 0',
                    fontSize: '1.1rem', cursor: 'pointer', color: NAVY,
                    fontFamily: "'Inter', sans-serif", fontWeight: '700',
                  }}
                >+</button>
                {Number(formData.groupSize) >= 4 && (
                  <span style={{ marginLeft: '12px', fontSize: '0.75rem', color: '#2ecc71',
                    fontWeight: '600', fontFamily: "'Inter', sans-serif" }}>
                    Group discount applies!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div>
          <h2 style={{ margin: '0 0 6px', fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem', color: NAVY }}>
            Almost there.
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: '#64748b',
            fontFamily: "'Inter', sans-serif", lineHeight: 1.55 }}>
            Leave your details and our expedition team will reach out with a bespoke proposal within 24 hours.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.75rem',
                fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#374151', fontFamily: "'Inter', sans-serif" }}>
                Full Name *
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="e.g. Alexandra Chen"
                value={formData.name}
                onChange={e => setField('name', e.target.value)}
                autoComplete="name"
                style={INPUT_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = LAPIS; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.75rem',
                fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#374151', fontFamily: "'Inter', sans-serif" }}>
                Email Address *
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => setField('email', e.target.value)}
                autoComplete="email"
                style={INPUT_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = LAPIS; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.75rem',
                fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#374151', fontFamily: "'Inter', sans-serif" }}>
                WhatsApp Number
                <span style={{ marginLeft: '6px', fontWeight: '400', textTransform: 'none',
                  color: '#9ca3af', letterSpacing: '0' }}>(optional)</span>
              </label>
              <input
                id="contact-whatsapp"
                type="tel"
                placeholder="+977 98XXXXXXXX"
                value={formData.whatsapp}
                onChange={e => setField('whatsapp', e.target.value)}
                autoComplete="tel"
                style={INPUT_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = LAPIS; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; }}
              />
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div style={{
                padding: '11px 14px', borderRadius: '4px',
                background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.25)',
                color: '#e63946', fontSize: '0.83rem', fontFamily: "'Inter', sans-serif",
              }}>
                {errorMsg}
              </div>
            )}

            {/* Selected trips summary */}
            {(selectedTours?.length ?? 0) > 0 && (
              <div style={{
                padding: '12px 14px',
                background: STONE, border: `1px solid ${BORDER}`,
                borderRadius: '4px', fontSize: '0.78rem',
                color: '#64748b', fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
              }}>
                <strong style={{ color: NAVY, display: 'block', marginBottom: '4px' }}>
                  Your selection ({selectedTours.length} packages):
                </strong>
                {selectedTours.map(t => `• ${t.title}`).join('\n').split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>{line}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // ── Navigation buttons ───────────────────────────────────────────────────────
  const renderNav = () => {
    if (isSuccess) return null;

    const isLast = currentStep === TOTAL_STEPS;

    return (
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '28px',
        justifyContent: currentStep === 1 ? 'flex-end' : 'space-between',
      }}>
        {/* Back button */}
        {currentStep > 1 && (
          <button
            id="modal-back-btn"
            onClick={() => { setCurrentStep(s => s - 1); setErrorMsg(''); }}
            style={{
              padding: '11px 24px',
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              borderRadius: '4px',
              color: '#374151',
              fontSize: '0.85rem', fontWeight: '600',
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#9ca3af'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; }}
          >
            ← Back
          </button>
        )}

        {/* Next / Submit */}
        {isLast ? (
          <button
            id="modal-submit-btn"
            onClick={handleSubmit}
            disabled={!canAdvance || isSubmitting}
            style={{
              padding: '11px 28px',
              background: canAdvance && !isSubmitting ? NAVY : '#d1d5db',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.06em',
              fontFamily: "'Inter', sans-serif",
              cursor: canAdvance && !isSubmitting ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
            onMouseEnter={e => { if (canAdvance && !isSubmitting) e.currentTarget.style.background = LAPIS; }}
            onMouseLeave={e => { if (canAdvance && !isSubmitting) e.currentTarget.style.background = NAVY; }}
          >
            {isSubmitting ? (
              <>
                {/* CSS Spinner */}
                <span style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
                Sending…
              </>
            ) : (
              'Submit Enquiry →'
            )}
          </button>
        ) : (
          <button
            id="modal-next-btn"
            onClick={() => { if (canAdvance) setCurrentStep(s => s + 1); }}
            disabled={!canAdvance}
            style={{
              padding: '11px 28px',
              background: canAdvance ? NAVY : '#d1d5db',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.06em',
              fontFamily: "'Inter', sans-serif",
              cursor: canAdvance ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { if (canAdvance) e.currentTarget.style.background = LAPIS; }}
            onMouseLeave={e => { if (canAdvance) e.currentTarget.style.background = NAVY; }}
          >
            Next →
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes sc-pop   { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes md-slide { from { opacity: 0; transform: translateY(22px) scale(0.98); }
                              to   { opacity: 1; transform: translateY(0)    scale(1);    } }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: 'fixed', inset: 0,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* ── Modal card ── */}
        <div
          style={{
            position: 'relative',
            background: '#fff',
            border: `1px solid ${BORDER}`,
            borderRadius: '4px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '92vh',
            overflowY: 'auto',
            animation: 'md-slide 0.32s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          {/* ── Top bar ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px 14px',
            borderBottom: `1px solid ${BORDER}`,
            position: 'sticky', top: 0,
            background: '#fff',
            zIndex: 1,
          }}>
            <StepDots current={isSuccess ? TOTAL_STEPS + 1 : currentStep} total={TOTAL_STEPS} />
            {!isSuccess && (
              <span style={{
                fontSize: '0.72rem', color: '#9ca3af',
                fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em',
              }}>
                Step {currentStep} of {TOTAL_STEPS}
              </span>
            )}
            <button
              id="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: '32px', height: '32px',
                background: STONE, border: `1px solid ${BORDER}`,
                borderRadius: '4px', cursor: 'pointer',
                color: '#64748b', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = STONE; }}
            >
              ✕
            </button>
          </div>

          {/* ── Step content ── */}
          <div style={{ padding: '28px 28px 8px', position: 'relative' }}>
            {renderStep()}
            {renderNav()}
          </div>

          {/* ── Bottom privacy note ── */}
          {!isSuccess && (
            <div style={{
              padding: '16px 28px 20px',
              textAlign: 'center',
              fontSize: '0.7rem', color: '#9ca3af',
              fontFamily: "'Inter', sans-serif", lineHeight: 1.5,
            }}>
              🔒 Your details are private and will never be shared.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MultiStepLeadModal;
