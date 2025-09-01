import React, { useState } from 'react';
import { Factory, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NameEntryScreenProps {
  onComplete: () => void;
}

export const NameEntryScreen: React.FC<NameEntryScreenProps> = ({ onComplete }) => {
  const { authenticateWithName, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 2) {
      return;
    }

    const success = await authenticateWithName(name);
    if (success) {
      setTimeout(() => onComplete(), 500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-yellow-500 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-blue-500 rounded-lg rotate-45"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-white rounded-full"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
              <Factory className="text-white" size={32} />
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500">
              <img 
                src="/untitled (10).jpeg" 
                alt="CemtrAS AI"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CemtrAS AI</h1>
          <p className="text-slate-300">Enter your name to access all premium features</p>
        </div>

        {/* Name Entry Form */}
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 text-center">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2">
              <User size={20} />
              Welcome! What's your name?
            </h2>
          </div>

          <div className="p-8">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-6 text-center">
                <p className="text-red-700 font-semibold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl 
                           focus:border-blue-500 focus:outline-none transition-colors 
                           font-semibold text-lg"
                  required
                  minLength={2}
                  disabled={isLoading}
                />
              </div>

              {/* Character Count */}
              <div className="text-right">
                <span className={`text-xs font-medium ${
                  name.length >= 2 ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {name.length}/2 minimum characters
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={name.trim().length < 2 || isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white
                         font-bold text-lg rounded-xl transition-all duration-300 shadow-lg
                         hover:from-blue-700 hover:to-blue-900 hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Getting Started...
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} />
                    Access All Features
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Features List */}
            <div className="mt-8 space-y-3">
              <h4 className="text-sm font-bold text-slate-700 text-center mb-4">
                🎉 You'll get instant access to:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>General AI Assistant</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>File Upload Capabilities</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Chat History & Saved Sessions</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>All Expert Consultation Areas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};