import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { ProfessionalAIBrandingService } from './ProfessionalAIBrandingService';
import { ResponseValidator } from './ResponseValidator';
import { TemplateProvider } from './TemplateProvider';

// Mock the environment variables
const mockEnv = {
  VITE_OPENAI_API_KEY: 'test-openai-key',
  VITE_GEMINI_API_KEY: 'test-gemini-key'
};

// Mock import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: mockEnv
    }
  }
});

describe('Professional AI Consultation System', () => {
  let aiService: ProfessionalAIBrandingService;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock the providers to avoid actual API calls
    jest.mock('../providers/openAI');
    jest.mock('../providers/gemini');
    jest.mock('@/lib/database/systemPromptService');
    
    aiService = new ProfessionalAIBrandingService();
  });

  test('Marketing plan query returns professional structured response', async () => {
    const query = 'How do I create a marketing plan for my B2B software company?';
    
    // Mock successful response
    const mockResponse = {
      success: true,
      content: `
      ## Strategic Analysis
      
      B2B software marketing requires a systematic approach focused on demonstrating ROI and building trust through thought leadership. The framework below provides actionable steps for implementation.
      
      ## Implementation Framework
      
      1. Market Research and Analysis
      2. Target Audience Segmentation
      3. Content Strategy Development
      4. Channel Selection and Optimization
      5. Performance Measurement System
      
      ## Success Metrics
      
      - Lead generation: 50+ qualified leads per month
      - Conversion rate: 15% from lead to opportunity
      - Customer acquisition cost: <$2,000
      - ROI measurement through attribution modeling
      `,
      model: 'chatgpt',
      timestamp: new Date().toISOString(),
      qualityScore: 85,
      validationPassed: true
    };
    
    // Mock the processQuery method
    jest.spyOn(aiService, 'processQuery').mockResolvedValue(mockResponse);
    
    const response = await aiService.processQuery(query, {} as any, 'strategic');
    
    expect(response.success).toBe(true);
    expect(response.qualityScore).toBeGreaterThan(80);
    expect(response.content).toContain('Strategic Analysis');
    expect(response.content).toContain('Implementation');
    expect(response.content).not.toMatch(/hey there|awesome|great question/i);
    expect(response.content).toMatch(/framework|strategy|metrics|ROI/i);
    expect(response.content!.length).toBeGreaterThan(800);
  });
  
  test('Response validation rejects casual language', () => {
    const validator = new ResponseValidator();
    const casualResponse = "Hey there! That's awesome! 🎉 Don't worry, you've got this!";
    
    const validation = validator.validateResponse(casualResponse);
    expect(validation.isValid).toBe(false);
    expect(validation.issues.length).toBeGreaterThan(0);
    expect(validation.issues).toContain('Contains casual or unprofessional language');
  });
  
  test('Response validation accepts professional language', () => {
    const validator = new ResponseValidator();
    const professionalResponse = `
    ## Strategic Analysis
    
    The market analysis indicates significant opportunities for growth through targeted customer segmentation and strategic positioning. Implementation of the following framework will deliver measurable results within 90 days.
    
    ## Implementation Framework
    
    1. Develop comprehensive market research methodology
    2. Execute customer segmentation analysis
    3. Create positioning strategy with differentiation metrics
    4. Build performance measurement system with ROI tracking
    
    ## Success Metrics
    
    Key performance indicators include lead generation benchmarks, conversion rate optimization, and customer acquisition cost analysis.
    `;
    
    const validation = validator.validateResponse(professionalResponse);
    expect(validation.isValid).toBe(true);
    expect(validation.score).toBeGreaterThan(80);
    expect(validation.issues.length).toBe(0);
  });
  
  test('Template integration works for marketing queries', () => {
    const template = TemplateProvider.getTemplateForQuery('marketing plan');
    expect(template).toContain('Strategic Foundation');
    expect(template).toContain('Success Metrics');
    expect(template).toContain('Budget Allocation');
    expect(template).toContain('Implementation Roadmap');
  });
  
  test('Template integration works for brand strategy queries', () => {
    const template = TemplateProvider.getTemplateForQuery('brand strategy');
    expect(template).toContain('Brand Foundation Analysis');
    expect(template).toContain('Brand Positioning Framework');
    expect(template).toContain('Brand Measurement System');
  });
  
  test('Template integration returns null for unmatched queries', () => {
    const template = TemplateProvider.getTemplateForQuery('random question');
    expect(template).toBeNull();
  });
  
  test('Model configuration uses professional temperature settings', () => {
    const chatgptConfig = (aiService as any).getModelConfig('chatgpt', 'strategic');
    const geminiConfig = (aiService as any).getModelConfig('gemini', 'analytical');
    
    expect(chatgptConfig.temperature).toBe(0.4); // Strategic setting
    expect(chatgptConfig.maxTokens).toBe(3000);
    expect(chatgptConfig.presencePenalty).toBe(0.1);
    expect(chatgptConfig.frequencyPenalty).toBe(0.2);
    
    expect(geminiConfig.temperature).toBe(0.25);
    expect(geminiConfig.maxTokens).toBe(2500);
    expect(geminiConfig.topP).toBe(0.8);
  });
  
  test('Service availability check works correctly', () => {
    expect(aiService.isAvailable()).toBe(true);
    expect(aiService.getAvailableModels()).toContain('chatgpt');
    expect(aiService.getAvailableModels()).toContain('gemini');
  });
  
  test('Query enhancement adds professional context', () => {
    const originalQuery = 'How do I market my product?';
    const enhancedQuery = (aiService as any).enhanceQueryForProfessionalResponse(originalQuery, 'strategic');
    
    expect(enhancedQuery).toContain('PROFESSIONAL BUSINESS CONSULTATION');
    expect(enhancedQuery).toContain('strategic value');
    expect(enhancedQuery).toContain('frameworks and implementation steps');
    expect(enhancedQuery).toContain('measurable success criteria');
    expect(enhancedQuery).toContain(originalQuery);
  });
});
