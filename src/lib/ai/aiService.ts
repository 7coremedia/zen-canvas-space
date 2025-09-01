// AI Service Layer - Core interfaces and types

export interface AIProvider {
  name: string;
  generateResponse(prompt: string, context: AIContext): Promise<AIResponse>;
  isAvailable(): boolean;
}

export interface AIContext {
  conversationHistory: Array<{ role: string; content: string }>;
  currentStep: BrandCreationStep;
  userSelections: Record<string, any>;
  brandIdea: string;
  uploadedFiles?: Array<{
    name: string;
    type: string;
    size: number;
    data?: File; // Include actual file data for AI analysis
  }>;
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
    model?: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
  error?: string;
}

// Import types from existing files
import { ChatMessage, BrandCreationStep } from '@/components/ai-brand-chat/types';
