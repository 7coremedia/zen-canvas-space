export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  score: number;
  suggestions: string[];
}

export class ResponseValidator {
  private prohibitedPatterns = [
    // Casual greetings and openings
    /^(hey there|hi there|hello there|awesome|great question|excellent|fantastic)/i,
    /^(so you're|so you|well,|now,|alright,)/i,
    /^(that's exactly|that is exactly)/i,
    
    // Casual expressions and enthusiasm
    /(you've got this|don't worry|it's exciting|let's dive in|dive into|dive deep)/i,
    /(let's break it down|break it down|making it less daunting|more exciting)/i,
    /(where the magic happens|magic happens|awesome|cool|amazing|fantastic)/i,
    /(that's exactly where|exactly where the magic)/i,
    
    // Emoji detection
    /🎯|🚀|💪|✨|🔥|👍|😊|🎉|💯/g,
    
    // Multiple exclamation points and casual punctuation
    /(!{2,})/g,
    
    // Casual transitions and fillers
    /(so,|well,|now,|alright,|right,)/i,
    
    // Casual enthusiasm patterns
    /(ready to|ready for|excited about|excited to)/i
  ];
  
  private requiredElements = [
    'framework',
    'strategy',
    'implementation',
    'measurement',
    'actionable',
    'specific'
  ];
  
  private professionalIndicators = [
    'analysis',
    'strategy',
    'implementation',
    'metrics',
    'ROI',
    'framework',
    'methodology',
    'benchmarks'
  ];

  private formattingRequirements = {
    hasMainTitle: (text: string) => /^#\s+.+/.test(text),
    hasSectionHeaders: (text: string) => /##\s+.+/.test(text),
    hasBulletPoints: (text: string) => /^[•\-\*]\s+.+/.test(text, 'm'),
    hasProperSpacing: (text: string) => !/\n{3,}/.test(text),
    hasExecutiveSummary: (text: string) => text.length > 1000 ? /##\s+Executive\s+Summary/i.test(text) : true
  };

  constructor() {}

  validateResponse(response: string): ValidationResult {
    const validation: ValidationResult = {
      isValid: true,
      issues: [],
      score: 0,
      suggestions: []
    };
    
    // Check for prohibited casual language
    this.prohibitedPatterns.forEach(pattern => {
      if (pattern.test(response)) {
        validation.isValid = false;
        validation.issues.push('Contains casual or unprofessional language');
      }
    });
    
    // Check for professional terminology
    const professionalTermCount = this.professionalIndicators
      .filter(term => response.toLowerCase().includes(term)).length;
    
    if (professionalTermCount < 3) {
      validation.issues.push('Lacks professional business terminology');
      validation.suggestions.push('Include more strategic business language and frameworks');
    }
    
    // Check response length and depth
    if (response.length < 800) {
      validation.issues.push('Response may be too brief for professional consultation');
      validation.suggestions.push('Provide more comprehensive analysis and actionable details');
    }
    
    // Check for actionable content
    const actionableKeywords = ['implement', 'execute', 'create', 'develop', 'establish', 'build'];
    const actionableCount = actionableKeywords
      .filter(keyword => response.toLowerCase().includes(keyword)).length;
    
    if (actionableCount < 2) {
      validation.issues.push('Lacks clear actionable recommendations');
      validation.suggestions.push('Include specific implementation steps and concrete actions');
    }
    
    // Check formatting requirements
    const formattingScore = this.validateFormatting(response);
    if (formattingScore < 80) {
      validation.issues.push('Response lacks proper professional formatting');
      validation.suggestions.push('Ensure proper headers, bullet points, and paragraph spacing');
    }
    
    // Calculate quality score (formatting counts for 30% of total score)
    const contentScore = Math.max(0, 100 - (validation.issues.length * 20));
    const finalScore = Math.round((contentScore * 0.7) + (formattingScore * 0.3));
    validation.score = finalScore;
    
    return validation;
  }

  /**
   * Validate formatting requirements
   */
  private validateFormatting(response: string): number {
    let score = 100;
    const requirements = this.formattingRequirements;
    
    // Check main title (H1)
    if (!requirements.hasMainTitle(response)) {
      score -= 20;
    }
    
    // Check section headers (H2)
    if (!requirements.hasSectionHeaders(response)) {
      score -= 25;
    }
    
    // Check bullet points
    if (!requirements.hasBulletPoints(response)) {
      score -= 15;
    }
    
    // Check proper spacing
    if (!requirements.hasProperSpacing(response)) {
      score -= 10;
    }
    
    // Check executive summary for long responses
    if (!requirements.hasExecutiveSummary(response)) {
      score -= 10;
    }
    
    return Math.max(0, score);
  }
  
  async enhanceResponse(originalResponse: string, validationResult: ValidationResult): Promise<string> {
    if (validationResult.score >= 80) {
      return originalResponse; // Already high quality
    }
    
    // If response fails validation, regenerate with enhanced prompting
    const enhancementPrompt = `
    ENHANCE THIS RESPONSE TO MEET PROFESSIONAL CONSULTING STANDARDS:
    
    Original response: ${originalResponse}
    
    Issues to address: ${validationResult.issues.join(', ')}
    
    Requirements:
    - Use professional business language
    - Include specific frameworks and methodologies
    - Provide actionable implementation steps
    - Add measurable success criteria
    - Remove any casual language or emojis
    - Ensure comprehensive depth appropriate for executive-level consultation
    `;
    
    // Return enhanced version (implement regeneration logic)
    return await this.regenerateResponse(enhancementPrompt);
  }

  private async regenerateResponse(enhancementPrompt: string): Promise<string> {
    // This would integrate with the AI service to regenerate the response
    // For now, return a placeholder enhanced response
    return `ENHANCED PROFESSIONAL RESPONSE: ${enhancementPrompt}`;
  }
}
