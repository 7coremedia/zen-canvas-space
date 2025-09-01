interface TemplateData {
  brandIdea: string;
  businessType: string;
  targetAudience: string;
  feeling1: string;
  feeling2: string;
  brandName1: string;
  brandName2: string;
  color1: string;
  color2: string;
}

// Business type detection and mapping
const businessTypeMap: Record<string, string> = {
  coffee: 'coffee',
  cafe: 'coffee',
  brew: 'coffee',
  restaurant: 'food',
  food: 'food',
  tech: 'technology',
  software: 'technology',
  app: 'technology',
  fashion: 'fashion',
  clothing: 'fashion',
  wear: 'fashion',
  beauty: 'beauty',
  skincare: 'beauty',
  fitness: 'health',
  health: 'health',
  wellness: 'health',
  finance: 'financial',
  bank: 'financial',
  money: 'financial',
  education: 'educational',
  learning: 'educational',
  school: 'educational',
  travel: 'travel',
  tourism: 'travel',
  hotel: 'travel',
  automotive: 'automotive',
  car: 'automotive',
  vehicle: 'automotive',
  real: 'real estate',
  property: 'real estate',
  home: 'real estate',
  consulting: 'consulting',
  service: 'service',
  agency: 'service'
};

// Target audience mapping
const targetAudienceMap: Record<string, string> = {
  coffee: 'urban professionals and coffee enthusiasts',
  food: 'food lovers and culinary adventurers',
  technology: 'tech-savvy professionals and innovators',
  fashion: 'style-conscious individuals and trendsetters',
  beauty: 'beauty enthusiasts and self-care advocates',
  health: 'health-conscious individuals and wellness seekers',
  financial: 'financially savvy professionals and investors',
  educational: 'lifelong learners and knowledge seekers',
  travel: 'adventure seekers and travel enthusiasts',
  automotive: 'car enthusiasts and modern drivers',
  'real estate': 'homebuyers and property investors',
  consulting: 'business professionals and decision makers',
  service: 'quality-conscious consumers and professionals'
};

// Feeling combinations
const feelingCombinations: Record<string, string[]> = {
  coffee: ['warm', 'sophisticated', 'inviting', 'premium', 'authentic'],
  food: ['delicious', 'authentic', 'innovative', 'memorable', 'satisfying'],
  technology: ['innovative', 'reliable', 'cutting-edge', 'efficient', 'smart'],
  fashion: ['stylish', 'confident', 'trendsetting', 'elegant', 'bold'],
  beauty: ['radiant', 'confident', 'nurturing', 'transformative', 'luxurious'],
  health: ['energizing', 'trustworthy', 'motivating', 'supportive', 'transformative'],
  financial: ['trustworthy', 'secure', 'professional', 'reliable', 'confident'],
  educational: ['inspiring', 'knowledgeable', 'engaging', 'trustworthy', 'transformative'],
  travel: ['adventurous', 'inspiring', 'reliable', 'memorable', 'exciting'],
  automotive: ['powerful', 'reliable', 'innovative', 'stylish', 'confident'],
  'real estate': ['trustworthy', 'professional', 'reliable', 'knowledgeable', 'secure'],
  consulting: ['professional', 'trustworthy', 'expert', 'reliable', 'strategic'],
  service: ['reliable', 'professional', 'trustworthy', 'efficient', 'quality-focused']
};

