import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HeaderVanilla, FooterVanilla, Loading } from '@/components';
import {
  InstagramProfileHeader,
  AvailabilitySection,
  ReviewsSection,
  WhatsIncludedSection,
  MeetingRequirementsSection,
} from '@/components/celebrity-profile';
import { celebrityApi, savedApi } from '@/services/api';
import { useAuthStore } from '@/store/auth';
import '@/styles/celebrity-profile.css';

export const CelebrityProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: celebrity, isLoading, error } = useQuery({
    queryKey: ['celebrity', slug],
    queryFn: () => celebrityApi.getBySlug(slug!),
    enabled: !!slug,
  });

  // Only check if saved when user is authenticated
  const { data: isSaved } = useQuery({
    queryKey: ['celebrity-saved', celebrity?.id],
    queryFn: () => savedApi.check(celebrity!.id),
    enabled: !!celebrity?.id && isAuthenticated,
  });

  if (isLoading) return <Loading />;

  const handleFollowToggle = () => {
    // TODO: Implement follow/unfollow functionality
    console.log('Toggle follow');
  };

  const handleMessage = () => {
    // TODO: Implement messaging
    console.log('Open message dialog');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: celebrity?.name,
        text: `Check out ${celebrity?.name} on StarryMeet!`,
        url: window.location.href,
      });
    }
  };

  const handleRequestMeeting = (
    slotId: string,
    type: string,
    duration: number,
    price: number
  ) => {
    // TODO: Implement booking modal
    console.log('Request meeting:', { slotId, type, duration, price });
  };

  if (error || !celebrity) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #0A0A0A)' }}>
        <HeaderVanilla />
        <main>
          <div className="container">
            <div
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.5)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f87171', marginBottom: '8px' }}>
                Celebrity Not Found
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                The celebrity you're looking for doesn't exist or has been removed.
              </p>
              <Link
                to="/browse"
                className="btn-large"
                style={{
                  display: 'inline-block',
                  background: '#C6A34F',
                  color: '#000',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                }}
              >
                Browse Celebrities
              </Link>
            </div>
          </div>
        </main>
        <FooterVanilla />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #0A0A0A)' }}>
      <HeaderVanilla />
      <main>
        <div className="container">
          <InstagramProfileHeader
            celebrity={celebrity}
            isSaved={isSaved || false}
            onFollowToggle={handleFollowToggle}
            onMessage={handleMessage}
            onShare={handleShare}
          />

          <AvailabilitySection
            availability={celebrity.availability || []}
            onRequestMeeting={handleRequestMeeting}
          />

          <ReviewsSection
            reviews={celebrity.reviews || []}
            averageRating={celebrity.average_rating || 0}
          />

          <WhatsIncludedSection />

          <MeetingRequirementsSection />
        </div>
      </main>
      <FooterVanilla />
    </div>
  );
};
