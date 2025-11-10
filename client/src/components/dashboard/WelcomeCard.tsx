import { useAuthStore } from '@/store/auth';

export const WelcomeCard = () => {
  const { user } = useAuthStore();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // Get first name from user
  const firstName = (user as any)?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <div className="bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.7)] rounded-2xl p-6 mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-black/70">Ready to connect with your icons?</p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-black">{timeStr}</div>
        <div className="text-sm text-black/70">{dateStr}</div>
      </div>
    </div>
  );
};