// Brand name generators
const brandNameGenerators: Record<string, string[]> = {
  coffee: ['BrewCraft', 'UrbanRoast', 'BeanTheory', 'CafeCulture', 'RoastMaster'],
  food: ['CulinaryCraft', 'TasteTheory', 'FlavorForge', 'KitchenCulture', 'ChefCraft'],
  technology: ['TechForge', 'InnovateLab', 'DigitalCraft', 'CodeTheory', 'FutureForge'],
  fashion: ['StyleCraft', 'FashionForge', 'TrendTheory', 'DesignLab', 'ModeCraft'],
  beauty: ['BeautyCraft', 'GlowTheory', 'RadianceLab', 'BeautyForge', 'GlowCraft'],
  health: ['HealthCraft', 'VitalityLab', 'WellnessForge', 'FitnessTheory', 'HealthForge'],
  financial: ['FinanceCraft', 'WealthTheory', 'MoneyLab', 'FinanceForge', 'CapitalCraft'],
  educational: ['LearnCraft', 'KnowledgeLab', 'EduTheory', 'LearnForge', 'MindCraft'],
  travel: ['TravelCraft', 'JourneyLab', 'AdventureForge', 'VoyageTheory', 'ExploreCraft'],
  automotive: ['DriveCraft', 'AutoLab', 'MotorForge', 'DriveTheory', 'VehicleCraft'],
  'real estate': ['PropertyCraft', 'HomeLab', 'EstateForge', 'PropertyTheory', 'HomeCraft'],
  consulting: ['ConsultCraft', 'StrategyLab', 'BusinessForge', 'ConsultTheory', 'StrategyCraft'],
  service: ['ServiceCraft', 'QualityLab', 'ServiceForge', 'QualityTheory', 'ServiceLab']
};

// Color schemes
const colorSchemes: Record<string, string[]> = {
  coffee: ['deep browns', 'warm creams', 'rich caramels', 'golden tans'],
  food: ['vibrant reds', 'fresh greens', 'warm oranges', 'appetizing yellows'],
  technology: ['cool blues', 'modern grays', 'electric purples', 'tech greens'],
  fashion: ['elegant blacks', 'sophisticated grays', 'bold colors', 'trendy pastels'],
  beauty: ['soft pinks', 'radiant golds', 'natural greens', 'luxurious purples'],
  health: ['energizing greens', 'vital blues', 'fresh whites', 'natural earth tones'],
  financial: ['trustworthy blues', 'professional grays', 'confident greens', 'premium golds'],
  educational: ['inspiring blues', 'knowledgeable greens', 'engaging oranges', 'trustworthy grays'],
  travel: ['adventurous blues', 'inspiring greens', 'warm earth tones', 'exotic purples'],
  automotive: ['powerful blacks', 'reliable silvers', 'bold reds', 'sporty blues'],
  'real estate': ['trustworthy blues', 'professional grays', 'warm earth tones', 'reliable greens'],
  consulting: ['professional blues', 'trustworthy grays', 'confident greens', 'premium blacks'],
  service: ['reliable blues', 'professional grays', 'quality greens', 'trustworthy whites']
};

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to detect business type from brand idea
const detectBusinessType = (brandIdea: string): string => {
  const lowerIdea = brandIdea.toLowerCase();
  
  for (const [keyword, businessType] of Object.entries(businessTypeMap)) {
    if (lowerIdea.includes(keyword)) {
      return businessType;
    }
  }
  
  // Default to service if no specific type detected
  return 'service';
};

// Helper function to get target audience for business type
const getTargetAudience = (businessType: string): string => {
  return targetAudienceMap[businessType] || targetAudienceMap.service;
};

// Helper function to shorten brand idea if too long
const shortenBrandIdea = (brandIdea: string, maxLength: number = 50): string => {
  if (brandIdea.length <= maxLength) {
    return brandIdea;
  }
  
  // Try to find a good breaking point
  const words = brandIdea.split(' ');
  let shortened = '';
  
  for (const word of words) {
    if ((shortened + ' ' + word).length <= maxLength) {
      shortened += (shortened ? ' ' : '') + word;
    } else {
      break;
    }
  }
  
  return shortened + (shortened.length < brandIdea.length ? '...' : '');
};

export const generateTemplateData = (brandIdea: string): TemplateData => {
  const businessType = detectBusinessType(brandIdea);
  const shortenedIdea = shortenBrandIdea(brandIdea);
  
  const feelings = feelingCombinations[businessType] || feelingCombinations.service;
  const brandNames = brandNameGenerators[businessType] || brandNameGenerators.service;
  const colors = colorSchemes[businessType] || colorSchemes.service;
  
  return {
    brandIdea: shortenedIdea,
    businessType,
    targetAudience: targetAudienceMap[businessType] || targetAudienceMap.service,
    feeling1: getRandomItem(feelings),
    feeling2: getRandomItem(feelings.filter(f => f !== feelings[0])),
    brandName1: getRandomItem(brandNames),
    brandName2: getRandomItem(brandNames.filter(n => n !== brandNames[0])),
    color1: getRandomItem(colors),
    color2: getRandomItem(colors.filter(c => c !== colors[0]))
  };
};

