// Centralized option catalogs for Brand Intelligence Intake
// These IDs are what we persist; UI renders from this config.

export const logoStyles = [
  { id: "minimalist", label: "Minimalist", description: "Clean and simple.", preview: "/visuals/logo-styles/minimalist.png" },
  { id: "emblem", label: "Emblem", description: "Badge-like logos.", preview: "/visuals/logo-styles/emblem.png" },
  { id: "abstract", label: "Abstract", description: "Non-literal shapes.", preview: "/visuals/logo-styles/abstract.png" },
  { id: "wordmark", label: "Wordmark", description: "Typography only.", preview: "/visuals/logo-styles/wordmark.png" },
  { id: "mascot", label: "Mascot", description: "Illustrated character logos.", preview: "/visuals/logo-styles/mascot.png" },
  { id: "signature", label: "Signature", description: "Handwritten signature style.", preview: "/visuals/logo-styles/signature.png" },
];

export const colorPalettes = [
  { id: "earthy_tones", label: "Earthy Tones", colors: ["#A0522D", "#CD853F", "#F4A460", "#D2B48C"], preview: "/visuals/color-palettes/earthy.png" },
  { id: "modern_minimal", label: "Modern Minimal", colors: ["#FFFFFF", "#000000", "#888888"], preview: "/visuals/color-palettes/minimal.png" },
  { id: "luxury_gold", label: "Luxury Gold", colors: ["#1C1C1C", "#FFD700", "#E5E5E5"], preview: "/visuals/color-palettes/gold.png" },
  { id: "vibrant_tech", label: "Vibrant Tech", colors: ["#0066FF", "#00CC99", "#FF3366"], preview: "/visuals/color-palettes/tech.png" },
  { id: "pastel_dream", label: "Pastel Dream", colors: ["#FFC1CC", "#FFDAB9", "#E6E6FA"], preview: "/visuals/color-palettes/pastel.png" },
  { id: "bold_retro", label: "Bold Retro", colors: ["#FF4500", "#FFD700", "#00CED1"], preview: "/visuals/color-palettes/retro.png" },
];

export const typographyPairings = [
  { id: "serif_sans", label: "Serif + Sans", headlineFont: "Playfair Display", bodyFont: "Inter", preview: "/visuals/typography/serif-sans.png" },
  { id: "modern_sans", label: "Modern Sans", headlineFont: "Poppins", bodyFont: "Roboto", preview: "/visuals/typography/modern-sans.png" },
  { id: "handwritten_mix", label: "Handwritten Mix", headlineFont: "Pacifico", bodyFont: "Open Sans", preview: "/visuals/typography/handwritten.png" },
  { id: "luxury_serif", label: "Luxury Serif", headlineFont: "Cormorant Garamond", bodyFont: "Lato", preview: "/visuals/typography/luxury-serif.png" },
  { id: "tech_modern", label: "Tech Modern", headlineFont: "Orbitron", bodyFont: "Inter", preview: "/visuals/typography/tech.png" },
  { id: "editorial", label: "Editorial", headlineFont: "Merriweather", bodyFont: "Source Sans Pro", preview: "/visuals/typography/editorial.png" },
];

export const imageryStyles = [
  { id: "minimalist", label: "Minimalist", description: "Whitespace-driven, clean visuals.", preview: "/visuals/imagery/minimalist.png" },
  { id: "lifestyle", label: "Lifestyle", description: "People-centered, real-life moments.", preview: "/visuals/imagery/lifestyle.png" },
  { id: "artistic", label: "Artistic", description: "Creative, expressive imagery.", preview: "/visuals/imagery/artistic.png" },
  { id: "corporate", label: "Corporate", description: "Professional and structured.", preview: "/visuals/imagery/corporate.png" },
  { id: "editorial", label: "Editorial", description: "Magazine-inspired photography.", preview: "/visuals/imagery/editorial.png" },
  { id: "abstract_visual", label: "Abstract", description: "Patterns, textures, surreal visuals.", preview: "/visuals/imagery/abstract.png" },
];

export const archetypes = [
  "Hero", "Sage", "Explorer", "Creator", "Everyman", "Innocent", "Outlaw", "Magician", "Ruler", "Caregiver", "Jester", "Lover"
] as const;

export const geographicFocusOptions = [
  "Local", "Regional", "Global"
] as const;

export const distributionChannels = [
  "Online", "Retail", "Hybrid", "Wholesale", "Marketplace"
] as const;

export const businessModels = [
  "B2C", "B2B", "Subscription", "Freemium", "SaaS", "Services"
] as const;

export const platforms = [
  "Instagram", "TikTok", "LinkedIn", "YouTube", "Facebook", "Website", "Email"
] as const;

export const marketingGoals = [
  "Awareness", "Sales", "Community", "Authority", "Leads"
] as const;


