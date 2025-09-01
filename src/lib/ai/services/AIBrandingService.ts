import { SystemPromptService } from '@/lib/database/systemPromptService';
import { OpenAIProvider } from '../providers/openAI';
import { GeminiProvider } from '../providers/gemini';
import { AIContext, AIResponse } from '../aiService';

export interface AIModelConfig {
  temperature: number;
  maxTokens: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  topP?: number;
}

export interface AIQueryResult {
  success: boolean;
  content?: string;
  model?: string;
  timestamp: string;
  error?: string;
}

export class AIBrandingService {
  private models = {
    primary: 'chatgpt',    // For creative and strategic queries
    secondary: 'gemini',   // For analytical and factual queries
    timeout: 45000,        // 45 seconds timeout for complex branding queries
    retryAttempts: 2
  };
  
  private systemPromptCache: string | null = null;
  private cacheExpiry: number | null = null;
  private CACHE_DURATION = 300000; // 5 minutes

  private openaiProvider: OpenAIProvider | null = null;
  private geminiProvider: GeminiProvider | null = null;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (openaiApiKey) {
      this.openaiProvider = new OpenAIProvider(openaiApiKey);
    }

    if (geminiApiKey) {
      this.geminiProvider = new GeminiProvider(geminiApiKey);
    }

