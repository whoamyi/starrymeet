import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Header, BottomNav } from '@/components';
import { toastConfig } from '@/hooks/useToast';

interface SettingsData {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  currency: string;
  timezone: string;
  language: string;
}

export const Settings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<SettingsData>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
  });

  // TODO: Replace with actual API calls when backend is ready
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: SettingsData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toastConfig.success('Settings saved successfully');
    },
    onError: () => {
      toastConfig.error('Failed to save settings');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toastConfig.success('Account deleted');
      // Redirect to auth or home
      window.location.href = '/react/auth';
    },
    onError: () => {
      toastConfig.error('Failed to delete account');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettingsMutation.mutate(formData);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      deleteAccountMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your preferences and account settings</p>
        </div>

        {/* Settings Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notification Toggles */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) =>
                      setFormData({ ...formData, emailNotifications: e.target.checked })
                    }
                    className="w-5 h-5 bg-gray-800 border-gray-700 rounded focus:ring-[#D4A574] focus:ring-2"
                  />
                  <div>
                    <div className="text-white font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-400">
                      Receive updates about your bookings via email
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.smsNotifications}
                    onChange={(e) =>
                      setFormData({ ...formData, smsNotifications: e.target.checked })
                    }
                    className="w-5 h-5 bg-gray-800 border-gray-700 rounded focus:ring-[#D4A574] focus:ring-2"
                  />
                  <div>
                    <div className="text-white font-medium">SMS Notifications</div>
                    <div className="text-sm text-gray-400">
                      Receive text messages for important updates
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.marketingEmails}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingEmails: e.target.checked })
                    }
                    className="w-5 h-5 bg-gray-800 border-gray-700 rounded focus:ring-[#D4A574] focus:ring-2"
                  />
                  <div>
                    <div className="text-white font-medium">Marketing Emails</div>
                    <div className="text-sm text-gray-400">
                      Receive promotional offers and news
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6"></div>

            {/* Regional Settings */}
            <h3 className="text-lg font-bold text-white mb-4">Regional Settings</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#D4A574] transition"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#D4A574] transition"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#D4A574] transition"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saveSettingsMutation.isPending}
              className="w-full bg-[#D4A574] text-black font-semibold py-3 rounded-xl hover:bg-[#C49563] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <p className="text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
