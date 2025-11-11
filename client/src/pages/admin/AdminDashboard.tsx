import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminDashboardApi } from '@/services/api';
import { Loading } from '@/components';

export const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: adminDashboardApi.getStats,
  });

  const { data: celebrities, isLoading: celebsLoading } = useQuery({
    queryKey: ['admin-celebrity-overview'],
    queryFn: () => adminDashboardApi.getCelebrityOverview(),
  });

  if (statsLoading || celebsLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of all celebrity profiles and platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Messages Stats */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Messages</h3>
            <span className="text-2xl">💬</span>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {stats?.messaging.total_unread_messages || 0}
            </div>
            <div className="text-sm text-gray-400">Unread messages</div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
              <span className="text-gray-500">Total conversations</span>
              <span className="text-white font-medium">
                {stats?.messaging.total_conversations || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Applications Stats */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Applications</h3>
            <span className="text-2xl">📝</span>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {stats?.applications.pending_applications || 0}
            </div>
            <div className="text-sm text-gray-400">Pending review</div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
              <span className="text-gray-500">Total applications</span>
              <span className="text-white font-medium">
                {stats?.applications.total_applications || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Celebrities Stats */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Celebrities</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {stats?.celebrities.active_celebrities || 0}
            </div>
            <div className="text-sm text-gray-400">Active profiles</div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
              <span className="text-gray-500">Featured</span>
              <span className="text-white font-medium">
                {stats?.celebrities.featured_celebrities || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Users Stats */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Users</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {stats?.users.users_this_week || 0}
            </div>
            <div className="text-sm text-gray-400">New this week</div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800">
              <span className="text-gray-500">Total users</span>
              <span className="text-white font-medium">
                {stats?.users.total_users || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Celebrity Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Celebrity Profiles</h2>
          <div className="text-sm text-gray-400">
            {celebrities?.length || 0} profiles with activity
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {celebrities?.map((celebrity) => (
            <Link
              key={celebrity.id}
              to={`/admin/celebrity/${celebrity.id}`}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition group"
            >
              {/* Celebrity Header */}
              <div className="flex items-center space-x-4 mb-4">
                {celebrity.avatar_url ? (
                  <img
                    src={celebrity.avatar_url}
                    alt={celebrity.display_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                    {celebrity.display_name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-gray-200">
                    {celebrity.display_name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{celebrity.category}</p>
                </div>
                {celebrity.is_verified && (
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              {/* Activity Badges */}
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {celebrity.unread_messages > 0 && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                    <span>💬</span>
                    <span className="font-medium">{celebrity.unread_messages}</span>
                    <span className="text-xs">unread</span>
                  </div>
                )}
                {celebrity.pending_applications > 0 && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
                    <span>📝</span>
                    <span className="font-medium">{celebrity.pending_applications}</span>
                    <span className="text-xs">pending</span>
                  </div>
                )}
                {celebrity.conversation_count > 0 && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm">
                    <span>{celebrity.conversation_count}</span>
                    <span className="text-xs">conversations</span>
                  </div>
                )}
              </div>

              {/* Arrow indicator */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>Manage profile</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {(!celebrities || celebrities.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No celebrity profiles with activity yet
          </div>
        )}
      </div>
    </div>
  );
};
