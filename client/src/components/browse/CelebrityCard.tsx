import { Link } from 'react-router-dom';
import type { Celebrity } from '@/types';

interface CelebrityCardProps {
  celebrity: Celebrity;
  viewMode: 'swipe' | 'grid';
}

export const CelebrityCard = ({ celebrity, viewMode }: CelebrityCardProps) => {
  const truncateName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  const imageUrl =
    celebrity.profile_image ||
    'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';

  const minPrice = celebrity.price_per_hour || 5000;
  const available = celebrity.total_bookings || 3; // Using total_bookings as proxy for availability
  const category = celebrity.category || 'Celebrity';
  const rating = celebrity.rating || celebrity.average_rating || 4.9;
  const location = celebrity.location || 'Virtual';

  if (viewMode === 'swipe') {
    return (
      <Link
        to={`/celebrity/${celebrity.slug}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div className="card-img">
          <img src={imageUrl} alt={celebrity.name} />
        </div>
        <div className="card-content">
          <div className="card-name-row">
            <h3>{truncateName(celebrity.name)}</h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0095F6">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <p className="card-cat">{category}</p>
          <div className="card-bottom">
            <span className="card-tickets">🎫 {available} left</span>
            <span className="card-price">${parseFloat(minPrice.toString()).toLocaleString()}+</span>
          </div>
          <div className="card-stats">
            <span>⭐ {rating.toFixed(1)}</span>
            <span>•</span>
            <span>📍 {location}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link to={`/celebrity/${celebrity.slug}`} className="grid-card">
      <div className="grid-card-img">
        <img src={imageUrl} alt={celebrity.name} loading="lazy" />
      </div>
      <div className="grid-card-content">
        <div className="grid-card-name-row">
          <h4>{truncateName(celebrity.name)}</h4>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095F6">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <p className="grid-card-cat">{category}</p>
        <div className="grid-card-bottom">
          <span className="grid-card-tickets">🎫 {available}</span>
          <span className="grid-card-price">
            ${parseFloat(minPrice.toString()).toLocaleString()}+
          </span>
        </div>
      </div>
    </Link>
  );
};
