// Secure AI Service - Uses Supabase Edge Functions for secure API calls

export interface AIContext {
  conversationHistory: any[];
  currentStep?: string;
  userSelections?: Record<string, any>;
  brandIdea?: string;
}

export interface AIResponse {
  content: string;
  metadata?: {
    suggestions?: string[];
    selected?: string;
    hexCodes?: string[];
    headingFont?: string;
    bodyFont?: string;
    fontStyle?: string;
  };
  error?: string;
}

export class SecureAIService {
  private edgeFunctionUrl: string;
  private defaultProvider: string;

  constructor(edgeFunctionUrl: string, defaultProvider: string = 'openai') {
    this.edgeFunctionUrl = edgeFunctionUrl;
    this.defaultProvider = defaultProvider;
  }

  /**
   * Generate AI response using the secure Edge Function
   */
  async generateResponse(prompt: string, context: AIContext, provider?: string): Promise<AIResponse> {
    try {
      console.log('🚀 Calling secure Edge Function with prompt:', prompt.substring(0, 100) + '...');
      
      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getSupabaseAnonKey()}`,
        },
        body: JSON.stringify({
          message: prompt,
          provider: provider || this.defaultProvider,
          queryType: 'branding',
          model: provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-pro'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Edge Function error:', response.status, errorText);
        throw new Error(`Edge Function error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Edge Function response received');
      
      return {
        content: data.response,
        metadata: this.extractMetadata(data.response)
      };

    } catch (error) {
      console.error('❌ Secure AI Service error:', error);
      return {
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        error: error.message
      };
    }
  }

  /**
   * Get Supabase anon key for authentication
   */
  private getSupabaseAnonKey(): string {
    // This is safe to expose - it's the public anon key
    return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  }

  /**
   * Extract metadata from AI response
   */
  private extractMetadata(response: string): any {
    // You can implement logic to extract specific metadata from responses
    // For now, return basic structure
    return {
      responseLength: response.length,
      hasSuggestions: response.includes('suggestion') || response.includes('recommend'),
      hasMetrics: response.includes('KPI') || response.includes('ROI') || response.includes('metric')
    };
  }

  /**
   * Test the Edge Function connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.generateResponse(
        'Hello, this is a test message to verify the connection.',
        { conversationHistory: [] }
      );
      return !response.error && response.content.length > 0;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): string[] {
    return ['openai', 'gemini'];
  }

  /**
   * Set default provider
   */
  setDefaultProvider(provider: string): void {
    if (['openai', 'gemini'].includes(provider)) {
      this.defaultProvider = provider;
    }
  }
}
