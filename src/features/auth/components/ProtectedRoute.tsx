import { useEffect } from 'react';
import { useAuthStore } from '../../../store/auth';
import { authApi } from '../api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, user, setAuth } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token && !user) {
        try {
          const userData = await authApi.getCurrentUser();
          setAuth(true, userData);
        } catch (error) {
          // Token invalid, clear auth
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          setAuth(false, null);
        }
      }
    };

    checkAuth();
  }, [user, setAuth]);

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cần đăng nhập
          </h2>
          <p className="text-gray-600 mb-4">
            Vui lòng đăng nhập để truy cập trang này
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
