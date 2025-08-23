import { useState, useRef, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Loader2, 
  MessageCircleQuestion, 
  Settings, 
  Wand2, 
  Check, 
  Send 
} from 'lucide-react';
// Mock useToast since we're having import issues
const useToast = () => ({
  toast: (options: any) => console.log('Toast:', options)
});

// Mock AIPreviewCard
const AIPreviewCard = ({ title, children, onRegenerate, className = '' }: any) => (
  <div className={`bg-white rounded-lg p-4 shadow ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium">{title}</h3>
      {onRegenerate && (
        <button 
          onClick={onRegenerate}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Regenerate
        </button>
      )}
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Mock cn utility
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

// Mock useLocation and useNavigate
const useLocation = () => ({
  search: ''
});

const useNavigate = () => ({
  push: (path: string) => console.log('Navigating to:', path)
});

// Import UI components
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LogoStep } from './advanced/LogoStep';
import { ColorPaletteStep } from './advanced/ColorPaletteStep';
import { TypographyStep } from './advanced/TypographyStep';

// Human assistance dialog hook
interface HumanAssistanceReturn {
  openDialog: (type: 'ai' | 'human') => void;
  HumanAssistanceButton: FC;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  Dialog: FC;
}

const useHumanAssistance = (): HumanAssistanceReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'ai' | 'human'>('ai');

  const openDialog = (type: 'ai' | 'human') => {
    setMode(type);
    setIsOpen(true);
  };

  const DialogComponent: FC = () => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-background rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">
              {mode === 'ai' ? 'AI Assistant' : 'Human Support'}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {mode === 'ai' ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ask me anything about customizing your brand. I can help with design suggestions, best practices, and more.
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">How can I make my brand colors more accessible?</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg ml-8">
                    <p className="text-sm">Here are some tips for accessible color combinations...</p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type your question..."
                      className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button size="sm" className="gap-1">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <MessageCircleQuestion className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h4 className="font-medium">Need human assistance?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our support team is here to help you with any questions about your brand setup.
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your message</label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Describe what you need help with..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="your@email.com"
                    />
                  </div>
                  <Button className="w-full">
                    Send Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const HumanAssistanceButton: FC = () => (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => openDialog('human')}
      className="flex items-center gap-2"
    >
      <MessageCircleQuestion className="w-4 h-4" />
      Get Human Help
    </Button>
  );

  return {
    openDialog,
    HumanAssistanceButton,
    isOpen,
    setIsOpen,
    Dialog: DialogComponent
  };
};

// Define types for our brand data
interface BrandColors {
  [key: string]: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

interface BrandData {
  name: string;
  description: string;
  colors: BrandColors;
  typography: {
    fontFamily: string;
    baseSize: string;
    scaleRatio: number;
  };
  logo?: {
    url: string;
    alt: string;
  };
}

// Mock AI generated data for preview
const mockAIGeneratedData: BrandData = {
  name: 'EcoBrew',
  description: 'A sustainable coffee shop focused on community and quality.',
  colors: {
    primary: '#2E7D32',
    secondary: '#558B2F',
    accent: '#9E9D24',
    background: '#F5F5F5',
    text: '#212121',
    muted: '#757575',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    baseSize: '16px',
    scaleRatio: 1.2
  },
  logo: {
    url: '/placeholder-logo.svg',
    alt: 'EcoBrew Logo'
  }
};

type BrandWizardStep = {
  id: string;
  title: string;
  description: string;
  section?: string;
};

type BrandWizardProps = {
  initialData?: BrandData;
  onDataChange?: (data: BrandData) => void;
  onComplete: (data: BrandData) => void;
  brandId?: string;
};

const BrandWizard: FC<BrandWizardProps> = ({
  initialData = mockAIGeneratedData,
  onDataChange = () => {},
  onComplete,
  brandId,
}): JSX.Element => {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BrandData>(initialData);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Hooks
  const navigate = useNavigate();
  const { openDialog, Dialog, isOpen, setIsOpen } = useHumanAssistance();
  
  // Mock toast function for development
  const showToast = (options: { title: string; description?: string; variant?: string }) => {
    console.log('Toast:', options.title, options.description || '');
  };

  const handleRegenerate = (section: string) => {
    console.log(`Regenerating ${section}`);
    // Implementation would go here
  };

  const steps: BrandWizardStep[] = [
    { 
      id: 'overview',
      title: 'Brand Overview',
      description: 'Review your AI-generated brand identity',
      section: 'overview'
    },
    { 
      id: 'logo', 
      title: 'Logo', 
      description: 'Your brand logo, generated by AI',
      section: 'logo'
    },
    { 
      id: 'colors', 
      title: 'Colors', 
      description: 'Your brand color palette',
      section: 'colors'
    },
    { 
      id: 'typography', 
      title: 'Typography', 
      description: 'Fonts that represent your brand',
      section: 'typography'
    },
  ];

  // Get AI prompt from URL if it exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get('prompt');
    if (prompt) {
      // In a real app, we would call the AI service here
      console.log('AI Prompt:', prompt);
  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const section = currentStepData?.section || 'overview';
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(formData);
    }
  };

  // ...

  // Render the appropriate step content based on current step and mode
  const renderStepContent = (): JSX.Element => {
    const currentStepData = steps[currentStep];
    const section = currentStepData?.section || 'overview';
    const { colors, typography } = formData;

    // AI Preview Mode
    if (!isAdvanced) {
      return (
        <AIPreviewCard 
          title=""
          onRegenerate={() => handleRegenerate('brand identity')}
          className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {section === 'overview' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{formData.name}</h2>
                <p className="text-gray-700">{formData.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Primary Color</p>
                  <div 
                    className="w-full h-4 rounded-md mt-1"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{colors.primary}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Font Family</p>
                  <p className="text-lg font-medium mt-1" style={{ fontFamily: typography.fontFamily }}>
                    {typography.fontFamily}
                  </p>
                </div>
              </div>
            </div>
          )}
          {section === 'logo' && formData.logo && (
            <div className="p-6">
              <img 
                src={formData.logo.url} 
                alt={formData.logo.alt} 
                className="max-h-48 mx-auto"
              />
            </div>
          )}
          {section === 'colors' && (
            <div className="p-6">
              onRegenerate={() => handleRegenerate('logo')}
            >
              <div className="flex justify-center p-8 bg-muted/20 rounded-lg">
                {logo ? (
                  <img 
                    src={logo.url} 
                    alt={logo.alt}
                    className="max-w-full max-h-64 object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground">No logo generated yet</div>
                )}
              </div>
            </AIPreviewCard>
          )}

          {section === 'colors' && (
            <AIPreviewCard 
              title="Color Palette"
              description="AI-generated color scheme for your brand"
              onRegenerate={() => handleRegenerate('colors')}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(Object.entries(colors) as [string, string][]).map(([name, color]) => (
                  <div key={name} className="space-y-2">
                    <div 
                      className="w-full h-16 rounded-lg"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-sm">
                      <p className="font-medium capitalize">{name}</p>
                      <p className="text-muted-foreground text-xs">{color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AIPreviewCard>
          )}

          {section === 'typography' && (
            <AIPreviewCard 
              title="Typography"
              description="AI-selected fonts for your brand"
              onRegenerate={() => handleRegenerate('typography')}
            >
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Heading Font</p>
                  <div style={{ fontFamily: typography.fontFamily }}>
                    <h3 className="text-3xl font-bold">Aa Bb Cc</h3>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Typography</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700" style={{ fontFamily: formData.typography?.fontFamily }}>
                      {formData.typography?.fontFamily}
                    </p>
                    <div className="text-sm text-gray-500">
                      Base size: {formData.typography?.baseSize} • Scale: {formData.typography?.scaleRatio}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-3 text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      setIsAdvanced(true);
                      const sectionIndex = steps.findIndex(step => step.section === 'typography');
                      if (sectionIndex !== -1) setCurrentStep(sectionIndex);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-gray-900">Color Palette</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      setIsAdvanced(true);
                      const sectionIndex = steps.findIndex(step => step.section === 'colors');
                      if (sectionIndex !== -1) setCurrentStep(sectionIndex);
                    }}
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {formData.colors && Object.entries(formData.colors).map(([name, color]) => (
                    <div key={name} className="flex flex-col items-center">
                      <div 
                        className="h-12 w-full rounded-md border border-gray-200 mb-1"
                        style={{ backgroundColor: color }}
                        title={`${name}: ${color}`}
                      />
                      <span className="text-xs text-gray-500 capitalize">{name}</span>
                      <span className="text-xs text-gray-400 font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AIPreviewCard>
      );
    }

    switch (section) {
      case 'overview':
        return (
          <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              {currentStepData.title}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-medium text-gray-900">Brand Name</h3>
                <p className="mt-1 text-sm text-gray-500">
                  The name of your brand as it will appear to customers.
                </p>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleDataChange({ name: e.target.value })}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                />
              </div>
              
              <div>
                <h3 className="text-base md:text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-1 text-sm text-gray-500">
                  A brief description of your brand and what it represents.
                </p>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleDataChange({ description: e.target.value })}
                  rows={3}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                />
              </div>
            </div>
          </div>
        );
      
      case 'logo':
        return <LogoStep data={formData} onChange={handleDataChange} />;
      
      case 'colors':
        return <ColorPaletteStep data={formData} onChange={handleDataChange} />;
      
      case 'typography':
        return <TypographyStep data={formData} onChange={handleDataChange} />;
      
      default:
        return null;
    }
  };

  // Calculate progress
  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const section = currentStepData?.section || 'overview';
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="flex flex-col min-h-screen w-full" ref={containerRef}>
      {/* Progress Bar */}
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-1.5">
        <div 
          className="bg-blue-600 h-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-auto">
        {/* Toggle between AI and Advanced */}
        <div className="flex justify-center my-4 px-4">
          <div className="inline-flex rounded-lg shadow-sm border border-gray-200 overflow-hidden" role="group">
            <button
              type="button"
              onClick={() => setIsAdvanced(false)}
              className={`px-3 py-2 text-sm font-medium ${
                !isAdvanced 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Wand2 className="w-4 h-4 md:mr-2" />
                <span className="sr-only md:not-sr-only md:ml-1">AI</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsAdvanced(true)}
              className={`px-3 py-2 text-sm font-medium ${
                isAdvanced 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Settings className="w-4 h-4 md:mr-2" />
                <span className="sr-only md:not-sr-only md:ml-1">Advanced</span>
              </div>
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="w-full px-4 pb-20">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-10">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={isAdvanced ? () => setIsAdvanced(false) : prevStep}
            disabled={isFirstStep && !isAdvanced}
            className={`${(isFirstStep && !isAdvanced) ? 'invisible' : ''}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">{isAdvanced ? 'Back' : 'Previous'}</span>
          </Button>
          
          <Button
            onClick={isAdvanced ? nextStep : () => setIsAdvanced(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isAdvanced ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            <span>{isAdvanced ? 'Save' : 'Edit'}</span>
          </Button>
        </div>
      </div>
      {isOpen && <Dialog />}
    </div>
  );
};

export { BrandWizard };
