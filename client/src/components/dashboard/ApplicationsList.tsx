import { Link } from 'react-router-dom';
import { formatDate } from '@/utils';
import type { DashboardApplication } from '@/types';

interface ApplicationsListProps {
  applications: DashboardApplication[];
}

export const ApplicationsList = ({ applications }: ApplicationsListProps) => {
  if (!applications?.length) {
    return (
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Meeting Applications</h2>
          <Link to="/browse" className="text-[rgba(255, 255, 255, 0.8)] text-sm font-semibold">
            Browse Celebrities
          </Link>
        </div>
        <div className="bg-gray-900/50 rounded-2xl p-8 text-center">
          <p className="text-gray-400">No applications yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Start by applying to meet your favorite celebrity
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Meeting Applications</h2>
      </div>
      <div className="space-y-3">
        {applications.slice(0, 5).map((application) => (
          <div
            key={application.id}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 flex items-center gap-4"
          >
            {application.celebrity_image && (
              <img
                src={application.celebrity_image}
                alt={application.celebrity_name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">
                  {application.celebrity_name || 'Unknown'}
                </h3>
                <span className="text-lg">
                  {application.application_type === 'professional' ? '💼' : '💫'}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {application.application_type === 'professional' ? 'Professional' : 'Personal'} Application
              </p>
              <p className="text-xs text-gray-500 mt-1">
                📅 Applied {formatDate(application.created_at, 'MMM d, yyyy')}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              application.status === 'approved'
                ? 'bg-green-500/20 text-green-400'
                : application.status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400'
                : application.status === 'under_review'
                ? 'bg-blue-500/20 text-blue-400'
                : application.status === 'rejected'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
