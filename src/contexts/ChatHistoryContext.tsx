import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatHistoryService } from '../services/chatHistoryService';
import { useAuth } from './AuthContext';
import type { ChatHistory, ChatHistoryState, Message, UserRole } from '../types';

interface ChatHistoryContextType extends ChatHistoryState {
  saveChatHistory: (chatData: {
    title?: string;
    messages: Message[];
    role: UserRole | 'General AI';
  }) => ChatHistory | null;
  loadChatHistory: (chatId: string) => ChatHistory | null;
  deleteChatHistory: (chatId: string) => void;
  clearAllHistories: () => void;
  updateCurrentChat: (messages: Message[]) => void;
  setCurrentChatId: (chatId: string | null) => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};

interface ChatHistoryProviderProps {
  children: ReactNode;
}

export const ChatHistoryProvider: React.FC<ChatHistoryProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [chatHistoryState, setChatHistoryState] = useState<ChatHistoryState>({
    histories: [],
    currentChatId: null,
    maxHistories: 1
  });

  // Load chat histories when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const histories = ChatHistoryService.getChatHistories(user.id);
      setChatHistoryState(prev => ({
        ...prev,
        histories
      }));
    } else {
      setChatHistoryState(prev => ({
        ...prev,
        histories: [],
        currentChatId: null
      }));
    }
  }, [user, isAuthenticated]);

  const saveChatHistory = (chatData: {
    title?: string;
    messages: Message[];
    role: UserRole | 'General AI';
  }): ChatHistory | null => {
    if (!isAuthenticated || !user) return null;

    // Only save if there are at least 2 messages (1 user + 1 AI response)
    if (chatData.messages.length < 2) return null;

    const newHistory = ChatHistoryService.saveChatHistory(user.id, chatData);
    
    // Update local state
    setChatHistoryState(prev => ({
      ...prev,
      histories: [newHistory, ...prev.histories.filter(h => h.id !== newHistory.id)].slice(0, prev.maxHistories),
      currentChatId: newHistory.id
    }));

    return newHistory;
  };

  const loadChatHistory = (chatId: string): ChatHistory | null => {
    if (!isAuthenticated || !user) return null;

    const history = ChatHistoryService.getChatHistory(user.id, chatId);
    if (history) {
      setChatHistoryState(prev => ({
        ...prev,
        currentChatId: chatId
      }));
    }
    return history;
  };

  const deleteChatHistory = (chatId: string): void => {
    if (!isAuthenticated || !user) return;

    ChatHistoryService.deleteChatHistory(user.id, chatId);
    
    setChatHistoryState(prev => ({
      ...prev,
      histories: prev.histories.filter(h => h.id !== chatId),
      currentChatId: prev.currentChatId === chatId ? null : prev.currentChatId
    }));
  };

  const clearAllHistories = (): void => {
    if (!isAuthenticated || !user) return;

    ChatHistoryService.clearAllHistories(user.id);
    
    setChatHistoryState(prev => ({
      ...prev,
      histories: [],
      currentChatId: null
    }));
  };

  const updateCurrentChat = (messages: Message[]): void => {
    if (!isAuthenticated || !user || !chatHistoryState.currentChatId) return;

    ChatHistoryService.updateChatHistory(user.id, chatHistoryState.currentChatId, messages);
    
    setChatHistoryState(prev => ({
      ...prev,
      histories: prev.histories.map(h => 
        h.id === chatHistoryState.currentChatId 
          ? { ...h, messages, lastUpdated: new Date() }
          : h
      )
    }));
  };

  const setCurrentChatId = (chatId: string | null): void => {
    setChatHistoryState(prev => ({
      ...prev,
      currentChatId: chatId
    }));
  };

  const value: ChatHistoryContextType = {
    ...chatHistoryState,
    saveChatHistory,
    loadChatHistory,
    deleteChatHistory,
    clearAllHistories,
    updateCurrentChat,
    setCurrentChatId
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
};