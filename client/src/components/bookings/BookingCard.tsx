import { Link } from 'react-router-dom';
import { formatDate, formatTime, formatCurrency } from '@/utils';
import type { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard = ({ booking }: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Link
      to={`/booking-details.html?id=${booking.id}`}
      className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 hover:border-[#D4A574] transition-all block"
    >
      <div className="flex items-start gap-4">
        {booking.celebrity?.profile_image && (
          <img
            src={booking.celebrity.profile_image}
            alt={booking.celebrity.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {booking.celebrity?.name || 'Unknown Celebrity'}
              </h3>
              <p className="text-sm text-gray-400">
                {booking.celebrity?.category || 'Unknown'}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{formatDate(booking.booking_date, 'MMM d, yyyy')}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{formatTime(booking.booking_time)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span className="text-[#D4A574] font-semibold">
                {formatCurrency(booking.total_price)}
              </span>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Duration: {booking.duration_hours} {booking.duration_hours === 1 ? 'hour' : 'hours'}
          </div>
        </div>
      </div>
    </Link>
  );
};
