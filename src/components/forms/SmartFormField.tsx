import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

interface SmartFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: React.ReactNode;
  helpText?: string;
  validationRules?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => string | null;
  };
  smartDefaults?: string[];
  disabled?: boolean;
}

export const SmartFormField: React.FC<SmartFormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  icon,
  helpText,
  validationRules,
  smartDefaults = [],
  disabled = false
}) => {
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Smart validation
  useEffect(() => {
    if (!touched || !value.trim()) {
      setValidationState('idle');
      setErrorMessage(null);
      return;
    }

    const trimmed = value.trim();
    
    // Apply validation rules
    if (validationRules) {
      if (validationRules.minLength && trimmed.length < validationRules.minLength) {
        setValidationState('invalid');
        setErrorMessage(`Minimum ${validationRules.minLength} characters required`);
        return;
      }
      
      if (validationRules.maxLength && trimmed.length > validationRules.maxLength) {
        setValidationState('invalid');
        setErrorMessage(`Maximum ${validationRules.maxLength} characters allowed`);
        return;
      }
      
      if (validationRules.pattern && !validationRules.pattern.test(trimmed)) {
        setValidationState('invalid');
        setErrorMessage('Please enter a valid format');
        return;
      }
      
      if (validationRules.customValidator) {
        const customError = validationRules.customValidator(trimmed);
        if (customError) {
          setValidationState('invalid');
          setErrorMessage(customError);
          return;
        }
      }
    }

    setValidationState('valid');
    setErrorMessage(null);
  }, [value, touched, validationRules]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (!touched) setTouched(true);
  };

  const handleQuickSelect = (defaultValue: string) => {
    onChange(defaultValue);
    setTouched(true);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-3">
      {/* Label */}
      <label 
        htmlFor={id} 
        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      {/* Smart Defaults - Progressive Disclosure */}
      {smartDefaults.length > 0 && !touched && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Quick options:</p>
          <div className="flex flex-wrap gap-2">
            {smartDefaults.map((defaultValue, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickSelect(defaultValue)}
                disabled={disabled}
                className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200 border border-blue-200 dark:border-blue-800 font-medium disabled:opacity-50"
              >
                {defaultValue}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <div className="text-gray-400 dark:text-gray-500">
              {icon}
            </div>
            {validationState === 'valid' && (
              <Check className="text-green-500 w-4 h-4" />
            )}
          </div>
        )}
        
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={handleInputChange}
          className={`w-full ${icon ? 'pl-14' : 'pl-4'} ${type === 'password' ? 'pr-12' : 'pr-4'} py-4 border-2 rounded-xl text-base transition-all duration-200 font-medium bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none ${
            validationState === 'idle' 
              ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800' 
              : validationState === 'valid' 
                ? 'border-green-400 dark:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800' 
                : 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800'
          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50`}
          placeholder={placeholder}
          aria-label={label}
          aria-describedby={errorMessage ? `${id}-error` : helpText ? `${id}-help` : undefined}
          aria-required={required}
          aria-invalid={validationState === 'invalid'}
          autoComplete={autoComplete}
          disabled={disabled}
          spellCheck="false"
        />

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {/* Smart Feedback Messages */}
      {errorMessage && (
        <div 
          id={`${id}-error`}
          className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {/* Positive feedback */}
      {validationState === 'valid' && !errorMessage && (
        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
          <Check className="w-4 h-4" />
          <span>Looks good!</span>
        </div>
      )}

      {/* Help text */}
      {helpText && !errorMessage && (
        <p id={`${id}-help`} className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {helpText}
        </p>
      )}
    </div>
  );
};