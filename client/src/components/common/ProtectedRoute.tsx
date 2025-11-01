import { useAuthStore } from '@/store/authStore';
import { Loading } from './Loading';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = () => {
      checkAuth();
      setChecking(false);
    };
    verify();
  }, [checkAuth]);

  if (checking) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    window.location.href = '/auth';
    return null;
  }

  return <>{children}</>;
};
