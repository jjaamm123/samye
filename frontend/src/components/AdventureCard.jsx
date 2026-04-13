import React from 'react';
import { Link } from 'react-router-dom';

function AdventureCard({ adventure }) {

  const intensityColor = {
    Easy:    '#2ecc71',
    Moderate: '#f39c12',
    Intense: '#e67e22',
    Extreme: '#e63946',
  }[adventure.intensity] || '#1a5c9e';

  let imageUrl = adventure.featuredImage || '';
  if (!imageUrl || imageUrl.startsWith('/images/')) {
    const fallbacks = {
      Rafting:     'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=600&q=80',
      Paragliding: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=600&q=80',
      Bungee:      'https://images.unsplash.com/photo-1605540840428-583c4b572240?auto=format&fit=crop&w=600&q=80',
      Climbing:    'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=600&q=80',
      Biking:      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=600&q=80',
      Zipline:     'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=600&q=80',
    };
    const matched = Object.keys(fallbacks).find(key =>
      adventure.title?.toLowerCase().includes(key.toLowerCase()) ||
      adventure.sportType?.toLowerCase().includes(key.toLowerCase())
    );
    imageUrl = matched ? fallbacks[matched] : 'https://images.unsplash.com/photo-1605540840428-583c4b572240?auto=format&fit=crop&w=600&q=80';
  }

  return (
    <div className="tour-card">
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={adventure.title} className="tour-image" />

        <div className="card-base-info">
          <span className="card-destination-tag">{adventure.location}</span>
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
              <span className="card-price">${adventure.price}</span>
            </div>
            {/* Link goes to /adventure/:id — different from /tour/:id */}
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