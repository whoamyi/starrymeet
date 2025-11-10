import { Link } from 'react-router-dom';

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  to: string;
}

const ActionCard = ({ icon, title, description, to }: ActionCardProps) => (
  <Link
    to={to}
    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-800 hover:border-[rgba(255, 255, 255, 0.8)] transition-all"
  >
    <div className="text-4xl">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </Link>
);

interface QuickActionsProps {
  stats?: {
    upcoming_count?: number;
    completed_count?: number;
    pending_count?: number;
    saved_count?: number;
    unread_notifications_count?: number;
  };
}

export const QuickActions = ({ stats }: QuickActionsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <ActionCard
      icon="🔍"
      title="Browse Celebrities"
      description="Discover your favorites"
      to="/browse"
    />
    <ActionCard
      icon="💬"
      title="Messages"
      description={stats?.unread_notifications_count ? `${stats.unread_notifications_count} new notifications` : 'No new notifications'}
      to="/messages"
    />
    <ActionCard
      icon="⭐"
      title="Favorites"
      description={`${stats?.saved_count || 0} saved`}
      to="/favorites"
    />
  </div>
);