export const generateSummaryTemplate = (brandIdea: string): string => {
  const data = generateTemplateData(brandIdea);
  
  return `<b>Brand Analysis</b>

So, I thought about this <b>${data.brandIdea}</b> for <b>${data.targetAudience}</b> and I've come up with a solid plan to build your brand from the ground up. I'm focusing on creating a brand that feels <b>${data.feeling1}</b> and <b>${data.feeling2}</b>, centered around a name like <b>${data.brandName1}</b> or <b>${data.brandName2}</b>, and using a clean, modern color scheme with <b>${data.color1}</b> and <b>${data.color2}</b> to visually represent its <b>${data.businessType}</b> driven purpose.`;
};

// Brand name generation interfaces and data
interface BrandNameSuggestion {
  name: string;
  suggestion: string;
  implication?: string;
  nod?: string;
}

// Contextual words for brand name generation
const contextualWords: Record<string, string[]> = {
  coffee: ['warmth and craftsmanship', 'urban energy and quality', 'tradition and innovation'],
  food: ['flavor and creativity', 'tradition and innovation', 'quality and experience'],
  technology: ['innovation and reliability', 'intelligence and efficiency', 'future and precision'],
  fashion: ['style and confidence', 'elegance and boldness', 'trend and timelessness'],
  beauty: ['radiance and transformation', 'confidence and nurturing', 'luxury and authenticity'],
  health: ['vitality and trust', 'energy and support', 'wellness and transformation'],
  financial: ['trust and security', 'wealth and intelligence', 'stability and growth'],
  educational: ['knowledge and inspiration', 'learning and engagement', 'wisdom and growth'],
  travel: ['adventure and reliability', 'exploration and inspiration', 'journey and discovery'],
  automotive: ['power and precision', 'innovation and reliability', 'style and performance'],
  'real estate': ['trust and expertise', 'home and security', 'property and knowledge'],
  consulting: ['expertise and strategy', 'trust and results', 'intelligence and solutions'],
  service: ['quality and reliability', 'trust and excellence', 'service and professionalism']
};

// Brand name reasoning templates
const brandNameReasonings: Record<string, string[]> = {
  suggests: [
    'connection to innovation and forward-thinking',
    'sense of premium quality and craftsmanship',
    'blend of tradition and modern approach',
    'focus on user experience and satisfaction',
    'commitment to excellence and reliability',
    'dedication to solving real problems',
    'emphasis on community and connection',
    'balance of professionalism and approachability'
  ],
  implies: [
    'strength and dependability in every interaction',
    'sophisticated approach to solving challenges',
    'dedication to creating meaningful experiences',
    'focus on delivering exceptional value',
    'commitment to innovation and growth',
    'emphasis on building lasting relationships',
    'balance of expertise and accessibility',
    'promise of transformative results'
  ],
  nod: [
    'the foundational elements that drive success',
    'the core values that define great experiences',
    'the essential qualities customers seek',
    'the intersection of tradition and innovation',
    'the balance between form and function',
    'the importance of trust and reliability',
    'the power of simplicity and clarity',
    'the value of authentic connections'
  ]
};

export const generateBrandNameTemplate = (brandIdea: string): string => {
  const businessType = detectBusinessType(brandIdea);
  const contextWords = contextualWords[businessType] || contextualWords.service;
  const brandNames = brandNameGenerators[businessType] || brandNameGenerators.service;

  // Get 3 random brand names
  const shuffledNames = [...brandNames].sort(() => 0.5 - Math.random());
  const selectedNames = shuffledNames.slice(0, 3);

  // Get contextual words
  const selectedContextWords = getRandomItem(contextWords);

  // Generate reasoning for each name
  const suggestions: BrandNameSuggestion[] = selectedNames.map((name, index) => {
    const reasoningType = index === 0 ? 'suggests' : index === 1 ? 'implies' : 'nod';
    const reasonings = brandNameReasonings[reasoningType];

    return {
      name,
      [reasoningType]: getRandomItem(reasonings)
    } as BrandNameSuggestion;
  });

  return `<b>Brand Name</b>

A good brand name should be memorable and hint at what the product does. Let's focus on names that combine ${selectedContextWords}.

<b>${suggestions[0].name}</b>: "${suggestions[0].name}" suggests a ${suggestions[0].suggestion}

<b>${suggestions[1].name}</b>: "${suggestions[1].name}" implies ${suggestions[1].implication}

<b>${suggestions[2].name}</b>: "${suggestions[2].name}" is a nod to ${suggestions[2].nod}`;
};

