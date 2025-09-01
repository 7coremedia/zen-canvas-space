import { AIProvider, AIContext, AIResponse } from '../aiService';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateResponse(prompt: string, context: AIContext): Promise<AIResponse> {
    try {
      // Check if we have uploaded files that need image analysis
      const hasImages = context.uploadedFiles?.some(file => 
        file.type.startsWith('image/') && file.data
      );

      // Use GPT-4o if we have images, otherwise use the default model
      const modelToUse = hasImages ? 'gpt-4o' : this.model;

      // Format messages for OpenAI chat API
      const messages = await this.formatMessages(prompt, context, modelToUse);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: messages,
          max_tokens: 2048,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenAI');
      }

      const content = data.choices[0].message.content;
      const usage = data.usage;

      return {
        content: content,
        metadata: {
          model: modelToUse,
          usage: {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens
          }
        }
      };
    } catch (error) {
      console.error('OpenAI generation error:', error);
      return {
        content: 'Sorry, I encountered an error while generating a response.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async formatMessages(prompt: string, context: AIContext, model: string): Promise<Array<{ role: string; content: string | Array<any> }>> {
    const messages: Array<{ role: string; content: string | Array<any> }> = [];

    // Use the system prompt from context if available, otherwise use a default professional message
    const systemMessage = (context as any).systemPrompt || `You are a professional brand strategist with expertise in business development and marketing. Provide strategic, actionable guidance using professional business terminology.`;

    // If we have images, we need to use a different format for GPT-4o
    if (model === 'gpt-4o' && context.uploadedFiles?.some(f => f.type.startsWith('image/'))) {
      messages.push({
        role: 'system',
        content: systemMessage
      });

      // Add conversation history as text
      if (context.conversationHistory && context.conversationHistory.length > 0) {
        const recentMessages = context.conversationHistory.slice(-6);
        for (const message of recentMessages) {
          messages.push({
            role: message.role === 'user' ? 'user' : 'assistant',
            content: message.content
          });
        }
      }

      // Add current context information
      let contextInfo = '';
      if (context.brandIdea) {
        contextInfo += `Brand Idea: ${context.brandIdea}\n`;
      }
      if (context.currentStep) {
        contextInfo += `Current Step: ${context.currentStep}\n`;
      }
      if (Object.keys(context.userSelections).length > 0) {
        contextInfo += `User Selections: ${JSON.stringify(context.userSelections)}\n`;
      }

      // Create the main message with images and text
      const imageContents: Array<any> = [];
      
      // Add text content first
      const textContent = contextInfo ? `${contextInfo}\nUser Request: ${prompt}` : prompt;
      imageContents.push({ type: 'text', text: textContent });

      // Add image files
      for (const file of context.uploadedFiles || []) {
        if (file.type.startsWith('image/') && file.data) {
          try {
            const base64 = await this.fileToBase64(file.data);
            imageContents.push({
              type: 'image_url',
              image_url: {
                url: `data:${file.type};base64,${base64}`,
                detail: 'high'
              }
            });
          } catch (error) {
            console.error('Error converting image to base64:', error);
          }
        }
      }

      messages.push({
        role: 'user',
        content: imageContents
      });

    } else {
      // Standard text-only format for other models
      messages.push({
        role: 'system',
        content: systemMessage
      });

      // Add conversation history
      if (context.conversationHistory && context.conversationHistory.length > 0) {
        // Add last few messages for context (OpenAI has token limits)
        const recentMessages = context.conversationHistory.slice(-6);
        for (const message of recentMessages) {
          messages.push({
            role: message.role === 'user' ? 'user' : 'assistant',
            content: message.content
          });
        }
      }

      // Add current context information
      let contextInfo = '';
      if (context.brandIdea) {
        contextInfo += `Brand Idea: ${context.brandIdea}\n`;
      }
      if (context.currentStep) {
        contextInfo += `Current Step: ${context.currentStep}\n`;
      }
      if (Object.keys(context.userSelections).length > 0) {
        contextInfo += `User Selections: ${JSON.stringify(context.userSelections)}\n`;
      }

      // Add file information if available
      if (context.uploadedFiles && context.uploadedFiles.length > 0) {
        contextInfo += `\nUploaded Files:\n`;
        for (const file of context.uploadedFiles) {
          contextInfo += `- ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)} KB)\n`;
        }
      }

      // Add the main prompt with context
      const fullPrompt = contextInfo ? `${contextInfo}\nUser Request: ${prompt}` : prompt;
      messages.push({
        role: 'user',
        content: fullPrompt
      });
    }

    return messages;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
  static getAvailableModels(): Array<{ id: string; name: string; description: string; supportsImages: boolean }> {
    return [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective for testing', supportsImages: false },
      { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model for production', supportsImages: false },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Latest GPT-4 with improved performance', supportsImages: false },
      { id: 'gpt-4o', name: 'GPT-4 Omni', description: 'Advanced model with built-in image analysis capabilities', supportsImages: true }
    ];
  }
}
