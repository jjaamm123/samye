import React from 'react';

function TourCard({ tour }) {
  let imageUrl = tour.featuredImage;

  if (imageUrl.startsWith('/images/')) {
    if (tour.destination === 'Nepal') {
      imageUrl = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80";
    } else if (tour.destination === 'Tibet') {
      imageUrl = "https://images.unsplash.com/photo-1551114671-fa2b87f4c7d0?auto=format&fit=crop&w=600&q=80";
    } else {
      imageUrl = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80";
    }
  }

  const difficultyColor = {
    Easy: '#2ecc71',
    Moderate: '#f39c12',
    Hard: '#e63946',
    Challenging: '#c0392b',
  }[tour.difficulty] || '#1a5c9e';

  return (
    <div className="tour-card">

      <div className="card-image-wrapper">
        <img src={imageUrl} alt={tour.title} className="tour-image" />

        <div className="card-base-info">
          <span className="card-destination-tag">{tour.destination}</span>
          <span className="card-duration-tag">{tour.duration} Days</span>
        </div>

        <div className="card-hover-overlay">
          <div className="card-hover-content">
            <h3 className="card-title">{tour.title}</h3>
            <p className="card-description">{tour.description}</p>

            <div className="card-meta-row">

              <span
                className="card-difficulty-badge"
                style={{ backgroundColor: difficultyColor }}
              >
                {tour.difficulty}
              </span>
              <span className="card-price">${tour.price}</span>
            </div>

            <button className="card-cta-btn">View Tour →</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default TourCard;