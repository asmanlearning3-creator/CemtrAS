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
      {/* Overlay for mobile and desktop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        role="button"
        aria-label="Close sidebar"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
      />

      {/* Sidebar with smooth animations */}
      <aside 
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed z-50
          w-80 h-full top-0 left-0
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
          border-r border-gray-200/50 dark:border-gray-700/50
          flex flex-col shadow-2xl lg:shadow-xl
          transition-transform duration-300 ease-out
        `}
        role="complementary"
        aria-label="Navigation and chat history"
      >
        {/* Compact Sidebar Header */}
        <header className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3" role="group" aria-label="CemtrAS AI logo">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md">
                <Factory className="text-white" size={18} />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CemtrAS AI
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="text-gray-500 dark:text-gray-400" size={18} />
            </button>
          </div>

          {/* Compact User Profile */}
          {user && (
            <div className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm" role="group" aria-label="User profile information">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md" aria-label={`${user.name}'s avatar`}>
                  <User className="text-white" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Online
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Logout from CemtrAS AI"
                  title="Logout"
                >
                  <LogOut className="text-gray-400 hover:text-red-500" size={14} />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Compact Content Area */}
        <main className="flex-1 flex flex-col min-h-0 p-4 space-y-4">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            aria-label="Start a new chat session"
          >
            <Plus size={18} />
            <span>New Chat Session</span>
          </button>

          {/* Role Selection */}
          <section aria-labelledby="role-selection-heading">
            <h3 id="role-selection-heading" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              Select Expertise
            </h3>
            <div className="max-h-64 overflow-y-auto">
              <RoleSelector 
                selectedRole={selectedRole}
                onRoleChange={onRoleChange}
              />
            </div>
          </section>

          {/* Unified Chat History */}
          <section className="flex-1 min-h-0" aria-labelledby="chat-history-heading">
            <h3 id="chat-history-heading" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-500" />
              Chat History
            </h3>
            <div className="h-full overflow-y-auto space-y-2" role="list" aria-label="Previous chat conversations">
              {histories.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No chat history yet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Start a conversation to see your chats here
                  </p>
                </div>
              ) : (
                histories.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className="w-full text-left p-3 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md group"
                    role="listitem"
                    aria-label={`Load chat: ${chat.title}, ${chat.messages.length} messages, ${chat.role} expertise`}
                    tabIndex={0}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <MessageSquare className="text-white w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {chat.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                            {chat.role}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chat.messages.length} messages
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {chat.lastUpdated.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Compact Stats */}
          <section className="space-y-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50" aria-labelledby="stats-heading">
            <h3 id="stats-heading" className="sr-only">Chat Statistics</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/50" role="group" aria-label="Message count">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="text-blue-500 w-3 h-3" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Messages
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{messageCount}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200/50 dark:border-green-800/50" role="group" aria-label="System status">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-green-500 w-3 h-3" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    Status
                  </span>
                </div>
                <p className={`text-sm font-bold ${isLoading ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                  {isLoading ? 'Processing' : 'Ready'}
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Compact Footer */}
        <footer className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0" role="contentinfo">
          <div className="text-center space-y-3">
            {/* Attribution */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  Made By <span className="text-blue-600 dark:text-blue-400 font-medium">Vipul</span>
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  Idea By <span className="text-purple-600 dark:text-purple-400 font-medium">Akanksha</span>
                </span>
              </div>
            </div>
            
            {/* Powered By */}
            <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Powered by <span className="text-blue-600 dark:text-blue-400 font-medium">AI Technology</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                © 2025 CemtrAS AI
              </p>
            </div>
          </div>
        </footer>
      </aside>

      {/* Compact Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            role="dialog"
            aria-labelledby="logout-title"
            aria-describedby="logout-description"
          >
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <LogOut className="text-white w-6 h-6" />
              </div>
              <h3 id="logout-title" className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Confirm Logout
              </h3>
              <p id="logout-description" className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to logout?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Cancel logout"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-pink-700 transition-colors duration-200"
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