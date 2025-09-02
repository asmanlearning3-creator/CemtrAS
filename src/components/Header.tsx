import React from 'react';
import { Menu, X, Factory, User, Moon, Sun, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { UserRole } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedRole: UserRole | 'General AI';
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, selectedRole }) => {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg flex-shrink-0" role="banner">
      <div className="flex items-center justify-between">
        {/* Left Section - Enhanced Branding */}
        <div className="flex items-center gap-4" role="group" aria-label="CemtrAS AI branding and navigation">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200 backdrop-blur-sm accessible-button focus-ring-enhanced"
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? (
              <X className="text-gray-700 dark:text-gray-300" size={24} />
            ) : (
              <Menu className="text-gray-700 dark:text-gray-300" size={24} />
            )}
          </button>

          {/* Enhanced App Branding */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl blur-sm opacity-50"></div>
              <div className="relative p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
                <Factory className="text-white" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="text-white w-3 h-3" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dyslexia-friendly">
                CemtrAS AI
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 dyslexia-friendly" aria-live="polite">
                  {selectedRole} Expert Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Enhanced Controls */}
        <div className="flex items-center gap-4" role="group" aria-label="User controls">
          {/* Enhanced Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 accessible-button focus-ring-enhanced"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="text-yellow-500 w-5 h-5" />
            ) : (
              <Moon className="text-gray-600 w-5 h-5" />
            )}
          </button>

          {/* Enhanced User Section */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-green-100/80 dark:bg-green-900/30 rounded-xl border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm" role="status" aria-label="User status">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-700 dark:text-green-400 dyslexia-friendly">
                Online & Ready
              </span>
            </div>

            {user ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm" role="group" aria-label="User profile">
                <span className="text-sm font-bold text-accessible dark:text-accessible-dark hidden md:inline dyslexia-friendly">
                  {user.name}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg" aria-label={`${user.name}'s profile`}>
                  <User className="text-white" size={18} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg">
                  <img 
                    src="/untitled (10).jpeg"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};