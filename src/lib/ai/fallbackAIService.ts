import { AIProvider, AIContext, AIResponse } from './aiService';

export class FallbackAIService {
  constructor() {
    console.log('🔄 Fallback AI Service initialized');
  }

  async generateResponse(prompt: string, context: AIContext): Promise<AIResponse> {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    console.log('🔄 Fallback service trying providers:', {
      hasOpenAI: !!openaiKey,
      hasGemini: !!geminiKey,
      promptLength: prompt.length
    });

    // Try OpenAI first
    if (openaiKey) {
      try {
        console.log('🎯 Trying OpenAI API...');
        const response = await this.callOpenAI(prompt, context);
        if (response) {
          return response;
        }
      } catch (error) {
        console.warn('⚠️ OpenAI failed:', error);
      }
    }

    // Try Gemini as fallback
    if (geminiKey) {
      try {
        console.log('🎯 Trying Gemini API...');
        const response = await this.callGemini(prompt, context);
        if (response) {
          return response;
        }
      } catch (error) {
        console.warn('⚠️ Gemini failed:', error);
      }
    }

    return {
      content: 'I apologize, but both AI services are currently unavailable. Please check your API keys and try again later.',
      error: 'No working AI provider found'
    };
  }

  private async callOpenAI(prompt: string, context: AIContext): Promise<AIResponse | null> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const systemPrompt = `You are a professional branding consultant helping users create their brand identity.
    Current step: ${context.currentStep || 'general'}
    Brand idea: ${context.brandIdea || 'Not specified'}

    Provide helpful, professional advice focused on branding, logo design, and business strategy.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response from OpenAI';

      return {
        content,
        metadata: {
          provider: 'OpenAI',
          model: 'gpt-3.5-turbo'
        }
      };
    } catch (error) {
      console.error('❌ OpenAI error:', error);
      return null;
    }
  }

  private async callGemini(prompt: string, context: AIContext): Promise<AIResponse | null> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const systemPrompt = `You are a professional branding consultant helping users create their brand identity.
    Current step: ${context.currentStep || 'general'}
    Brand idea: ${context.brandIdea || 'Not specified'}

    Provide helpful, professional advice focused on branding, logo design, and business strategy.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';

      return {
        content,
        metadata: {
          provider: 'Gemini',
          model: 'gemini-pro'
        }
      };
    } catch (error) {
      console.error('❌ Gemini error:', error);
      return null;
    }
  }
}
