export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  category: 'brand-strategy' | 'visual-identity' | 'naming' | 'research' | 'planning';
}

export interface ContextAnalysis {
  topics: string[];
  suggestions: string[];
  nextActions: SuggestedAction[];
  confidence: number;
}

export class ContextAnalyzer {
  private static readonly BRAND_TOPICS = [
    'brand identity', 'brand positioning', 'target audience', 'brand values',
    'logo design', 'color palette', 'typography', 'brand voice', 'brand name',
    'market research', 'competitor analysis', 'brand strategy', 'visual identity',
    'brand guidelines', 'brand messaging', 'brand personality'
  ];

  private static readonly ACTION_TEMPLATES = {
    'brand-identity': {
      title: 'Define Your Brand Identity',
      description: 'Let\'s dive deeper into what makes your brand unique',
      icon: '🎯',
      action: 'Help me define my brand identity',
      category: 'brand-strategy' as const
    },
    'target-audience': {
      title: 'Research Your Target Audience',
      description: 'Understand who your ideal customers are',
      icon: '👥',
      action: 'Help me identify my target audience',
      category: 'brand-strategy' as const
    },
    'brand-positioning': {
      title: 'Craft Your Brand Positioning',
      description: 'Position your brand in the market',
      icon: '📍',
      action: 'Help me position my brand',
      category: 'brand-strategy' as const
    },
    'logo-design': {
      title: 'Design Your Logo',
      description: 'Create a memorable logo for your brand',
      icon: '🎨',
      action: 'Help me design a logo',
      category: 'visual-identity' as const
    },
    'color-palette': {
      title: 'Choose Your Color Palette',
      description: 'Select colors that represent your brand',
      icon: '🌈',
      action: 'Help me choose brand colors',
      category: 'visual-identity' as const
    },
    'typography': {
      title: 'Select Your Typography',
      description: 'Pick fonts that match your brand personality',
      icon: '📝',
      action: 'Help me choose typography',
      category: 'visual-identity' as const
    },
    'brand-name': {
      title: 'Generate Brand Names',
      description: 'Brainstorm memorable brand names',
      icon: '✨',
      action: 'Help me generate brand names',
      category: 'naming' as const
    },
    'competitor-analysis': {
      title: 'Analyze Competitors',
      description: 'Research your competition',
      icon: '🔍',
      action: 'Help me analyze competitors',
      category: 'research' as const
    },
    'brand-guidelines': {
      title: 'Create Brand Guidelines',
      description: 'Document your brand standards',
      icon: '📋',
      action: 'Help me create brand guidelines',
      category: 'planning' as const
    },
    'brand-messaging': {
      title: 'Develop Brand Messaging',
      description: 'Craft your brand\'s voice and tone',
      icon: '��️',
      action: 'Help me develop brand messaging',
      category: 'brand-strategy' as const
    }
  };

  static analyzeResponse(content: string): ContextAnalysis {
    const topics = this.extractTopics(content);
    const suggestions = this.extractSuggestions(content);
    const nextActions = this.generateNextActions(topics, suggestions);
    
    return {
      topics,
      suggestions,
      nextActions,
      confidence: this.calculateConfidence(topics, suggestions)
    };
  }

