import { AIResponse, BrandCreationStep } from '../../types/aiResponse';

/**
 * Placeholder validator for AIResponse JSON
 * 
 * Currently performs basic TypeScript shape validation.
 * TODO: Replace with strict Ajv/Zod validation.
 */
export function validateAIResponse(json: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic shape validation
  if (!json || typeof json !== 'object') {
    errors.push('Response must be a valid JSON object');
    return { isValid: false, errors };
  }

  // Check required top-level fields
  if (!json.content || typeof json.content !== 'string') {
    errors.push('content field is required and must be a string');
  }

  if (!json.metadata || typeof json.metadata !== 'object') {
    errors.push('metadata field is required and must be an object');
  }

  // Validate metadata structure
  if (json.metadata) {
    const metadata = json.metadata;

    // Check required metadata fields
    if (!metadata.step || !Object.values(BrandCreationStep).includes(metadata.step)) {
      errors.push('metadata.step is required and must be a valid BrandCreationStep');
    }

    if (typeof metadata.isAskingQuestion !== 'boolean') {
      errors.push('metadata.isAskingQuestion is required and must be a boolean');
    }

    if (typeof metadata.requiresUserAction !== 'boolean') {
      errors.push('metadata.requiresUserAction is required and must be a boolean');
    }

    if (typeof metadata.showInputControl !== 'boolean') {
      errors.push('metadata.showInputControl is required and must be a boolean');
    }

    if (typeof metadata.showThinking !== 'boolean') {
      errors.push('metadata.showThinking is required and must be a boolean');
    }

    if (typeof metadata.showSummary !== 'boolean') {
      errors.push('metadata.showSummary is required and must be a boolean');
    }

    // Check nextStep if present
    if (metadata.nextStep && !Object.values(BrandCreationStep).includes(metadata.nextStep)) {
      errors.push('metadata.nextStep must be a valid BrandCreationStep');
    }

    // Validate content length (no strict limit for chat responses)
    if (json.content) {
      const wordCount = json.content.trim().split(/\s+/).length;
      if (wordCount > 2000) {
        errors.push(`content exceeds 2000 word limit (${wordCount} words)`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}


