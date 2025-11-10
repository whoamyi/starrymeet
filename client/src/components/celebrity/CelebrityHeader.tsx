import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { savedApi } from '@/services/api';
import { toastConfig } from '@/utils';
import { formatPrice } from '@/utils';
import type { Celebrity } from '@/types';

interface CelebrityHeaderProps {
  celebrity: Celebrity;
  isSaved: boolean;
}

export const CelebrityHeader = ({ celebrity, isSaved }: CelebrityHeaderProps) => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () => savedApi.add(celebrity.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] });
      queryClient.invalidateQueries({ queryKey: ['celebrity-saved', celebrity.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toastConfig.success('Added to favorites');
    },
    onError: () => {
      toastConfig.error('Failed to add to favorites');
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => savedApi.remove(celebrity.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] });
      queryClient.invalidateQueries({ queryKey: ['celebrity-saved', celebrity.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toastConfig.success('Removed from favorites');
    },
    onError: () => {
      toastConfig.error('Failed to remove from favorites');
    },
  });

  const handleToggleSave = () => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }

    if (isSaved) {
      removeMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl mb-6">
        <img
          src={celebrity.profile_image}
          alt={celebrity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* Celebrity Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {celebrity.name}
              </h1>
              <p className="text-xl text-gray-300 mb-3">{celebrity.category}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-2xl font-bold text-[rgba(255, 255, 255, 0.8)]">
                  {formatPrice(celebrity.price_per_hour)}/hr
                </span>
                {celebrity.follower_count > 0 && (
                  <span className="text-sm text-gray-400">
                    {celebrity.follower_count.toLocaleString()} followers
                  </span>
                )}
                {celebrity.rating && (
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    {celebrity.rating.toFixed(1)}
                  </div>
                )}
              </div>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleSave}
              disabled={saveMutation.isPending || removeMutation.isPending}
              className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition disabled:opacity-50"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                className={isSaved ? 'text-red-500' : 'text-white'}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
