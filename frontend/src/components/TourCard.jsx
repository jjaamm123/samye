import React from 'react';
import { Link } from 'react-router-dom'; 
import PriceDisplay from './PriceDisplay';

function TourCard({ tour }) {
  const imageUrl = tour.cardImage || tour.featuredImage;

  const difficultyColor = {
    Easy: '#2ecc71',
    Moderate: '#f39c12',
    Hard: '#e63946',
    Challenging: '#c0392b',
  }[tour.difficulty] || '#1a5c9e';

  return (
    <Link to={`/tour/${tour._id}`} className="relative block w-full h-[400px] sm:h-[450px] rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500">
      
      {/* Base Image */}
      <img src={imageUrl} alt={tour.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0" loading="lazy" />

      {/* Base State (Visible by default, fades out on hover) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-white font-serif text-2xl leading-snug drop-shadow-md">{tour.title}</h3>
        <p className="text-gray-200 text-sm font-medium mt-2">{tour.duration}</p>
      </div>

      {/* Hover Overlay State (Hidden by default, fades in on hover) */}
      <div className="absolute inset-0 z-20 bg-black/85 p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        
        <p className="text-[#eeddaa] text-xs uppercase tracking-[0.15em] mb-2 font-semibold">{tour.destination}</p>
        <h3 className="text-white font-serif text-2xl mb-3">{tour.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-3 mb-6 font-light leading-relaxed">{tour.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span style={{ backgroundColor: difficultyColor }} className="text-white px-3 py-1 rounded-md text-xs font-bold tracking-wide">
              {tour.difficulty}
            </span>
            <span className="text-white">
              <PriceDisplay price={tour.price} size="sm" />
            </span>
          </div>
          
          <span className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:text-[#eeddaa] transition-colors">
            View Tour 
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

export default TourCard;