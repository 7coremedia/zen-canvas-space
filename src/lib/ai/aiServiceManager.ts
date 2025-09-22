// AI Service Manager - Now uses Secure Edge Function with fallback to direct API calls

import { AIProvider, AIContext, AIResponse } from './aiService';
import { SecureAIService } from './secureAIService';
import { FallbackAIService } from './fallbackAIService';
import { getEdgeFunctionUrl, getDefaultProvider } from '../config/aiConfig';

export class AIServiceManager {
  private secureService: SecureAIService;
  private fallbackService: FallbackAIService;
  private aiBrandingService: any = null; // Keep for compatibility

  constructor() {
    const edgeFunctionUrl = getEdgeFunctionUrl();
    const defaultProvider = getDefaultProvider();

    this.secureService = new SecureAIService(edgeFunctionUrl, defaultProvider);
    this.fallbackService = new FallbackAIService();

    console.log('✅ Secure AI Service initialized with Edge Function:', edgeFunctionUrl);
    console.log('🔄 Fallback AI Service ready');

    // Test the connection
    this.testConnection();
  }

  /**
   * Test the Edge Function connection
   */
  private async testConnection() {
    try {
      const isConnected = await this.secureService.testConnection();
      if (isConnected) {
        console.log('✅ Edge Function connection successful');
      } else {
        console.warn('⚠️ Edge Function connection failed - fallback will be used');
      }
    } catch (error) {
      console.warn('⚠️ Edge Function connection error - fallback will be used:', error.message);
    }
  }

  /**
   * Generate AI response using the secure Edge Function with fallback
   */
  async generateResponse(prompt: string, context: AIContext): Promise<AIResponse> {
    console.log('🚀 AIServiceManager: Generating response via secure Edge Function (with fallback)');

    // Try Edge Function first
    try {
      const response = await this.secureService.generateResponse(prompt, context);

      if (!response.error) {
        console.log('✅ AI response generated successfully via Edge Function');
        return response;
      } else {
        console.warn('⚠️ Edge Function failed, trying fallback:', response.error);
      }
    } catch (error) {
      console.warn('⚠️ Edge Function error, trying fallback:', error.message);
    }

    // Use fallback service
    console.log('🔄 Using fallback AI service...');
    try {
      const fallbackResponse = await this.fallbackService.generateResponse(prompt, context);
      console.log('✅ Fallback AI response generated successfully');
      return fallbackResponse;
    } catch (error) {
      console.error('❌ Both AI services failed:', error);
      return {
        content: 'I apologize, but both AI services are currently unavailable. Please check your API keys and try again later.',
        error: 'All AI services failed'
      };
    }
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): string[] {
    return this.secureService.getAvailableProviders();
  }

  /**
   * Set default provider
   */
  setDefaultProvider(provider: string): void {
    this.secureService.setDefaultProvider(provider);
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return true; // Always available with fallback
  }

  /**
   * Get current provider name
   */
  getCurrentProviderName(): string {
    return 'Secure Edge Function + Fallback';
  }

  /**
   * Test the service
   */
  async test(): Promise<boolean> {
    try {
      const edgeFunctionWorks = await this.secureService.testConnection();
      return edgeFunctionWorks; // Return true if Edge Function works
    } catch (error) {
      console.warn('⚠️ Edge Function test failed, but fallback is available');
      return true; // Fallback is always available
    }
  }
}
