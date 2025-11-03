import { Link } from 'react-router-dom';

interface Celebrity {
  id: string;
  name: string;
  slug: string;
  category: string;
  profile_image: string | null;
  price_per_hour: number;
  bio?: string;
}

interface SwipeViewProps {
  currentCard: Celebrity | undefined;
  onPass: () => void;
  onBack: () => void;
}

export const SwipeView = ({ currentCard, onPass, onBack }: SwipeViewProps) => {
  return (
    <div className="swipe-section">
      <div className="card-container">
        <div className="card">
          {currentCard ? (
            <>
              <img
                src={
                  currentCard.profile_image ||
                  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&h=800&fit=crop'
                }
                alt={currentCard.name}
                className="card-image"
              />
              <div className="card-info">
                <h2>{currentCard.name}</h2>
                <p className="category">{currentCard.category}</p>
                <p className="price">From ${Math.round(currentCard.price_per_hour).toLocaleString()}/hr</p>
                <p className="bio">{currentCard.bio || 'No bio available'}</p>
              </div>
            </>
          ) : (
            <div className="loading-state">No more celebrities</div>
          )}
        </div>
      </div>

      <div className="controls">
        <button className="ctrl-btn pass" onClick={onPass}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button className="ctrl-btn back" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button className="ctrl-btn view">
          <Link to={currentCard ? `/celebrity/${currentCard.slug}` : '#'}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </Link>
        </button>
      </div>
    </div>
  );
};
