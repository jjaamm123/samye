// src/components/TourMap.jsx
// Pure SVG route map — zero external dependencies.
// Renders a numbered, clickable stop-chain from the tour's itinerary array.
// Each stop is a circle marker; hovering/clicking reveals a tooltip card.
import { useState, useRef, useEffect } from 'react';

// ── Palette (matching brand) ──────────────────────────────────────────────────
const LAPIS  = '#1a5c9e';
const GOLD   = '#d4af37';
const NAVY   = '#050b16';
const BEIGE  = '#f7f2e8';

// ── Compute evenly-spaced stop positions along a gentle S-curve path ──────────
function generateStops(count) {
  if (count === 0) return [];
  if (count === 1) return [{ x: 200, y: 120 }];

  const WIDTH  = 700;
  const HEIGHT = 200;
  const PAD    = 60;

  return Array.from({ length: count }, (_, i) => {
    const t  = count === 1 ? 0.5 : i / (count - 1);
    const x  = PAD + t * (WIDTH - PAD * 2);
    // Gentle sine wave for visual interest
    const y  = HEIGHT / 2 + Math.sin(t * Math.PI * 1.4) * (HEIGHT * 0.28);
    return { x, y };
  });
}

// ── Build SVG path string through all stop positions ─────────────────────────
function buildPath(stops) {
  if (stops.length < 2) return '';
  const pts = stops.map(s => `${s.x},${s.y}`).join(' L ');
  return `M ${pts}`;
}

