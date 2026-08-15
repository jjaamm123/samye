// src/components/VisualMoodboard.jsx
// Right-panel Expedition Moodboard.
// Displays a visual card grid of the user's selected tours/adventures and a sticky CTA.
import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';
import { getPriceAmount, getPriceDisplayType } from '../utils/priceHelpers';

// ── Palette ──────────────────────────────────────────────────────────────────
const NAVY  = '#050b16';
const LAPIS = '#1a5c9e';
const GOLD  = '#d4af37';
const STONE = '#fafaf9';
const BORDER = '#e5e7eb';

// ── TYPE ACCENT COLOURS ──────────────────────────────────────────────────────
const TYPE_TAG = {
  tour:      { bg: 'rgba(26,92,158,0.1)', color: LAPIS },
  adventure: { bg: 'rgba(230,57,70,0.1)', color: '#e63946' },
};

// ── Individual moodboard card ─────────────────────────────────────────────────
function MoodCard({ item, onRemove, formatPrice }) {
  const imgSrc = item.cardImage || item.heroImage || item.featuredImage || '';
  const dt     = getPriceDisplayType(item.price);
  const amt    = getPriceAmount(item.price);

  const priceLabel = (() => {
    if (dt === 'por')          return 'Price on Request';
    if (dt === 'starting_from') return `From ${formatPrice(amt)}`;
    return `${formatPrice(amt)} / person`;
  })();

  return (
    <div style={{
      position: 'relative',
      border: `1px solid ${BORDER}`,
      borderRadius: '4px',
      background: '#fff',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#f1f5f9' }}>
        {imgSrc
          ? <img
              src={imgSrc}
              alt={item.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#94a3b8', fontSize: '2rem' }}>
              🏔️
            </div>
        }
        {/* Type badge */}
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          padding: '3px 9px',
          background: TYPE_TAG[item.type]?.bg || 'rgba(0,0,0,0.15)',
          color: TYPE_TAG[item.type]?.color || '#fff',
          fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.08em',
          textTransform: 'uppercase', borderRadius: '2px',
          fontFamily: "'Inter', sans-serif",
          backdropFilter: 'blur(4px)',
        }}>
          {item.type === 'adventure' ? (item.sportType || 'Adventure') : 'Tour'}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h4 style={{
          margin: 0, fontSize: '0.9rem', fontWeight: '700',
          color: NAVY, fontFamily: "'Playfair Display', serif",
          lineHeight: 1.3,
        }}>
          {item.title}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748b', fontFamily: "'Inter', sans-serif" }}>
            {item.duration} {item.type === 'tour' ? 'days' : ''}
            {item.destination || item.location
              ? ` · ${item.destination || item.location}`
              : ''}
          </span>
          <span style={{
            fontSize: '0.74rem', fontWeight: '600',
            color: dt === 'por' ? '#64748b' : LAPIS,
            fontStyle: dt === 'por' ? 'italic' : 'normal',
            fontFamily: "'Inter', sans-serif",
          }}>
            {priceLabel}
          </span>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item.uid)}
        title="Remove from trip"
        style={{
          position: 'absolute', top: '8px', right: '8px',
          width: '26px', height: '26px',
          background: 'rgba(5,11,22,0.65)', backdropFilter: 'blur(4px)',
          border: 'none', borderRadius: '50%',
          color: '#fff', fontSize: '0.7rem', fontWeight: '700',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1, transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,57,70,0.85)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(5,11,22,0.65)'; }}
      >
        ✕
      </button>
    </div>
  );
}

// ── Main moodboard component ──────────────────────────────────────────────────
function VisualMoodboard({ selectedTours, totalTripDays, onRequestItinerary, onRemove }) {
  const { formatPrice } = useContext(CurrencyContext);
  const hasItems = selectedTours?.length > 0;

  return (
    <div style={{
      position: 'sticky',
      top: '100px',
      display: 'flex',
      flexDirection: 'column',
      background: STONE,
      border: `1px solid ${BORDER}`,
      borderRadius: '4px',
      overflow: 'hidden',
      maxHeight: 'calc(100vh - 120px)',
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: `1px solid ${BORDER}`,
        background: NAVY,
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <span style={{
              display: 'block',
              fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: GOLD, marginBottom: '4px',
              fontFamily: "'Inter', sans-serif",
            }}>
              Expedition Blueprint
            </span>
            <h3 style={{
              margin: 0, fontSize: '1.1rem', fontWeight: '700',
              fontFamily: "'Playfair Display', serif", color: '#fff',
            }}>
              {hasItems ? `${selectedTours.length} Package${selectedTours.length > 1 ? 's' : ''} Selected` : 'Your Moodboard'}
            </h3>
          </div>
          {hasItems && (
            <div style={{
              textAlign: 'right',
              padding: '8px 14px',
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: '4px',
              flexShrink: 0,
            }}>
              <span style={{ display: 'block', fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                Total Days
              </span>
              <strong style={{ fontSize: '1.5rem', color: GOLD, fontFamily: "'Playfair Display', serif",
                lineHeight: 1.1 }}>
                {totalTripDays}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable card grid ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: hasItems ? '16px' : '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {!hasItems ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>🗺️</div>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif", margin: 0 }}>
              Add tours and adventures from the left panel to begin building your expedition.
            </p>
          </div>
        ) : (
          <>
            {/* Masonry-style 2-column grid for 3+ items, single column otherwise */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: selectedTours.length >= 3 ? '1fr 1fr' : '1fr',
              gap: '12px',
            }}>
              {selectedTours?.map(item => (
                <MoodCard
                  key={item.uid}
                  item={item}
                  onRemove={onRemove}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            {/* Moodboard caption */}
            <p style={{
              margin: '4px 0 0',
              fontSize: '0.72rem', color: '#94a3b8',
              fontFamily: "'Inter', sans-serif", textAlign: 'center', lineHeight: 1.5,
            }}>
              Hover to explore · Click ✕ to remove
            </p>
          </>
        )}
      </div>

      {/* ── Sticky footer CTA ── */}
      <div style={{
        padding: '16px 20px',
        borderTop: `1px solid ${BORDER}`,
        background: '#fff',
      }}>
        {hasItems ? (
          <>
            <button
              id="moodboard-cta-btn"
              onClick={onRequestItinerary}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: NAVY,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.82rem',
                fontWeight: '700',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = LAPIS; }}
              onMouseLeave={e => { e.currentTarget.style.background = NAVY; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Request Custom Itinerary
            </button>
            <p style={{
              margin: '10px 0 0', textAlign: 'center',
              fontSize: '0.7rem', color: '#94a3b8',
              fontFamily: "'Inter', sans-serif", lineHeight: 1.4,
            }}>
              Our experts respond within 24 hours with a personalised proposal.
            </p>
          </>
        ) : (
          <p style={{
            margin: 0, textAlign: 'center',
            fontSize: '0.78rem', color: '#94a3b8',
            fontFamily: "'Inter', sans-serif",
          }}>
            Select packages to unlock your custom itinerary request.
          </p>
        )}
      </div>
    </div>
  );
}

export default VisualMoodboard;
