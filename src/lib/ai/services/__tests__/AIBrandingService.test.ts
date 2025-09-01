import { AIBrandingService } from '../AIBrandingService';
import { SystemPromptService } from '@/lib/database/systemPromptService';

// Mock the SystemPromptService
jest.mock('@/lib/database/systemPromptService');
const mockSystemPromptService = SystemPromptService as jest.Mocked<typeof SystemPromptService>;

// Mock environment variables
const mockEnv = {
  VITE_OPENAI_API_KEY: 'test-openai-key',
  VITE_GEMINI_API_KEY: 'test-gemini-key'
};

Object.defineProperty(import.meta, 'env', {
  value: mockEnv,
  writable: true
});

describe('AIBrandingService', () => {
  let service: AIBrandingService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock successful system prompt response
    mockSystemPromptService.getActivePrompt.mockResolvedValue({
      success: true,
      data: {
        id: 1,
        version: 'test-v1.0',
        content: 'Test system prompt content',
        is_active: true,
        created_at: new Date().toISOString(),
        description: 'Test prompt'
      }
    });
  });

  describe('getSystemPrompt', () => {
    it('should retrieve active system prompt', async () => {
      service = new AIBrandingService();
      
      const prompt = await service.getSystemPrompt();
      
      expect(prompt).toBe('Test system prompt content');
      expect(mockSystemPromptService.getActivePrompt).toHaveBeenCalledTimes(1);
    });

    it('should cache system prompts correctly', async () => {
      service = new AIBrandingService();
      
      // First call should fetch from database
      const prompt1 = await service.getSystemPrompt();
      expect(mockSystemPromptService.getActivePrompt).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      const prompt2 = await service.getSystemPrompt();
      expect(mockSystemPromptService.getActivePrompt).toHaveBeenCalledTimes(1);
      
      expect(prompt1).toBe(prompt2);
    });

    it('should handle database errors gracefully', async () => {
      mockSystemPromptService.getActivePrompt.mockResolvedValue({
        success: false,
        error: 'Database error'
      });

      service = new AIBrandingService();
      
      await expect(service.getSystemPrompt()).rejects.toThrow(
        'System configuration error - unable to load AI instructions'
      );
    });
  });

  describe('determineModel', () => {
    it('should select correct model based on query type', () => {
      service = new AIBrandingService();
      
      // Test creative/strategic queries (should use ChatGPT)
      const creativeQuery = 'Help me develop a brand strategy for my startup';
      const model1 = (service as any).determineModel('strategic', creativeQuery);
      expect(model1).toBe('chatgpt');
      
      // Test analytical queries (should use Gemini)
      const analyticalQuery = 'What are the market statistics for the tech industry?';
      const model2 = (service as any).determineModel('analytical', analyticalQuery);
      expect(model2).toBe('gemini');
    });

    it('should default to ChatGPT for strategic queries', () => {
      service = new AIBrandingService();
      
      const neutralQuery = 'Hello, how are you?';
      const model = (service as any).determineModel('strategic', neutralQuery);
      expect(model).toBe('chatgpt');
    });
  });

  describe('isAvailable', () => {
    it('should return true when providers are available', () => {
      service = new AIBrandingService();
      expect(service.isAvailable()).toBe(true);
    });

    it('should return false when no providers are available', () => {
      // Mock no API keys
      Object.defineProperty(import.meta, 'env', {
        value: {},
        writable: true
      });

      expect(() => new AIBrandingService()).toThrow(
        'No AI providers available. Please check your API keys.'
      );
    });
  });

  describe('getAvailableModels', () => {
    it('should return available model types', () => {
      service = new AIBrandingService();
      const models = service.getAvailableModels();
      
      expect(models).toContain('chatgpt');
      expect(models).toContain('gemini');
      expect(models.length).toBe(2);
    });
  });

  describe('error handling', () => {
    it('should handle API failures gracefully', async () => {
      // Mock system prompt failure
      mockSystemPromptService.getActivePrompt.mockRejectedValue(
        new Error('Network error')
      );

      service = new AIBrandingService();
      
      const result = await service.processQuery('test query', {} as any);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Our AI branding consultant is temporarily unavailable. Please try again in a moment.'
      );
    });
  });
});
