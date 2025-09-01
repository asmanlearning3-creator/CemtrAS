import React from 'react';
import { Factory, BarChart3, TrendingUp, ShoppingCart, Wrench, Settings, Bot, Zap } from 'lucide-react';
import type { UserRole } from '../types';

interface RoleSelectorProps {
  selectedRole: UserRole | 'General AI';
  onRoleChange: (role: UserRole | 'General AI') => void;
}

const roles: { 
  value: UserRole | 'General AI'; 
  label: string; 
  icon: React.ReactNode; 
  gradient: string;
  description: string;
}[] = [
  { 
    value: 'Operations', 
    label: 'Operations & Maintenance', 
    icon: <Factory size={20} />, 
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Machinery troubleshooting & process optimization'
  },
  { 
    value: 'Project Management', 
    label: 'Project Management', 
    icon: <BarChart3 size={20} />, 
    gradient: 'from-blue-500 to-cyan-500',
    description: 'EPC scheduling & resource planning'
  },
  { 
    value: 'Sales & Marketing', 
    label: 'Sales & Marketing', 
    icon: <TrendingUp size={20} />, 
    gradient: 'from-green-500 to-emerald-500',
    description: 'Market analysis & customer strategies'
  },
  { 
    value: 'Procurement', 
    label: 'Procurement & Supply Chain', 
    icon: <ShoppingCart size={20} />, 
    gradient: 'from-purple-500 to-violet-500',
    description: 'Vendor negotiations & inventory optimization'
  },
  { 
    value: 'Erection & Commissioning', 
    label: 'Erection & Commissioning', 
    icon: <Wrench size={20} />, 
    gradient: 'from-red-500 to-pink-500',
    description: 'Installation sequencing & safety compliance'
  },
  { 
    value: 'Engineering & Design', 
    label: 'Engineering & Design', 
    icon: <Settings size={20} />, 
    gradient: 'from-orange-500 to-red-500',
    description: 'Process flow design & equipment selection'
  },
  { 
    value: 'General AI', 
    label: 'General AI Assistant', 
    icon: <Bot size={20} />, 
    gradient: 'from-indigo-500 to-purple-500',
    description: 'General purpose AI for any questions'
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="space-y-3">
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => onRoleChange(role.value)}
          className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
            selectedRole === role.value
              ? 'shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
              : 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} ${
            selectedRole === role.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'
          } transition-opacity duration-300`}></div>
          
          {/* Content */}
          <div className={`relative p-4 ${
            selectedRole === role.value 
              ? 'text-white' 
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50'
          } transition-all duration-300`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl shadow-lg ${
                selectedRole === role.value 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 group-hover:backdrop-blur-sm'
              } transition-all duration-300`}>
                {role.icon}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className={`font-bold text-sm mb-1 ${
                  selectedRole === role.value ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-white'
                } transition-colors duration-300 truncate`}>
                  {role.label}
                </div>
                <div className={`text-xs ${
                  selectedRole === role.value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400 group-hover:text-white/80'
                } transition-colors duration-300 truncate`}>
                  {role.description}
                </div>
              </div>
              {selectedRole === role.value && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};