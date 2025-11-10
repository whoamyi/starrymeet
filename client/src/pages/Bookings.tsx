import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header, BottomNav, Loading } from '@/components';
import { BookingCard } from '@/components/bookings/BookingCard';
import { BookingFilters } from '@/components/bookings/BookingFilters';
import { bookingsApi } from '@/services/api';
import type { Booking } from '@/types';

export const Bookings = () => {
  const [selectedStatus, setSelectedStatus] = useState<Booking['status'] | 'all'>('all');

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.getAll(),
  });

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (selectedStatus === 'all') return bookings;
    return bookings.filter((b) => b.status === selectedStatus);
  }, [bookings, selectedStatus]);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <h1 className="text-3xl font-bold mb-6">Bookings</h1>
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Bookings</h2>
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
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        <BookingFilters selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />

        {filteredBookings.length === 0 ? (
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p className="text-gray-400 mb-4">
              {selectedStatus === 'all'
                ? 'No bookings yet'
                : `No ${selectedStatus} bookings`}
            </p>
            <a
              href="/browse"
              className="inline-block bg-[rgba(255, 255, 255, 0.8)] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[rgba(255, 255, 255, 0.7)] transition"
            >
              Browse Celebrities
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};