// Dynamic Positioning Statement Templates
const positioningTemplates = [
  "At {brandName}, we don't just {basicService} - we {enhancedService} for {targetAudience} who {audienceNeed}. Our {uniqueApproach} ensures {primaryBenefit}, while our {secondaryApproach} delivers {secondaryBenefit}. This means {emotionalBenefit} and {tangibleBenefit} for your {businessType} journey.",
  
  "{brandName} isn't your typical {businessType} provider. We {uniqueService} specifically for {targetAudience} who {audienceCharacteristic}. Through our {primaryApproach}, we {primaryBenefit}, and with our {secondaryApproach}, we {secondaryBenefit}. The result? {emotionalBenefit} and {tangibleBenefit} that {businessOutcome}.",
  
  "For {targetAudience} who {audienceNeed}, {brandName} goes beyond {basicService}. We {enhancedService} through {primaryApproach} that {primaryBenefit}, combined with {secondaryApproach} that {secondaryBenefit}. This creates {emotionalBenefit} and {tangibleBenefit} for your {businessType} success.",
  
  "{brandName} understands that {targetAudience} need more than {basicService}. That's why we {enhancedService} with {primaryApproach} that {primaryBenefit}, enhanced by {secondaryApproach} that {secondaryBenefit}. This delivers {emotionalBenefit} and {tangibleBenefit} for your {businessType} growth."
];

