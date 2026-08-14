
import { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(localStorage.getItem('app_currency') || 'USD');

  useEffect(() => {
    localStorage.setItem('app_currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'USD' ? 'NPR' : 'USD'));
  };

  // Formats a raw USD amount number into the current currency string.
  // Safe to call with undefined/null — returns empty string.
  const formatAmount = (amountInUSD) => {
    if (amountInUSD == null || isNaN(amountInUSD)) return '';
    const NPR_RATE = 133.50;
    if (currency === 'USD') {
      return `$${Number(amountInUSD).toLocaleString('en-US')}`;
    } else {
      return `Rs ${Math.round(amountInUSD * NPR_RATE).toLocaleString('en-IN')}`;
    }
  };

  // Legacy helper — still used by older call sites that pass a plain number.
  // For new code, prefer using <PriceDisplay price={tour.price} /> instead.
  const formatPrice = (priceInUSD) => {
    // Handles both old (Number) and new (Object) price shapes.
    const amount = typeof priceInUSD === 'object' && priceInUSD !== null
      ? priceInUSD.amount
      : priceInUSD;
    return formatAmount(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};