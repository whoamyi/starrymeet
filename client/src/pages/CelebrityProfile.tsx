import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    placeholderData: false, // Start with false to prevent flicker
  });

  // Follow/Unfollow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!celebrity?.id) throw new Error('No celebrity ID');
      if (isSaved) {
        await savedApi.remove(celebrity.id);
        return false;
      } else {
        await savedApi.add(celebrity.id);
        return true;
      }
    },
    onSuccess: (newSavedState) => {
      queryClient.invalidateQueries({ queryKey: ['celebrity-saved', celebrity?.id] });
      queryClient.invalidateQueries({ queryKey: ['saved'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast(newSavedState ? 'Following!' : 'Unfollowed');
    },
    onError: () => {
      showToast('Failed to update. Please try again.');
    },
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Handle automatic action after login (e.g., auto-save when returning from auth)
  useEffect(() => {
    const action = (location.state as any)?.action;

    console.log('[CelebrityProfile] useEffect check:', {
      isAuthenticated,
      action,
      hasCelebrity: !!celebrity,
      isSaved,
      locationState: location.state
    });

    // Auto-save after login: only check if user is authenticated and action is 'save'
    // Don't check isSaved because it might not be loaded yet or user wants to toggle
    if (isAuthenticated && action === 'save' && celebrity) {
      console.log('[CelebrityProfile] Auto-performing save action after login');

      // Only save if not already saved (after data loads)
      if (isSaved !== true) {
        followMutation.mutate();
      }

      // Clear the action from state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [isAuthenticated, celebrity, isSaved, location.state]);

  if (isLoading) return <Loading />;

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      // Redirect to auth with action to auto-save after login
      navigate('/auth', { state: { from: `/celebrity/${slug}`, action: 'save' } });
      return;
    }
    followMutation.mutate();
  };

  const handleMessage = () => {
    if (!isAuthenticated) {
      // Redirect to auth, then to messages
      navigate('/auth', { state: { from: '/messages' } });
      return;
    }
    navigate('/messages', { state: { celebrityId: celebrity?.id, celebrityName: celebrity?.name } });
  };

  const handleShare = async () => {
    const shareData = {
      title: celebrity?.name || 'Celebrity Profile',
      text: `Check out ${celebrity?.name} on StarryMeet!`,
      url: window.location.href,
    };

    // Try native share first
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy link');
    });
  };

  const handleRequestMeeting = (
    slotId: string,
    type: string,
    duration: number,
    price: number
  ) => {
    // The intended destination after login
    const intendedDestination = `/apply/${slug}`;

    if (!isAuthenticated) {
      // Pass the intended destination (not current page) so user continues their action after login
      navigate('/auth', { state: { from: intendedDestination } });
      return;
    }

    // Navigate to application flow
    navigate(intendedDestination);
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
                  background: 'rgba(255, 255, 255, 0.8)',
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-ig show" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};