// Dynamic positioning content based on industry and target audience
const positioningContent = {
  // Basic services by industry
  basicServices: {
    'Food & Beverage': ['serve food', 'make coffee', 'provide meals', 'offer drinks'],
    'Technology': ['build software', 'create apps', 'develop solutions', 'provide tech'],
    'Fashion & Lifestyle': ['sell clothes', 'offer fashion', 'provide style', 'create looks'],
    'Professional Services': ['offer services', 'provide consulting', 'deliver solutions', 'give advice'],
    'Creative & Arts': ['create art', 'design work', 'produce content', 'make creative'],
    'Health & Wellness': ['provide health', 'offer wellness', 'deliver care', 'support fitness'],
    'Education': ['teach courses', 'provide education', 'offer learning', 'deliver knowledge'],
    'Finance': ['manage money', 'provide finance', 'offer banking', 'handle investments']
  },
  
  // Enhanced services by industry
  enhancedServices: {
    'Food & Beverage': ['craft culinary experiences', 'curate dining journeys', 'create memorable moments', 'elevate taste experiences'],
    'Technology': ['engineer innovative solutions', 'architect digital experiences', 'pioneer cutting-edge technology', 'transform business processes'],
    'Fashion & Lifestyle': ['curate personal style journeys', 'craft lifestyle experiences', 'design confidence-building looks', 'create authentic expressions'],
    'Professional Services': ['strategize business transformations', 'orchestrate success pathways', 'engineer growth solutions', 'architect winning strategies'],
    'Creative & Arts': ['craft visual storytelling', 'design emotional connections', 'create brand experiences', 'produce meaningful art'],
    'Health & Wellness': ['orchestrate wellness journeys', 'engineer health transformations', 'curate lifestyle changes', 'design vitality pathways'],
    'Education': ['craft learning experiences', 'design knowledge pathways', 'engineer skill development', 'curate educational journeys'],
    'Finance': ['architect wealth strategies', 'engineer financial success', 'curate investment pathways', 'design financial security']
  },
  
  // Audience needs by target audience
  audienceNeeds: {
    'Young Professionals (25-35)': ['seek work-life balance', 'value efficiency and quality', 'want authentic experiences', 'prioritize convenience'],
    'Creative Entrepreneurs': ['need inspiration and innovation', 'seek unique solutions', 'value artistic expression', 'want to stand out'],
    'Small Business Owners': ['require practical solutions', 'need cost-effective options', 'seek reliable partnerships', 'want growth support'],
    'Tech-Savvy Millennials': ['expect seamless experiences', 'value innovation and speed', 'seek personalized solutions', 'want cutting-edge technology'],
    'Luxury Consumers': ['demand premium quality', 'seek exclusive experiences', 'value sophisticated solutions', 'want personalized attention'],
    'Health-Conscious Individuals': ['prioritize wellness', 'seek sustainable options', 'value natural solutions', 'want holistic approaches'],
    'Students & Academics': ['need affordable quality', 'seek knowledge and growth', 'value practical learning', 'want supportive environments'],
    'Corporate Executives': ['require strategic solutions', 'need reliable partnerships', 'seek proven results', 'want professional excellence']
  },
  
  // Audience characteristics
  audienceCharacteristics: {
    'Young Professionals (25-35)': ['are ambitious and discerning', 'value quality and efficiency', 'seek authentic experiences', 'prioritize convenience'],
    'Creative Entrepreneurs': ['think outside the box', 'value innovation and uniqueness', 'seek artistic expression', 'want to make an impact'],
    'Small Business Owners': ['are practical and results-driven', 'need reliable solutions', 'value cost-effectiveness', 'seek growth opportunities'],
    'Tech-Savvy Millennials': ['embrace technology', 'expect seamless experiences', 'value personalization', 'seek cutting-edge solutions'],
    'Luxury Consumers': ['appreciate premium quality', 'seek exclusive experiences', 'value sophistication', 'expect personalized service'],
    'Health-Conscious Individuals': ['prioritize wellness', 'value sustainability', 'seek natural solutions', 'want holistic approaches'],
    'Students & Academics': ['are curious learners', 'seek knowledge and growth', 'value practical education', 'need supportive environments'],
    'Corporate Executives': ['are strategic thinkers', 'require proven solutions', 'value reliability', 'seek professional excellence']
  },
  
  // Unique approaches
  uniqueApproaches: {
    'Food & Beverage': ['artisanal craftsmanship', 'sustainable sourcing', 'innovative flavor profiles', 'community-focused dining'],
    'Technology': ['user-centered design', 'agile development', 'cutting-edge innovation', 'scalable architecture'],
    'Fashion & Lifestyle': ['personalized styling', 'sustainable fashion', 'trend-forward design', 'authentic expression'],
    'Professional Services': ['strategic consulting', 'data-driven insights', 'customized solutions', 'proven methodologies'],
    'Creative & Arts': ['visual storytelling', 'emotional design', 'brand expression', 'artistic innovation'],
    'Health & Wellness': ['holistic wellness', 'evidence-based approaches', 'personalized care', 'sustainable health'],
    'Education': ['experiential learning', 'personalized instruction', 'practical application', 'continuous support'],
    'Finance': ['strategic planning', 'risk management', 'personalized advice', 'proven strategies']
  },
  
  // Secondary approaches
  secondaryApproaches: {
    'Food & Beverage': ['seasonal menus', 'local partnerships', 'quality ingredients', 'exceptional service'],
    'Technology': ['continuous improvement', 'user feedback loops', 'performance optimization', 'security-first design'],
    'Fashion & Lifestyle': ['trend analysis', 'quality materials', 'ethical production', 'personalized service'],
    'Professional Services': ['ongoing support', 'performance tracking', 'continuous improvement', 'client collaboration'],
    'Creative & Arts': ['collaborative process', 'quality craftsmanship', 'innovative techniques', 'client partnership'],
    'Health & Wellness': ['preventive care', 'lifestyle coaching', 'community support', 'ongoing guidance'],
    'Education': ['mentorship programs', 'practical projects', 'community learning', 'lifelong support'],
    'Finance': ['ongoing monitoring', 'market analysis', 'client education', 'proactive planning']
  },
  
  // Business outcomes
  businessOutcomes: {
    'Food & Beverage': ['elevate your dining experience', 'create memorable moments', 'build community connections', 'deliver exceptional taste'],
    'Technology': ['transform your business', 'accelerate your growth', 'enhance your efficiency', 'drive innovation'],
    'Fashion & Lifestyle': ['express your authentic self', 'build confidence', 'create lasting impressions', 'define your style'],
    'Professional Services': ['achieve your goals', 'scale your business', 'optimize your operations', 'maximize your success'],
    'Creative & Arts': ['bring your vision to life', 'connect with your audience', 'build your brand', 'create meaningful impact'],
    'Health & Wellness': ['transform your wellbeing', 'achieve your health goals', 'build sustainable habits', 'live your best life'],
    'Education': ['accelerate your learning', 'develop new skills', 'advance your career', 'achieve your potential'],
    'Finance': ['secure your future', 'grow your wealth', 'achieve financial freedom', 'build lasting prosperity']
  }
};

