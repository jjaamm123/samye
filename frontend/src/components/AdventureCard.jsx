import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';
  
function AdventureCard({ adventure }) {
  const { formatPrice } = useContext(CurrencyContext);

  const intensityColor = {
    Easy:    '#2ecc71',
    Moderate: '#f39c12',
    Intense: '#e67e22',
    Extreme: '#e63946',
  }[adventure.intensity] || '#1a5c9e';

  // Look for the new cardImage first, fallback to the old featuredImage if needed
  const imageUrl = adventure.cardImage || adventure.featuredImage || '';

  return (
    <div className="tour-card flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition-shadow border border-slate-100">
      <Link to={`/adventure/${adventure._id}`} className="flex flex-col h-full" style={{ textDecoration: 'none', color: 'inherit' }}>
        
        <div className="relative">
          <img src={imageUrl} alt={adventure.title} className="w-full h-56 sm:h-64 object-cover" />
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
            {adventure.duration}
          </div>
        </div>

        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
            {adventure.location || 'Adventure'}
          </p>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 line-clamp-2">{adventure.title}</h3>
          <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">{adventure.description}</p>

          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs font-bold px-2 py-1 rounded text-white"
              style={{ backgroundColor: intensityColor }}
            >
              {adventure.intensity}
            </span>
            <span className="text-lg font-bold text-slate-800">
              {formatPrice(adventure.price)}
            </span>
          </div>
          <span className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-auto block">View Details →</span>
        </div>

      </Link>
    </div>
  );
}

export default AdventureCard;