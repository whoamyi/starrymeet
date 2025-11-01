import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils';

export const ProfileInfo = () => {
  const { user } = useAuthStore();

  const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-800">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value || 'Not set'}</span>
    </div>
  );

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Profile Information</h2>
      <div>
        <InfoRow label="Username" value={user?.username} />
        <InfoRow label="Email" value={user?.email} />
        <InfoRow label="Bio" value={user?.bio} />
        <InfoRow label="Location" value={user?.location} />
        <InfoRow
          label="Member Since"
          value={user?.created_at ? formatDate(user.created_at, 'MMMM d, yyyy') : undefined}
        />
      </div>
    </div>
  );
};
