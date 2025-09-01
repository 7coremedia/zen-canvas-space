// AI Service Manager - Now uses Secure Edge Function for all AI operations

import { AIProvider, AIContext, AIResponse } from './aiService';
import { SecureAIService } from './secureAIService';
import { getEdgeFunctionUrl, getDefaultProvider } from '../config/aiConfig';

export class AIServiceManager {
  private secureService: SecureAIService;
  private aiBrandingService: any = null; // Keep for compatibility

  constructor() {
    const edgeFunctionUrl = getEdgeFunctionUrl();
    const defaultProvider = getDefaultProvider();
    
    this.secureService = new SecureAIService(edgeFunctionUrl, defaultProvider);
    console.log('✅ Secure AI Service initialized with Edge Function:', edgeFunctionUrl);
    
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
        console.error('❌ Edge Function connection failed');
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
    }
  }

  /**
   * Generate AI response using the secure Edge Function
   */
  async generateResponse(prompt: string, context: AIContext): Promise<AIResponse> {
    console.log('🚀 AIServiceManager: Generating response via secure Edge Function');
    
    try {
      // Use the secure service
      const response = await this.secureService.generateResponse(prompt, context);
      
      if (response.error) {
        console.error('❌ AI response error:', response.error);
        return {
          content: 'I apologize, but I encountered an error. Please try again.',
          error: response.error
        };
      }
      
      console.log('✅ AI response generated successfully');
      return response;
      
    } catch (error) {
      console.error('❌ AIServiceManager error:', error);
      return {
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        error: error.message
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
    return true; // Always available when using Edge Function
  }

  /**
   * Get current provider name
   */
  getCurrentProviderName(): string {
    return 'Secure Edge Function';
  }

  /**
   * Test the service
   */
  async test(): Promise<boolean> {
    return await this.secureService.testConnection();
  }
}
