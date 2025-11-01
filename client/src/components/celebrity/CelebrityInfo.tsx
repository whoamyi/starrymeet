import type { Celebrity } from '@/types';

interface CelebrityInfoProps {
  celebrity: Celebrity;
}

export const CelebrityInfo = ({ celebrity }: CelebrityInfoProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* About */}
      <div className="md:col-span-2">
        <div className="bg-gray-900/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {celebrity.bio || 'No bio available.'}
          </p>
        </div>
      </div>

      {/* Quick Info */}
      <div className="space-y-4">
        <div className="bg-gray-900/50 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Quick Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#D4A574]">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <p className="text-gray-400">Response Time</p>
                <p className="text-white font-medium">{celebrity.response_time || 'Within 24 hours'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#D4A574]">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
              </svg>
              <div>
                <p className="text-gray-400">Status</p>
                <p className="text-white font-medium capitalize">{celebrity.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        {celebrity.available_dates && celebrity.available_dates.length > 0 && (
          <div className="bg-gray-900/50 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Upcoming Availability</h3>
            <div className="space-y-2">
              {celebrity.available_dates.slice(0, 3).map((date, index) => (
                <div key={index} className="text-sm">
                  <p className="text-gray-400">{date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
