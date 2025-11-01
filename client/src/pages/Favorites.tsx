import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header, BottomNav, Loading } from '@/components';
import { savedApi } from '@/services/api';
import { formatPrice } from '@/utils';
import { toastConfig } from '@/utils';

export const Favorites = () => {
  const queryClient = useQueryClient();

  const { data: saved, isLoading, error } = useQuery({
    queryKey: ['saved'],
    queryFn: savedApi.getAll,
  });

  const removeMutation = useMutation({
    mutationFn: (celebrityId: string) => savedApi.remove(celebrityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toastConfig.success('Removed from favorites');
    },
    onError: () => {
      toastConfig.error('Failed to remove from favorites');
    },
  });

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <h1 className="text-3xl font-bold mb-6">Favorites</h1>
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Favorites</h2>
            <p className="text-gray-400">Please try refreshing the page.</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <span className="text-gray-400">{saved?.length || 0} saved</span>
        </div>

        {!saved || saved.length === 0 ? (
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p className="text-gray-400 mb-4">No favorites yet</p>
            <a
              href="/browse"
              className="inline-block bg-[#D4A574] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#C49563] transition"
            >
              Browse Celebrities
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {saved.map((item) => {
              const celeb = item.celebrity;
              if (!celeb) return null;

              return (
                <div key={item.id} className="group relative">
                  <Link to={`/celebrity/celeb.slug}`}>
                    <div className="relative overflow-hidden rounded-2xl mb-2">
                      <img
                        src={celeb.profile_image}
                        alt={celeb.name}
                        className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeMutation.mutate(celeb.id);
                        }}
                        disabled={removeMutation.isPending}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition"
                        title="Remove from favorites"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                    </div>
                  </Link>
                  <h4 className="font-semibold text-sm text-white mb-1">{celeb.name}</h4>
                  <p className="text-xs text-gray-400 mb-1">{celeb.category}</p>
                  <p className="text-xs text-[#D4A574] font-semibold">
                    {formatPrice(celeb.price_per_hour)}/hr
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};
