// AI Prompt Templates for Brand Creation

export const PROMPTS = {
  IDEA_PROCESSING: `
You are a brand strategist and creative director. The user has provided a business idea. 
Your task is to analyze this idea and provide initial thoughts and direction.

Business Idea: {idea}

Please provide:
1. A brief analysis of the core business concept
2. Key brand elements to consider
3. Initial direction for brand development

Keep your response concise, professional, and actionable.
  `,

  BRAND_NAME_GENERATION: `
You are a creative naming specialist. Based on the business idea and context, generate 5 brand name suggestions.

Business Idea: {idea}
Industry: {industry}
Target Audience: {targetAudience}

For each name, provide:
- The name
- Brief reasoning for the choice
- Domain availability check
- Brand personality fit

Names should be:
- Memorable and unique
- Available as domains (assume available for now)
- Aligned with the brand personality
- Easy to pronounce and spell
  `,

  POSITIONING_DEVELOPMENT: `
You are a brand positioning expert. Create a compelling positioning statement for the brand.

Brand Name: {brandName}
Business Idea: {idea}
Industry: {industry}

Create a positioning statement that:
- Clearly defines the brand's unique value proposition
- Differentiates from competitors
- Resonates with the target audience
- Is memorable and actionable

Format: "For [target audience], [brand name] is the [category] that [benefit] because [reason to believe]."
  `,

  COLOR_THEORY: `
You are a color psychology expert and brand designer. Suggest a color palette for the brand.

Brand Name: {brandName}
Positioning: {positioning}
Industry: {industry}
Target Audience: {targetAudience}

Provide:
1. Primary color palette (3-5 colors with hex codes)
2. Reasoning for each color choice
3. Color psychology explanation
4. Industry appropriateness
5. Target audience appeal

Colors should:
- Reflect the brand personality
- Work well together
- Be accessible and readable
- Align with industry standards
  `,

  TYPOGRAPHY_SELECTION: `
You are a typography specialist. Recommend font combinations for the brand.

Brand Name: {brandName}
Brand Personality: {personality}
Color Palette: {colors}
Industry: {industry}

Recommend:
1. Heading font (with reasoning)
2. Body font (with reasoning)
3. Font pairing explanation
4. Usage guidelines

Fonts should:
- Reflect brand personality
- Be highly readable
- Work across digital and print
- Be web-safe or easily accessible
  `,

  LOGO_CONCEPTS: `
You are a logo designer. Create logo concept descriptions for the brand.

Brand Name: {brandName}
Brand Personality: {personality}
Industry: {industry}
Target Audience: {targetAudience}

Provide 3-5 logo concept descriptions including:
- Concept name and style
- Visual approach
- Symbolism and meaning
- Application versatility
- Brand personality alignment

Concepts should be:
- Distinct from each other
- Appropriate for the industry
- Scalable and versatile
- Memorable and unique
  `,

  MOODBOARD_CREATION: `
You are a visual brand strategist. Create a moodboard direction for the brand.

Brand Name: {brandName}
Brand Personality: {personality}
Color Palette: {colors}
Typography: {typography}

Provide:
1. Visual style keywords
2. Mood and atmosphere description
3. Reference imagery suggestions
4. Design elements to include
5. Overall aesthetic direction

The moodboard should:
- Reflect the brand personality
- Inspire visual design decisions
- Be cohesive with colors and typography
- Appeal to the target audience
  `,

  BRAND_STARTER_SHEET: `
You are a brand strategist. Create a comprehensive brand starter sheet.

Brand Name: {brandName}
Business Idea: {idea}
Positioning: {positioning}
Colors: {colors}
Typography: {typography}
Logo: {logo}

Create a brand starter sheet including:
1. Brand overview and mission
2. Brand personality traits
3. Visual guidelines summary
4. Voice and tone guidelines
5. Application examples
6. Next steps for brand development

Make it comprehensive yet easy to understand and implement.
  `
};

export const getPrompt = (type: keyof typeof PROMPTS, variables: Record<string, string>) => {
  let prompt = PROMPTS[type];
  
  // Replace variables in the prompt
  Object.entries(variables).forEach(([key, value]) => {
    prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  
  return prompt;
};
