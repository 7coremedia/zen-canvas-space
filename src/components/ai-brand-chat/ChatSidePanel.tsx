import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from './types';
import { Button } from '@/components/ui/button';
import { Copy, MessageCircle, Clock, User, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ChatSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onLoadChat: (messages: ChatMessage[]) => void;
}

export const ChatSidePanel: React.FC<ChatSidePanelProps> = ({
  isOpen,
  onClose,
  messages,
  onLoadChat
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const handleHumanHelp = () => {
    navigate('/contact');
  };

  const copyChatHistory = () => {
    const chatText = messages
      .map(msg => `${msg.type === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(chatText).then(() => {
      // You could add a toast notification here
      console.log('Chat history copied to clipboard');
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getChatSummary = (messages: ChatMessage[]) => {
    if (messages.length === 0) return 'No messages yet';
    
    const lastMessage = messages[messages.length - 1];
    const preview = lastMessage.content.slice(0, 50);
    return preview + (lastMessage.content.length > 50 ? '...' : '');
  };

  return (
    <>
      {/* Side Panel */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        w-80 max-w-[85vw] md:max-w-[320px]
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Chat History</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Human Assistant CTA */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900">Need Human Help?</h4>
            </div>
            <p className="text-sm text-amber-800 mb-3">
              Sometimes you need a real person. Our branding experts are here to help.
            </p>
            <Button
              onClick={handleHumanHelp}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold rounded-xl"
            >
              Talk to Human Expert
            </Button>
          </div>

          {/* Copy Chat Button */}
          {messages.length > 0 && (
            <Button
              variant="outline"
              onClick={copyChatHistory}
              className="w-full justify-center gap-2 rounded-xl"
            >
              <Copy className="w-4 h-4" />
              Copy Chat History
            </Button>
          )}

          {/* Chat History */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Conversations
            </h4>
            
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No chat history yet</p>
                <p className="text-xs text-gray-400">Start a conversation to see it here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.slice(-5).map((message, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => onLoadChat(messages.slice(0, index + 1))}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        message.type === 'user' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {message.type === 'user' ? 'You' : 'AI'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {getChatSummary([message])}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth Section - Bottom of side panel */}
          <div className="border-t border-gray-200 pt-4 mt-6 pb-4">
            {user ? (
              // User is signed in
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Signed in as {user.email}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="w-full justify-center gap-2 rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              // User is not signed in
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Sign up to access more features
                  </p>
                  <p className="text-xs text-gray-500">
                    Save chat history, access premium tools, and more
                  </p>
                </div>
                <div className="space-y-2">
                                  <Button
                  onClick={() => navigate('/auth')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold rounded-xl"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign Up / Sign In
                </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
