// Simple Branding Chat Types - No Brand Creation Complexity

export enum BrandCreationStep {
  IDEA = 'IDEA',
  THOUGHT = 'THOUGHT',
  SUMMARY = 'SUMMARY',
  BRAND_NAME = 'BRAND_NAME',
  POSITIONING = 'POSITIONING',
  BRAND_COLORS = 'BRAND_COLORS',
  TYPOGRAPHY = 'TYPOGRAPHY',
  LOGO_SUITE = 'LOGO_SUITE',
  MOODBOARD = 'MOODBOARD',
  BRAND_STARTER_SHEET = 'BRAND_STARTER_SHEET',
  RESULT = 'RESULT'
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string; // For uploaded files
    preview?: string; // For image previews
  }>;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
}
