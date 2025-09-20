export type PackageType = 'crest' | 'arsenal' | 'throne' | 'conquest';

export interface PackageAdjustment {
  reduction: number;
  feature: string;
  description: string;
}

export interface Package {
  id: PackageType;
  name: string;
  priceRange: [number, number];
  description: string;
  features: string[];
  dynamicAdjustments: PackageAdjustment[];
  recommendedFor: string[];
  timeline: string;
}

export interface BudgetRange {
  min: number;
  max: number;
  label: string;
  recommendedPackages: PackageType[];
  smartAdjustments: PackageAdjustment[];
}

// Budget ranges from onboarding form
export const BUDGET_RANGES: BudgetRange[] = [
  {
    min: 100000,
    max: 150000,
    label: "N100,000 - N150,000",
    recommendedPackages: ['crest'],
    smartAdjustments: [
      { reduction: 25000, feature: 'Reduce logo to 2 concepts only', description: 'Streamline logo development' },
      { reduction: 50000, feature: 'Remove starter brand sheet', description: 'Focus on core deliverables' }
    ]
  },
  {
    min: 150000,
    max: 200000,
    label: "N150,000 - N200,000",
    recommendedPackages: ['crest', 'arsenal'],
    smartAdjustments: [
      { reduction: 25000, feature: 'Reduce website pages to 3 max', description: 'Essential pages only' },
      { reduction: 50000, feature: 'Reduce social kit to 3 templates', description: 'Core social templates' }
    ]
  },
  {
    min: 200000,
    max: 250000,
    label: "N200,000 - N250,000",
    recommendedPackages: ['arsenal'],
    smartAdjustments: [
      { reduction: 25000, feature: 'Reduce website pages to 5 max', description: 'Streamlined website' },
      { reduction: 50000, feature: 'Reduce social kit to 5 templates', description: 'Essential social presence' }
    ]
  },
  {
    min: 250000,
    max: 300000,
    label: "N250,000 - N300,000",
    recommendedPackages: ['arsenal', 'throne'],
    smartAdjustments: [
      { reduction: 25000, feature: 'Reduce brand book to 20 pages', description: 'Condensed brand guide' },
      { reduction: 50000, feature: 'Remove offline assets', description: 'Digital-first approach' }
    ]
  },
  {
    min: 300000,
    max: 500000,
    label: "N300,000 - N500,000",
    recommendedPackages: ['throne', 'conquest'],
    smartAdjustments: [
      { reduction: 25000, feature: 'Reduce campaign kit variations', description: 'Focused campaign approach' },
      { reduction: 50000, feature: 'Limit social + content kit to 20 templates', description: 'Streamlined content system' }
    ]
  }
];

export const PACKAGES: Record<PackageType, Package> = {
  crest: {
    id: 'crest',
    name: 'The Crest',
    priceRange: [50000, 100000],
    description: 'For startups and hustlers with just a name.',
    features: [
      'Discovery (mini workshop)',
      'Logo (3 concepts, 2 revisions)',
      'Basic color palette + typography',
      'Starter brand sheet (PDF)'
    ],
    dynamicAdjustments: [
      { reduction: 25000, feature: 'Reduce logo to 2 concepts only', description: 'Streamline logo development' },
      { reduction: 50000, feature: 'Remove starter brand sheet', description: 'Focus on core deliverables' }
    ],
    recommendedFor: ['Startups', 'New businesses', 'Budget-conscious clients'],
    timeline: '2-3 weeks'
  },
  arsenal: {
    id: 'arsenal',
    name: 'The Arsenal',
    priceRange: [250000, 500000],
    description: 'For brands that need to be seen & remembered.',
    features: [
      'Full Discovery Workshop',
      'Brand Strategy Lite (mission, tone, positioning)',
      'Logo system (primary + alternates)',
      'Full color + typography suite',
      'Brand Guide (10–15 pages)',
      'Social Media Starter Kit (5 templates)',
      'Website (10–30 pages)'
    ],
    dynamicAdjustments: [
      { reduction: 25000, feature: 'Reduce website pages to 3 max', description: 'Essential pages only' },
      { reduction: 50000, feature: 'Reduce social kit to 3 templates', description: 'Core social templates' },
      { reduction: 75000, feature: 'Brand guide shrinks to starter sheet', description: 'Simplified brand guide' },
      { reduction: 100000, feature: 'No Brand Strategy Lite', description: 'Focus on visual identity' }
    ],
    recommendedFor: ['Growing businesses', 'Established startups', 'Service providers'],
    timeline: '4-6 weeks'
  },
  throne: {
    id: 'throne',
    name: 'The Throne',
    priceRange: [700000, 1500000],
    description: 'For businesses moving from brand to empire.',
    features: [
      'Complete Discovery & Research',
      'Full Brand Strategy Document',
      'Brand Identity System (logos, colors, typography, imagery)',
      '30–50 page Brand Book',
      'Website (Unlimited pages)',
      'Offline assets (stationery, packaging basics)',
      'Social Brand Kit (15 templates + guide)'
    ],
    dynamicAdjustments: [
      { reduction: 25000, feature: 'Reduce brand book to 20 pages', description: 'Condensed brand guide' },
      { reduction: 50000, feature: 'Remove offline assets', description: 'Digital-first approach' },
      { reduction: 75000, feature: 'Social kit reduces to 10 templates', description: 'Streamlined social presence' },
      { reduction: 100000, feature: 'Website capped at 5 pages', description: 'Essential website only' }
    ],
    recommendedFor: ['Established businesses', 'Expanding companies', 'Premium brands'],
    timeline: '8-12 weeks'
  },
  conquest: {
    id: 'conquest',
    name: 'The Conquest',
    priceRange: [2000000, 2500000],
    description: 'For empire builders, investors, and visionaries who want their brand to sell at scale.',
    features: [
      'Advanced research (customer interviews, cultural analysis)',
      'Naming workshop (if needed)',
      'Campaign launch kit (ads, activations)',
      'Website (multi-page, funnel-ready)',
      'Social + Content System (30+ templates, tone, playbook)',
      'Offline domination (packaging, signage, retail)',
      '3–6 months brand oversight + rollout support'
    ],
    dynamicAdjustments: [
      { reduction: 25000, feature: 'Reduce campaign kit variations', description: 'Focused campaign approach' },
      { reduction: 50000, feature: 'Limit social + content kit to 20 templates', description: 'Streamlined content system' },
      { reduction: 75000, feature: 'Website funnel reduced to fewer pages', description: 'Essential funnel pages' },
      { reduction: 100000, feature: 'Remove naming workshop', description: 'Focus on existing brand' }
    ],
    recommendedFor: ['Enterprise clients', 'Investors', 'Scale-up companies', 'Market leaders'],
    timeline: '12-16 weeks'
  }
};

