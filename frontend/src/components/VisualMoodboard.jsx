import { Link } from 'react-router-dom';

// THEME TOKENS
const NAVY   = '#050b16';
const LAPIS  = '#1a5c9e';
const GOLD   = '#d4af37';
const STONE  = '#fafaf9';
const BORDER = '#e5e7eb';

const TYPE_TAG = {
  tour:      { bg: 'rgba(26,92,158,0.82)',  color: '#fff' },
  adventure: { bg: 'rgba(230,57,70,0.82)',  color: '#fff' },
};

// MOOD CARD COMPONENT
function MoodCard({ item, onRemove }) {
  const imgSrc  = item.cardImage || item.featuredImage || item.heroImage || '';
  const detailsPath = item.type === 'tour'
    ? `/tours/${item._id}`
    : `/adventures/${item._id}`;

  return (
    <div style={{
      position: 'relative',
      borderRadius: '6px',
      overflow: 'hidden',
      aspectRatio: '3/2',
      background: '#1a1a2e',
      flexShrink: 0,
    }}>
      {imgSrc
        ? <img
            src={imgSrc}
            alt={item.title}
            loading="lazy"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
        : <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', color: 'rgba(255,255,255,0.2)',
          }}>
            🏔️
          </div>
      }
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(5,11,22,0.92) 0%, rgba(5,11,22,0.4) 50%, rgba(5,11,22,0.1) 100%)',
        pointerEvents: 'none',
      }} />
      <span style={{
        position: 'absolute', top: '10px', left: '10px',
        padding: '3px 9px',
        background: TYPE_TAG[item.type]?.bg || 'rgba(0,0,0,0.7)',
        color: TYPE_TAG[item.type]?.color || '#fff',
        fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.1em',
        textTransform: 'uppercase', borderRadius: '2px',
        fontFamily: "'Inter', sans-serif",
      }}>
        {item.type === 'adventure' ? (item.sportType || 'Adventure') : 'Tour'}
      </span>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 14px 12px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: '8px',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{
            margin: '0 0 3px',
            fontSize: '0.88rem', fontWeight: '700',
            color: '#fff', fontFamily: "'Playfair Display', serif",
            lineHeight: 1.25,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {item.title}
          </h4>
          <span style={{
            fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)',
            fontFamily: "'Inter', sans-serif",
          }}>
            {item.duration ? item.duration : ''}
            {(item.destination || item.location)
              ? ` · ${item.destination || item.location}`
              : ''}
          </span>
        </div>
        <Link
          to={detailsPath}
          target="_blank"
          rel="noopener noreferrer"
          title="View full details"
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '5px 10px',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '3px',
            color: '#fff',
            fontSize: '0.66rem', fontWeight: '600', letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Details
        </Link>
      </div>
      <button
        onClick={() => onRemove(item.uid)}
        title="Remove from trip"
        style={{
          position: 'absolute', top: '8px', right: '8px',
          width: '24px', height: '24px',
          background: 'rgba(5,11,22,0.7)', backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%',
          color: '#fff', fontSize: '0.62rem', fontWeight: '700',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,57,70,0.85)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(5,11,22,0.7)'; }}
      >
        ✕
      </button>
    </div>
  );
}

// ── Main moodboard component ──────────────────────────────────────────────────
function VisualMoodboard({ selectedTours, totalTripDays, onRequestItinerary, onRemove }) {
  const hasItems = (selectedTours?.length ?? 0) > 0;

  return (
    <div style={{
      position: 'sticky',
      top: '100px',
      display: 'flex',
      flexDirection: 'column',
      background: NAVY,
      borderRadius: '6px',
      overflow: 'hidden',
      maxHeight: 'calc(100vh - 120px)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '20px 22px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <span style={{
              display: 'block',
              fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: GOLD, marginBottom: '5px',
              fontFamily: "'Inter', sans-serif",
            }}>
              Expedition Blueprint
            </span>
            <h3 style={{
              margin: 0, fontSize: '1.05rem', fontWeight: '700',
              fontFamily: "'Playfair Display', serif", color: '#fff',
              lineHeight: 1.2,
            }}>
              {hasItems
                ? `${selectedTours.length} Package${selectedTours.length > 1 ? 's' : ''} Selected`
                : 'Your Moodboard'}
            </h3>
          </div>

          {/* Total Days chip */}
          {hasItems && (
            <div style={{
              textAlign: 'center',
              padding: '8px 14px',
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '4px',
              flexShrink: 0,
            }}>
              <span style={{
                display: 'block', fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif", marginBottom: '1px',
              }}>
                Total Days
              </span>
              <strong style={{
                fontSize: '1.55rem', color: GOLD,
                fontFamily: "'Playfair Display', serif", lineHeight: 1,
              }}>
                ~{totalTripDays}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable journey spine ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: hasItems ? '0' : '40px 24px',
      }}>
        {!hasItems ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>🗺️</div>
            <p style={{
              fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif", margin: 0,
            }}>
              Add tours and adventures from the left to begin building your expedition.
            </p>
          </div>
        ) : (
          /* Journey spine — dashed vertical line connecting cards */
          <div style={{ position: 'relative', padding: '16px 18px 8px 46px' }}>

            {/* Dashed spine line */}
            <div style={{
              position: 'absolute',
              top: '28px', bottom: '28px', left: '22px',
              width: '1px',
              borderLeft: `1.5px dashed rgba(212,175,55,0.3)`,
              zIndex: 0,
            }} />

            {selectedTours?.map((item, idx) => (
              <div key={item.uid} style={{ position: 'relative', marginBottom: idx < selectedTours.length - 1 ? '20px' : '0' }}>
                {/* Spine dot */}
                <div style={{
                  position: 'absolute',
                  left: '-30px', top: '14px',
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  background: item.type === 'adventure' ? '#e63946' : GOLD,
                  border: `2px solid ${NAVY}`,
                  boxShadow: `0 0 0 2px ${item.type === 'adventure' ? 'rgba(230,57,70,0.3)' : 'rgba(212,175,55,0.3)'}`,
                  zIndex: 1,
                  flexShrink: 0,
                }} />

                <MoodCard item={item} onRemove={onRemove} />
              </div>
            ))}

            <p style={{
              margin: '12px 0 4px',
              fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)',
              fontFamily: "'Inter', sans-serif", textAlign: 'center', lineHeight: 1.5,
            }}>
              Hover to explore · ✕ to remove · Details opens in new tab
            </p>
          </div>
        )}
      </div>

      {/* ── Sticky footer CTA ── */}
      <div style={{
        padding: '14px 18px 16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        flexShrink: 0,
      }}>
        {hasItems ? (
          <>
            <button
              id="moodboard-cta-btn"
              onClick={onRequestItinerary}
              style={{
                width: '100%',
                padding: '13px 20px',
                background: GOLD,
                color: NAVY,
                border: 'none',
                borderRadius: '4px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: '800',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Request Custom Itinerary
            </button>
            <p style={{
              margin: '9px 0 0', textAlign: 'center',
              fontSize: '0.66rem', color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Inter', sans-serif", lineHeight: 1.4,
            }}>
              Our experts respond within 24 hours.
            </p>
          </>
        ) : (
          <p style={{
            margin: 0, textAlign: 'center',
            fontSize: '0.76rem', color: 'rgba(255,255,255,0.25)',
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
