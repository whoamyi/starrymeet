import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = (requireAuth: boolean = true) => {
  const { isAuthenticated, user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    const verify = async () => {
      const isValid = checkAuth();
      if (requireAuth && !isValid) {
        window.location.href = '/auth';
      }
    };
    verify();
  }, [requireAuth, checkAuth]);

  return {
    isAuthenticated,
    user,
    logout,
    isLoggedIn: isAuthenticated,
    userName: user?.username || 'Guest',
    userEmail: user?.email || '',
    userInitials: user ? user.username.substring(0, 2).toUpperCase() : 'U'
  };
};
