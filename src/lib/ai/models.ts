// AI Model Configurations

export interface AIModelConfig {
  name: string;
  provider: 'openai' | 'anthropic' | 'ollama';
  version: string;
  maxTokens: number;
  temperature: number;
  capabilities: string[];
}

export const AI_MODELS: Record<string, AIModelConfig> = {
  'gpt-4': {
    name: 'GPT-4',
    provider: 'openai',
    version: 'gpt-4',
    maxTokens: 4000,
    temperature: 0.7,
    capabilities: ['brand-strategy', 'creative-writing', 'analysis', 'reasoning']
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    version: 'gpt-3.5-turbo',
    maxTokens: 4000,
    temperature: 0.7,
    capabilities: ['brand-strategy', 'creative-writing', 'analysis']
  },
  'claude-3-opus': {
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    version: 'claude-3-opus-20240229',
    maxTokens: 4000,
    temperature: 0.7,
    capabilities: ['brand-strategy', 'creative-writing', 'analysis', 'reasoning', 'safety']
  },
  'claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    version: 'claude-3-sonnet-20240229',
    maxTokens: 4000,
    temperature: 0.7,
    capabilities: ['brand-strategy', 'creative-writing', 'analysis']
  },
  'llama-3.1': {
    name: 'Llama 3.1',
    provider: 'ollama',
    version: 'llama3.1:8b',
    maxTokens: 4000,
    temperature: 0.7,
    capabilities: ['brand-strategy', 'creative-writing']
  },

};

export const DEFAULT_MODEL = 'gpt-4'; // Start with GPT-4 for development

export interface AIRequest {
  prompt: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  systemMessage?: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, any>;
}


