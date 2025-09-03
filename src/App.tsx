import React, { useState, useRef, useEffect } from 'react';
import { Factory } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingMessage } from './components/LoadingMessage';
import { ErrorMessage } from './components/ErrorMessage';
import { NameEntryScreen } from './components/NameEntryScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useAuth } from './contexts/AuthContext';
import { useChatHistory } from './contexts/ChatHistoryContext';
import { useTheme } from './contexts/ThemeContext';
import { generateResponse } from './utils/gemini';
import type { Message, UserRole, ChatState, ChatHistory, FileUpload } from './types';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { saveChatHistory, loadChatHistory, setCurrentChatId } = useChatHistory();
  const { isDarkMode } = useTheme();
  const [showNameEntry, setShowNameEntry] = useState(!isAuthenticated);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedRole: 'Operations',
    uploadedFiles: []
  });
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      setShowNameEntry(false);
    }
  }, [isAuthenticated]);

  const handleNameEntryComplete = () => {
    setShowNameEntry(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError('GEMINI_API_KEY is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      files: chatState.uploadedFiles && chatState.uploadedFiles.length > 0 ? [...chatState.uploadedFiles] : undefined
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      uploadedFiles: []
    }));

    setSidebarOpen(false);
    setError(null);

    try {
      const aiResponse = await generateResponse(
        content, 
        chatState.selectedRole, 
        true,
        chatState.uploadedFiles || []
      );
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (err) {
      setChatState(prev => ({ ...prev, isLoading: false }));
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  useEffect(() => {
    if (chatState.messages.length >= 2) {
      const hasUserMessage = chatState.messages.some(m => m.role === 'user');
      const hasAIResponse = chatState.messages.some(m => m.role === 'assistant');
      
      if (hasUserMessage && hasAIResponse) {
        saveChatHistory({
          messages: chatState.messages,
          role: chatState.selectedRole
        });
      }
    }
  }, [chatState.messages, chatState.selectedRole, saveChatHistory]);

  const handleRoleChange = (role: UserRole | 'General AI') => {
    setChatState(prev => ({ ...prev, selectedRole: role }));
  };

  const handleLoadChat = (history: ChatHistory) => {
    setChatState(prev => ({
      ...prev,
      messages: history.messages,
      selectedRole: history.role,
      isLoading: false
    }));
    setCurrentChatId(history.id);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      isLoading: false,
      uploadedFiles: []
    }));
    setCurrentChatId(null);
    setSidebarOpen(false);
  };

  const handleFileUpload = (files: FileUpload[]) => {
    setChatState(prev => ({
      ...prev,
      uploadedFiles: [...(prev.uploadedFiles || []), ...files]
    }));
  };

  const handleRemoveFile = (fileId: string) => {
    setChatState(prev => ({
      ...prev,
      uploadedFiles: (prev.uploadedFiles || []).filter(f => f.id !== fileId)
    }));
  };

  const clearError = () => setError(null);

  if (showNameEntry) {
    return <NameEntryScreen onComplete={handleNameEntryComplete} />;
  }

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Clean Background */}
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900"></div>

      <div className="h-full w-full flex relative z-10">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedRole={chatState.selectedRole}
          onRoleChange={handleRoleChange}
          onLoadChat={handleLoadChat}
          onNewChat={handleNewChat}
          messageCount={chatState.messages.length}
          isLoading={chatState.isLoading}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : ''}`}>
          {/* Header */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            selectedRole={chatState.selectedRole}
          />

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 space-y-4 min-h-full">
              {error && (
                <ErrorMessage 
                  message={error} 
                  onRetry={error.includes('GEMINI_API_KEY') ? undefined : clearError}
                />
              )}

              {chatState.messages.length === 0 && !error ? (
                <WelcomeScreen selectedRole={chatState.selectedRole} />
              ) : (
                <>
                  {chatState.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {chatState.isLoading && <LoadingMessage />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 flex-shrink-0">
            <ChatInput 
              onSend={handleSendMessage}
              isLoading={chatState.isLoading || !!error}
              placeholder={`Message CemtrAS AI (${chatState.selectedRole})...`}
              onFileUpload={handleFileUpload}
              uploadedFiles={chatState.uploadedFiles || []}
              onRemoveFile={handleRemoveFile}
            />
            
            {/* Compact Attribution */}
            <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>Made By <span className="text-blue-600 dark:text-blue-400">Vipul</span></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <span>Idea By <span className="text-purple-600 dark:text-purple-400">Akanksha</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;