import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FiLogOut, FiHome, FiList, FiUsers } from 'react-icons/fi';

export function Layout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiHome className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Shamba Records</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500 uppercase">
                {user?.role === 'admin' ? 'Administrator' : 'Field Agent'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow">
          <nav className="p-6 space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 rounded text-gray-700"
            >
              <FiHome className="w-5 h-5" />
              Dashboard
            </button>
            {user?.role === 'user' && (
              <button
                onClick={() => navigate('/my-fields')}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 rounded text-gray-700"
              >
                <FiList className="w-5 h-5" />
                My Fields
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/users')}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 rounded text-gray-700"
              >
                <FiUsers className="w-5 h-5" />
                Users
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        <p>&copy; 2026 Shamba Records. All rights reserved.</p>
      </footer>
    </div>
  );
}
