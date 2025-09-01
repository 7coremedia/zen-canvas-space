export interface SystemPrompt {
  id: number;
  version: string;
  content: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
  description?: string;
}

export interface SystemPromptCreate {
  version: string;
  content: string;
  description?: string;
  created_by?: string;
}

export interface SystemPromptUpdate {
  content?: string;
  description?: string;
  created_by?: string;
}

export interface SystemPromptResponse {
  success: boolean;
  data?: SystemPrompt | SystemPrompt[];
  error?: string;
}
