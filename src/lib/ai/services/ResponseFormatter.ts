export class ResponseFormatter {
  /**
   * Main formatting method that applies comprehensive professional formatting
   */
  static formatProfessionalResponse(rawResponse: string): string {
    let formatted = rawResponse;
    
    // Step 1: Clean up the response
    formatted = this.cleanupResponse(formatted);
    
    // Step 2: Add main title if missing
    formatted = this.addMainTitle(formatted);
    
    // Step 3: Add structural headers
    formatted = this.addStructuralHeaders(formatted);
    
    // Step 4: Format lists and bullet points
    formatted = this.formatLists(formatted);
    
    // Step 5: Ensure proper paragraph spacing
    formatted = this.ensureParagraphSpacing(formatted);
    
    // Step 6: Add executive summary for long responses
    if (formatted.length > 1200 && !formatted.toLowerCase().includes('executive summary')) {
      formatted = this.addExecutiveSummary(formatted);
    }
    
    // Step 7: Final formatting cleanup
    formatted = this.finalFormatting(formatted);
    
    return formatted;
  }
  
  /**
   * Clean up common formatting issues
   */
  private static cleanupResponse(response: string): string {
    return response
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/\n\s+/g, '\n') // Remove leading spaces on lines
      .replace(/\s+\n/g, '\n'); // Remove trailing spaces on lines
  }
  
  /**
   * Add a main title if one doesn't exist
   */
  private static addMainTitle(content: string): string {
    if (!content.startsWith('#') && !content.startsWith('**')) {
      // Extract first meaningful sentence for title
      const firstSentence = content.split(/[.!?]/)[0].trim();
      if (firstSentence.length > 10 && firstSentence.length < 100) {
        return `# ${firstSentence}\n\n${content}`;
      }
    }
    return content;
  }
  
  /**
   * Add structural headers based on content analysis
   */
  private static addStructuralHeaders(content: string): string {
    const sections = content.split('\n\n');
    let structuredContent = '';
    let hasHeaders = false;
    
    sections.forEach((section, index) => {
      const trimmedSection = section.trim();
      if (trimmedSection.length === 0) return;
      
      // Check if section already has a header
      if (trimmedSection.startsWith('#')) {
        hasHeaders = true;
        structuredContent += `${trimmedSection}\n\n`;
        return;
      }
      
      // Add headers based on content analysis
      if (trimmedSection.length > 80) {
        const header = this.determineHeader(trimmedSection, index, hasHeaders);
        structuredContent += `${header}\n\n${trimmedSection}\n\n`;
        hasHeaders = true;
      } else {
        structuredContent += `${trimmedSection}\n\n`;
      }
    });
    
    return structuredContent;
  }
  
  /**
   * Determine appropriate header based on content and position
   */
  private static determineHeader(content: string, index: number, hasHeaders: boolean): string {
    const lowerContent = content.toLowerCase();
    
    // First section without headers
    if (index === 0 && !hasHeaders) {
      if (lowerContent.includes('brand') || lowerContent.includes('marketing')) {
        return '## Strategic Overview';
      }
      return '## Key Insights';
    }
    
    // Content-based headers
    if (lowerContent.includes('implement') || lowerContent.includes('action') || lowerContent.includes('step')) {
      return '## Implementation Strategy';
    }
    
    if (lowerContent.includes('measure') || lowerContent.includes('kpi') || lowerContent.includes('metric')) {
      return '## Success Metrics';
    }
    
    if (lowerContent.includes('benefit') || lowerContent.includes('advantage') || lowerContent.includes('value')) {
      return '## Key Benefits';
    }
    
    if (lowerContent.includes('challenge') || lowerContent.includes('risk') || lowerContent.includes('consideration')) {
      return '## Important Considerations';
    }
    
    if (lowerContent.includes('example') || lowerContent.includes('case') || lowerContent.includes('scenario')) {
      return '## Practical Examples';
    }
    
    if (lowerContent.includes('next') || lowerContent.includes('future') || lowerContent.includes('recommend')) {
      return '## Next Steps';
    }
    
    // Default headers based on position
    const defaultHeaders = [
      '## Strategic Analysis',
      '## Implementation Framework',
      '## Key Considerations',
      '## Action Items'
    ];
    
    return defaultHeaders[index % defaultHeaders.length] || '## Additional Insights';
  }
  
  /**
   * Format lists and bullet points
   */
  private static formatLists(content: string): string {
    // Convert numbered lists to proper markdown
    content = content.replace(/^(\d+)\.\s+/gm, '$1. ');
    
    // Convert dash lists to proper markdown
    content = content.replace(/^-\s+/gm, '• ');
    
    // Ensure proper spacing around lists
    content = content.replace(/(\n• .*?)(\n(?!•))/g, '$1\n$2');
    
    // Add spacing before lists
    content = content.replace(/(\n)(• .*?)/g, '$1\n$2');
    
    return content;
  }
  
  /**
   * Ensure consistent paragraph spacing
   */
  private static ensureParagraphSpacing(content: string): string {
    return content
      .replace(/\n{3,}/g, '\n\n') // Max 2 line breaks between sections
      .replace(/([.!?])\n([A-Z])/g, '$1\n\n$2') // Add spacing after sentences that start new paragraphs
      .replace(/(\n• .*?)(\n(?!•))/g, '$1\n$2'); // Ensure proper list spacing
  }
  
  /**
   * Add executive summary for long responses
   */
  private static addExecutiveSummary(content: string): string {
    // Extract key points
    const keyPoints = content
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return (trimmed.startsWith('•') || trimmed.startsWith('-') || 
                trimmed.includes('**') || trimmed.includes('key') || 
                trimmed.includes('important') || trimmed.includes('critical'));
      })
      .slice(0, 6)
      .map(line => line.trim())
      .filter(line => line.length > 10)
      .join('\n');
    
    if (keyPoints) {
      const summary = `## Executive Summary\n\n${keyPoints}\n\n---\n\n`;
      return summary + content;
    }
    
    return content;
  }
  
  /**
   * Final formatting cleanup
   */
  private static finalFormatting(content: string): string {
    return content
      .replace(/\n{3,}/g, '\n\n') // Final cleanup of excessive breaks
      .replace(/\n+$/, '\n') // Single newline at end
      .trim();
  }
  
  /**
   * Format specific types of responses
   */
  static formatMarketingPlan(content: string): string {
    let formatted = this.formatProfessionalResponse(content);
    
    // Ensure marketing plan structure
    if (!formatted.includes('## Executive Summary')) {
      formatted = formatted.replace(/^/, '## Executive Summary\n\nThis marketing plan outlines a comprehensive strategy for brand development and market penetration.\n\n---\n\n');
    }
    
    return formatted;
  }
  
  static formatBrandStrategy(content: string): string {
    let formatted = this.formatProfessionalResponse(content);
    
    // Ensure brand strategy structure
    if (!formatted.includes('## Brand Identity')) {
      formatted = formatted.replace(/^/, '## Brand Identity\n\nThis strategy focuses on establishing a strong, memorable brand presence in the market.\n\n---\n\n');
    }
    
    return formatted;
  }
}
