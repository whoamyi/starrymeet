import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils';

interface ProfileHeaderProps {
  onEditClick: () => void;
}

export const ProfileHeader = ({ onEditClick }: ProfileHeaderProps) => {
  const { user } = useAuthStore();

  return (
    <div className="bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.7)] rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-black"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-black border-4 border-black flex items-center justify-center text-3xl font-bold text-[rgba(255, 255, 255, 0.8)]">
              {getInitials(user?.username || 'U')}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-1">
            {user?.username}
          </h1>
          <p className="text-black/70">{user?.email}</p>
        </div>
        <button
          onClick={onEditClick}
          className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-black/80 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};
