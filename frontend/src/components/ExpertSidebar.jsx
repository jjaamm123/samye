// src/components/ExpertSidebar.jsx
// High-converting "Speak to an expert" sticky sidebar card.
// Used on both TourDetails and AdventureDetails pages.
import PriceDisplay, { getPriceDisplayType } from './PriceDisplay';

// ── WHATSAPP CONFIG — same as TourDetails ──────────────────────────────────
const WHATSAPP_NUMBER = 'YOUR_WHATSAPP_NUMBER'; // e.g. '9779800000000'

// Trust badge definitions
const TRUST_BADGES = [
  { icon: '★', value: '4.9 / 5', label: 'Guest Rating' },
  { icon: '✦', value: '500+',    label: 'Travellers' },
  { icon: '✔', value: 'TAAN',    label: 'Certified' },
];

function ExpertSidebar({ item, itemType = 'tour', onEnquireClick, formatPrice }) {
  // item = tour or adventure object
  const isPriceObject = item?.price && typeof item.price === 'object';
  const isPOR = isPriceObject && getPriceDisplayType(item.price) === 'por';

  const waMessage = encodeURIComponent(
    `Hi Samye Travels! I'd like to speak to an expert about the "${item?.title || 'tour'}" and discuss pricing and dates.`
  );

  return (
    <aside className="ed-sidebar">

      {/* ── Expert CTA Card ── */}
      <div className="ed-expert-card">

        {/* Avatar + headline */}
        <div className="ed-expert-header">
          <div className="ed-expert-avatar" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <p className="ed-expert-kicker">Your travel specialist</p>
            <p className="ed-expert-name">Samye Travels Team</p>
          </div>
        </div>

        {/* Price block */}
        <div className="ed-expert-price-block">
          {isPOR ? (
            <div>
              <span className="ed-price-label">Pricing</span>
              <div className="ed-price-value" style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#64748b' }}>
                Price on Request
              </div>
            </div>
          ) : isPriceObject ? (
            <div>
              <span className="ed-price-label">
                {getPriceDisplayType(item.price) === 'exact' ? 'Price' : 'From'}
              </span>
              <div className="ed-price-value">
                <PriceDisplay price={item.price} size="lg" />
                <span className="ed-price-per"> / person</span>
              </div>
            </div>
          ) : (
            <div>
              <span className="ed-price-label">From</span>
              <div className="ed-price-value">
                {formatPrice ? formatPrice(item?.price) : `$${item?.price ?? '—'}`}
                <span className="ed-price-per"> / person</span>
              </div>
            </div>
          )}
        </div>

        <div className="ed-expert-divider" />

        {/* Persuasive copy */}
        <p className="ed-expert-copy">
          Speak to an expert to personalise this {itemType} — dates, group size, extensions, and budget are all flexible.
        </p>

        {/* Primary CTA */}
        <button
          id="ed-enquire-btn"
          className="ed-enquire-btn"
          onClick={onEnquireClick}
        >
          Enquire Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ marginLeft: '8px' }}>
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>

        {/* WhatsApp CTA */}
        {isPOR ? (
          <a
            id="ed-whatsapp-btn"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-whatsapp-btn"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        ) : (
          <a
            id="ed-whatsapp-btn"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-whatsapp-btn"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        )}
      </div>

      {/* ── Trust Badges ── */}
      <div className="ed-trust-badges">
        {TRUST_BADGES.map((badge) => (
          <div key={badge.label} className="ed-trust-item">
            <span className="ed-trust-icon" aria-hidden="true">{badge.icon}</span>
            <span className="ed-trust-value">{badge.value}</span>
            <span className="ed-trust-label">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* ── Quick Facts ── */}
      {item && (
        <div className="ed-quick-facts">
          <h4 className="ed-quick-facts-title">At a Glance</h4>
          {itemType === 'tour' && (
            <>
              {item.destination && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Destination</span>
                  <span className="ed-fact-val">{item.destination}</span>
                </div>
              )}
              {item.duration && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Duration</span>
                  <span className="ed-fact-val">{item.duration} Days</span>
                </div>
              )}
              {item.difficulty && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Difficulty</span>
                  <span className="ed-fact-val">{item.difficulty}</span>
                </div>
              )}
              {item.itinerary?.length > 0 && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Itinerary</span>
                  <span className="ed-fact-val">{item.itinerary.length} Days</span>
                </div>
              )}
            </>
          )}
          {itemType === 'adventure' && (
            <>
              {item.sportType && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Sport</span>
                  <span className="ed-fact-val">{item.sportType}</span>
                </div>
              )}
              {item.location && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Location</span>
                  <span className="ed-fact-val">{item.location}</span>
                </div>
              )}
              {item.duration && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Duration</span>
                  <span className="ed-fact-val">{item.duration}</span>
                </div>
              )}
              {item.minAge && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Min Age</span>
                  <span className="ed-fact-val">{item.minAge}</span>
                </div>
              )}
              {item.intensity && (
                <div className="ed-fact-row">
                  <span className="ed-fact-label">Intensity</span>
                  <span className="ed-fact-val">{item.intensity}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </aside>
  );
}

export default ExpertSidebar;
