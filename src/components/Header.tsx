import React from 'react';
import { Menu, Factory, User, Moon, Sun, Sparkles, ChevronDown } from 'lucide-react';
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
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 shadow-sm flex-shrink-0" role="banner">
      <div className="flex items-center justify-between">
        {/* Left Section - Compact Branding */}
        <div className="flex items-center gap-3" role="group" aria-label="CemtrAS AI branding and navigation">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={sidebarOpen}
          >
            <Menu className="text-gray-700 dark:text-gray-300" size={20} />
          </button>

          {/* Compact App Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md">
              <Factory className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CemtrAS AI
            </h1>
          </div>
        </div>

        {/* Center Section - Role Selector */}
        <div className="hidden md:flex items-center">
          <RoleDropdown selectedRole={selectedRole} onRoleChange={() => {}} />
        </div>

        {/* Right Section - Compact Controls */}
        <div className="flex items-center gap-2" role="group" aria-label="User controls">
          {/* Compact Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="text-yellow-500 w-4 h-4" />
            ) : (
              <Moon className="text-gray-600 w-4 h-4" />
            )}
          </button>

          {/* Compact User Section */}
          {user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm" role="group" aria-label="User profile">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                {user.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm" aria-label={`${user.name}'s profile`}>
                <User className="text-white" size={14} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500 shadow-sm">
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
    </header>
  );
};

// Role Dropdown Component
interface RoleDropdownProps {
  selectedRole: UserRole | 'General AI';
  onRoleChange: (role: UserRole | 'General AI') => void;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ selectedRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const roles = [
    'CEO',
    'Sales Head', 
    'Marketing Manager',
    'Operations Manager',
    'HR Director',
    'Finance Manager',
    'Project Management',
    'Engineering & Design',
    'Procurement',
    'General AI'
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {selectedRole}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-20 max-h-64 overflow-y-auto">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  onRoleChange(role as UserRole | 'General AI');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
                  selectedRole === role ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};