import React, { useState, useEffect } from 'react';
import { Factory, User, ArrowRight, Sparkles, Shield, Zap, Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NameEntryScreenProps {
  onComplete: () => void;
}

export const NameEntryScreen: React.FC<NameEntryScreenProps> = ({ onComplete }) => {
  const { authenticateWithName, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Smart validation with real-time feedback
  useEffect(() => {
    const trimmedName = name.trim();
    const isValidName = trimmedName.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmedName);
    setIsValid(isValidName);
    
    // Show hint after user starts typing but name is invalid
    if (touched && trimmedName.length > 0 && !isValidName) {
      setShowHint(true);
    } else {
      setShowHint(false);
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

  // Smart defaults for common names
  const quickNameOptions = ['Guest User', 'Plant Manager', 'Operations Lead'];

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
              <div className="space-y-3">
                <label 
                  htmlFor="name" 
                  className="block text-base font-semibold text-gray-800 mb-3"
                >
                  What should we call you?
                </label>
                
                {/* Quick name options for faster onboarding */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm text-gray-600 mr-2">Quick options:</span>
                  {quickNameOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setName(option);
                        setTouched(true);
                      }}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-6 py-5 border-2 rounded-2xl text-lg transition-all duration-200 ${
                      !touched 
                        ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                        : isValid 
                          ? 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200' 
                          : 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    } font-bold bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none`}
                    placeholder="Enter your full name (e.g., John Smith)"
                    aria-label="Enter your full name"
                    aria-describedby={showHint ? "name-hint" : "character-count"}
                    aria-required="true"
                    autoComplete="name"
                    autoFocus
                    required
                    minLength={2}
                    disabled={isLoading}
                  />
                </div>
                
                {/* Progressive disclosure: Show validation hint only when needed */}
                {showHint && (
                  <div 
                    id="name-hint"
                    className="flex items-start space-x-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 animate-fadeIn"
                    role="alert"
                    aria-live="polite"
                  >
                    <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Please enter at least 2 characters using only letters and spaces</span>
                  </div>
                )}
                
                {/* Positive feedback when valid */}
                {touched && isValid && (
                  <div className="flex items-center space-x-2 text-sm text-green-700 animate-fadeIn">
                    <div className="w-4 h-4 