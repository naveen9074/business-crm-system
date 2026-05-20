import React from 'react';
import { useAuth } from '../store/AuthContext';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return children;
  }

  return (
    <div className="flex h-screen crm-bg">
      {/* Sidebar */}
      <Sidebar
        userRole={user.role}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-6 z-20 shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {user.role === 'admin' ? 'Admin Panel' : user.role === 'manager' ? 'Manager Panel' : 'Employee Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Info */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200/60">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-md">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800 leading-tight">{user.name}</p>
                <p className="text-[11px] text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-8 animate-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
