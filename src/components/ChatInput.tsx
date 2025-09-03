import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, X, FileText, Image, AlertCircle, Check } from 'lucide-react';
import type { FileUpload } from '../types';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  onFileUpload?: (files: FileUpload[]) => void;
  uploadedFiles?: FileUpload[];
  onRemoveFile?: (fileId: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  placeholder = "Type your message...",
  onFileUpload,
  uploadedFiles = [],
  onRemoveFile
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showCharCount, setShowCharCount] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const MAX_CHARS = 2000;
  const SHOW_COUNT_THRESHOLD = 1500;

  // Smart validation and character counting
  useEffect(() => {
    const trimmed = message.trim();
    const count = message.length;
    setCharCount(count);
    setShowCharCount(count > SHOW_COUNT_THRESHOLD);

    if (count === 0) {
      setValidationState('idle');
    } else if (count > MAX_CHARS) {
      setValidationState('invalid');
    } else if (trimmed.length >= 3) {
      setValidationState('valid');
    } else {
      setValidationState('idle');
    }
  }, [message]);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => {
          const newMessage = prev + (prev ? ' ' : '') + transcript;
          return newMessage.slice(0, MAX_CHARS); // Prevent overflow
        });
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !isLoading && validationState !== 'invalid') {
      onSend(trimmed);
      setMessage('');
      setCharCount(0);
      setShowCharCount(false);
      setValidationState('idle');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Smart file handling with validation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !onFileUpload) return;

    // Smart file validation
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type === 'application/pdf' || 
                         file.type.startsWith('text/') ||
                         file.name.endsWith('.doc') ||
                         file.name.endsWith('.docx');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      // Show user-friendly error for invalid files
      alert('Some files were skipped. Please use images, PDFs, or documents under 10MB.');
    }

    if (validFiles.length === 0) return;

    const fileUploads: FileUpload[] = validFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      content: '',
      uploadDate: new Date()
    }));

    // Read file contents
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileUploads[index].content = e.target?.result || '';
        if (index === validFiles.length - 1) {
          onFileUpload(fileUploads);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasVoiceSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  const canSend = message.trim().length > 0 && validationState !== 'invalid' && !isLoading;

  return (
    <div className="space-y-4">
      {/* Smart File Display with Enhanced UX */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3" role="region" aria-label="Uploaded files">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Attached Files ({uploadedFiles.length})
            </h3>
            {uploadedFiles.length > 1 && onRemoveFile && (
              <button
                onClick={() => uploadedFiles.forEach(f => onRemoveFile(f.id))}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
              >
                Remove All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="group flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2">
                  {file.type.startsWith('image/') ? (
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                      <Image className="text-blue-600 dark:text-blue-400 w-4 h-4" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-green-100 dark:bg-green-800/50 rounded-lg">
                      <FileText className="text-green-600 dark:text-green-400 w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate block max-w-32">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                {onRemoveFile && (
                  <button
                    onClick={() => onRemoveFile(file.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Remove file ${file.name}`}
                  >
                    <X className="text-red-500 dark:text-red-400 w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

          {/* ChatGPT-style Input Form */}
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto" role="search" aria-label="Send message to CemtrAS AI">
        <div className="flex items-end gap-4">
          <div className="flex-1 relative">
            {/* ChatGPT-style Textarea with auto-resize */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  const newValue = e.target.value.slice(0, MAX_CHARS); // Prevent overflow
                  setMessage(newValue);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-24 rounded-xl resize-none focus:outline-none transition-all duration-200 text-base leading-relaxed border-2 ${
                  validationState === 'invalid'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                } disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-md`}
                aria-label="Type your message to CemtrAS AI"
                aria-describedby="input-help"
                aria-invalid={validationState === 'invalid'}
                rows={1}
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
              
              {/* Character Counter */}
              {showCharCount && (
                <div className={`absolute bottom-2 left-3 text-xs ${
                  charCount > MAX_CHARS * 0.9 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {charCount}/{MAX_CHARS}
                </div>
              )}
            </div>
            
            {/* Control Buttons - ChatGPT style */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {/* File Upload */}
              {onFileUpload && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload files"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Upload files (images, PDFs, documents up to 10MB)"
                    title="Upload files"
                  >
                    <Paperclip size={14} />
                  </button>
                </>
              )}

              {/* Voice Input */}
              {hasVoiceSupport && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label={isListening ? "Stop voice recording" : "Start voice input"}
                  title={isListening ? "Stop recording" : "Start voice input"}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
              )}
            </div>

            {/* Validation Feedback */}
            {validationState === 'invalid' && (
              <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>Message too long ({charCount}/{MAX_CHARS} characters)</span>
              </div>
            )}
          </div>
          
          {/* ChatGPT-style Send Button */}
          <button
            type="submit"
            disabled={!canSend}
            className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 shadow-sm focus:outline-none min-w-[48px] min-h-[48px] flex items-center justify-center ${
              canSend
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            aria-label={isLoading ? "Sending message..." : "Send message to CemtrAS AI"}
            title={canSend ? "Send message" : "Enter a message to send"}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {/* Helper Text */}
        <div id="input-help" className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {validationState === 'valid' && (
            <span className="ml-2 text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
            </span>
          )}
        </div>
      </form>
    </div>
  );
};