// Smart pricing calculator based on budget
export const calculateSmartPricing = (
  budgetRange: string,
  selectedPackage: PackageType,
  adjustments: PackageAdjustment[] = []
): {
  recommendedPackage: PackageType;
  originalPrice: number;
  adjustedPrice: number;
  savings: number;
  adjustments: PackageAdjustment[];
  isWithinBudget: boolean;
  budgetAnalysis: string;
} => {
  const budget = BUDGET_RANGES.find(range => range.label === budgetRange);
  const packageInfo = PACKAGES[selectedPackage];
  
  if (!budget || !packageInfo) {
    throw new Error('Invalid budget range or package');
  }

  // Start with the maximum price of the package
  const originalPrice = packageInfo.priceRange[1];
  
  // Calculate total reduction from adjustments
  const totalReduction = adjustments.reduce((sum, adj) => sum + adj.reduction, 0);
  const adjustedPrice = Math.max(originalPrice - totalReduction, packageInfo.priceRange[0]);
  
  // Check if within budget
  const isWithinBudget = adjustedPrice <= budget.max;
  
  // Calculate savings
  const savings = originalPrice - adjustedPrice;
  
  // Generate budget analysis
  let budgetAnalysis = '';
  if (isWithinBudget) {
    const remainingBudget = budget.max - adjustedPrice;
    budgetAnalysis = `Perfect fit! You'll have ₦${remainingBudget.toLocaleString()} remaining in your budget.`;
  } else {
    const overBudget = adjustedPrice - budget.max;
    budgetAnalysis = `This package is ₦${overBudget.toLocaleString()} over your budget. Consider our recommended adjustments.`;
  }

  return {
    recommendedPackage: budget.recommendedPackages[0] as PackageType,
    originalPrice,
    adjustedPrice,
    savings,
    adjustments,
    isWithinBudget,
    budgetAnalysis
  };
};

// Get package recommendations based on budget
export const getPackageRecommendations = (budgetRange: string): {
  primary: PackageType;
  alternatives: PackageType[];
  budget: BudgetRange;
} => {
  const budget = BUDGET_RANGES.find(range => range.label === budgetRange);
  
  if (!budget) {
    throw new Error('Invalid budget range');
  }

  return {
    primary: budget.recommendedPackages[0] as PackageType,
    alternatives: budget.recommendedPackages.slice(1) as PackageType[],
    budget
  };
};

// Generate smart adjustments based on budget constraints
export const generateSmartAdjustments = (
  budgetRange: string,
  selectedPackage: PackageType
): PackageAdjustment[] => {
  const budget = BUDGET_RANGES.find(range => range.label === budgetRange);
  const packageInfo = PACKAGES[selectedPackage];
  
  if (!budget || !packageInfo) {
    return [];
  }

  // If package is within budget, no adjustments needed
  if (packageInfo.priceRange[1] <= budget.max) {
    return [];
  }

  // Calculate how much we need to reduce
  const overBudget = packageInfo.priceRange[1] - budget.max;
  
  // Find adjustments that would bring it within budget
  const smartAdjustments: PackageAdjustment[] = [];
  let totalReduction = 0;
  
  for (const adjustment of packageInfo.dynamicAdjustments) {
    if (totalReduction + adjustment.reduction <= overBudget) {
      smartAdjustments.push(adjustment);
      totalReduction += adjustment.reduction;
    }
  }

  return smartAdjustments;
};
