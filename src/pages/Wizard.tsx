import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrandWizard } from '@/components/brand-wizard/BrandWizard';
import { BrandChat } from '@/components/brand-wizard/BrandChat';
import { MessageCircle, MessageSquare } from 'lucide-react';

type BrandData = {
  name?: string;
  description?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography?: {
    fontFamily: string;
    baseSize: string;
    scaleRatio: number;
  };
  logo?: {
    url: string;
    alt: string;
  };
};

export default function Wizard() {
  const navigate = useNavigate();
  const [showAIChat, setShowAIChat] = useState(false);
  const [showHumanChat, setShowHumanChat] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('Wizard component mounted');

  const handleComplete = async (brandData: BrandData) => {
    setIsSubmitting(true);
    try {
      console.log('Saving brand data:', brandData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate(`/brand/new-brand-${Date.now()}`);
    } catch (error) {
      console.error('Error saving brand:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-0">
      <BrandWizard 
        onComplete={handleComplete}
        initialData={{
          name: 'My Awesome Brand',
          description: 'A fantastic brand created with our wizard',
          colors: {
            primary: '#3B82F6',
            secondary: '#8B5CF6',
            accent: '#EC4899',
            background: '#FFFFFF',
            text: '#1F2937',
            muted: '#6B7280'
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            baseSize: '16px',
            scaleRatio: 1.2
          },
          logo: {
            url: '/placeholder-logo.svg',
            alt: 'My Awesome Brand Logo'
          }
        }}
      />
      {showAIChat && (
        <div className="fixed bottom-24 right-8 w-96 h-[600px] z-50">
          <BrandChat 
            mode="ai"
            onClose={() => setShowAIChat(false)}
            onSendMessage={async (message) => {
              console.log('AI Message sent:', message);
            }}
          />
        </div>
      )}
      {showHumanChat && (
        <div className="fixed bottom-24 right-8 w-96 h-[600px] z-50">
          <BrandChat 
            mode="human"
            onClose={() => setShowHumanChat(false)}
            onSendMessage={async (message) => {
              console.log('Human Message sent:', message);
            }}
          />
        </div>
      )}
      <Button
        variant="outline"
        size="lg"
        className="fixed bottom-8 right-8 rounded-full h-16 w-16 p-0 shadow-lg z-50"
        onClick={() => setShowAIChat(true)}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Chat with AI</span>
      </Button>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-8 right-28 rounded-full h-16 w-16 p-0 shadow-lg z-50"
        onClick={() => setShowHumanChat(true)}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Chat with Human</span>
      </Button>
      {isSubmitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Saving your brand...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        </div>
      )}
    </div>
  );
}
