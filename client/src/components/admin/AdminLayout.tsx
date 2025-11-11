import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export const AdminLayout = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Messages', path: '/admin/messages', icon: '💬' },
    { name: 'Applications', path: '/admin/applications', icon: '📝' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">StarryMeet</span>
              <span className="px-2 py-1 text-xs font-semibold text-black bg-white rounded">
                ADMIN
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive(item.path)
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                ← Back to User View
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {user?.first_name?.[0] || 'A'}
                </div>
                <span className="text-sm text-white">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};
