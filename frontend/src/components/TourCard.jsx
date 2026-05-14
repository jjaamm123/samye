import React from 'react';
import { Link } from 'react-router-dom'; 
import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';

function TourCard({ tour }) {
  // 1. We need formatPrice from the context!
  const { formatPrice } = useContext(CurrencyContext);
  const imageUrl = tour.featuredImage;

  const difficultyColor = {
    Easy: '#2ecc71',
    Moderate: '#f39c12',
    Hard: '#e63946',
    Challenging: '#c0392b',
  }[tour.difficulty] || '#1a5c9e';

  return (
    <div className="tour-card">
      <Link to={`/tour/${tour._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        
        <div className="card-image-wrapper">
          <img src={imageUrl} alt={tour.title} className="tour-image" />

          <div className="card-base-info">
            <span className="card-destination-tag">{tour.title}</span>
            <span className="card-duration-tag">{tour.duration} Days</span>
          </div>

          <div className="card-hover-overlay">
            <div className="card-hover-content">
              <p style={{ color: '#eeddaa', fontSize: '0.85rem', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {tour.destination}
              </p>
              <h3 className="card-title">{tour.title}</h3>
              <p className="card-description">{tour.description}</p>

              <div className="card-meta-row">
                <span
                  className="card-difficulty-badge"
                  style={{ backgroundColor: difficultyColor }}
                >
                  {tour.difficulty}
                </span>
                {/* 2. Swapped the hardcoded $ for the dynamic function */}
                <span className="card-price">{formatPrice(tour.price)}</span>
              </div>
              <span className="card-cta-btn" style={{ display: 'inline-block' }}>View Tour →</span>
            </div>
          </div>
        </div>

      </Link>
    </div>
  );
}

export default TourCard;