import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils';
import type { Celebrity } from '@/types';
import { toastConfig } from '@/hooks/useToast';

interface BookingSectionProps {
  celebrity: Celebrity;
}

export const BookingSection = ({ celebrity }: BookingSectionProps) => {
  const { isAuthenticated } = useAuthStore();
  const [selectedHours, setSelectedHours] = useState(1);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }
    // Redirect to booking page with celebrity info
    // TODO: Implement booking flow
    toastConfig.info('Booking flow coming soon!');
  };

  const totalPrice = celebrity.price_per_hour * selectedHours;

  return (
    <div className="bg-gradient-to-r from-[#D4A574] to-[#C49563] rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black mb-2">Book a Meeting</h2>
          <p className="text-black/70 mb-4">
            Choose your preferred duration and schedule a meeting
          </p>

          <div className="flex items-center gap-4">
            <label className="text-black font-semibold">Duration:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setSelectedHours(hours)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedHours === hours
                      ? 'bg-black text-[#D4A574]'
                      : 'bg-black/20 text-black hover:bg-black/30'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-sm text-black/70 mb-1">Total Price</p>
          <p className="text-3xl font-bold text-black mb-4">
            {formatCurrency(totalPrice)}
          </p>
          <button
            onClick={handleBookNow}
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-black/90 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
