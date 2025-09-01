// Together AI Provider Implementation

import { AIProvider, AIContext, AIResponse } from '../aiService';

export class TogetherAIProvider implements AIProvider {
  name = 'Together AI';
  private apiKey: string;
  private model = 'meta-llama/Llama-2-70b-chat-hf';
  private baseUrl = 'https://api.together.xyz/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, context: AIContext): Promise<AIResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.buildMessages(prompt, context),
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      console.error('Together AI request failed:', error);
      return { 
        content: '', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  private buildMessages(prompt: string, context: AIContext) {
    const systemPrompt = this.getSystemPrompt(context.currentStep, context);
    const conversationHistory = this.formatConversationHistory(context.conversationHistory);
    
    return [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: prompt }
    ];
  }

  private getSystemPrompt(step: string, context: AIContext): string {
    // For the simplified chat system, use a general branding expert prompt
    return `You are an expert brand strategist, creative director, and marketing consultant with 15+ years of experience helping businesses create powerful brand identities. You specialize in:

- Brand strategy and positioning
- Visual identity design (logos, colors, typography)
- Brand naming and messaging
- Marketing strategy and campaigns
- Competitive analysis and differentiation
- Target audience research and segmentation
- Brand guidelines and standards

Provide detailed, actionable advice with specific examples and step-by-step guidance. Be thorough but conversational. Include practical tips, industry best practices, and real-world examples when relevant.

User's Brand Idea: ${context.brandIdea || 'Not provided yet'}`;
      
    return `You are an expert brand strategist, creative director, and marketing consultant with 15+ years of experience helping businesses create powerful brand identities. You specialize in:

- Brand strategy and positioning
- Visual identity design (logos, colors, typography)
- Brand naming and messaging
- Marketing strategy and campaigns
- Competitive analysis and differentiation
- Target audience research and segmentation
- Brand guidelines and standards

Provide detailed, actionable advice with specific examples and step-by-step guidance. Be thorough but conversational. Include practical tips, industry best practices, and real-world examples when relevant.

User's Brand Idea: ${context.brandIdea || 'Not provided yet'}`;
  }

  private formatConversationHistory(history: any[]): any[] {
    // Convert conversation history to the format expected by Together AI
    return history
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      .slice(-10); // Keep last 10 messages to avoid token limits
  }

  private parseResponse(data: any): AIResponse {
    const content = data.choices?.[0]?.message?.content || '';
    const usage = data.usage;
    
    // Parse structured data from response
    const metadata = this.extractMetadata(content);
    
    return {
      content: this.cleanContent(content),
      metadata: {
        ...metadata,
        model: this.model,
        usage: usage ? {
          promptTokens: usage.prompt_tokens || 0,
          completionTokens: usage.completion_tokens || 0,
          totalTokens: usage.total_tokens || 0
        } : undefined
      }
    };
  }

  private extractMetadata(content: string) {
    const metadata: any = {};
    
    // Extract suggestions (lines starting with - or •)
    const suggestions = content.match(/^[-•]\s*(.+)$/gm)?.map(s => s.replace(/^[-•]\s*/, '')) || [];
    if (suggestions.length > 0) metadata.suggestions = suggestions;
    
    // Extract hex codes
    const hexCodes = content.match(/#[0-9A-Fa-f]{6}/g) || [];
    if (hexCodes.length > 0) metadata.hexCodes = hexCodes;
    
    // Extract font names
    const fontMatch = content.match(/Heading:\s*([^-]+)/);
    if (fontMatch) metadata.headingFont = fontMatch[1].trim();
    
    const bodyFontMatch = content.match(/Body:\s*([^-]+)/);
    if (bodyFontMatch) metadata.bodyFont = bodyFontMatch[1].trim();
    
    return metadata;
  }

  private cleanContent(content: string): string {
    // Remove metadata markers and clean up formatting
    return content
      .replace(/^[-•]\s*/gm, '') // Remove bullet points
      .replace(/#[0-9A-Fa-f]{6}/g, '') // Remove hex codes
      .replace(/\n\s*\n/g, '\n') // Clean up extra newlines
      .trim();
  }

  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }
}
