import React from 'react';
import { AlertTriangle, RefreshCw, Zap } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200/50 dark:border-red-800/50 rounded-2xl p-6 mb-6 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-6">
        {/* Enhanced Error Icon */}
        <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl">
          <AlertTriangle className="text-white" size={24} />
        </div>
        
        {/* Enhanced Error Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-red-600 dark:text-red-400 w-4 h-4" />
            <h3 className="text-lg font-black text-red-800 dark:text-red-200">System Error</h3>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed font-medium">{message}</p>
        </div>
        
        {/* Enhanced Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm rounded-2xl 
                     hover:from-red-700 hover:to-pink-700 transition-all duration-200 font-bold
                     flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};