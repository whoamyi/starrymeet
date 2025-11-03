import { useState } from 'react';

interface Celebrity {
  id: string;
  name: string;
  category: string;
  profile_image: string | null;
  picture_url?: string;
  bio?: string;
  location?: string;
  country?: string;
  verified?: boolean;
  tier?: string;
  total_bookings?: number;
  review_count?: number;
  average_rating?: number;
  review_rate?: number;
  availability_count?: number;
}

interface InstagramProfileHeaderProps {
  celebrity: Celebrity;
  isSaved: boolean;
  onFollowToggle?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}

export const InstagramProfileHeader = ({
  celebrity,
  isSaved,
  onFollowToggle,
  onMessage,
  onShare,
}: InstagramProfileHeaderProps) => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const bioNeedsToggle = (celebrity.bio?.length || 0) > 150;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayBio = bioExpanded || !bioNeedsToggle
    ? celebrity.bio
    : celebrity.bio?.slice(0, 150) + '...';

  return (
    <header className="profile-header-ig">
      {/* Avatar with Tier Badge */}
      <div className="profile-avatar-wrapper">
        {celebrity.tier && (
          <div className="profile-tier-badge">{celebrity.tier}</div>
        )}
        <div className="profile-avatar-ig">
          {(celebrity.picture_url || celebrity.profile_image) ? (
            <img
              src={celebrity.picture_url || celebrity.profile_image!}
              alt={celebrity.name}
              className="profile-avatar-img"
            />
          ) : (
            <div className="profile-initials-ig">{getInitials(celebrity.name)}</div>
          )}
        </div>
      </div>

      {/* Name + Verification */}
      <div className="profile-identity">
        <h1 className="profile-name-ig">{celebrity.name}</h1>
        {celebrity.verified && (
          <svg
            className="profile-verified"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="11" fill="#3897f0" />
            <path
              d="M9.5 12.5L11 14L14.5 10.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Category */}
      <p className="profile-category-ig">{celebrity.category}</p>

      {/* Stats Row (Instagram-style) */}
      <div className="profile-stats-ig">
        <div className="stat-ig">
          <span className="stat-value-ig">{celebrity.availability_count ?? celebrity.total_bookings ?? 0}</span>
          <span className="stat-label-ig">availability</span>
        </div>
        <div className="stat-ig">
          <span className="stat-value-ig">{celebrity.review_count || 0}</span>
          <span className="stat-label-ig">reviews</span>
        </div>
        <div className="stat-ig">
          <span className="stat-value-ig">
            {(() => {
              const ratingValue = celebrity.review_rate ?? celebrity.average_rating;
              return ratingValue ? Number(ratingValue).toFixed(1) : '-';
            })()}
          </span>
          <span className="stat-label-ig">rating</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions-ig">
        <button
          className={`btn-action-ig btn-action-ig--follow ${isSaved ? 'following' : ''}`}
          onClick={onFollowToggle}
          data-following={isSaved}
        >
          <span className="btn-action-ig__text">{isSaved ? 'Following' : 'Follow'}</span>
        </button>
        <button className="btn-action-ig btn-action-ig--message" onClick={onMessage}>
          <span className="btn-action-ig__text">Message</span>
        </button>
        <button
          className="btn-action-ig btn-action-ig--share"
          onClick={onShare}
          aria-label="Share profile"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* Bio (Expandable) */}
      {celebrity.bio && (
        <div className="profile-bio-section-ig">
          <p className="profile-bio-ig" data-expanded={bioExpanded}>
            {displayBio}
          </p>
          {bioNeedsToggle && (
            <button
              className="profile-bio-toggle-ig"
              onClick={() => setBioExpanded(!bioExpanded)}
              aria-expanded={bioExpanded}
            >
              <span className="toggle-text">{bioExpanded ? 'less' : 'more'}</span>
            </button>
          )}
        </div>
      )}

      {/* Location */}
      {(celebrity.country || celebrity.location) && (
        <div className="profile-location-ig">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{celebrity.country || celebrity.location}</span>
        </div>
      )}
    </header>
  );
};
