import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header, BottomNav, Loading } from '@/components';
import { CelebrityHeader } from '@/components/celebrity/CelebrityHeader';
import { CelebrityInfo } from '@/components/celebrity/CelebrityInfo';
import { BookingSection } from '@/components/celebrity/BookingSection';
import { celebrityApi, savedApi } from '@/services/api';

export const CelebrityProfile = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: celebrity, isLoading, error } = useQuery({
    queryKey: ['celebrity', slug],
    queryFn: () => celebrityApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: isSaved } = useQuery({
    queryKey: ['celebrity-saved', celebrity?.id],
    queryFn: () => savedApi.check(celebrity!.id),
    enabled: !!celebrity?.id,
  });

  if (isLoading) return <Loading />;

  if (error || !celebrity) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Celebrity Not Found</h2>
            <p className="text-gray-400 mb-4">
              The celebrity you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/react/browse"
              className="inline-block bg-[#D4A574] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#C49563] transition"
            >
              Browse Celebrities
            </Link>
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
        {/* Back Button */}
        <Link
          to="/react/browse"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Browse
        </Link>

        <CelebrityHeader celebrity={celebrity} isSaved={isSaved || false} />
        <BookingSection celebrity={celebrity} />
        <CelebrityInfo celebrity={celebrity} />
      </main>
      <BottomNav />
    </div>
  );
};
