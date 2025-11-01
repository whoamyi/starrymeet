import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils';
import type { SavedCelebrity } from '@/types';

interface SavedCelebritiesProps {
  saved: SavedCelebrity[];
}

export const SavedCelebrities = ({ saved }: SavedCelebritiesProps) => {
  if (!saved?.length) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Favorites</h2>
          <Link to="/browse.html" className="text-[#D4A574] text-sm font-semibold">
            Start Exploring
          </Link>
        </div>
        <div className="bg-gray-900/50 rounded-2xl p-8 text-center">
          <p className="text-gray-400">No favorites yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Favorites</h2>
        <Link to="/react/favorites" className="text-[#D4A574] text-sm font-semibold">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {saved.slice(0, 6).map((item) => {
          const celeb = item.celebrity;
          if (!celeb) return null;

          return (
            <Link
              key={celeb.id}
              to={`/celebrity-profile.html?slug=${celeb.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl mb-2">
                <img
                  src={celeb.profile_image}
                  alt={celeb.name}
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 className="font-semibold text-sm text-white mb-1">{celeb.name}</h4>
              <p className="text-xs text-gray-400">{celeb.category}</p>
              <p className="text-xs text-[#D4A574] font-semibold mt-1">
                {formatPrice(celeb.price_per_hour)}/hr
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
