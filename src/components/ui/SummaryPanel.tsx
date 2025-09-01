import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrandData } from '@/components/ai-brand-chat/types';
import { BrandCreationStep } from '@/types/aiResponse';
// Simple step index mapping
const getStepIndex = (step: BrandCreationStep): number => {
  const stepOrder = [
    'IDEA_GATHERING', 'INDUSTRY_ANALYSIS', 'TARGET_AUDIENCE', 'COMPETITOR_ANALYSIS',
    'POSITIONING', 'BRAND_NAME_GENERATION', 'COLOR_PALETTE', 'TYPOGRAPHY',
    'LOGO_CONCEPT', 'MOODBOARD', 'BRAND_GUIDELINES', 'MARKETING_STRATEGY',
    'SOCIAL_MEDIA', 'WEBSITE_STRATEGY', 'CONTENT_STRATEGY', 'LAUNCH_PLAN', 'FINAL_REVIEW'
  ];
  return stepOrder.indexOf(step) + 1;
};

interface SummaryPanelProps {
  /** Brand data collected so far */
  brandData: Partial<BrandData>;
  /** Current step in the process */
  step: BrandCreationStep;
  /** Whether to show the summary panel */
  show: boolean;
  /** Optional className for styling */
  className?: string;
}

/**
 * SummaryPanel Component
 * 
 * Displays collected brand data and progress from Step 2 onward.
 * Shows progress bar and formatted brand information.
 * Hidden during Step 1 (IDEA_GATHERING).
 * 
 * Props:
 * - brandData: Collected brand information
 * - step: Current step in the process
 * - show: Whether to display the panel
 * - className: Optional styling classes
 */
export const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  brandData, 
  step, 
  show, 
  className 
}) => {
  if (!show) return null;

  const currentStepIndex = getStepIndex(step);
  const totalSteps = 17;
  const progressPercentage = (currentStepIndex / totalSteps) * 100;

  // Helper function to format brand data for display
  const formatBrandData = () => {
    const sections: Array<{ title: string; content: string | string[]; icon?: string }> = [];

    // Core Information
    if (brandData.idea) {
      sections.push({
        title: 'Brand Idea',
        content: brandData.idea,
        icon: '💡'
      });
    }

    if (brandData.summary) {
      sections.push({
        title: 'Summary',
        content: brandData.summary,
        icon: '📝'
      });
    }

    // Product Details (from Step 2+)
    if (brandData.product?.features?.length) {
      sections.push({
        title: 'Product Features',
        content: brandData.product.features,
        icon: '🏷️'
      });
    }

    if (brandData.product?.benefits?.length) {
      sections.push({
        title: 'Product Benefits',
        content: brandData.product.benefits,
        icon: '✨'
      });
    }

    // Brand Name
    if (brandData.brandName?.selected) {
      sections.push({
        title: 'Brand Name',
        content: brandData.brandName.selected,
        icon: '🏷️'
      });
    }

    // Positioning
    if (brandData.positioning?.statement) {
      sections.push({
        title: 'Positioning',
        content: brandData.positioning.statement,
        icon: '🎯'
      });
    }

    // Colors
    if (brandData.brandColors?.selected?.length) {
      sections.push({
        title: 'Brand Colors',
        content: brandData.brandColors.selected,
        icon: '🎨'
      });
    }

    // Typography
    if (brandData.typography?.heading?.name) {
      sections.push({
        title: 'Typography',
        content: [
          `Heading: ${brandData.typography.heading.name}`,
          `Body: ${brandData.typography.body?.name || 'Not set'}`
        ],
        icon: '📄'
      });
    }

    // Moodboard keywords
    if (brandData.moodboard?.keywords?.length) {
      sections.push({
        title: 'Style Keywords',
        content: brandData.moodboard.keywords,
        icon: '🎭'
      });
    }

    return sections;
  };

  const brandSections = formatBrandData();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Brand Progress
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Step {currentStepIndex} of {totalSteps}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {brandSections.length > 0 ? (
          <div className="space-y-3">
            {brandSections.map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{section.icon}</span>
                  <h4 className="text-sm font-medium text-foreground">
                    {section.title}
                  </h4>
                </div>
                
                <div className="pl-6">
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-1">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {section.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Start building your brand to see progress here
            </p>
          </div>
        )}

        {/* Pending items indicator */}
        {brandSections.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              ⚪ Pending: {totalSteps - currentStepIndex} more steps to complete
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

