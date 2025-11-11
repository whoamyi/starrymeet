import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminMessagesApi, adminApplicationsApi, celebrityApi } from '@/services/api';
import { Loading } from '@/components';

type TabType = 'messages' | 'applications' | 'bookings';

export const AdminCelebrityDetail = () => {
  const { celebrityId } = useParams<{ celebrityId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('messages');

  const { data: celebrity, isLoading: celebrityLoading } = useQuery({
    queryKey: ['celebrity', celebrityId],
    queryFn: () => celebrityApi.getById(celebrityId!),
    enabled: !!celebrityId,
  });

  const { data: conversations } = useQuery({
    queryKey: ['admin-conversations', celebrityId],
    queryFn: () => adminMessagesApi.getCelebrityConversations(celebrityId!),
    enabled: !!celebrityId && activeTab === 'messages',
  });

  const { data: applications } = useQuery({
    queryKey: ['admin-applications', celebrityId],
    queryFn: () => adminApplicationsApi.getCelebrityApplications(celebrityId!),
    enabled: !!celebrityId && activeTab === 'applications',
  });

  if (celebrityLoading) {
    return <Loading />;
  }

  if (!celebrity) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-gray-400">Celebrity not found</div>
      </div>
    );
  }

  const tabs = [
    { id: 'messages' as TabType, name: 'Messages', count: conversations?.length || 0 },
    { id: 'applications' as TabType, name: 'Applications', count: applications?.data?.length || 0 },
    { id: 'bookings' as TabType, name: 'Bookings', count: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Celebrity Header */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
        <div className="flex items-center space-x-6">
          {celebrity.profile_image ? (
            <img
              src={celebrity.profile_image}
              alt={celebrity.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl">
              {celebrity.name[0]}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{celebrity.name}</h1>
              {celebrity.verified && (
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-gray-400 mb-4">{celebrity.category}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="text-gray-500">Total Bookings: </span>
                <span className="text-white font-medium">{celebrity.total_bookings || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Rating: </span>
                <span className="text-white font-medium">{celebrity.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Status: </span>
                <span className={`font-medium ${celebrity.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                  {celebrity.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === tab.id
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'messages' && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Conversations</h3>
            {conversations && conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    to={`/admin/celebrity/${celebrityId}/messages/${conv.user_id}`}
                    className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {conv.User.avatar_url ? (
                          <img
                            src={conv.User.avatar_url}
                            alt={`${conv.User.first_name} ${conv.User.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                            {conv.User.first_name[0]}
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium">
                            {conv.User.first_name} {conv.User.last_name}
                          </div>
                          <div className="text-sm text-gray-400 truncate max-w-md">
                            {conv.last_message_preview}
                          </div>
                        </div>
                      </div>
                      {conv.unread_count_admin > 0 && (
                        <div className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
                          {conv.unread_count_admin}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No conversations yet</div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Applications</h3>
            {applications?.data && applications.data.length > 0 ? (
              <div className="space-y-3">
                {applications.data.map((app) => (
                  <div key={app.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-medium">
                        {app.user_first_name} {app.user_last_name}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        app.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                        app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {app.application_type} • {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No applications yet</div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Bookings</h3>
            <div className="text-center py-8 text-gray-500">Coming soon</div>
          </div>
        )}
      </div>
    </div>
  );
};
