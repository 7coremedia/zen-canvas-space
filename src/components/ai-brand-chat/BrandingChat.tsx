import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useBrandingChat } from '@/hooks/useBrandingChat';
import { ChatMessage as ChatMessageType, BrandCreationStep } from './types';
import { ChatMessage } from './ChatMessage';
import { ChatHeader } from './ChatHeader';
import { CTACards } from './CTACards';
import { ChatSidePanel } from './ChatSidePanel';
import { Button } from '@/components/ui/button';
import { Send, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatGlowingInput from './ChatGlowingInput';
import { AIServiceManager } from '@/lib/ai/aiServiceManager';
import { CTASystem, CTATemplate } from '@/lib/ai/contextAnalyzer';

interface BrandingChatProps {
  initialMessage?: string;
}

export const BrandingChat: React.FC<BrandingChatProps> = ({ initialMessage = '' }) => {
  const navigate = useNavigate();
  const { chatState, addMessage, setLoading, setError, clearChat } = useBrandingChat();
  
  // Initialize AI service
  const aiService = useMemo(() => new AIServiceManager(), []);

  const [inputValue, setInputValue] = useState('');
  
  // Handle initial message from URL or props
  useEffect(() => {
    // Check URL for initial message
    const params = new URLSearchParams(window.location.search);
    const messageFromUrl = params.get('message');
    const initialText = messageFromUrl || initialMessage;
    
    if (initialText && !chatState.messages.some(m => m.content === initialText)) {
      setInputValue(initialText);
      
      // Auto-submit after a short delay if it's a direct link with a message
      if (messageFromUrl) {
        const timer = setTimeout(() => {
          if (initialText.trim()) {
            handleSubmit({ preventDefault: () => {} } as React.FormEvent);
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [initialMessage]);

  const [ctaTemplates, setCtaTemplates] = useState<CTATemplate[]>([]);
  const [showCTAs, setShowCTAs] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear chat history on mount to ensure fresh conversations
  useEffect(() => {
    if (chatState.messages.length > 0) {
      console.log('🔄 Clearing previous chat history to ensure fresh conversation');
      clearChat();
    }
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputValue.trim() && uploadedFiles.length === 0) || chatState.isLoading) return;

    // Prepare attachments for the message
    const attachments = uploadedFiles.map(file => ({
      id: Math.random().toString(36).substring(2),
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    const userMessage: Omit<ChatMessageType, 'id' | 'timestamp'> = {
      type: 'user',
      content: inputValue.trim() + (uploadedFiles.length > 0 ? `\n\n📎 Attached ${uploadedFiles.length} file(s): ${uploadedFiles.map(f => f.name).join(', ')}` : ''),
      attachments: attachments
    };

    addMessage(userMessage);
    setInputValue('');
    setUploadedFiles([]);

    setShowCTAs(false); // Hide CTAs when user sends a new message
    setLoading(true);

    try {
      // Create context for AI
      const context = {
        conversationHistory: chatState.messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        currentStep: BrandCreationStep.IDEA,
        userSelections: {},
        brandIdea: '', // No longer using localStorage, always use current input
        uploadedFiles: uploadedFiles.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          data: file // Include the actual file for AI analysis
        }))
      };

      console.log('AI Context created:', {
        hasFiles: uploadedFiles.length > 0,
        fileTypes: uploadedFiles.map(f => f.type),
        hasImages: uploadedFiles.some(f => f.type.startsWith('image/')),
        context
      });

      // Generate AI response using real AI service
      console.log('Calling AI service with context...');
      const aiResponse = await aiService.generateResponse(inputValue.trim(), context);
      console.log('AI Response received:', aiResponse);
      
      if (aiResponse.error) {
        throw new Error(aiResponse.error);
      }

      const aiMessage: Omit<ChatMessageType, 'id' | 'timestamp'> = {
        type: 'ai',
        content: aiResponse.content
      };
      
      addMessage(aiMessage);

      // Analyze the user's question for CTAs
      const questionAnalysis = CTASystem.analyzeQuestion(inputValue.trim());
      console.log('CTA Analysis:', questionAnalysis); // Debug log
      
      if (questionAnalysis.suggestedCTAs.length > 0 && questionAnalysis.confidence > 0.1) {
        console.log('Setting specific CTAs:', questionAnalysis.suggestedCTAs); // Debug log
        setCtaTemplates(questionAnalysis.suggestedCTAs);
        setShowCTAs(true);
      } else {
        // Always show fallback CTAs to ensure users see action options
        const fallbackCTAs = CTASystem.getFallbackCTAs();
        console.log('Setting fallback CTAs:', fallbackCTAs); // Debug log
        setCtaTemplates(fallbackCTAs);
        setShowCTAs(true);
      }


    } catch (error) {
      console.error('AI response error:', error);
      setError('Failed to get AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };



  const handleHumanHelp = () => {
    navigate('/contact');
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const loadChatHistory = (messages: ChatMessageType[]) => {
    // This would need to be implemented in the useBrandingChat hook
    // For now, we'll just close the panel
    setIsSidePanelOpen(false);
  };

  const handleFileUpload = (files: File[]) => {
    console.log('BrandingChat received files:', files); // Debug log
    setUploadedFiles(files); // Update the uploaded files state
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32">
      {/* Header - Sticky at top */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <ChatHeader onHumanHelp={handleHumanHelp} onToggleSidePanel={toggleSidePanel} />
      </div>

      {/* Side Panel */}
      <ChatSidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        messages={chatState.messages}
        onLoadChat={loadChatHistory}
      />

      {/* Main Chat Area - Slides when side panel opens (desktop only) */}
      <div className={`
        flex-1 flex flex-col relative
        transform transition-transform duration-300 ease-in-out
        ${isSidePanelOpen ? 'md:translate-x-20 translate-x-0' : 'translate-x-0'}
      `}>
        {/* Messages Container - 766px max width, centered */}
        <div className={`flex-1 p-4 pb-32 ${
          isSidePanelOpen 
            ? 'overflow-hidden' 
            : 'overflow-y-auto'
        }`}>
          <div className="max-w-[766px] mx-auto space-y-4 px-4 md:px-0">
          {chatState.messages.length === 0 ? (
            <div className="text-center py-12 w-full">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
                King's Brain
              </h2>
              <p className="text-gray-600 mb-8">
                Ask me anything about branding, design, strategy, or brand development.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => setInputValue("What colors work best for a tech startup?")}
                >
                  <span className="text-lg mr-2">💡</span>
                  <span className="text-sm">Best colors for tech startup?</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => setInputValue("How do I create a memorable brand name?")}
                >
                  <span className="text-lg mr-2">✨</span>
                  <span className="text-sm">Create memorable brand name?</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => setInputValue("What's the difference between a logo and a brand?")}
                >
                  <span className="text-lg mr-2">🎨</span>
                  <span className="text-sm">Logo vs brand difference?</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => setInputValue("How do I build brand loyalty?")}
                >
                  <span className="text-lg mr-2">❤️</span>
                  <span className="text-sm">Build brand loyalty?</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => setInputValue("What makes a good marketing strategy?")}
                >
                  <span className="text-lg mr-2">📈</span>
                  <span className="text-sm">Good marketing strategy?</span>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => setInputValue("How do I measure brand success?")}
                >
                  <span className="text-lg mr-2">📊</span>
                  <span className="text-sm">Measure brand success?</span>
                </Button>
              </div>
            </div>
          ) : (
            chatState.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          
          {chatState.isLoading && (
            <div className="flex justify-start mb-6">
              <div className="max-w-[85%] md:max-w-[70%]">
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl px-3 md:px-4 py-2 md:py-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs md:text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* CTA Cards - Take users to specific pages */}
          <CTACards
            ctas={ctaTemplates}
            visible={showCTAs && !chatState.isLoading}
          />
          
          <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at bottom but moves with content (desktop only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-white p-4 z-10">
        <div className={`
          max-w-[766px] mx-auto px-4 md:px-0
          transform transition-transform duration-300 ease-in-out
          ${isSidePanelOpen ? 'md:translate-x-20 translate-x-0' : 'translate-x-0'}
        `}>
                      <ChatGlowingInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              onFileUpload={handleFileUpload}
              isLoading={chatState.isLoading}
              placeholder="What should i explain?"
            />
        </div>
      </div>

      {/* Error Display */}
      {chatState.error && (
        <div className="fixed bottom-32 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-20">
          {chatState.error}
        </div>
      )}
    </div>
  );
};