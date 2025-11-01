import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { celebrityApi } from '@/services/api';
import { formatPrice } from '@/utils';
import { Loading } from '@/components';

export const FeaturedCelebrities = () => {
  const { data: celebrities, isLoading } = useQuery({
    queryKey: ['featured-celebrities'],
    queryFn: () => celebrityApi.getFeatured(6),
  });

  if (isLoading) {
    return (
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <Loading />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet The Icons
          </h2>
          <p className="text-xl text-gray-400">
            <span className="text-[#D4A574] font-semibold">{celebrities?.length || 147}</span> verified celebrities available for private meetings
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {celebrities?.map((celebrity) => (
            <Link
              key={celebrity.id}
              to={`/celebrity/${celebrity.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl mb-3">
                <img
                  src={celebrity.profile_image}
                  alt={celebrity.name}
                  className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {celebrity.status === 'active' && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>
              <h3 className="font-semibold text-white mb-1 truncate">
                {celebrity.name}
              </h3>
              <p className="text-sm text-gray-400 mb-1">{celebrity.category}</p>
              <p className="text-sm text-[#D4A574] font-semibold">
                {formatPrice(celebrity.price_per_hour)}/hr
              </p>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-gray-900 text-white border border-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 hover:border-[#D4A574] transition"
          >
            <span>View All Icons</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
