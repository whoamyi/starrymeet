import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but not admin, redirect to user dashboard
  if (user?.role !== 'admin') {
    console.warn('[AdminRoute] Access denied: User is not an admin');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
