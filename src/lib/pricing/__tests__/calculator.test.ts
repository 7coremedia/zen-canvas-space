import { calculateBrandPricing, getBestPackageRecommendation } from '../calculator';
import { PACKAGES } from '@/config/packages';

describe('Pricing Calculator', () => {
  const mockBrandContext = {
    budgetRange: 'N200,000 - N250,000',
    industry: 'Technology',
    businessModel: 'B2B',
    pricePositioning: 70,
    launchTiming: '2-3 months',
    primaryAudience: ['Businesses', 'Startups']
  };

  it('should calculate pricing for Arsenal package', () => {
    const result = calculateBrandPricing(mockBrandContext, 'arsenal');
    
    expect(result).toBeDefined();
    expect(result.budgetRange).toBeDefined();
    expect(result.originalPrice).toBe(PACKAGES.arsenal.priceRange[1]);
    expect(result.adjustedPrice).toBeLessThanOrEqual(result.originalPrice);
    expect(result.isWithinBudget).toBe(true);
    expect(result.budgetAnalysis).toContain('Perfect fit');
  });

  it('should recommend appropriate package based on budget', () => {
    const result = getBestPackageRecommendation(mockBrandContext);
    
    expect(result.primary).toBeDefined();
    expect(result.alternatives).toBeDefined();
    expect(result.reasoning).toContain('recommend');
  });

  it('should handle budget constraints correctly', () => {
    const lowBudgetContext = {
      ...mockBrandContext,
      budgetRange: 'N100,000 - N150,000'
    };
    
    const result = calculateBrandPricing(lowBudgetContext, 'throne');
    
    expect(result.isWithinBudget).toBe(false);
    expect(result.budgetAnalysis).toContain('over your budget');
  });
});
