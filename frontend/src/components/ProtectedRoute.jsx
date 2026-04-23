import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403 Forbidden</h1>
          <p className="text-gray-600 mb-6">You do not have permission to access this page.</p>
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
