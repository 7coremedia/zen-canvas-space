import { useState, useCallback } from 'react';
import { ChatMessage, ChatState } from '@/components/ai-brand-chat/types';

const CHAT_STORAGE_KEY = 'branding_chat_state';

export const useBrandingChat = () => {
  const [chatState, setChatState] = useState<ChatState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          messages: parsed.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          isLoading: false,
          error: null
        };
      } catch (error) {
        console.error('Failed to parse saved chat state:', error);
      }
    }
    
    return {
      messages: [],
      isLoading: false,
      error: null
    };
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setChatState(prev => {
      const newState = {
        ...prev,
        messages: [...prev.messages, newMessage]
      };
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setChatState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setChatState(prev => ({ ...prev, error }));
  }, []);

  const clearChat = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null
    });
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  return {
    chatState,
    addMessage,
    setLoading,
    setError,
    clearChat
  };
};
