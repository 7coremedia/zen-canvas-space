import { PACKAGES, BUDGET_RANGES, PackageType, PackageAdjustment, BudgetRange } from '@/config/packages';

export interface PricingAnalysis {
  budgetRange: BudgetRange;
  recommendedPackage: PackageType;
  originalPrice: number;
  adjustedPrice: number;
  savings: number;
  adjustments: PackageAdjustment[];
  isWithinBudget: boolean;
  budgetAnalysis: string;
  smartRecommendations: string[];
}

export interface BrandPricingContext {
  budgetRange: string;
  industry: string;
  businessModel: string;
  pricePositioning: number; // 0-100 scale
  launchTiming: string;
  primaryAudience: string[];
}

/**
 * Calculate smart pricing based on brand profile data
 */
export const calculateBrandPricing = (
  brandContext: BrandPricingContext,
  selectedPackage: PackageType,
  customAdjustments: PackageAdjustment[] = []
): PricingAnalysis => {
  const budget = BUDGET_RANGES.find(range => range.label === brandContext.budgetRange);
  const packageInfo = PACKAGES[selectedPackage];
  
  if (!budget || !packageInfo) {
    throw new Error('Invalid budget range or package');
  }

  // Start with the maximum price of the package
  const originalPrice = packageInfo.priceRange[1];
  
  // Generate smart adjustments based on budget and brand context
  const smartAdjustments = generateContextualAdjustments(brandContext, selectedPackage);
  
  // Combine smart adjustments with custom adjustments
  const allAdjustments = [...smartAdjustments, ...customAdjustments];
  
  // Calculate total reduction from adjustments
  const totalReduction = allAdjustments.reduce((sum, adj) => sum + adj.reduction, 0);
  const adjustedPrice = Math.max(originalPrice - totalReduction, packageInfo.priceRange[0]);
  
  // Check if within budget
  const isWithinBudget = adjustedPrice <= budget.max;
  
  // Calculate savings
  const savings = originalPrice - adjustedPrice;
  
  // Generate budget analysis
  const budgetAnalysis = generateBudgetAnalysis(budget, adjustedPrice, isWithinBudget);
  
  // Generate smart recommendations
  const smartRecommendations = generateSmartRecommendations(
    brandContext, 
    selectedPackage, 
    isWithinBudget, 
    budget
  );

  return {
    budgetRange: budget,
    recommendedPackage: budget.recommendedPackages[0] as PackageType,
    originalPrice,
    adjustedPrice,
    savings,
    adjustments: allAdjustments,
    isWithinBudget,
    budgetAnalysis,
    smartRecommendations
  };
};

/**
 * Generate contextual adjustments based on brand profile
 */
const generateContextualAdjustments = (
  brandContext: BrandPricingContext,
  selectedPackage: PackageType
): PackageAdjustment[] => {
  const packageInfo = PACKAGES[selectedPackage];
  const adjustments: PackageAdjustment[] = [];
  
  // Industry-based adjustments
  if (brandContext.industry === 'Technology' && brandContext.pricePositioning < 30) {
    // Tech startups often need more digital focus
    adjustments.push({
      reduction: 50000,
      feature: 'Remove offline assets',
      description: 'Focus on digital presence for tech startup'
    });
  }
  
  // Business model adjustments
  if (brandContext.businessModel === 'B2B' && brandContext.pricePositioning > 70) {
    // B2B premium brands might need more strategy
    // No reduction, but we could add value instead
  }
  
  // Launch timing adjustments
  if (brandContext.launchTiming === 'ASAP') {
    adjustments.push({
      reduction: 25000,
      feature: 'Streamlined timeline',
      description: 'Fast-track delivery for urgent launch'
    });
  }
  
  // Audience-based adjustments
  if (brandContext.primaryAudience.includes('Startups')) {
    adjustments.push({
      reduction: 25000,
      feature: 'Startup-friendly pricing',
      description: 'Special pricing for startup ecosystem'
    });
  }
  
  return adjustments;
};

/**
 * Generate budget analysis text
 */
const generateBudgetAnalysis = (
  budget: BudgetRange,
  adjustedPrice: number,
  isWithinBudget: boolean
): string => {
  if (isWithinBudget) {
    const remainingBudget = budget.max - adjustedPrice;
    const percentageUsed = Math.round((adjustedPrice / budget.max) * 100);
    
    if (percentageUsed < 70) {
      return `Excellent! You're using ${percentageUsed}% of your budget (₦${adjustedPrice.toLocaleString()}). You have ₦${remainingBudget.toLocaleString()} remaining for additional services.`;
    } else if (percentageUsed < 90) {
      return `Great fit! You're using ${percentageUsed}% of your budget (₦${adjustedPrice.toLocaleString()}). You have ₦${remainingBudget.toLocaleString()} remaining.`;
    } else {
      return `Perfect! You're using ${percentageUsed}% of your budget (₦${adjustedPrice.toLocaleString()}). ₦${remainingBudget.toLocaleString()} remaining for any extras.`;
    }
  } else {
    const overBudget = adjustedPrice - budget.max;
    const percentageOver = Math.round((overBudget / budget.max) * 100);
    return `This package is ₦${overBudget.toLocaleString()} (${percentageOver}%) over your budget. Consider our recommended adjustments or upgrade your budget range.`;
  }
};

