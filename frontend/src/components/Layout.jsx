import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FiLogOut, FiHome, FiUsers, FiMenu, FiX } from 'react-icons/fi';

export function Layout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center w-full">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <FiHome className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Shamba Records</h1>
            </div>
            
            {/* Desktop Navigation - Visible on sm and up */}
            <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition"
              >
                <FiHome className="w-5 h-5 flex-shrink-0" />
                <span>Dashboard</span>
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/users')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <FiUsers className="w-5 h-5 flex-shrink-0" />
                  <span>Users</span>
                </button>
              )}
            </nav>

            {/* Desktop User Info & Logout - Visible on sm and up */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                <p className="text-xs text-gray-500 uppercase truncate">
                  {user?.role === 'admin' ? 'Admin' : 'Agent'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition text-sm whitespace-nowrap"
              >
                <FiLogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Hamburger Menu Button - Visible only on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu - Visible only on mobile when open */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-200 space-y-2">
              <button
                onClick={() => handleNavClick('/dashboard')}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition"
              >
                <FiHome className="w-5 h-5 flex-shrink-0" />
                <span>Dashboard</span>
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('/users')}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <FiUsers className="w-5 h-5 flex-shrink-0" />
                  <span>Users</span>
                </button>
              )}
              <div className="pt-2 border-t border-gray-200">
                <div className="px-3 py-2 text-xs">
                  <p className="font-medium text-gray-900">{user?.username}</p>
                  <p className="text-gray-500 uppercase">{user?.role === 'admin' ? 'Admin' : 'Agent'}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  <FiLogOut className="w-4 h-4 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-3 sm:p-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-3 sm:py-4 text-xs text-gray-500">
        <p>&copy; 2026 Shamba Records. All rights reserved.</p>
      </footer>
    </div>
  );
}
