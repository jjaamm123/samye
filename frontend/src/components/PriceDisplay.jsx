// src/components/PriceDisplay.jsx
// Shared component that renders tour.price (the new nested object) intelligently.
// Also handles the legacy case where tour.price is still a plain Number (old DB docs).
import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';

/**
 * Returns the raw displayType string from a price value.
 * Safely handles both old (Number) and new (Object) price shapes.
 */
export function getPriceDisplayType(price) {
  if (price == null) return 'por';
  if (typeof price === 'object') return price.displayType || 'starting_from';
  // Legacy flat number — treat as starting_from
  return 'starting_from';
}

/**
 * Returns the numeric amount from a price value.
 */
export function getPriceAmount(price) {
  if (price == null) return 0;
  if (typeof price === 'object') return price.amount ?? 0;
  return price; // legacy flat number
}

/**
 * <PriceDisplay price={tour.price} className="..." />
 *
 * Renders price according to displayType:
 *   'por'           → "Price on Request"
 *   'starting_from' → "Starting from $1,200"
 *   'exact'         → "$1,200"
 *
 * Accepts an optional `className` prop to override the wrapper span style.
 * Accepts an optional `size` prop: 'sm' | 'md' (default) | 'lg' for typography scaling.
 */
function PriceDisplay({ price, className = '', size = 'md' }) {
  const { formatAmount } = useContext(CurrencyContext);

  const displayType = getPriceDisplayType(price);
  const amount      = getPriceAmount(price);

  const sizeStyles = {
    sm: { fontSize: '0.85rem', fontWeight: '600' },
    md: { fontSize: '1.05rem', fontWeight: '700' },
    lg: { fontSize: '1.6rem',  fontWeight: '800' },
  };

  const baseStyle = {
    display:    'inline-flex',
    alignItems: 'baseline',
    gap:        '4px',
    ...sizeStyles[size],
  };

  if (displayType === 'por') {
    return (
      <span className={className} style={{ ...baseStyle, color: '#64748b', fontStyle: 'italic' }}>
        Price on Request
      </span>
    );
  }

  const formattedAmount = formatAmount(amount);

  if (displayType === 'starting_from') {
    return (
      <span className={className} style={baseStyle}>
        <span style={{ fontSize: '0.72em', fontWeight: '500', opacity: 0.75, letterSpacing: '0.02em' }}>
          Starting from
        </span>
        <span>{formattedAmount}</span>
      </span>
    );
  }

  // 'exact'
  return (
    <span className={className} style={baseStyle}>
      {formattedAmount}
    </span>
  );
}

export default PriceDisplay;
