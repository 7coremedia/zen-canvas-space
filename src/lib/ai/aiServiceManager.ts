// AI Service Manager - Coordinates between different AI providers

import { AIProvider, AIContext, AIResponse } from './aiService';
import { TogetherAIProvider } from './providers/togetherAI';
import { OpenAIProvider } from './providers/openAI';
import { GeminiProvider } from './providers/gemini';
import { ProfessionalAIBrandingService } from './services/ProfessionalAIBrandingService';

export class AIServiceManager {
  private providers: AIProvider[] = [];
  private currentProvider: AIProvider | null = null;
  private fallbackProvider: AIProvider | null = null;
  private aiBrandingService: ProfessionalAIBrandingService | null = null;

  constructor() {
    this.initializeProviders();
    // Initialize AI Branding Service asynchronously
    this.initializeAIBrandingService();
  }

  private initializeProviders() {
    // Priority 1: OpenAI (ChatGPT) - Best for professional responses with system prompts
    const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openAiApiKey) {
      const openAiProvider = new OpenAIProvider(openAiApiKey);
      this.providers.push(openAiProvider);
      this.currentProvider = openAiProvider;
      console.log('OpenAI (ChatGPT) provider initialized as primary');
    }

    // Priority 2: Google Gemini (Fallback)
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiApiKey) {
      const geminiProvider = new GeminiProvider(geminiApiKey);
      this.providers.push(geminiProvider);
      
      // If no higher priority providers are available, use Gemini as primary
      if (!this.currentProvider) {
        this.currentProvider = geminiProvider;
        console.log('Google Gemini provider initialized as primary');
      }
    }

    // Priority 4: Together AI (Fallback)
    const togetherApiKey = import.meta.env.VITE_TOGETHER_API_KEY;
    if (togetherApiKey) {
      const togetherProvider = new TogetherAIProvider(togetherApiKey);
      this.providers.push(togetherProvider);
      
      // If no other providers are available, use Together AI as primary
      if (!this.currentProvider) {
        this.currentProvider = togetherProvider;
        console.log('Together AI provider initialized as primary');
      }
    }

    // If no other providers are available, log error
    if (!this.currentProvider) {
      console.error('No AI providers available. Please check your API keys.');
      throw new Error('No AI providers available. Please check your API keys.');
    }

    // Initialize AI Branding Service
    try {
      this.aiBrandingService = new ProfessionalAIBrandingService();
      console.log('✅ AI Branding Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI Branding Service:', error);
      this.aiBrandingService = null;
    }

    console.log(`AI Service Manager initialized with ${this.providers.length} providers`);
    console.log(`Primary provider: ${this.currentProvider.name}`);
  }

  private async initializeAIBrandingService() {
    if (!this.aiBrandingService) {
      console.log('⚠️ AI Branding Service not available');
      return;
    }

    try {
      // Test if the service can actually get a system prompt
      const testPrompt = await this.aiBrandingService.getSystemPrompt();
      console.log('✅ System prompt loaded successfully, length:', testPrompt.length);
    } catch (promptError) {
      console.error('❌ Failed to load system prompt during initialization:', promptError);
      console.log('🔄 Disabling AI Branding Service due to prompt loading failure');
      this.aiBrandingService = null; // Disable the service if it can't load prompts
    }
  }

  async generateResponse(prompt: string, context: AIContext): Promise<AIResponse> {
    console.log('🚀 generateResponse called with prompt:', prompt.substring(0, 100) + '...');
    
    // Use the Professional AI Branding Service if available
    if (this.aiBrandingService) {
      try {
        console.log('🎯 Using Professional AI Branding Service for enhanced response generation');
        console.log('AI Branding Service available:', this.aiBrandingService.isAvailable());
        
        const result = await this.aiBrandingService.processQuery(prompt, context);
        console.log('📊 AI Branding Service result:', result);
        
        if (result.success) {
          console.log('✅ AI Branding Service successful, returning professional response');
          console.log('📝 Response content preview:', result.content?.substring(0, 200) + '...');
          return {
            content: result.content,
            error: undefined
          };
        } else {
          console.error('❌ AI Branding Service failed:', result.error);
          console.log('🔄 Falling back to provider-based approach...');
        }
      } catch (error) {
        console.error('❌ AI Branding Service error:', error);
        console.log('🔄 Falling back to provider-based approach...');
      }
    } else {
      console.warn('⚠️ AI Branding Service not available, using fallback');
    }

    // Fallback to provider-based approach if AI Branding Service is not available
    if (!this.currentProvider) {
      return {
        content: 'AI service is not available. Please check your configuration.',
        error: 'No AI provider available'
      };
    }

    // Check if we have images that need analysis
    const hasImages = context.uploadedFiles?.some(file => 
      file.type.startsWith('image/') && file.data
    );

    // Select the best provider for the task
    let selectedProvider = this.currentProvider;
    
    if (hasImages) {
      // For images, prioritize providers that support image analysis
      const imageProvider = this.providers.find(provider => {
        if (provider.name === 'OpenAI') {
          return true; // OpenAI supports GPT-4 Vision
        }
        return false;
      });
      
      if (imageProvider) {
        selectedProvider = imageProvider;
        console.log(`Using ${selectedProvider.name} for image analysis (GPT-4 Vision)`);
      } else {
        console.log('No image-capable provider found, using text-only fallback');
      }
    }

    try {
      console.log(`🔄 Fallback: Generating response with ${selectedProvider.name}`);
      console.log(`🔑 Provider type: ${selectedProvider.constructor.name}`);
      
      const response = await selectedProvider.generateResponse(prompt, context);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      console.log(`✅ Fallback provider ${selectedProvider.name} successful`);
      console.log(`📝 Response preview:`, response.content?.substring(0, 200) + '...');
      
      return response;
    } catch (error) {
      console.error(`❌ Primary provider ${this.currentProvider.name} failed:`, error);
      
      // Try fallback providers
      for (const provider of this.providers) {
        if (provider !== this.currentProvider && provider.isAvailable()) {
          try {
            console.log(`Trying fallback provider: ${provider.name}`);
            this.currentProvider = provider;
            const fallbackResponse = await provider.generateResponse(prompt, context);
            
            if (!fallbackResponse.error) {
              console.log(`Successfully used fallback provider: ${provider.name}`);
              return fallbackResponse;
            }
          } catch (fallbackError) {
            console.error(`Fallback provider ${provider.name} failed:`, fallbackError);
          }
        }
      }

      // If all providers fail, return error response
      return {
        content: 'Sorry, I encountered an error. Please try again.',
        error: error instanceof Error ? error.message : 'All AI providers failed'
      };
    }
  }

  getCurrentProvider(): AIProvider | null {
    return this.currentProvider;
  }

  getAvailableProviders(): AIProvider[] {
    return this.providers.filter(provider => provider.isAvailable());
  }

  // Get AI Branding Service
  getAIBrandingService(): ProfessionalAIBrandingService | null {
    return this.aiBrandingService;
  }

  switchProvider(providerName: string): boolean {
    const provider = this.providers.find(p => p.name === providerName);
    if (provider && provider.isAvailable()) {
      this.currentProvider = provider;
      console.log(`Switched to provider: ${provider.name}`);
      return true;
    }
    return false;
  }

  // Test method to verify AI service is working
  async testConnection(): Promise<{ success: boolean; provider: string; error?: string }> {
    try {
      const testContext: AIContext = {
        conversationHistory: [],
        currentStep: 'IDEA' as any,
        userSelections: {},
        brandIdea: 'Test business idea'
      };

      const response = await this.generateResponse('Hello, this is a test.', testContext);
      
      return {
        success: !response.error,
        provider: this.currentProvider?.name || 'Unknown',
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        provider: this.currentProvider?.name || 'Unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Method to get provider status
  getProviderStatus(): Array<{ name: string; available: boolean; isCurrent: boolean }> {
    return this.providers.map(provider => ({
      name: provider.name,
      available: provider.isAvailable(),
      isCurrent: provider === this.currentProvider
    }));
  }

  // Method to get provider capabilities
  getProviderCapabilities(): Array<{ name: string; supportsImages: boolean; description: string }> {
    return this.providers.map(provider => {
      let supportsImages = false;
      let description = '';

      if (provider.name === 'OpenAI') {
        supportsImages = true;
        description = 'GPT-4 Vision for advanced image analysis';
      } else if (provider.name === 'Google Gemini') {
        supportsImages = true;
        description = 'Gemini Pro Vision for image analysis';
      } else if (provider.name === 'Together AI') {
        supportsImages = false;
        description = 'Text-only models';
      } else {
        supportsImages = false;
        description = 'Unknown provider';
      }

      return { name: provider.name, supportsImages, description };
    });
  }

  // Method to get provider details
  getProviderDetails(): Array<{ 
    name: string; 
    available: boolean; 
    isCurrent: boolean;
    model?: string;
    cost?: string;
  }> {
    return this.providers.map(provider => {
      const details: any = {
        name: provider.name,
        available: provider.isAvailable(),
        isCurrent: provider === this.currentProvider
      };

      // Add model information if available
      if ('getModel' in provider) {
        details.model = (provider as any).getModel();
      }

      // Add cost information
      switch (provider.name) {
        case 'Google Gemini':
          details.cost = 'Free (15 requests/minute)';
          break;
        case 'OpenAI':
          details.cost = '$0.002 per 1K tokens (GPT-3.5)';
          break;
        case 'Together AI':
          details.cost = '$0.20 per 1M tokens';
          break;
        default:
          details.cost = 'Unknown';
          break;
      }

      return details;
    });
  }
}
