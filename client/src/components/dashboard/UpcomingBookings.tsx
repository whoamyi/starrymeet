import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '@/utils';
import type { Booking } from '@/types';

interface UpcomingBookingsProps {
  bookings: Booking[];
}

export const UpcomingBookings = ({ bookings }: UpcomingBookingsProps) => {
  if (!bookings?.length) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
          <Link to="/browse.html" className="text-[#D4A574] text-sm font-semibold">
            Book a Meeting
          </Link>
        </div>
        <div className="bg-gray-900/50 rounded-2xl p-8 text-center">
          <p className="text-gray-400">No upcoming meetings</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
        <Link to="/react/bookings" className="text-[#D4A574] text-sm font-semibold">
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {bookings.slice(0, 3).map((booking) => (
          <Link
            key={booking.id}
            to={`/booking-details.html?id=${booking.id}`}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800 hover:border-[#D4A574] transition-all"
          >
            {booking.celebrity?.profile_image && (
              <img
                src={booking.celebrity.profile_image}
                alt={booking.celebrity.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                {booking.celebrity?.name || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-400">
                📅 {formatDate(booking.booking_date, 'MMM d')} at {formatTime(booking.booking_time)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              booking.status === 'confirmed'
                ? 'bg-green-500/20 text-green-400'
                : booking.status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {booking.status}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