function TourMap({ itinerary = [] }) {
  const [hoveredIdx, setHoveredIdx]   = useState(null);
  const [tooltip, setTooltip]         = useState({ x: 0, y: 0 });
  const [animated, setAnimated]       = useState(false);
  const pathRef                       = useRef(null);
  const svgRef                        = useRef(null);

  // Trigger path draw animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!itinerary?.length) {
    return (
      <div className="tm-empty">
        <span>Route map will appear once itinerary days are added.</span>
      </div>
    );
  }

  const stops    = generateStops(itinerary.length);
  const pathD    = buildPath(stops);

  // Measure path length for dash animation
  const pathLen  = pathRef.current?.getTotalLength?.() || 1000;

  const handleMouseEnter = (idx, stop) => {
    setHoveredIdx(idx);
    // Position tooltip: shift left if near right edge
    const svgRect = svgRef.current?.getBoundingClientRect();
    setTooltip({ x: stop.x, y: stop.y });
  };

  return (
    <div className="tm-root">
      {/* ── SVG Canvas ── */}
      <svg
        ref={svgRef}
        viewBox="0 0 700 200"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        className="tm-svg"
        aria-label="Tour route map"
        role="img"
      >
        {/* ── Faint grid lines (editorial texture) ── */}
        <defs>
          <pattern id="tm-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <line x1="50" y1="0" x2="50" y2="50" stroke="#e0d9cc" strokeWidth="0.5"/>
            <line x1="0" y1="50" x2="50" y2="50" stroke="#e0d9cc" strokeWidth="0.5"/>
          </pattern>
          {/* Animated dash clip */}
          <style>{`
            @keyframes tm-draw {
              from { stroke-dashoffset: ${pathLen}; }
              to   { stroke-dashoffset: 0; }
            }
            .tm-animated-path {
              stroke-dasharray: ${pathLen};
              stroke-dashoffset: ${animated ? 0 : pathLen};
              transition: stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}</style>
        </defs>

        <rect width="700" height="200" fill={BEIGE} rx="0"/>
        <rect width="700" height="200" fill="url(#tm-grid)" rx="0"/>

        {/* ── Route path (animated draw-in) ── */}
        {stops.length > 1 && (
          <>
            {/* Shadow path */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(26,92,158,0.12)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main path */}
            <path
              ref={pathRef}
              className="tm-animated-path"
              d={pathD}
              fill="none"
              stroke={LAPIS}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 4"
            />
          </>
        )}

        {/* ── Stop markers ── */}
        {stops.map((stop, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <g
              key={idx}
              className="tm-stop"
              onMouseEnter={() => handleMouseEnter(idx, stop)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setHoveredIdx(isHovered ? null : idx)}
              tabIndex={0}
              role="button"
              aria-label={`Stop ${idx + 1}: ${itinerary[idx]?.title || ''}`}
              onKeyDown={e => e.key === 'Enter' && setHoveredIdx(isHovered ? null : idx)}
            >
              {/* Pulse ring (only on hover) */}
              {isHovered && (
                <circle cx={stop.x} cy={stop.y} r="22"
                  fill="rgba(26,92,158,0.12)"
                  stroke="rgba(26,92,158,0.22)"
                  strokeWidth="1"
                />
              )}
              {/* Outer circle */}
              <circle
                cx={stop.x} cy={stop.y} r={isHovered ? 14 : 12}
                fill={isHovered ? LAPIS : '#ffffff'}
                stroke={LAPIS}
                strokeWidth="2"
                style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
              />
              {/* Stop number */}
              <text
                x={stop.x} y={stop.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight="700"
                fontFamily="'Inter', sans-serif"
                fill={isHovered ? '#ffffff' : LAPIS}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {idx + 1}
              </text>
              {/* Stop label below */}
              <text
                x={stop.x}
                y={stop.y + (isHovered ? 26 : 24)}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="'Inter', sans-serif"
                fontWeight="600"
                fill={NAVY}
                style={{ pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.5px' }}
              >
                {(itinerary[idx]?.title || '').slice(0, 16)}{(itinerary[idx]?.title?.length || 0) > 16 ? '…' : ''}
              </text>
            </g>
          );
        })}

        {/* ── Destination endpoint flag (last stop) ── */}
        {stops.length > 0 && (() => {
          const last = stops[stops.length - 1];
          return (
            <g style={{ pointerEvents: 'none' }}>
              <line x1={last.x} y1={last.y - 14} x2={last.x} y2={last.y - 36}
                stroke={GOLD} strokeWidth="1.5"/>
              <rect x={last.x} y={last.y - 46} width="28" height="10" rx="1"
                fill={GOLD}/>
              <text x={last.x + 14} y={last.y - 40} textAnchor="middle"
                dominantBaseline="central" fontSize="6" fontWeight="700"
                fill={NAVY} fontFamily="'Inter', sans-serif"
                style={{ userSelect: 'none' }}>
                END
              </text>
            </g>
          );
        })()}
      </svg>

      {/* ── Hover Tooltip Card (rendered outside SVG for styling freedom) ── */}
      {hoveredIdx !== null && itinerary[hoveredIdx] && (
        <div
          className="tm-tooltip"
          style={{
            // Position roughly below the hovered stop using % of container
            left: `${(stops[hoveredIdx]?.x / 700) * 100}%`,
          }}
        >
          <span className="tm-tooltip-day">Day {itinerary[hoveredIdx].day}</span>
          <strong className="tm-tooltip-title">{itinerary[hoveredIdx].title}</strong>
          {itinerary[hoveredIdx].description && (
            <p className="tm-tooltip-desc">
              {itinerary[hoveredIdx].description.slice(0, 90)}
              {itinerary[hoveredIdx].description.length > 90 ? '…' : ''}
            </p>
          )}
          <button
            className="tm-tooltip-link"
            onClick={() => {
              const el = document.getElementById('section-itinerary');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setHoveredIdx(null);
            }}
          >
            View in Itinerary →
          </button>
        </div>
      )}

      {/* ── Legend ── */}
      <div className="tm-legend">
        <span className="tm-legend-item">
          <span className="tm-legend-dot" />
          Route stop — hover to preview
        </span>
        <span className="tm-legend-item" style={{ color: '#999' }}>
          {itinerary.length} stops · {itinerary.length > 0 ? itinerary[itinerary.length - 1].day : 0} days
        </span>
      </div>
    </div>
  );
}

export default TourMap;
