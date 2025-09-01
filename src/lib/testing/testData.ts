import { BrandCreationStep } from '@/components/ai-brand-chat/types';
import { generateSummaryTemplate } from '@/lib/ai/templateGenerator';

export const TEST_MESSAGES = {
  [BrandCreationStep.IDEA]: {
    content: "I want to create a sustainable fashion brand that focuses on eco-friendly materials and ethical manufacturing. The brand should appeal to environmentally conscious millennials and Gen Z consumers who care about both style and sustainability.",
    type: 'user' as const
  },
  
  'brand-understanding': {
    content: "A brand that remakes people ATM cards design and makes them 10x better",
    type: 'brand-understanding' as const
  },
  
  [BrandCreationStep.THOUGHT]: {
    content: generateSummaryTemplate("sustainable fashion brand"),
    type: 'ai-thought' as const
  },
  
  [BrandCreationStep.SUMMARY]: {
    content: "**Brand Concept Summary:**\n\n**Core Idea:** Sustainable fashion brand for eco-conscious millennials/Gen Z\n**Key Differentiators:** Ethical manufacturing, eco-friendly materials, transparent supply chain\n**Target Market:** Environmentally conscious consumers aged 18-35\n**Market Opportunity:** Growing demand for sustainable fashion\n**Next Steps:** Brand naming, positioning strategy, visual identity development",
    type: 'ai-summary' as const
  },
  
  [BrandCreationStep.BRAND_NAME]: {
    content: "Based on your sustainable fashion concept, here are 5 brand name suggestions that capture the essence of eco-friendly, ethical fashion while being memorable and available:",
    type: 'interactive' as const
  },
  
  [BrandCreationStep.POSITIONING]: {
    content: "Now that we have your brand name 'EcoThread', let's develop a compelling positioning statement that clearly defines your unique value proposition and differentiates you from competitors in the sustainable fashion space.",
    type: 'interactive' as const
  },
  
  [BrandCreationStep.BRAND_COLORS]: {
    content: "For your sustainable fashion brand 'EcoThread', I've selected a color palette that reflects nature, sustainability, and modern fashion. These colors will work beautifully across all your brand materials and resonate with your eco-conscious audience.",
    type: 'interactive' as const
  },
  
  [BrandCreationStep.TYPOGRAPHY]: {
    content: "Typography is crucial for your sustainable fashion brand. I've selected font combinations that balance modern aesthetics with readability, ensuring your brand communicates both style and substance effectively.",
    type: 'interactive' as const
  },
  
  [BrandCreationStep.LOGO_SUITE]: {
    content: "Your logo is the visual foundation of your brand identity. I've created several logo concepts that reflect EcoThread's commitment to sustainability while maintaining a modern, fashion-forward aesthetic.",
    type: 'interactive' as const
  },
  
  [BrandCreationStep.MOODBOARD]: {
    content: "This moodboard captures the visual essence of EcoThread - combining natural elements, sustainable materials, and modern fashion aesthetics. Use this as inspiration for all your brand visuals and marketing materials.",
    type: 'interactive' as const
  },
  
  [BrandCreationStep.BRAND_STARTER_SHEET]: {
    content: "Congratulations! Your complete brand identity for EcoThread is ready. This brand starter sheet contains everything you need to begin implementing your sustainable fashion brand across all touchpoints.",
    type: 'interactive' as const
  },
  
  [BrandCreationStep.RESULT]: {
    content: "🎉 **Brand Creation Complete!**\n\nYour sustainable fashion brand 'EcoThread' is now fully developed with a complete visual identity, positioning strategy, and brand guidelines. You're ready to launch your eco-friendly fashion brand!",
    type: 'ai' as const
  }
};