const positioningBenefits = {
  primary: [
    "premium solution",
    "innovative approach", 
    "trusted partner",
    "reliable service",
    "cutting-edge technology",
    "expert guidance"
  ],
  secondary: [
    "unmatched quality and attention to detail",
    "forward-thinking strategies and modern solutions",
    "proven track record and established expertise",
    "consistent performance and dependable support",
    "advanced features and seamless integration",
    "specialized knowledge and personalized service"
  ],
  emotional: [
    "peace of mind",
    "confidence in your decisions",
    "trust in our expertise",
    "reliability you can count on",
    "excitement about possibilities",
    "assurance of success"
  ],
  tangible: [
    "measurable results",
    "tangible outcomes",
    "concrete benefits",
    "real value",
    "clear advantages",
    "proven returns"
  ]
};

export const generatePositioningStatementTemplate = (brandIdea: string, brandName: string, industry?: string, targetAudience?: string): string => {
  const businessType = detectBusinessType(brandIdea);
  const template = getRandomItem(positioningTemplates);
  
  // Use provided industry and target audience, or fall back to detected values
  const finalIndustry = industry || businessType;
  const finalTargetAudience = targetAudience || getTargetAudience(businessType);
  
  // Get dynamic content based on industry and target audience
  const basicService = getRandomItem(positioningContent.basicServices[finalIndustry] || positioningContent.basicServices['Professional Services']);
  const enhancedService = getRandomItem(positioningContent.enhancedServices[finalIndustry] || positioningContent.enhancedServices['Professional Services']);
  const audienceNeed = getRandomItem(positioningContent.audienceNeeds[finalTargetAudience] || positioningContent.audienceNeeds['Small Business Owners']);
  const audienceCharacteristic = getRandomItem(positioningContent.audienceCharacteristics[finalTargetAudience] || positioningContent.audienceCharacteristics['Small Business Owners']);
  const uniqueApproach = getRandomItem(positioningContent.uniqueApproaches[finalIndustry] || positioningContent.uniqueApproaches['Professional Services']);
  const secondaryApproach = getRandomItem(positioningContent.secondaryApproaches[finalIndustry] || positioningContent.secondaryApproaches['Professional Services']);
  const businessOutcome = getRandomItem(positioningContent.businessOutcomes[finalIndustry] || positioningContent.businessOutcomes['Professional Services']);
  
  const primaryBenefit = getRandomItem(positioningBenefits.primary);
  const secondaryBenefit = getRandomItem(positioningBenefits.secondary);
  const emotionalBenefit = getRandomItem(positioningBenefits.emotional);
  const tangibleBenefit = getRandomItem(positioningBenefits.tangible);

  const content = template
    .replace('{brandName}', `<b>${brandName}</b>`)
    .replace('{basicService}', basicService)
    .replace('{enhancedService}', enhancedService)
    .replace('{targetAudience}', `<b>${finalTargetAudience}</b>`)
    .replace('{audienceNeed}', audienceNeed)
    .replace('{audienceCharacteristic}', audienceCharacteristic)
    .replace('{uniqueApproach}', uniqueApproach)
    .replace('{primaryApproach}', uniqueApproach)
    .replace('{secondaryApproach}', secondaryApproach)
    .replace('{businessType}', `<b>${finalIndustry}</b>`)
    .replace('{businessOutcome}', businessOutcome)
    .replace('{primaryBenefit}', primaryBenefit)
    .replace('{secondaryBenefit}', secondaryBenefit)
    .replace('{emotionalBenefit}', emotionalBenefit)
    .replace('{tangibleBenefit}', tangibleBenefit);

  return `<b>Positioning Statement</b>

${content}`;
};

