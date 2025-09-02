import React, { useState } from 'react';
import { Factory, User, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NameEntryScreenProps {
  onComplete: () => void;
}

export const NameEntryScreen: React.FC<NameEntryScreenProps> = ({ onComplete }) => {
  const { authenticateWithName, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Skip Link for Screen Readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border-4 border-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border-4 border-indigo-500 rounded-lg rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 border-4 border-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main id="main-content" className="max-w-lg w-full relative z-10">
        {/* Enhanced Header */}
        <header className="text-center mb-12">
          {/* Enhanced Logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-2xl"></div>
            <div className="relative p-8 bg-gradient-to-br from-white to-blue-50 rounded-3xl border-2 border-blue-200 shadow-2xl w-32 h-32 mx-auto flex items-center justify-center backdrop-blur-sm">
              <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg flex items-center justify-center">
                <Factory className="text-white w-12 h-12" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="text-white w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Enhanced Branding */}
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 dyslexia-friendly">
            CemtrAS AI
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-24"></div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
              AI-DRIVEN ENGINEERING
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-24"></div>
          </div>
          <p className="text-lg text-slate-600 font-medium">Enter your name to access all premium features</p>
        </header>

        {/* Enhanced Name Entry Form */}
        <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-slate-200/50 overflow-hidden" aria-labelledby="name-entry-heading">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-8 text-center">
            <h2 id="name-entry-heading" className="text-2xl font-bold flex items-center justify-center gap-3 dyslexia-friendly">
              <User size={24} />
              Welcome! What's your name?
            </h2>
          </div>

          <div className="p-8">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 text-center backdrop-blur-sm" role="alert" aria-live="polite">
                <p className="text-red-700 font-bold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced Name Input */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full pl-14 pr-6 py-5 border-2 border-slate-300 rounded-2xl 
                           focus:border-blue-500 focus:outline-none transition-all duration-200
                           font-bold text-lg bg-white/80 backdrop-blur-sm shadow-lg
                           hover:shadow-xl focus:shadow-xl"
                  aria-label="Enter your full name"
                  aria-describedby="name-help character-count"
                  aria-required="true"
                  autoComplete="name"
                  required
                  minLength={2}
                  disabled={isLoading}
                />
              </div>

              {/* Character Count */}
              <div className="text-right" id="character-count" aria-live="polite">
                <span id="name-help" className="sr-only">
                  Enter at least 2 characters for your name
                </span>
                <span className={`text-xs font-bold ${
                  name.length >= 2 ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {name.length}/2 minimum characters
                </span>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                aria-describedby="submit-help"
                disabled={name.trim().length < 2 || isLoading}
                className="w-full py-5 px-8 bg-gradient-to-r from-blue-600 to-indigo-700
                         text-white font-black text-lg rounded-2xl transition-all duration-300 shadow-xl
                         hover:from-blue-700 hover:to-indigo-800 hover:shadow-2xl hover:-translate-y-1
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center gap-4"
              >
                <span id="submit-help" className="sr-only">Click to access all CemtrAS AI features</span>
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Getting Started...
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    Access All Features
                    <ArrowRight size={24} />
                  </>
                )}
              </button>
            </form>

            {/* Enhanced Features List */}
            <div className="mt-10 space-y-4">
              <h4 className="text-sm font-black text-slate-700 text-center mb-6 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                🚀 Available Expertise Areas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" role="list">
                {[
                  { 
                    title: 'Plant Operations & Maintenance', 
                    color: 'bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
                    icon: '⚙️',
                    description: 'Machinery troubleshooting & process optimization'
                  },
                  { 
                    title: 'Project Management', 
                    color: 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-800 border-blue-200',
                    icon: '📊',
                    description: 'EPC scheduling & resource planning'
                  },
                  { 
                    title: 'Sales & Marketing', 
                    color: 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 border-green-200',
                    icon: '📈',
                    description: 'Market analysis & customer strategies'
                  },
                  { 
                    title: 'Procurement & Supply Chain', 
                    color: 'bg-gradient-to-br from-purple-100 to-violet-100 text-purple-800 border-purple-200',
                    icon: '🛒',
                    description: 'Vendor negotiations & inventory optimization'
                  },
                  { 
                    title: 'Erection & Commissioning', 
                    color: 'bg-gradient-to-br from-red-100 to-pink-100 text-red-800 border-red-200',
                    icon: '🔧',
                    description: 'Installation sequencing & safety compliance'
                  },
                  { 
                    title: 'Engineering & Design', 
                    color: 'bg-gradient-to-br from-orange-100 to-red-100 text-orange-800 border-orange-200',
                    icon: '⚡',
                    description: 'Process flow design & equipment selection'
                  }
                ].map((feature, index) => (
                  <div key={index} className={`${feature.color} rounded-xl p-4 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 accessible-button`} role="listitem" tabIndex={0}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{feature.icon}</div>
                      <div className="font-bold text-xs leading-tight">{feature.title}</div>
                    </div>
                    <div className="text-xs opacity-80 leading-relaxed dyslexia-friendly">{feature.description}</div>
                  </div>
                ))}
              </div>
              
              {/* Additional Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="text-xs font-bold text-gray-600 text-center mb-4 flex items-center justify-center gap-2">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  Plus Premium Features
                </h5>
                <div className="grid grid-cols-2 gap-3 text-xs" role="list">
                  {[
                    { icon: '🤖', text: 'General AI Assistant', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                    { icon: '📎', text: 'File Upload Support', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { icon: '💾', text: 'Chat History & Sessions', color: 'bg-green-50 text-green-700 border-green-200' },
                    { icon: '🎯', text: 'Expert Consultation', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
                  ].map((feature, index) => (
                    <div key={index} className={`${feature.color} rounded-lg p-3 text-center font-bold backdrop-blur-sm border accessible-button`} role="listitem" tabIndex={0}>
                      <div className="text-base mb-1">{feature.icon}</div>
                      <div className="text-xs leading-tight dyslexia-friendly">{feature.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attribution */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dyslexia-friendly">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Made By <span className="font-bold text-blue-600">Vipul</span></span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dyslexia-friendly">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Idea By <span className="font-bold text-purple-600">Akanksha</span></span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};