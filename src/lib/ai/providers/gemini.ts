import { AIProvider, AIContext, AIResponse } from '../aiService';

export class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(apiKey: string, model: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateResponse(prompt: string, context: AIContext): Promise<AIResponse> {
    try {
      // Format the prompt with context
      const formattedPrompt = this.formatPrompt(prompt, context);
      
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: formattedPrompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
            topP: 0.9,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini');
      }

      const content = data.candidates[0].content.parts[0].text;
      const usageMetadata = data.usageMetadata;

      return {
        content: content,
        metadata: {
          model: this.model,
          usage: {
            promptTokens: usageMetadata?.promptTokenCount || 0,
            completionTokens: usageMetadata?.candidatesTokenCount || 0,
            totalTokens: usageMetadata?.totalTokenCount || 0
          }
        }
      };
    } catch (error) {
      console.error('Gemini generation error:', error);
      return {
        content: 'Sorry, I encountered an error while generating a response.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private formatPrompt(prompt: string, context: AIContext): string {
    let formattedPrompt = '';

    // Use the system prompt from context if available, otherwise use a default professional message
    const systemPrompt = (context as any).systemPrompt || `You are a professional brand strategist with expertise in business development and marketing. Provide strategic, actionable guidance using professional business terminology.`;
    
    formattedPrompt += `${systemPrompt}\n\n`;

    // Add conversation history if available
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      formattedPrompt += `Previous conversation:\n`;
      const recentMessages = context.conversationHistory.slice(-6); // Keep more context
      for (const message of recentMessages) {
        if (message.role === 'user') {
          formattedPrompt += `User: ${message.content}\n`;
        } else {
          formattedPrompt += `Assistant: ${message.content}\n`;
        }
      }
      formattedPrompt += '\n';
    }

    // Add brand context if available
    if (context.brandIdea) {
      formattedPrompt += `User's Brand Idea: ${context.brandIdea}\n`;
    }

    // Add current step context
    if (context.currentStep) {
      formattedPrompt += `Current Context: ${context.currentStep}\n`;
    }

    // Add user selections if available
    if (Object.keys(context.userSelections).length > 0) {
      formattedPrompt += `User's Previous Choices: ${JSON.stringify(context.userSelections)}\n`;
    }

    // Add the main prompt with natural instructions
    formattedPrompt += `\nUser Question: ${prompt}\n\nPlease respond naturally and conversationally, as if you're having a helpful chat with a friend about their business. Share your thoughts, give practical advice, and use real examples when helpful. Keep it engaging and genuinely useful!`;

    return formattedPrompt;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  // Method to change model
  setModel(model: string): void {
    this.model = model;
  }

  // Method to get current model
  getModel(): string {
    return this.model;
  }

  // Method to get available models
  static getAvailableModels(): Array<{ id: string; name: string; description: string }> {
    return [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and versatile model (Recommended)' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable model (may have rate limits)' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Latest stable model' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Latest pro model' }
    ];
  }
}