// Color Scheme Templates
const colorSchemeTemplates = [
  "Our {brandName} uses a {colorScheme} palette that {colorMeaning}, creating a {brandFeel} that {brandPromise}.",
  "The {colorScheme} color scheme of {brandName} {colorMeaning}, establishing a {brandFeel} that {brandPromise}.",
  "{brandName} embraces {colorScheme} colors that {colorMeaning}, fostering a {brandFeel} that {brandPromise}."
];

const colorSchemeOptions = {
  professional: {
    colors: "blue and gray",
    hexCodes: ["#3B82F6", "#6B7280"],
    meaning: "conveys trust and stability",
    feel: "professional and reliable",
    promise: "builds confidence in our expertise"
  },
  modern: {
    colors: "black and gold", 
    hexCodes: ["#000000", "#F59E0B"],
    meaning: "signals premium quality and sophistication",
    feel: "modern and luxurious",
    promise: "delivers exceptional value"
  },
  fresh: {
    colors: "green and white",
    hexCodes: ["#10B981", "#FFFFFF"],
    meaning: "represents growth and clarity",
    feel: "fresh and approachable", 
    promise: "offers clear, sustainable solutions"
  },
  bold: {
    colors: "red and black",
    hexCodes: ["#EF4444", "#000000"],
    meaning: "expresses energy and confidence",
    feel: "bold and dynamic",
    promise: "drives powerful results"
  }
};

export const generateColorSchemeTemplate = (brandName: string): { content: string; hexCodes: string[] } => {
  const schemeKey = getRandomItem(Object.keys(colorSchemeOptions)) as keyof typeof colorSchemeOptions;
  const scheme = colorSchemeOptions[schemeKey];
  const template = getRandomItem(colorSchemeTemplates);
  
  const content = template
    .replace('{brandName}', `<b>${brandName}</b>`)
    .replace('{colorScheme}', `<b>${scheme.colors}</b>`)
    .replace('{colorMeaning}', scheme.meaning)
    .replace('{brandFeel}', scheme.feel)
    .replace('{brandPromise}', scheme.promise);
    
  return {
    content: `<b>Brand Colors</b>

${content}`,
    hexCodes: scheme.hexCodes
  };
};

// Typography Templates with Enhanced AI Thinking
const typographyThinkingTemplates = [
  "Let me analyze the typography needs for {brandName} based on the {industry} industry and {targetAudience} target audience. We need fonts that are clean, readable, and professional.\n\nHeading Font: For {industry} and {category} targeting {targetAudience}, we would use {headingFontType} fonts that feel {headingFeeling1} and {headingFeeling2}. Use this for titles and headlines to create a bold, clear statement. The best font is {headingFont}.\n\nBody Font: For body text, we will use {bodyFontType} fonts perfect for body text. They are clean and easy on the eyes, which is ideal for {useCase}. The best choice is {bodyFont}.\n\nThis font pairing creates excellent visual hierarchy and ensures your brand communicates {brandPersonality} while maintaining {readabilityBenefit}.",
  
  "Based on {brandName}'s positioning as {positioning} and targeting {targetAudience} in the {industry} space, I'm thinking about typography that reflects {brandPersonality}.\n\nHeading Font: For {industry} businesses serving {targetAudience}, {headingFontType} fonts work best because they feel {headingFeeling1} and {headingFeeling2}. This creates the right impression for {useCase}. I recommend {headingFont}.\n\nBody Font: For readable body text that supports {brandPersonality}, {bodyFontType} fonts are ideal. They provide {readabilityBenefit} which is crucial for {useCase}. The perfect match is {bodyFont}.\n\nThis combination ensures your brand feels {overallFeel} while maintaining professional standards.",
  
  "Analyzing {brandName}'s typography requirements considering the {industry} market and {targetAudience} demographics. The typography must convey {brandPersonality} while ensuring maximum readability.\n\nHeading Font: In {industry}, {headingFontType} fonts are most effective for {targetAudience} because they feel {headingFeeling1} and {headingFeeling2}. This font style creates strong visual impact for {useCase}. The optimal choice is {headingFont}.\n\nBody Font: For body content that supports {brandPersonality}, we need {bodyFontType} fonts that provide {readabilityBenefit}. This is essential for {useCase} and long-form content. I suggest {bodyFont}.\n\nThis pairing establishes a {overallFeel} brand presence that resonates with {targetAudience}."
];

