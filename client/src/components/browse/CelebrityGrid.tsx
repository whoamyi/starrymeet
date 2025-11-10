import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils';
import type { Celebrity } from '@/types';

interface CelebrityGridProps {
  celebrities: Celebrity[];
}

export const CelebrityGrid = ({ celebrities }: CelebrityGridProps) => {
  if (celebrities.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-12 text-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto mb-4 opacity-50"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <p className="text-gray-400">No celebrities found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {celebrities.map((celebrity) => (
        <Link
          key={celebrity.id}
          to={`/react/celebrity/${celebrity.slug}`}
          className="group"
        >
          <div className="relative overflow-hidden rounded-2xl mb-2">
            <img
              src={celebrity.profile_image}
              alt={celebrity.name}
              className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {celebrity.status === 'active' && (
              <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full border-2 border-black"></div>
            )}
          </div>
          <h3 className="font-semibold text-white mb-1 truncate">{celebrity.name}</h3>
          <p className="text-sm text-gray-400 mb-1">{celebrity.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(255, 255, 255, 0.8)] font-semibold">
              {formatPrice(celebrity.price_per_hour)}/hr
            </span>
            {celebrity.rating && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {celebrity.rating.toFixed(1)}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};
