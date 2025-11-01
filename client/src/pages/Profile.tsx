import { useState } from 'react';
import { Header, BottomNav } from '@/components';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

export const Profile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <ProfileHeader onEditClick={() => setIsEditModalOpen(true)} />
        <ProfileInfo />

        {/* Account Settings Link */}
        <div className="bg-gray-900/50 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Account Settings</h2>
          <a
            href="/settings.html"
            className="flex items-center justify-between py-3 hover:text-[#D4A574] transition"
          >
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
              </svg>
              <span>Account Settings</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>
      </main>
      <BottomNav />
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};
