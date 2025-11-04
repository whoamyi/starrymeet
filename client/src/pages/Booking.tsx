import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HeaderVanilla, FooterVanilla } from '@/components';

interface BookingState {
  celebrityId: string;
  celebrityName: string;
  celebrityImage?: string;
  slotId: string;
  meetingType: string;
  duration: number;
  price: number;
}

export const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as BookingState | null;
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingData) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
        <HeaderVanilla />
        <main className="container" style={{ padding: '48px 16px' }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '48px 24px',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>
              No Booking Selected
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              Please select a time slot from a celebrity profile to continue.
            </p>
            <button
              onClick={() => navigate('/browse')}
              style={{
                background: '#D4A574',
                color: '#000',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Browse Celebrities
            </button>
          </div>
        </main>
        <FooterVanilla />
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    setIsProcessing(true);

    try {
      // TODO: Call booking API endpoint
      console.log('Booking request:', bookingData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to bookings page with success message
      navigate('/bookings', {
        state: {
          message: 'Booking request sent! The celebrity will review and confirm your meeting.'
        }
      });
    } catch (error) {
      console.error('Booking failed:', error);
      setIsProcessing(false);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <HeaderVanilla />
      <main className="container" style={{ padding: '48px 16px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '32px', textAlign: 'center' }}>
          Confirm Your Booking
        </h1>

        {/* Celebrity Info */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            {bookingData.celebrityImage ? (
              <img
                src={bookingData.celebrityImage}
                alt={bookingData.celebrityName}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: '600',
                color: '#fff',
              }}>
                {bookingData.celebrityName.charAt(0)}
              </div>
            )}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                {bookingData.celebrityName}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
                {bookingData.meetingType} Meeting
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div style={{
            display: 'grid',
            gap: '16px',
            padding: '20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Meeting Type:</span>
              <span style={{ color: '#ffffff', fontWeight: '600', textTransform: 'capitalize' }}>
                {bookingData.meetingType}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Duration:</span>
              <span style={{ color: '#ffffff', fontWeight: '600' }}>
                {bookingData.duration} minutes
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', fontWeight: '600' }}>Total:</span>
              <span style={{ color: '#D4A574', fontSize: '24px', fontWeight: '700' }}>
                ${(bookingData.price / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(212,165,116,0.1)',
          border: '1px solid rgba(212,165,116,0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '32px',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            📌 Your booking request will be sent to {bookingData.celebrityName}. They will review and confirm your meeting time. You'll receive a notification once confirmed.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            disabled={isProcessing}
            style={{
              padding: '14px 32px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '16px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isProcessing}
            style={{
              padding: '14px 48px',
              background: isProcessing ? 'rgba(212,165,116,0.5)' : '#D4A574',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontWeight: '700',
              fontSize: '16px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isProcessing ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #000',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
      <FooterVanilla />
    </div>
  );
};
