import { SystemPromptService } from '@/lib/database/systemPromptService';
import { OpenAIProvider } from '../providers/openAI';
import { GeminiProvider } from '../providers/gemini';
import { AIContext, AIResponse } from '../aiService';
import { ResponseValidator, ValidationResult } from './ResponseValidator';
import { ResponseFormatter } from './ResponseFormatter';
import { TemplateProvider } from './TemplateProvider';

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
  qualityScore?: number;
  validationPassed?: boolean;
  enhancementApplied?: boolean;
  consultationLevel?: string;
}

export class ProfessionalAIBrandingService {
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
  private validator: ResponseValidator;

  constructor() {
    this.initializeProviders();
    this.validator = new ResponseValidator();
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
      
      if (promptResponse.success && promptResponse.data) {
        // Update cache
        this.systemPromptCache = promptResponse.data.content;
        this.cacheExpiry = now + this.CACHE_DURATION;
        return this.systemPromptCache;
      } else {
        throw new Error(promptResponse.error || 'Failed to retrieve system prompt');
      }
    } catch (error) {
      console.error('Failed to retrieve system prompt:', error);
      throw new Error('System configuration error - unable to load AI instructions');
    }
  }

  /**
   * Enhanced professional query processing method with validation
   */
  async processQuery(userQuery: string, context: AIContext, queryType: 'strategic' | 'analytical' = 'strategic'): Promise<AIQueryResult> {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        // Get system prompt and enhance query
        const systemPrompt = await this.getSystemPrompt();
        const enhancedQuery = this.enhanceQueryForProfessionalResponse(userQuery, queryType);
        
        // Check if we should include a template
        const relevantTemplate = TemplateProvider.getTemplateForQuery(userQuery);
        let finalQuery = enhancedQuery;
        if (relevantTemplate) {
          finalQuery += `\n\nINCLUDE THIS FRAMEWORK TEMPLATE IN YOUR RESPONSE:\n${relevantTemplate}`;
        }
        
        const selectedModel = this.determineModel(queryType, userQuery);
        
        let response = await this.executeWithRetry(() => 
          this.callModel(selectedModel, systemPrompt, finalQuery, context, queryType)
        );
        
        // Validate response quality
        const validationResult = this.validator.validateResponse(response.content || '');
        
        if (validationResult.isValid && validationResult.score >= 80) {
          // High quality response - format and return it
          const formattedResponse = ResponseFormatter.formatProfessionalResponse(response.content || '');
          
          // Log for quality monitoring
          this.logConsultationMetrics(userQuery, response, queryType);
          
          return {
            ...response,
            content: formattedResponse,
            qualityScore: validationResult.score,
            validationPassed: true,
            consultationLevel: 'executive'
          };
        } else if (attempts < maxAttempts - 1) {
          // Low quality - try again with enhanced prompting
          console.warn(`Response quality score: ${validationResult.score}, attempting enhancement`);
          attempts++;
          continue;
        } else {
          // Final attempt - enhance the best response we got
          const enhancedContent = await this.validator.enhanceResponse(
            response.content || '', 
            validationResult
          );
          
          const formattedResponse = ResponseFormatter.formatProfessionalResponse(enhancedContent);
          
          return {
            ...response,
            content: formattedResponse,
            qualityScore: validationResult.score,
            validationPassed: false,
            enhancementApplied: true,
            consultationLevel: 'enhanced'
          };
        }
        
      } catch (error) {
        if (attempts === maxAttempts - 1) {
          console.error('Professional consultation service failed:', error);
          return {
            success: false,
            error: 'Our senior brand strategist is temporarily unavailable. Please try again shortly.',
            timestamp: new Date().toISOString(),
            consultationLevel: 'error'
          };
        }
        attempts++;
      }
    }

    // Fallback - should never reach here
    return {
      success: false,
      error: 'Service temporarily unavailable',
      timestamp: new Date().toISOString(),
      consultationLevel: 'error'
    };
  }

  /**
   * Enhance query for professional response
   */
  private enhanceQueryForProfessionalResponse(userQuery: string, queryType: 'strategic' | 'analytical'): string {
    const professionalContext = `
    PROVIDE A PROFESSIONAL BUSINESS CONSULTATION RESPONSE TO THIS QUERY.
    
    REQUIREMENTS:
    - Deliver immediate strategic value
    - Include specific frameworks and implementation steps
    - Provide measurable success criteria
    - Use professional business terminology
    - Structure response with clear hierarchy
    - Include concrete examples and templates
    
    QUERY: ${userQuery}
    
    RESPONSE FORMAT: Begin with strategic analysis, provide actionable framework, include specific examples, define success metrics, outline implementation roadmap.
    `;
    
    return professionalContext;
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
   * Get model configuration with professional settings
   */
  private getModelConfig(modelType: 'chatgpt' | 'gemini', queryType: 'strategic' | 'analytical' = 'strategic'): AIModelConfig {
    const baseConfigs = {
      chatgpt: {
        temperature: 0.35,  // REDUCED from 0.6 - More focused, professional
        maxTokens: 2500,    // INCREASED for comprehensive responses
        presencePenalty: 0.1, // Reduce repetitive language
        frequencyPenalty: 0.2 // Encourage varied professional vocabulary
      },
      gemini: {
        temperature: 0.25,  // REDUCED from 0.3 - Highly focused factual responses
        maxTokens: 2500,
        topP: 0.8          // More selective word choice
      }
    };
    
    // Adjust for complex strategic queries
    if (queryType === 'strategic') {
      baseConfigs.chatgpt.temperature = 0.4;  // Slight increase for strategic thinking
      baseConfigs.chatgpt.maxTokens = 3000;   // More room for comprehensive frameworks
    }
    
    return baseConfigs[modelType] || baseConfigs.chatgpt;
  }

  /**
   * Call specific model
   */
  private async callModel(modelType: 'chatgpt' | 'gemini', systemPrompt: string, userQuery: string, context: AIContext, queryType: 'strategic' | 'analytical' = 'strategic'): Promise<AIQueryResult> {
    const config = this.getModelConfig(modelType, queryType === 'strategic' ? 'strategic' : 'standard');
    
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
   * Call ChatGPT API with professional configuration
   */
  private async callChatGPT(systemPrompt: string, userQuery: string, context: AIContext, config: AIModelConfig): Promise<AIQueryResult> {
    if (!this.openaiProvider) {
      throw new Error('OpenAI provider not available');
    }

    const startTime = Date.now();
    
    try {
      // Create enhanced context with system prompt and professional configuration
      const enhancedContext = {
        ...context,
        systemPrompt: systemPrompt,
        modelConfig: config
      };

      const response = await this.openaiProvider.generateResponse(userQuery, enhancedContext);
      
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
   * Call Gemini API with professional configuration
   */
  private async callGemini(systemPrompt: string, userQuery: string, context: AIContext, config: AIModelConfig): Promise<AIQueryResult> {
    if (!this.geminiProvider) {
      throw new Error('Gemini provider not available');
    }

    const startTime = Date.now();
    
    try {
      // Create enhanced context with system prompt and professional configuration
      const enhancedContext = {
        ...context,
        systemPrompt: systemPrompt,
        modelConfig: config
      };

      const response = await this.geminiProvider.generateResponse(userQuery, enhancedContext);
      
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
   * Log consultation metrics
   */
  private logConsultationMetrics(query: string, response: AIQueryResult, queryType: 'strategic' | 'analytical') {
    const metrics = {
      timestamp: new Date().toISOString(),
      queryType: queryType,
      queryLength: query.length,
      responseLength: response.content?.length || 0,
      qualityScore: response.qualityScore || 'N/A',
      model: response.model,
      responseTime: 'N/A',
      validationPassed: response.validationPassed || false
    };
    
    // Log to your analytics system
    console.log('Consultation Metrics:', JSON.stringify(metrics));
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
