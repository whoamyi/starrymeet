import { useQuery } from '@tanstack/react-query';
import { Header, BottomNav, Loading } from '@/components';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingBookings } from '@/components/dashboard/UpcomingBookings';
import { SavedCelebrities } from '@/components/dashboard/SavedCelebrities';
import { dashboardApi } from '@/services/api';

export const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
  });

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Dashboard</h2>
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
        <WelcomeCard />
        <QuickActions stats={data?.stats} />
        <UpcomingBookings bookings={data?.upcoming_bookings || []} />
        <SavedCelebrities saved={data?.saved_celebrities || []} />
      </main>
      <BottomNav />
    </div>
  );
};
