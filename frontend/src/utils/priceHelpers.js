// src/utils/priceHelpers.js
// Shared price utility functions for Tours (nested object) and Adventures (flat number).
// Imported by VisualMoodboard, CustomTour, and any future components that need price handling.

/**
 * Safely extract a numeric amount from a price field that may be:
 *   a) a nested object  { amount: 1200, displayType: 'exact' }
 *   b) a flat number    1200
 *   c) undefined / null
 */
export function getPriceAmount(price) {
  if (price === null || price === undefined) return 0;
  if (typeof price === 'object') return Number(price?.amount ?? 0);
  return Number(price ?? 0);
}

/**
 * Returns the displayType for a price, defaulting to 'exact' for flat numbers.
 * Possible values: 'por' | 'starting_from' | 'exact'
 */
export function getPriceDisplayType(price) {
  if (price && typeof price === 'object') return price?.displayType ?? 'starting_from';
  return 'exact';
}

/**
 * Returns true if this price should NOT produce a hard numeric total.
 * (i.e. it requires a custom quote)
 */
export function isBespokePrice(price) {
  const dt = getPriceDisplayType(price);
  return dt === 'por' || dt === 'starting_from';
}