export const TEST_BRAND_NAMES = [
  {
    name: "EcoThread",
    reasoning: "Combines 'eco' for environmental consciousness with 'thread' representing fashion and connection. Suggests sustainable fashion that connects people to nature.",
    domainAvailable: true,
    personality: "Sustainable & Connected"
  },
  {
    name: "GreenStitch",
    reasoning: "Evokes the act of creating with 'stitch' while emphasizing environmental values with 'green'. Implies craftsmanship and sustainability.",
    domainAvailable: true,
    personality: "Craftsmanship & Eco-friendly"
  },
  {
    name: "EarthWear",
    reasoning: "Direct and memorable, combining 'earth' for environmental focus with 'wear' for fashion. Clear positioning for sustainable clothing.",
    domainAvailable: false,
    personality: "Direct & Environmental"
  },
  {
    name: "BioFashion",
    reasoning: "Modern and scientific approach, combining 'bio' for natural/organic with 'fashion'. Appeals to tech-savvy, environmentally conscious consumers.",
    domainAvailable: true,
    personality: "Modern & Scientific"
  },
  {
    name: "ConsciousCloth",
    reasoning: "Emphasizes the mindful approach to fashion with 'conscious' and the tangible product with 'cloth'. Clear value proposition.",
    domainAvailable: true,
    personality: "Mindful & Authentic"
  }
];

export const TEST_COLORS = [
  { name: 'Forest Green', hex: '#2d5016', description: 'Deep, natural green representing sustainability and growth' },
  { name: 'Sage', hex: '#9caf88', description: 'Soft, calming green that evokes nature and tranquility' },
  { name: 'Earthy Brown', hex: '#8b4513', description: 'Rich brown representing organic materials and grounding' },
  { name: 'Cream', hex: '#f5f5dc', description: 'Natural, clean cream for backgrounds and text' },
  { name: 'Ocean Blue', hex: '#1e3a8a', description: 'Deep blue representing water conservation and depth' },
  { name: 'Warm Gray', hex: '#6b7280', description: 'Neutral gray for balance and sophistication' }
];

export const TEST_FONTS = [
  {
    name: 'Inter',
    family: 'Inter, sans-serif',
    weight: '600',
    style: 'normal',
    description: 'Modern, clean, and highly readable - perfect for digital and print'
  },
  {
    name: 'Poppins',
    family: 'Poppins, sans-serif',
    weight: '500',
    style: 'normal',
    description: 'Friendly, approachable, and contemporary - great for brand personality'
  },
  {
    name: 'Playfair Display',
    family: 'Playfair Display, serif',
    weight: '400',
    style: 'normal',
    description: 'Elegant serif font for headings and premium feel'
  }
];

export const TEST_LOGO_CONCEPTS = [
  {
    id: '1',
    name: 'Leaf & Thread',
    description: 'Minimalist design combining a stylized leaf with thread elements, representing the fusion of nature and fashion.',
    style: 'Minimalist',
    placeholder: '/logo-leaf-thread.png',
    variations: ['Horizontal', 'Vertical', 'Icon only']
  },
  {
    id: '2',
    name: 'Eco Geometric',
    description: 'Modern geometric design using sustainable shapes and clean lines, perfect for contemporary fashion.',
    style: 'Geometric',
    placeholder: '/logo-geometric.png',
    variations: ['Primary', 'Secondary', 'Monochrome']
  },
  {
    id: '3',
    name: 'Organic Flow',
    description: 'Fluid, organic shapes that mimic natural forms, emphasizing the brand\'s connection to nature.',
    style: 'Organic',
    placeholder: '/logo-organic.png',
    variations: ['Color', 'Monochrome', 'Simplified']
  }
];

export const TEST_MOODBOARD_ITEMS = [
  { id: '1', type: 'color', color: '#2d5016', description: 'Forest green - primary brand color' },
  { id: '2', type: 'image', description: 'Natural cotton fabric texture' },
  { id: '3', type: 'image', description: 'Sustainable fashion runway' },
  { id: '4', type: 'color', color: '#9caf88', description: 'Sage green - secondary color' },
  { id: '5', type: 'texture', description: 'Organic cotton weave pattern' },
  { id: '6', type: 'image', description: 'Eco-friendly manufacturing process' },
  { id: '7', type: 'pattern', description: 'Leaf-inspired geometric pattern' },
  { id: '8', type: 'color', color: '#f5f5dc', description: 'Cream - neutral background' }
];

export const TEST_MOODBOARD_KEYWORDS = [
  'Sustainable', 'Natural', 'Eco-friendly', 'Modern', 'Organic', 'Clean', 'Minimalist', 'Ethical'
];

export const getTestMessage = (step: BrandCreationStep | 'brand-understanding') => {
  return TEST_MESSAGES[step] || {
    content: "Test message for step: " + step,
    type: 'ai' as const
  };
};
