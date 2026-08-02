import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FilePlus, FileText, CheckSquare, 
  History, Users, Settings, UserCircle, LogOut, Menu, X, Bell, Building
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: `/${user?.role?.toLowerCase().replace('role_', '')}` },
    ...(user?.role === 'ROLE_STUDENT' ? [
      { name: 'Create Request', icon: FilePlus, path: '/student/create' },
      { name: 'My Requests', icon: FileText, path: '/student/requests' }
    ] : []),
    ...(user?.role === 'ROLE_MENTOR' || user?.role === 'ROLE_HOD' || user?.role === 'ROLE_PRINCIPAL' ? [
      { name: 'Pending Approvals', icon: CheckSquare, path: `/${user?.role?.toLowerCase().replace('role_', '')}/pending` },
    ] : []),
    ...(user?.role === 'ROLE_ADMIN' ? [
      { name: 'Manage Students', icon: Users, path: '/admin/users' },
      { name: 'Manage Mentors', icon: UserCircle, path: '/admin/mentors' },
      { name: 'Manage HODs', icon: Building, path: '/admin/hods' },
    ] : []),
    { name: 'History', icon: History, path: '/history' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="fixed inset-y-0 left-0 z-50 md:relative h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
          >
            <div className="p-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KS</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white whitespace-nowrap">KSRCE Portal</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                      location.pathname === item.path 
                        ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/30 dark:text-primary-400' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-primary-600' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium whitespace-nowrap">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                {location.pathname.split('/').pop().replace('-', ' ') || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('ROLE_', '').toLowerCase()}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={location.pathname}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