    if (!this.openaiProvider && !this.geminiProvider) {
      console.error('No AI providers available. Please check your API keys.');
      throw new Error('No AI providers available. Please check your API keys.');
    }
  }

  /**
   * Get system prompt with caching
   */
  async getSystemPrompt(): Promise<string> {
    const now = Date.now();
    
    // Check if cache is valid
    if (this.systemPromptCache && this.cacheExpiry && now < this.cacheExpiry) {
      return this.systemPromptCache;
    }
    
    try {
      // Fetch from database
      const promptResponse = await SystemPromptService.getActivePrompt();
      
      if (!promptResponse.success || !promptResponse.data) {
        throw new Error('No active system prompt found');
      }
      
      // Update cache
      this.systemPromptCache = promptResponse.data.content;
      this.cacheExpiry = now + this.CACHE_DURATION;
      
      return this.systemPromptCache;
      
    } catch (error) {
      console.error('Failed to retrieve system prompt:', error);
      // DO NOT use mock data - throw error instead
      throw new Error('System configuration error - unable to load AI instructions');
    }
  }

  /**
   * Primary query processing method
   */
  async processQuery(userQuery: string, context: AIContext, queryType: 'strategic' | 'analytical' = 'strategic'): Promise<AIQueryResult> {
    try {
      const systemPrompt = await this.getSystemPrompt();
      const selectedModel = this.determineModel(queryType, userQuery);
      
      // Primary model attempt
      try {
        return await this.executeWithRetry(() => 
          this.callModel(selectedModel, systemPrompt, userQuery, context)
        );
      } catch (primaryError) {
        console.warn(`Primary model ${selectedModel} failed:`, primaryError);
        
        // Secondary model fallback
        const fallbackModel = selectedModel === 'chatgpt' ? 'gemini' : 'chatgpt';
        return await this.executeWithRetry(() => 
          this.callModel(fallbackModel, systemPrompt, userQuery, context)
        );
      }
      
    } catch (error) {
      console.error('AI processing failed:', error);
      
      // CRITICAL: Return proper error response, NOT mock data
      return {
        success: false,
        error: 'Our AI branding consultant is temporarily unavailable. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Model selection logic
   */
  private determineModel(queryType: 'strategic' | 'analytical', userQuery: string): 'chatgpt' | 'gemini' {
    // Convert query to lowercase for analysis
    const query = userQuery.toLowerCase();
    
    // Keywords that indicate creative/strategic thinking (ChatGPT)
    const creativeKeywords = [
      'strategy', 'creative', 'brainstorm', 'concept', 'vision', 'storytelling',
      'messaging', 'positioning', 'differentiate', 'unique', 'innovative'
    ];
    
    // Keywords that indicate analytical/factual needs (Gemini)
    const analyticalKeywords = [
      'data', 'research', 'analysis', 'statistics', 'market size', 'competitor',
      'trends', 'demographics', 'metrics', 'benchmark', 'study'
    ];
    
    // Score the query
    const creativeScore = creativeKeywords.filter(keyword => 
      query.includes(keyword)).length;
    const analyticalScore = analyticalKeywords.filter(keyword => 
      query.includes(keyword)).length;
    
    // Default to strategic (ChatGPT) unless analytical wins clearly
    return analyticalScore > creativeScore ? 'gemini' : 'chatgpt';
  }

  /**
   * Get model configuration
   */
  private getModelConfig(modelType: 'chatgpt' | 'gemini'): AIModelConfig {
    const configs = {
      chatgpt: {
        temperature: 0.6,  // Balanced creativity and focus
        maxTokens: 2000
      },
      gemini: {
        temperature: 0.3,  // More factual and precise
        maxTokens: 2000
      }
    };
    
    return configs[modelType] || configs.chatgpt;
  }

  /**
   * Call specific model
   */
  private async callModel(modelType: 'chatgpt' | 'gemini', systemPrompt: string, userQuery: string, context: AIContext): Promise<AIQueryResult> {
    const config = this.getModelConfig(modelType);
    
    switch (modelType) {
      case 'chatgpt':
        return await this.callChatGPT(systemPrompt, userQuery, context, config);
      case 'gemini':
        return await this.callGemini(systemPrompt, userQuery, context, config);
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  /**
   * Call ChatGPT API
   */
  private async callChatGPT(systemPrompt: string, userQuery: string, context: AIContext, config: AIModelConfig): Promise<AIQueryResult> {
    if (!this.openaiProvider) {
      throw new Error('OpenAI provider not available');
    }

    const startTime = Date.now();
    
    try {
      const response = await this.openaiProvider.generateResponse(userQuery, context);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      const responseTime = Date.now() - startTime;
      this.logRequest(userQuery, 'chatgpt', true, responseTime);
      
      return {
        success: true,
        content: response.content,
        model: 'chatgpt',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logRequest(userQuery, 'chatgpt', false, responseTime, error as Error);
      throw error;
    }
  }

  /**
   * Call Gemini API
   */
  private async callGemini(systemPrompt: string, userQuery: string, context: AIContext, config: AIModelConfig): Promise<AIQueryResult> {
    if (!this.geminiProvider) {
      throw new Error('Gemini provider not available');
    }

    const startTime = Date.now();
    
    try {
      const response = await this.geminiProvider.generateResponse(userQuery, context);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      const responseTime = Date.now() - startTime;
      this.logRequest(userQuery, 'gemini', true, responseTime);
      
      return {
        success: true,
        content: response.content,
        model: 'gemini',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logRequest(userQuery, 'gemini', false, responseTime, error as Error);
      throw error;
    }
  }

  /**
   * Error handling and retry logic
   */
  private async executeWithRetry(modelFunction: () => Promise<AIQueryResult>, attempts: number = this.models.retryAttempts): Promise<AIQueryResult> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const result = await Promise.race([
          modelFunction(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), this.models.timeout)
          )
        ]);
        
        return result;
        
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed:`, error);
        
        if (attempt < attempts) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Request logging
   */
  private logRequest(query: string, model: string, success: boolean, responseTime: number, error: Error | null = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      query: query.substring(0, 100) + '...', // Truncated for privacy
      model: model,
      success: success,
      responseTime: responseTime,
      error: error?.message || null
    };
    
    // Log to console for now, can be extended to external logging service
    console.log('AI Request:', JSON.stringify(logEntry));
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return !!(this.openaiProvider || this.geminiProvider);
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    const models: string[] = [];
    if (this.openaiProvider) models.push('chatgpt');
    if (this.geminiProvider) models.push('gemini');
    return models;
  }
}
