import React from 'react';
import { User, Bot, FileText, Image } from 'lucide-react';
import type { Message, FileUpload } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const renderContent = (content: string) => {
    return (
      <div className="text-accessible dark:text-accessible-dark leading-relaxed dyslexia-friendly">
        {content.split('\n').map((line, index) => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            return (
              <div key={index} className="flex items-start gap-3 ml-4 mb-3 content-spacing">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="dyslexia-friendly">{trimmedLine.replace(/^[•\-*]\s*/, '')}</span>
              </div>
            );
          }
          return trimmedLine ? <p key={index} className="mb-3 content-spacing dyslexia-friendly">{trimmedLine}</p> : null;
        })}
      </div>
    );
  };
  
  const renderFileAttachments = (files: FileUpload[]) => {
    if (!files || files.length === 0) return null;

    return (
      <div className="mt-4 space-y-2" role="list" aria-label="Attached files">
        {files.map((file) => (
          <div key={file.id} className="flex items-center gap-3 bg-white/80 dark:bg-gray-700/80 rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm" role="listitem">
            {file.type.startsWith('image/') ? (
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Image className="text-blue-600 dark:text-blue-400" size={16} />
              </div>
            ) : (
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FileText className="text-red-600 dark:text-red-400" size={16} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-accessible dark:text-accessible-dark truncate block dyslexia-friendly">
                {file.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 dyslexia-friendly">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <article 
      className={`flex gap-6 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-8`}
      role="group"
      aria-label={`Message from ${isUser ? 'you' : 'CemtrAS AI'} at ${message.timestamp.toLocaleTimeString()}`}
    >
      {/* Enhanced Avatar */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${
        isUser 
          ? 'bg-gradient-to-br from-blue-600 to-indigo-700' 
          : 'bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800'
      }`} aria-label={isUser ? 'Your message' : 'AI assistant message'}>
        {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
      </div>
      
      {/* Enhanced Message Bubble */}
      <div className={`flex-1 max-w-4xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-6 py-4 shadow-lg max-w-full backdrop-blur-sm border transition-all duration-200 hover:shadow-xl accessible-button ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl rounded-br-lg border-blue-500/50'
            : 'bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white border-gray-200/50 dark:border-gray-700/50 rounded-2xl rounded-bl-lg'
        }`}>
          <div className="text-sm leading-relaxed">
            {isUser ? (
              <div className="space-y-3 content-spacing">
                <div className="font-semibold break-words">{message.content}</div>
                {message.files && renderFileAttachments(message.files)}
              </div>
            ) : (
              <div className="space-y-3 content-spacing">
                {renderContent(message.content)}
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-3 font-semibold flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'} dyslexia-friendly`} aria-label={`Message timestamp: ${message.timestamp.toLocaleString()}`}>
          <div className={`w-2 h-2 rounded-full ${isUser ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
          <span>{isUser ? 'YOU' : 'CemtrAS AI'}</span>
          <span>•</span>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </article>
  );
};