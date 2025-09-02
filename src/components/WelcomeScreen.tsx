import React from 'react';
import { Factory, Sparkles, ArrowRight, Zap, Shield, Target } from 'lucide-react';
import type { UserRole } from '../types';

interface WelcomeScreenProps {
  selectedRole: UserRole | 'General AI';
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ selectedRole }) => {
  return (
    <div className="text-center py-16 px-6">
      {/* Enhanced Logo Section */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="relative p-12 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl w-48 h-48 mx-auto flex items-center justify-center backdrop-blur-sm">
          <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg flex items-center justify-center">
            <Factory className="text-white w-20 h-20" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="text-white w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Enhanced Branding */}
      <div className="mb-12">
        <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          CemtrAS AI
        </h1>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-32"></div>
          <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
            AI-DRIVEN ENGINEERING
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-32"></div>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed">
          Your trusted partner in building and optimizing world-class cement plants
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">Premium Access Activated</span>
        </div>
      </div>

      {/* Current Role Display */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="text-white w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Current Expertise
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedRole} Expert
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-2xl mx-auto">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-2xl text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-yellow-300" />
            <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
          </div>
          <p className="text-blue-100 mb-6 text-lg">
            Ask me anything about cement plant operations, and I'll provide expert guidance tailored to your needs.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-200">
            <span className="text-sm font-medium">Start typing below</span>
            <ArrowRight className="w-4 h-4 animate-bounce" style={{ animationDirection: 'alternate' }} />
          </div>
        </div>
      </div>
    </div>
  );
};