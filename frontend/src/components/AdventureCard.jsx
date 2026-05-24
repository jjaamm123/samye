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
    <div className="tour-card">
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={adventure.title} className="tour-image" />

        <div className="card-base-info">
          <span className="card-destination-tag">{adventure.title}</span>
          <span className="card-duration-tag">{adventure.duration}</span>
        </div>

        <div className="card-hover-overlay">
          <div className="card-hover-content">
            <h3 className="card-title">{adventure.title}</h3>
            <p className="card-description">{adventure.description}</p>
            <div className="card-meta-row">
              <span
                className="card-difficulty-badge"
                style={{ backgroundColor: intensityColor }}
              >
                {adventure.intensity}
              </span>
      
              <span className="card-price">{formatPrice(adventure.price)}</span>
            </div>
          
            <Link to={`/adventure/${adventure._id}`} className="card-cta-btn" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdventureCard;