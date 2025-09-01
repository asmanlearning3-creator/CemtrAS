import React from 'react';
import { Bot, Sparkles, Zap } from 'lucide-react';

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex gap-6 mb-8">
      {/* Enhanced Avatar */}
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center 
                      bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 shadow-xl">
        <Bot size={18} className="text-white" />
      </div>
      
      {/* Enhanced Loading Bubble */}
      <div className="flex-1 max-w-4xl">
        <div className="inline-block px-6 py-4 rounded-2xl rounded-bl-lg 
                        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex items-center gap-6">
            {/* Enhanced Loading Animation */}
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            {/* Enhanced Status Text */}
            <div className="flex items-center gap-3">
              <Zap className="text-blue-600 dark:text-blue-400 animate-pulse" size={18} />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-bold">
                CemtrAS AI is analyzing your query...
              </span>
              <Sparkles className="text-yellow-500 animate-spin" size={16} />
            </div>
          </div>
        </div>
        
        {/* Enhanced Timestamp */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-semibold flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
          <span>CemtrAS AI</span>
          <span>•</span>
          <span>Processing...</span>
        </div>
      </div>
    </div>
  );
};