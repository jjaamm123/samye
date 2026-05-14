
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

  const formatPrice = (priceInUSD) => {
    const NPR_RATE = 133.50; 
    
    if (currency === 'USD') {
      return `$${priceInUSD}`;
    } else {
      return `Rs ${Math.round(priceInUSD * NPR_RATE).toLocaleString('en-IN')}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};