/**
 * Generate smart recommendations based on brand context
 */
const generateSmartRecommendations = (
  brandContext: BrandPricingContext,
  selectedPackage: PackageType,
  isWithinBudget: boolean,
  budget: BudgetRange
): string[] => {
  const recommendations: string[] = [];
  
  // Budget-based recommendations
  if (isWithinBudget) {
    const remainingBudget = budget.max - PACKAGES[selectedPackage].priceRange[1];
    if (remainingBudget > 50000) {
      recommendations.push(`Consider adding individual services like social media management (₦150,000+) or additional website pages.`);
    }
  } else {
    recommendations.push(`Consider the ${budget.recommendedPackages[0]} package which fits perfectly within your budget.`);
  }
  
  // Industry-specific recommendations
  if (brandContext.industry === 'E-commerce') {
    recommendations.push('E-commerce brands benefit most from the full website package and social media integration.');
  } else if (brandContext.industry === 'Technology') {
    recommendations.push('Tech brands should prioritize digital assets and modern design systems.');
  } else if (brandContext.industry === 'Fashion') {
    recommendations.push('Fashion brands need strong visual identity and social media presence.');
  }
  
  // Launch timing recommendations
  if (brandContext.launchTiming === 'ASAP') {
    recommendations.push('For urgent launches, consider our fast-track delivery options.');
  } else if (brandContext.launchTiming === '1 year') {
    recommendations.push('With a year timeline, we can include more comprehensive research and strategy development.');
  }
  
  // Business model recommendations
  if (brandContext.businessModel === 'B2B') {
    recommendations.push('B2B brands benefit from professional presentation materials and case studies.');
  } else if (brandContext.businessModel === 'B2C') {
    recommendations.push('B2C brands need strong social media presence and customer engagement tools.');
  }
  
  return recommendations;
};

/**
 * Get the best package recommendation for a brand
 */
export const getBestPackageRecommendation = (brandContext: BrandPricingContext): {
  primary: PackageType;
  alternatives: PackageType[];
  reasoning: string;
} => {
  const budget = BUDGET_RANGES.find(range => range.label === brandContext.budgetRange);
  
  if (!budget) {
    throw new Error('Invalid budget range');
  }

  // Start with budget-based recommendation
  let primary = budget.recommendedPackages[0] as PackageType;
  let reasoning = `Based on your budget of ${budget.label}, we recommend the ${PACKAGES[primary].name} package.`;
  
  // Adjust based on business context
  if (brandContext.pricePositioning > 80 && budget.max >= 500000) {
    // High-end brands with good budget
    primary = 'throne';
    reasoning = `Given your premium positioning and budget, the ${PACKAGES[primary].name} package will deliver the luxury experience your brand deserves.`;
  } else if (brandContext.industry === 'Technology' && brandContext.businessModel === 'B2B') {
    // Tech B2B companies often need more comprehensive branding
    if (budget.max >= 300000) {
      primary = 'throne';
      reasoning = `Tech B2B companies benefit from comprehensive branding. The ${PACKAGES[primary].name} package includes everything you need for market leadership.`;
    }
  } else if (brandContext.primaryAudience.includes('Startups') && budget.max <= 200000) {
    // Startup-friendly approach
    primary = 'crest';
    reasoning = `Perfect for startups! The ${PACKAGES[primary].name} package gives you everything needed to launch without breaking the bank.`;
  }

  return {
    primary,
    alternatives: budget.recommendedPackages.filter(pkg => pkg !== primary) as PackageType[],
    reasoning
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString()}`;
};

/**
 * Calculate payment breakdown
 */
export const calculatePaymentBreakdown = (totalPrice: number): {
  upfront: number;
  balance: number;
  upfrontFormatted: string;
  balanceFormatted: string;
  totalFormatted: string;
} => {
  const upfront = Math.round(totalPrice * 0.5);
  const balance = totalPrice - upfront;
  
  return {
    upfront,
    balance,
    upfrontFormatted: formatCurrency(upfront),
    balanceFormatted: formatCurrency(balance),
    totalFormatted: formatCurrency(totalPrice)
  };
};