const typographyStyles = {
  modern: {
    headingFontType: "geometric sans-serif",
    headingFeeling1: "modern",
    headingFeeling2: "technical",
    bodyFontType: "highly readable sans-serif",
    readabilityBenefit: "excellent legibility across all devices",
    brandPersonality: "contemporary and innovative",
    overallFeel: "clean and professional",
    useCase: "instructions and marketing copy"
  },
  classic: {
    headingFontType: "traditional serif",
    headingFeeling1: "authoritative",
    headingFeeling2: "timeless",
    bodyFontType: "clean serif",
    readabilityBenefit: "comfortable reading experience",
    brandPersonality: "trustworthy and established",
    overallFeel: "elegant and credible",
    useCase: "professional communications"
  },
  geometric: {
    headingFontType: "precise geometric sans-serif",
    headingFeeling1: "technical",
    headingFeeling2: "precise",
    bodyFontType: "structured sans-serif",
    readabilityBenefit: "clear information hierarchy",
    brandPersonality: "technical and reliable",
    overallFeel: "structured and efficient",
    useCase: "technical documentation"
  },
  handwritten: {
    headingFontType: "personal handwritten",
    headingFeeling1: "warm",
    headingFeeling2: "approachable",
    bodyFontType: "friendly sans-serif",
    readabilityBenefit: "approachable and engaging",
    brandPersonality: "personal and friendly",
    overallFeel: "warm and genuine",
    useCase: "personal communications"
  }
};

const fontPairings = {
  modern: {
    headingFont: "Inter",
    bodyFont: "Roboto",
    description: "Clean, modern pairing perfect for tech and professional services"
  },
  classic: {
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    description: "Elegant serif combination ideal for luxury and traditional brands"
  },
  geometric: {
    headingFont: "Montserrat",
    bodyFont: "Open Sans",
    description: "Structured geometric fonts great for technical and corporate brands"
  },
  handwritten: {
    headingFont: "Dancing Script",
    bodyFont: "Lato",
    description: "Personal touch with readable body text for creative and personal brands"
  }
};

export const generateTypographyTemplate = (
  brandName: string, 
  industry?: string, 
  targetAudience?: string, 
  positioning?: string
): { content: string; headingFont: string; bodyFont: string; fontStyle: string } => {
  const styleKey = getRandomItem(Object.keys(typographyStyles)) as keyof typeof typographyStyles;
  const style = typographyStyles[styleKey];
  const pairing = fontPairings[styleKey];
  const template = getRandomItem(typographyThinkingTemplates);
  
  const content = template
    .replace('{brandName}', `<b>${brandName}</b>`)
    .replace('{industry}', `<b>${industry || 'your industry'}</b>`)
    .replace('{targetAudience}', `<b>${targetAudience || 'your target audience'}</b>`)
    .replace('{positioning}', positioning || 'your brand positioning')
    .replace('{category}', `<b>${industry || 'your category'}</b>`)
    .replace('{headingFontType}', style.headingFontType)
    .replace('{headingFeeling1}', style.headingFeeling1)
    .replace('{headingFeeling2}', style.headingFeeling2)
    .replace('{headingFont}', `<b>${pairing.headingFont}</b>`)
    .replace('{bodyFontType}', style.bodyFontType)
    .replace('{bodyFont}', `<b>${pairing.bodyFont}</b>`)
    .replace('{brandPersonality}', style.brandPersonality)
    .replace('{readabilityBenefit}', style.readabilityBenefit)
    .replace('{overallFeel}', style.overallFeel)
    .replace('{useCase}', style.useCase);
    
  return {
    content: `<b>Typography</b>

${content}`,
    headingFont: pairing.headingFont,
    bodyFont: pairing.bodyFont,
    fontStyle: styleKey
  };
};
