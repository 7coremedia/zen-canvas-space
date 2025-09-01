export const AI_CONFIG = {
  // Request timeout in milliseconds
  REQUEST_TIMEOUT: parseInt(import.meta.env.VITE_AI_REQUEST_TIMEOUT || '45000'),
  
  // Number of retry attempts
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_AI_RETRY_ATTEMPTS || '2'),
  
  // System prompt cache duration in milliseconds
  SYSTEM_PROMPT_CACHE_DURATION: parseInt(import.meta.env.VITE_SYSTEM_PROMPT_CACHE_DURATION || '300000'),
  
  // Model configurations
  MODELS: {
    CHATGPT: {
      temperature: 0.6,
      maxTokens: 2000
    },
    GEMINI: {
      temperature: 0.3,
      maxTokens: 2000
    }
  },
  
  // Provider priorities
  PROVIDER_PRIORITY: ['gemini', 'openai'] as const,
  
  // Feature flags
  FEATURES: {
    IMAGE_ANALYSIS: true,
    DUAL_MODEL_ARCHITECTURE: true,
    SYSTEM_PROMPT_MANAGEMENT: true
  }
} as const;

export type AIProviderType = typeof AI_CONFIG.PROVIDER_PRIORITY[number];

// Environment variable validation
export const validateEnvironment = () => {
  const requiredVars = [
    'VITE_GEMINI_API_KEY',
    'VITE_OPENAI_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing AI API keys:', missingVars);
    console.warn('Some AI features may not be available');
  }

  return {
    hasGemini: !!import.meta.env.VITE_GEMINI_API_KEY,
    hasOpenAI: !!import.meta.env.VITE_OPENAI_API_KEY,
    isFullyConfigured: missingVars.length === 0
  };
};
