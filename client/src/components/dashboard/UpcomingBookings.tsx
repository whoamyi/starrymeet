import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '@/utils';
import type { DashboardBooking } from '@/types';

interface UpcomingBookingsProps {
  bookings: DashboardBooking[];
}

export const UpcomingBookings = ({ bookings }: UpcomingBookingsProps) => {
  if (!bookings?.length) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
          <Link to="/browse" className="text-[rgba(255, 255, 255, 0.8)] text-sm font-semibold">
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
        <Link to="/bookings" className="text-[rgba(255, 255, 255, 0.8)] text-sm font-semibold">
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {bookings.slice(0, 3).map((booking) => (
          <Link
            key={booking.id}
            to={`/bookings`}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800 hover:border-[rgba(255, 255, 255, 0.8)] transition-all"
          >
            {booking.celebrity_image && (
              <img
                src={booking.celebrity_image}
                alt={booking.celebrity_name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                {booking.celebrity_name || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-400">
                📅 {formatDate(booking.meeting_date || booking.booking_date || '', 'MMM d')} {booking.booking_time ? `at ${formatTime(booking.booking_time)}` : ''}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              booking.status === 'confirmed' || booking.status === 'payment_complete'
                ? 'bg-green-500/20 text-green-400'
                : booking.status === 'pending' || booking.status.includes('pending')
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
