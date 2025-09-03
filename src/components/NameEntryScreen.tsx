import React, { useState, useEffect } from 'react';
import { Factory, User, ArrowRight, Sparkles, Shield, Zap, Lightbulb, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NameEntryScreenProps {
  onComplete: () => void;
}

export const NameEntryScreen: React.FC<NameEntryScreenProps> = ({ onComplete }) => {
  const { authenticateWithName, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // Smart validation with real-time feedback
  useEffect(() => {
    const trimmedName = name.trim();
    const isValidName = trimmedName.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmedName);
    setIsValid(isValidName);
    
    // Progressive validation feedback
    if (!touched) {
      setValidationState('idle');
      setShowHint(false);
    } else if (trimmedName.length === 0) {
      setValidationState('idle');
      setShowHint(false);
    } else if (isValidName) {
      setValidationState('valid');
      setShowHint(false);
    } else {
      setValidationState('invalid');
      setShowHint(true);
    }
  }, [name, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    if (!isValid) {
      return;
    }

    // Smart formatting: capitalize first letter of each word
    const formattedName = name.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const success = await authenticateWithName(formattedName);
    if (success) {
      setTimeout(() => onComplete(), 500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!touched) setTouched(true);
    clearError();
  };

  // Smart defaults for quick access
  const quickNameOptions = [
    { name: 'Guest User', description: 'Quick access' },
    { name: 'Plant Manager', description: 'Operations role' },
    { name: 'Project Lead', description: 'Management role' }
  ];

  const handleQuickSelect = (selectedName: string) => {
    setName(selectedName);
    setTouched(true);
    // Auto-submit after brief delay for better UX
    setTimeout(() => {
      const formattedName = selectedName.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      authenticateWithName(formattedName).then(success => {
        if (success) {
          setTimeout(() => onComplete(), 300);
        }
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Skip Link for Screen Readers */}
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50">
        Skip to main content
      </a>

      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border-4 border-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border-4 border-indigo-500 rounded-lg rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 border-4 border-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main id="main-content" className="max-w-6xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Branding & Features */}
          <div className="text-center lg:text-left space-y-8">
            {/* Enhanced Logo & Branding */}
            <header className="space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-2xl"></div>
                <div className="relative p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl w-24 h-24 flex items-center justify-center backdrop-blur-sm">
                  <div className="absolute inset-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg flex items-center justify-center">
                    <Factory className="text-white w-8 h-8" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="text-white w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  CemtrAS AI
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-16"></div>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                    AI-DRIVEN ENGINEERING
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-16"></div>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                  Your trusted partner in building and optimizing world-class cement plants
                </p>
              </div>
            </header>

            {/* Available Expertise Areas */}
            <section className="space-y-6" aria-labelledby="expertise-heading">
              <div className="text-center lg:text-left">
                <h2 id="expertise-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center lg:justify-start gap-3">
                  <Zap className="w-6 h-6 text-blue-500" />
                  Available Expertise Areas
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose from specialized AI experts for your cement plant needs
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { 
                    title: 'Operations & Maintenance', 
                    icon: <Factory size={20} />, 
                    gradient: 'from-yellow-500 to-orange-500',
                    description: 'Machinery troubleshooting & optimization'
                  },
                  { 
                    title: 'Project Management', 
                    icon: <Shield size={20} />, 
                    gradient: 'from-blue-500 to-cyan-500',
                    description: 'EPC scheduling & resource planning'
                  },
                  { 
                    title: 'Sales & Marketing', 
                    icon: <Zap size={20} />, 
                    gradient: 'from-green-500 to-emerald-500',
                    description: 'Market analysis & strategies'
                  },
                  { 
                    title: 'Procurement', 
                    icon: <ArrowRight size={20} />, 
                    gradient: 'from-purple-500 to-violet-500',
                    description: 'Supply chain optimization'
                  },
                  { 
                    title: 'Engineering & Design', 
                    icon: <Lightbulb size={20} />, 
                    gradient: 'from-orange-500 to-red-500',
                    description: 'Process design & equipment selection'
                  },
                  { 
                    title: 'General AI Assistant', 
                    icon: <Sparkles size={20} />, 
                    gradient: 'from-indigo-500 to-purple-500',
                    description: 'General purpose AI assistance'
                  }
                ].map((area, index) => (
                  <div
                    key={index}
                    className="group p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 bg-gradient-to-br ${area.gradient} rounded-lg shadow-md flex-shrink-0`}>
                        <div className="text-white">
                          {area.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 leading-tight">
                          {area.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Attribution */}
            <footer className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Made By <span className="text-blue-600 dark:text-blue-400 font-semibold">Vipul</span></span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Idea By <span className="text-purple-600 dark:text-purple-400 font-semibold">Akanksha</span></span>
                </div>
              </div>
            </footer>
          </div>

          {/* Right Column - Enhanced Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {/* Form Header */}
              <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <User size={24} />
                  <h2 className="text-2xl font-bold">Welcome!</h2>
                </div>
                <p className="text-blue-100 text-sm">Enter your name to access premium AI expertise</p>
              </header>

              <div className="p-8">
                {/* Smart Error Display with Recovery Suggestions */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6" role="alert" aria-live="polite">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-700 dark:text-red-300 font-semibold text-sm mb-1">{error}</p>
                        <p className="text-red-600 dark:text-red-400 text-xs">
                          Try using only letters and spaces, minimum 2 characters
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Smart Quick Options - Progressive Disclosure */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Quick Start Options
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {quickNameOptions.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => handleQuickSelect(option.name)}
                          disabled={isLoading}
                          className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 text-left disabled:opacity-50"
                          aria-label={`Quick select: ${option.name} - ${option.description}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                              <User className="text-white w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                {option.name}
                              </span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                        or enter custom name
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Name Input with Smart Validation */}
                  <div className="space-y-3">
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Your Name
                    </label>
                    
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <User className="text-gray-400 w-5 h-5" />
                        {validationState === 'valid' && (
                          <Check className="text-green-500 w-4 h-4" />
                        )}
                      </div>
                      
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleInputChange}
                        className={`w-full pl-14 pr-6 py-4 border-2 rounded-xl text-base transition-all duration-200 font-medium bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none ${
                          validationState === 'idle' 
                            ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800' 
                            : validationState === 'valid' 
                              ? 'border-green-400 dark:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800' 
                              : 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800'
                        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="Enter your full name"
                        aria-label="Enter your full name"
                        aria-describedby={showHint ? "name-hint" : "name-help"}
                        aria-required="true"
                        aria-invalid={validationState === 'invalid'}
                        autoComplete="name"
                        autoFocus
                        disabled={isLoading}
                        spellCheck="false"
                      />
                    </div>
                    
                    {/* Smart Validation Feedback */}
                    {showHint && (
                      <div 
                        id="name-hint"
                        className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
                        role="alert"
                        aria-live="polite"
                      >
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Please use only letters and spaces (minimum 2 characters)</span>
                      </div>
                    )}
                    
                    {/* Positive feedback when valid */}
                    {validationState === 'valid' && (
                      <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                        <Check className="w-4 h-4" />
                        <span>Perfect! Ready to continue</span>
                      </div>
                    )}

                    {/* Helper text */}
                    <p id="name-help" className="text-xs text-gray-500 dark:text-gray-400">
                      We'll use this to personalize your experience
                    </p>
                  </div>

                  {/* Enhanced Submit Button with Smart States */}
                  <button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
                      !isValid || isLoading
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                    aria-label={isLoading ? 'Processing your request' : 'Continue to CemtrAS AI'}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Setting up your account...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to CemtrAS AI</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>

                {/* Premium Features Highlight */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-bold text-green-800 dark:text-green-300 text-sm">
                      Premium Access Included
                    </h3>
                  </div>
                  <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                    <li>• Unlimited AI consultations</li>
                    <li>• All expertise areas available</li>
                    <li>• File upload support</li>
                    <li>• Chat history & persistence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};