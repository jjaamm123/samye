import React from 'react';
import { Link } from 'react-router-dom'; 
import PriceDisplay from './PriceDisplay';

function TourCard({ tour }) {
  const imageUrl = tour.cardImage || tour.featuredImage;

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-[#fbf9f5] shadow-sm hover:shadow-xl transition-shadow duration-300 border border-[#e2d9cc] group relative">
      <Link to={`/tour/${tour._id}`} className="flex flex-col h-full" style={{ textDecoration: 'none', color: 'inherit' }}>
        
        <div className="relative h-60 overflow-hidden">
          <img src={imageUrl} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            {tour.duration}
          </div>
        </div>

        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <p className="text-xs font-bold tracking-widest text-[#9c826b] uppercase mb-2">
            {tour.destination}
          </p>
          <h3 className="font-serif text-xl text-[#1a1a1a] leading-snug mb-3 line-clamp-2">{tour.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3 mb-4 flex-grow">{tour.description}</p>

          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#eae3d5] text-[#4a4238] text-xs font-semibold tracking-wide rounded-md">
              {tour.difficulty}
            </span>
            <span className="text-lg font-bold text-slate-800">
              <PriceDisplay price={tour.price} size="sm" />
            </span>
          </div>
          <span className="w-full mt-auto py-3.5 bg-[#9c826b] hover:bg-[#856d57] text-white text-sm font-medium transition-colors text-center block rounded-md">
            View Details →
          </span>
        </div>

      </Link>
    </div>
  );
}

export default TourCard;