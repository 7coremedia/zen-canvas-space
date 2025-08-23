import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'human';
  timestamp: Date;
};

type BrandChatProps = {
  mode: 'ai' | 'human';
  onClose: () => void;
  onSendMessage: (message: string) => Promise<string>;
};

export function BrandChat({ mode, onClose, onSendMessage }: BrandChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatTitle = mode === 'ai' ? 'AI Brand Assistant' : 'Human Brand Expert';
  const chatDescription = mode === 'ai' 
    ? 'Ask me anything about building your brand.' 
    : 'Get personalized help from our brand experts.';
  
  // Add welcome message on first render
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        content: mode === 'ai' 
          ? "Hello! I'm your AI brand assistant. How can I help you with your brand today?"
          : "Hello! A human brand expert will be with you shortly. In the meantime, please describe how we can assist you with your brand.",
        sender: mode,
        timestamp: new Date(),
      },
    ]);
  }, [mode]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Get response from parent component
      const responseContent = await onSendMessage(inputMessage);
      
      // Add AI/human response
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: mode,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, something went wrong. Please try again.',
        sender: mode,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAvatar = (sender: string) => {
    switch (sender) {
      case 'ai':
        return (
          <Avatar className="h-8 w-8 bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        );
      case 'human':
        return (
          <Avatar className="h-8 w-8 bg-primary/10">
            <User className="h-4 w-4 text-primary" />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>
        );
      default:
        return (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              U
            </AvatarFallback>
          </Avatar>
        );
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-xl border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold">{chatTitle}</h3>
          <p className="text-xs text-muted-foreground">{chatDescription}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close chat</span>
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender !== 'user' && (
                <div className="mt-1">
                  {getAvatar(message.sender)}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="mt-1">
                  {getAvatar('user')}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-start gap-3">
              <div className="mt-1">
                {getAvatar(mode)}
              </div>
              <div className="bg-muted rounded-lg px-4 py-2 rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.5s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputMessage.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
