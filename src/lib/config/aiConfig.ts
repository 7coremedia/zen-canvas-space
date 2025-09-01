// AI Configuration for Secure Edge Function

export const AI_CONFIG = {
  // Your Supabase Edge Function URL
  EDGE_FUNCTION_URL: 'https://hnuwgbalqqgnxtajjywh.supabase.co/functions/v1/ai-chat',
  
  // Default AI provider
  DEFAULT_PROVIDER: 'openai' as 'openai' | 'gemini',
  
  // Available models for each provider
  MODELS: {
    openai: ['gpt-3.5-turbo', 'gpt-4'],
    gemini: ['gemini-pro', 'gemini-pro-vision']
  },
  
  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 30000,
  
  // Retry attempts
  RETRY_ATTEMPTS: 2,
  
  // Feature flags
  FEATURES: {
    METADATA_EXTRACTION: true,
    PROVIDER_SWITCHING: true,
    CONNECTION_TESTING: true
  }
} as const;

// Helper function to get the Edge Function URL
export function getEdgeFunctionUrl(): string {
  // You can override this with environment variable if needed
  return import.meta.env.VITE_AI_EDGE_FUNCTION_URL || AI_CONFIG.EDGE_FUNCTION_URL;
}

// Helper function to get default provider
export function getDefaultProvider(): 'openai' | 'gemini' {
  return AI_CONFIG.DEFAULT_PROVIDER;
}
