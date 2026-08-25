import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';

function AdventureCard({ adventure }) {
  const { formatPrice } = useContext(CurrencyContext);

  const imageUrl = adventure.cardImage || adventure.featuredImage || '';

  const intensityColor = {
    Easy: '#2ecc71',
    Moderate: '#f39c12',
    Hard: '#e63946',
    Challenging: '#c0392b',
    Intense: '#c0392b',
    Extreme: '#9b1c1c'
  }[adventure.intensity] || '#9c826b';

  return (
    <Link to={`/adventure/${adventure._id}`} className="relative block w-full h-[400px] sm:h-[450px] rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500">
      
      {/* Base Image */}
      <img src={imageUrl} alt={adventure.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0" loading="lazy" />

      {/* Base State (Visible by default, fades out on hover) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-white font-serif text-2xl leading-snug drop-shadow-md">{adventure.title}</h3>
        <p className="text-gray-200 text-sm font-medium mt-2">{adventure.duration}</p>
      </div>

      {/* Hover Overlay State (Hidden by default, fades in on hover) */}
      <div className="absolute inset-0 z-20 bg-black/85 p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        
        <p className="text-[#eeddaa] text-xs uppercase tracking-[0.15em] mb-2 font-semibold">{adventure.sportType || adventure.location || 'Adventure'}</p>
        <h3 className="text-white font-serif text-2xl mb-3">{adventure.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-3 mb-6 font-light leading-relaxed">{adventure.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span style={{ backgroundColor: intensityColor }} className="text-white px-3 py-1 rounded-md text-xs font-bold tracking-wide">
              {adventure.intensity}
            </span>
            <span className="text-white font-bold">
              {adventure.priceDisplayType === 'POR' ? 'Price on Request' : (adventure.priceDisplayType === 'Starting From' ? `Starting from ${formatPrice(adventure.price)}` : formatPrice(adventure.price))}
            </span>
          </div>
          
          <span className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:text-[#eeddaa] transition-colors">
            View Details 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>

      </div>

    </Link>
  );
}

export default AdventureCard;
