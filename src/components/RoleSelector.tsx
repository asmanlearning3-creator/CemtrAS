import React from 'react';
import { Factory, BarChart3, TrendingUp, ShoppingCart, Wrench, Settings, Bot, Zap, Crown, Users, DollarSign, Building } from 'lucide-react';
import type { UserRole } from '../types';

interface RoleSelectorProps {
  selectedRole: UserRole | 'General AI';
  onRoleChange: (role: UserRole | 'General AI') => void;
}

const roles: { 
  value: UserRole | 'General AI' | 'CEO' | 'Sales Head' | 'Marketing Manager' | 'Operations Manager' | 'HR Director' | 'Finance Manager'; 
  label: string; 
  icon: React.ReactNode; 
  gradient: string;
  description: string;
}[] = [
  { 
    value: 'CEO', 
    label: 'CEO', 
    icon: <Crown size={18} />, 
    gradient: 'from-purple-600 to-pink-600',
    description: 'Strategic leadership & executive decisions'
  },
  { 
    value: 'Sales Head', 
    label: 'Sales Head', 
    icon: <TrendingUp size={18} />, 
    gradient: 'from-green-500 to-emerald-500',
    description: 'Sales strategy & revenue growth'
  },
  { 
    value: 'Marketing Manager', 
    label: 'Marketing Manager', 
    icon: <TrendingUp size={18} />, 
    gradient: 'from-pink-500 to-rose-500',
    description: 'Brand management & market positioning'
  },
  { 
    value: 'Operations Manager', 
    label: 'Operations Manager', 
    icon: <Factory size={18} />, 
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Daily operations & process efficiency'
  },
  { 
    value: 'HR Director', 
    label: 'HR Director', 
    icon: <Users size={18} />, 
    gradient: 'from-teal-500 to-cyan-500',
    description: 'Talent management & organizational development'
  },
  { 
    value: 'Finance Manager', 
    label: 'Finance Manager', 
    icon: <DollarSign size={18} />, 
    gradient: 'from-emerald-500 to-green-500',
    description: 'Financial planning & budget management'
  },
  { 
    value: 'Operations', 
    label: 'Plant Operations', 
    icon: <Factory size={18} />, 
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Plant machinery & maintenance'
  },
  { 
    value: 'Project Management', 
    label: 'Project Management', 
    icon: <BarChart3 size={18} />, 
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Project planning & execution'
  },
  { 
    value: 'Procurement', 
    label: 'Procurement', 
    icon: <ShoppingCart size={18} />, 
    gradient: 'from-purple-500 to-violet-500',
    description: 'Supply chain & vendor management'
  },
  { 
    value: 'Engineering & Design', 
    label: 'Engineering & Design', 
    icon: <Settings size={18} />, 
    gradient: 'from-orange-500 to-red-500',
    description: 'Technical design & engineering'
  },
  { 
    value: 'General AI', 
    label: 'General AI Assistant', 
    icon: <Bot size={18} />, 
    gradient: 'from-indigo-500 to-purple-500',
    description: 'General purpose assistance'
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="space-y-2">
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => onRoleChange(role.value)}
          className={`w-full group relative overflow-hidden rounded-xl transition-all duration-200 ${
            selectedRole === role.value
              ? 'shadow-md'
              : 'shadow-sm hover:shadow-md'
          }`}
        >
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} ${
            selectedRole === role.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-90'
          } transition-opacity duration-300`}></div>
          
          {/* Content */}
          <div className={`relative p-3 ${
            selectedRole === role.value 
              ? 'text-white' 
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50'
          } transition-all duration-300`}>
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${
                selectedRole === role.value 
                  ? 'bg-white/20' 
                  : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20'
              } transition-all duration-300`}>
                {role.icon}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className={`font-medium text-sm ${
                  selectedRole === role.value ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-white'
                } transition-colors duration-300 truncate`}>
                  {role.label}
                </div>
                <div className={`text-xs leading-tight ${
                  selectedRole === role.value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400 group-hover:text-white/80'
                } transition-colors duration-300 truncate`}>
                  {role.description}
                </div>
              </div>
              {selectedRole === role.value && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};