  private static extractTopics(content: string): string[] {
    const topics: string[] = [];
    const lowerContent = content.toLowerCase();

    // Check for brand-related topics
    for (const topic of this.BRAND_TOPICS) {
      if (lowerContent.includes(topic.toLowerCase())) {
        topics.push(topic);
      }
    }

    // Extract topics from headers
    const headerMatches = content.match(/^#{1,3}\s+(.+)$/gm);
    if (headerMatches) {
      headerMatches.forEach(match => {
        const topic = match.replace(/^#{1,3}\s+/, '').trim();
        if (topic && !topics.includes(topic)) {
          topics.push(topic);
        }
      });
    }

    return topics;
  }

  private static extractSuggestions(content: string): string[] {
    const suggestions: string[] = [];

    // Extract from bullet points
    const bulletMatches = content.match(/^[-*]\s+(.+)$/gm);
    if (bulletMatches) {
      bulletMatches.forEach(match => {
        const suggestion = match.replace(/^[-*]\s+/, '').trim();
        if (suggestion && suggestion.length > 10) {
          suggestions.push(suggestion);
        }
      });
    }

    // Extract from numbered lists
    const numberedMatches = content.match(/^\d+\.\s+(.+)$/gm);
    if (numberedMatches) {
      numberedMatches.forEach(match => {
        const suggestion = match.replace(/^\d+\.\s+/, '').trim();
        if (suggestion && suggestion.length > 10) {
          suggestions.push(suggestion);
        }
      });
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  private static generateNextActions(topics: string[], suggestions: string[]): SuggestedAction[] {
    const actions: SuggestedAction[] = [];
    const usedCategories = new Set<string>();

    // Generate actions based on topics
    for (const topic of topics) {
      const actionKey = this.getActionKeyFromTopic(topic);
      if (actionKey && this.ACTION_TEMPLATES[actionKey] && !usedCategories.has(actionKey)) {
        actions.push({
          id: actionKey,
          ...this.ACTION_TEMPLATES[actionKey]
        });
        usedCategories.add(actionKey);
      }
    }

    // Add generic actions if we don't have enough
    const genericActions = [
      'brand-identity',
      'target-audience',
      'logo-design'
    ];

    for (const actionKey of genericActions) {
      if (actions.length >= 3) break;
      if (!usedCategories.has(actionKey) && this.ACTION_TEMPLATES[actionKey]) {
        actions.push({
          id: actionKey,
          ...this.ACTION_TEMPLATES[actionKey]
        });
        usedCategories.add(actionKey);
      }
    }

    return actions.slice(0, 3); // Return max 3 actions
  }

  private static getActionKeyFromTopic(topic: string): string | null {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('identity')) return 'brand-identity';
    if (topicLower.includes('audience') || topicLower.includes('target')) return 'target-audience';
    if (topicLower.includes('positioning')) return 'brand-positioning';
    if (topicLower.includes('logo')) return 'logo-design';
    if (topicLower.includes('color') || topicLower.includes('palette')) return 'color-palette';
    if (topicLower.includes('typography') || topicLower.includes('font')) return 'typography';
    if (topicLower.includes('name')) return 'brand-name';
    if (topicLower.includes('competitor') || topicLower.includes('competition')) return 'competitor-analysis';
    if (topicLower.includes('guideline')) return 'brand-guidelines';
    if (topicLower.includes('messaging') || topicLower.includes('voice')) return 'brand-messaging';
    
    return null;
  }

  private static calculateConfidence(topics: string[], suggestions: string[]): number {
    let confidence = 0;
    
    // More topics = higher confidence
    confidence += Math.min(topics.length * 0.2, 0.4);
    
    // More suggestions = higher confidence
    confidence += Math.min(suggestions.length * 0.1, 0.3);
    
    // Specific brand topics = higher confidence
    const brandTopicCount = topics.filter(topic => 
      this.BRAND_TOPICS.some(brandTopic => 
        topic.toLowerCase().includes(brandTopic.toLowerCase())
      )
    ).length;
    confidence += Math.min(brandTopicCount * 0.15, 0.3);
    
    return Math.min(confidence, 1);
  }
}

// CTA System interfaces and classes
export interface CTATemplate {
  id: string;
  title: string;
  subtitle?: string;
  primaryAction: {
    text: string;
    link: string;
    icon: string;
  };
  secondaryAction?: {
    text: string;
    link: string;
    icon: string;
  };
  category: string;
  keywords: string[];
  confidence: number;
}

export interface QuestionAnalysis {
  category: string;
  confidence: number;
  detectedKeywords: string[];
  suggestedCTAs: CTATemplate[];
}

export class CTASystem {
  private static readonly QUESTION_CATEGORIES = {
    'logo-design': {
      keywords: ['logo', 'design', 'symbol', 'mark', 'icon', 'brandmark', 'emblem'],
      confidence: 0.8
    },
    'brand-identity': {
      keywords: ['brand identity', 'branding', 'visual identity', 'brand guidelines', 'brand standards'],
      confidence: 0.9
    },
    'color-palette': {
      keywords: ['color', 'palette', 'colors', 'colour', 'hex', 'rgb', 'color scheme'],
      confidence: 0.85
    },
    'typography': {
      keywords: ['font', 'typography', 'typeface', 'text', 'lettering', 'fonts'],
      confidence: 0.8
    },
    'brand-strategy': {
      keywords: ['strategy', 'positioning', 'target audience', 'brand strategy', 'marketing'],
      confidence: 0.75
    },
    'portfolio': {
      keywords: ['examples', 'portfolio', 'work', 'projects', 'case studies', 'show me'],
      confidence: 0.9
    },
    'pricing': {
      keywords: ['cost', 'price', 'pricing', 'budget', 'how much', 'rates', 'fee'],
      confidence: 0.9
    },
    'contact': {
      keywords: ['contact', 'hire', 'work with', 'get started', 'consultation', 'meeting'],
      confidence: 0.8
    },
    'about': {
      keywords: ['about', 'who are you', 'experience', 'background', 'team', 'company'],
      confidence: 0.7
    }
  };

  private static readonly CTA_TEMPLATES: CTATemplate[] = [
    // Logo Design CTAs
    {
      id: 'logo-design-primary',
      title: 'Ready to bring your logo to life?',
      subtitle: 'Let\'s create something that truly represents your brand',
      primaryAction: {
        text: 'Start Logo Design',
        link: '/contact',
        icon: '🎨'
      },
      secondaryAction: {
        text: 'View Logo Portfolio',
        link: '/portfolio',
        icon: '👀'
      },
      category: 'logo-design',
      keywords: ['logo', 'design', 'symbol', 'mark'],
      confidence: 0.9
    },
    {
      id: 'logo-examples',
      title: 'Want to see some amazing logos?',
      subtitle: 'Check out our portfolio of successful brand marks',
      primaryAction: {
        text: 'View Logo Portfolio',
        link: '/portfolio',
        icon: '👀'
      },
      secondaryAction: {
        text: 'Get Started',
        link: '/contact',
        icon: '🚀'
      },
      category: 'logo-design',
      keywords: ['examples', 'portfolio', 'show me', 'see'],
      confidence: 0.8
    },

    // Brand Identity CTAs
    {
      id: 'brand-identity-complete',
      title: 'Need a complete brand identity?',
      subtitle: 'From logo to guidelines, we\'ve got you covered',
      primaryAction: {
        text: 'Start Brand Project',
        link: '/contact',
        icon: '🎯'
      },
      secondaryAction: {
        text: 'View Brand Work',
        link: '/portfolio',
        icon: '📋'
      },
      category: 'brand-identity',
      keywords: ['brand identity', 'branding', 'complete', 'full'],
      confidence: 0.9
    },
    {
      id: 'brand-guidelines',
      title: 'Ready to document your brand?',
      subtitle: 'Professional brand guidelines that keep your team aligned',
      primaryAction: {
        text: 'Create Guidelines',
        link: '/contact',
        icon: '📋'
      },
      secondaryAction: {
        text: 'See Examples',
        link: '/portfolio',
        icon: '👀'
      },
      category: 'brand-identity',
      keywords: ['guidelines', 'standards', 'documentation'],
      confidence: 0.85
    },

    // Color Palette CTAs
    {
      id: 'color-palette-design',
      title: 'Ready to choose your perfect colors?',
      subtitle: 'Let\'s create a palette that speaks your brand language',
      primaryAction: {
        text: 'Design Color Palette',
        link: '/contact',
        icon: '🌈'
      },
      secondaryAction: {
        text: 'View Color Work',
        link: '/portfolio',
        icon: '🎨'
      },
      category: 'color-palette',
      keywords: ['color', 'palette', 'colors', 'colour'],
      confidence: 0.9
    },

    // Typography CTAs
    {
      id: 'typography-selection',
      title: 'Need the perfect fonts?',
      subtitle: 'Typography that matches your brand personality',
      primaryAction: {
        text: 'Choose Typography',
        link: '/contact',
        icon: '📝'
      },
      secondaryAction: {
        text: 'See Font Examples',
        link: '/portfolio',
        icon: '👀'
      },
      category: 'typography',
      keywords: ['font', 'typography', 'typeface', 'fonts'],
      confidence: 0.85
    },

    // Portfolio CTAs
    {
      id: 'portfolio-showcase',
      title: 'Want to see our best work?',
      subtitle: 'Explore our portfolio of successful brand projects',
      primaryAction: {
        text: 'View Portfolio',
        link: '/portfolio',
        icon: '👀'
      },
      secondaryAction: {
        text: 'Start Your Project',
        link: '/contact',
        icon: '🚀'
      },
      category: 'portfolio',
      keywords: ['examples', 'portfolio', 'work', 'show me', 'see'],
      confidence: 0.9
    },

    // Pricing CTAs
    {
      id: 'pricing-inquiry',
      title: 'Curious about our rates?',
      subtitle: 'Let\'s discuss your project and get you a custom quote',
      primaryAction: {
        text: 'Get Quote',
        link: '/contact',
        icon: '💰'
      },
      secondaryAction: {
        text: 'View Portfolio',
        link: '/portfolio',
        icon: '👀'
      },
      category: 'pricing',
      keywords: ['cost', 'price', 'pricing', 'budget', 'how much'],
      confidence: 0.9
    },

    // Contact CTAs
    {
      id: 'contact-primary',
      title: 'Ready to work together?',
      subtitle: 'Let\'s discuss your project and bring your vision to life',
      primaryAction: {
        text: 'Start Project',
        link: '/contact',
        icon: '🚀'
      },
      secondaryAction: {
        text: 'View Our Work',
        link: '/portfolio',
        icon: '👀'
      },
      category: 'contact',
      keywords: ['contact', 'hire', 'work with', 'get started'],
      confidence: 0.8
    },

    // About CTAs
    {
      id: 'about-company',
      title: 'Want to know more about us?',
      subtitle: 'Learn about our team, process, and what makes us different',
      primaryAction: {
        text: 'About Us',
        link: '/about',
        icon: '👥'
      },
      secondaryAction: {
        text: 'View Work',
        link: '/portfolio',
        icon: '👀'
      },
      category: 'about',
      keywords: ['about', 'who are you', 'experience', 'team'],
      confidence: 0.7
    },

    // Strategy CTAs
    {
      id: 'strategy-consultation',
      title: 'Need strategic brand guidance?',
      subtitle: 'Let\'s develop a brand strategy that sets you apart',
      primaryAction: {
        text: 'Strategy Session',
        link: '/contact',
        icon: '🎯'
      },
      secondaryAction: {
        text: 'View Case Studies',
        link: '/portfolio',
        icon: '📊'
      },
      category: 'brand-strategy',
      keywords: ['strategy', 'positioning', 'target audience'],
      confidence: 0.75
    }
  ];

  static analyzeQuestion(question: string): QuestionAnalysis {
    const lowerQuestion = question.toLowerCase();
    const detectedKeywords: string[] = [];
    let bestCategory = '';
    let highestConfidence = 0;

    // Analyze question against categories
    for (const [category, config] of Object.entries(this.QUESTION_CATEGORIES)) {
      let categoryConfidence = 0;
      const categoryKeywords: string[] = [];

      for (const keyword of config.keywords) {
        if (lowerQuestion.includes(keyword.toLowerCase())) {
          categoryKeywords.push(keyword);
          categoryConfidence += config.confidence;
        }
      }

      if (categoryKeywords.length > 0) {
        categoryConfidence = categoryConfidence / categoryKeywords.length;
        detectedKeywords.push(...categoryKeywords);

        if (categoryConfidence > highestConfidence) {
          highestConfidence = categoryConfidence;
          bestCategory = category;
        }
      }
    }

    // Get relevant CTAs for the detected category
    const relevantCTAs = this.CTA_TEMPLATES.filter(cta => 
      cta.category === bestCategory || 
      cta.keywords.some(keyword => 
        detectedKeywords.some(detected => 
          detected.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    );

    // Sort by confidence and take top 2
    const suggestedCTAs = relevantCTAs
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2);

    return {
      category: bestCategory,
      confidence: highestConfidence,
      detectedKeywords,
      suggestedCTAs
    };
  }

  static getFallbackCTAs(): CTATemplate[] {
    return [
      {
        id: 'fallback-primary',
        title: 'Ready to start your brand journey?',
        subtitle: 'Let\'s create something amazing together',
        primaryAction: {
          text: 'Get Started',
          link: '/contact',
          icon: '🚀'
        },
        secondaryAction: {
          text: 'View Our Work',
          link: '/portfolio',
          icon: '👀'
        },
        category: 'general',
        keywords: [],
        confidence: 0.5
      }
    ];
  }
}