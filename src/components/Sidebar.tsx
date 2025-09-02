import React, { useState } from 'react';
import { Factory, User, LogOut, X, Plus, MessageSquare, Zap, History, Sparkles } from 'lucide-react';
import { RoleSelector } from './RoleSelector';
import { useAuth } from '../contexts/AuthContext';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import type { UserRole, ChatHistory } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: UserRole | 'General AI';
  onRoleChange: (role: UserRole | 'General AI') => void;
  onLoadChat: (history: ChatHistory) => void;
  onNewChat: () => void;
  messageCount: number;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedRole,
  onRoleChange,
  onLoadChat,
  onNewChat,
  messageCount,
  isLoading
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { histories } = useChatHistory();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    onClose();
    window.location.reload();
  };

  const handleChatSelect = (chatId: string) => {
    const history = histories.find(h => h.id === chatId);
    if (history) {
      onLoadChat(history);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          role="button"
          aria-label="Close sidebar"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onClose()}
        />
      )}

      {/* Enhanced Sidebar */}
      <aside 
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative z-50 lg:z-auto
          w-80 h-full
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
          border-r border-gray-200/50 dark:border-gray-700/50
          flex flex-col shadow-2xl lg:shadow-xl
          transition-all duration-300 ease-in-out
        `}
        role="complementary"
        aria-label="Navigation and chat history"
        aria-hidden={!isOpen}
      >
        {/* Enhanced Sidebar Header */}
        <header className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3" role="group" aria-label="CemtrAS AI logo">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
                  <Factory className="text-white" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="text-white w-2.5 h-2.5" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dyslexia-friendly">
                  CemtrAS AI
                </h2>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide dyslexia-friendly">
                  AI-Driven Engineering
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-xl transition-colors backdrop-blur-sm accessible-button focus-ring-enhanced"
              aria-label="Close sidebar"
            >
              <X className="text-gray-500 dark:text-gray-400" size={20} />
            </button>
          </div>

          {/* Enhanced User Profile */}
          {user && (
            <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg" role="group" aria-label="User profile information">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg" aria-label={`${user.name}'s avatar`}>
                  <User className="text-white" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-accessible dark:text-accessible-dark truncate dyslexia-friendly">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400 dyslexia-friendly">
                      Premium Access
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors accessible-button focus-ring-enhanced"
                  aria-label="Logout from CemtrAS AI"
                  title="Logout"
                >
                  <LogOut className="text-gray-400 hover:text-red-500" size={16} />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Enhanced Content Area */}
        <main className="flex-1 flex flex-col min-h-0 p-6 space-y-6">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 accessible-button focus-ring-enhanced dyslexia-friendly"
            aria-label="Start a new chat session"
          >
            <Plus size={20} />
            <span>New Chat Session</span>
          </button>

          {/* Role Selection */}
          <section aria-labelledby="role-selection-heading">
            <h3 id="role-selection-heading" className="text-sm font-bold text-accessible dark:text-accessible-dark uppercase tracking-wide mb-4 flex items-center gap-2 heading-spacing dyslexia-friendly">
              <Zap className="w-4 h-4 text-blue-500" />
              Select Expertise
            </h3>
            <div className="max-h-80 overflow-y-auto pr-2">
              <RoleSelector 
                selectedRole={selectedRole}
                onRoleChange={onRoleChange}
              />
            </div>
          </section>

          {/* Unified Chat History */}
          <section className="flex-1 min-h-0" aria-labelledby="chat-history-heading">
            <h3 id="chat-history-heading" className="text-sm font-bold text-accessible dark:text-accessible-dark uppercase tracking-wide mb-4 flex items-center gap-2 heading-spacing dyslexia-friendly">
              <History className="w-4 h-4 text-purple-500" />
              Chat History
            </h3>
            <div className="h-full overflow-y-auto pr-2 space-y-2" role="list" aria-label="Previous chat conversations">
              {histories.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium dyslexia-friendly">
                    No chat history yet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 dyslexia-friendly">
                    Start a conversation to see your chats here
                  </p>
                </div>
              ) : (
                histories.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className="w-full text-left p-4 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md group accessible-button focus-ring-enhanced"
                    role="listitem"
                    aria-label={`Load chat: ${chat.title}, ${chat.messages.length} messages, ${chat.role} expertise`}
                    tabIndex={0}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <MessageSquare className="text-white w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-accessible dark:text-accessible-dark truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dyslexia-friendly">
                          {chat.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-900/30 px-2 py-1 rounded-full dyslexia-friendly">
                            {chat.role}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 dyslexia-friendly">
                            {chat.messages.length} messages
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 dyslexia-friendly">
                          {chat.lastUpdated.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Enhanced Stats */}
          <section className="space-y-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50" aria-labelledby="stats-heading">
            <h3 id="stats-heading" className="sr-only">Chat Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50" role="group" aria-label="Message count">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="text-blue-500 w-4 h-4" />
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide dyslexia-friendly">
                    Messages
                  </span>
                </div>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{messageCount}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50" role="group" aria-label="System status">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-green-500 w-4 h-4" />
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide dyslexia-friendly">
                    Status
                  </span>
                </div>
                <p className={`text-sm font-black ${isLoading ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                  {isLoading ? 'Processing' : 'Ready'}
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Enhanced Footer with Attribution */}
        <footer className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/20" role="contentinfo">
          <div className="text-center space-y-3">
            {/* Attribution */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-accessible-light dark:text-gray-300 font-medium dyslexia-friendly">
                  Made By <span className="text-blue-600 dark:text-blue-400 font-bold">Vipul</span>
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span className="text-accessible-light dark:text-gray-300 font-medium dyslexia-friendly">
                  Idea By <span className="text-purple-600 dark:text-purple-400 font-bold">Akanksha</span>
                </span>
              </div>
            </div>
            
            {/* Powered By */}
            <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs text-accessible-light dark:text-gray-300 font-medium dyslexia-friendly">
                Powered by <span className="text-blue-600 dark:text-blue-400 font-bold">AI Technology</span>
              </p>
              <p className="text-xs text-accessible-light dark:text-gray-400 mt-1 dyslexia-friendly">
                © 2025 CemtrAS AI
              </p>
            </div>
          </div>
        </footer>
      </aside>

      {/* Enhanced Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
            role="dialog"
            aria-labelledby="logout-title"
            aria-describedby="logout-description"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogOut className="text-white w-8 h-8" />
              </div>
              <h3 id="logout-title" className="text-2xl font-bold text-accessible dark:text-accessible-dark mb-2 dyslexia-friendly">
                Confirm Logout
              </h3>
              <p id="logout-description" className="text-accessible-light dark:text-gray-300 leading-relaxed dyslexia-friendly">
                Are you sure you want to logout? Your chat history will be preserved for when you return.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-4 px-6 bg-gray-100 dark:bg-gray-700 text-accessible dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-md accessible-button focus-ring-enhanced dyslexia-friendly"
                aria-label="Cancel logout"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg accessible-button focus-ring-enhanced dyslexia-friendly"
                aria-label="Confirm logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};