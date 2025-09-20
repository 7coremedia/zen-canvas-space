import { PackageType, PACKAGES } from '@/config/packages';
import { calculatePaymentBreakdown } from '@/lib/pricing/calculator';

export interface ProposalData {
  clientInfo: {
    name: string;
    contact: string;
    email: string;
    company: string;
  };
  selectedPackage: PackageType;
  customizations: {
    timeline: string;
    specificNeeds: string;
    additionalNotes: string;
  };
}

export interface ProposalContext {
  brandData: any;
  proposalData: ProposalData;
  totalPrice: number;
  upfrontPayment: number;
  balanceDue: number;
}

// Main proposal template
const PROPOSAL_TEMPLATE = `# PROPOSAL DETAILS

**Project Name:** [CLIENT_PROJECT_NAME]  
**Vendor:** [VENDOR_NAME]  
**Timeline:** [TIMELINE]  
**Date:** [DATE]

---

## ⚡ Purpose: Why This Project Matters

Every empire begins with clarity of vision. This proposal exists to solve a pressing problem: **[CLIENT_PAIN_POINTS]**.

By executing this project, we're not just addressing symptoms — we're re-engineering the brand for dominance. The outcome? A stronger market presence, deeper customer loyalty, and a foundation built for scale. This aligns directly with your company's larger goals of **growth, visibility, and sustained market power**.

---

## 🎯 Target Outcomes

We don't move without measurable force. The outcomes of this project are:

- **Specific:** [SPECIFIC_OUTCOMES]
- **Measurable:** [MEASURABLE_METRICS]
- **Achievable:** Within agreed resources and timeline
- **Realistic:** Calibrated to market and client needs
- **Timely:** Delivered within the agreed timeline

---

## 🛠️ Proposed Solution

Our solution blends creativity with forceful execution. We will:

- Conduct in-depth discovery and brand workshops
- Develop a strategy-backed identity system
- Create digital and offline assets that command attention
- Build a website optimized for performance and customer experience
- Equip the brand with social media systems and campaign assets

> Visual aids like charts, diagrams, and mockups will be integrated where appropriate to help decision-makers grasp the solution at a glance — without drowning in detail.

---

## ⚠️ Risks and Rabbit Holes

No empire rises without challenges. We identify and confront them directly:

- **Risks:** Delays in feedback cycles, scope creep, market shifts.
- **Rabbit holes:** Over-customization, chasing minor design tweaks, or distractions outside agreed scope.

By outlining these early, we safeguard the project's momentum and focus.

---

## 📏 Boundaries & Scope

To maintain focus, these boundaries define the battlefield:

- Work is contained within the selected package scope
- Revisions are capped as outlined in each package
- Add-ons and extras are handled under the Individual Service Pricing section

**Deliverables:** Final brand assets, strategy documents, and systems as defined by the chosen package.

---

## ⚔️ Selected Package: [PACKAGE_NAME]

[PACKAGE_DESCRIPTION]

**Package Features:**
[PACKAGE_FEATURES]

**Investment:** [TOTAL_PRICE]
- **Upfront Payment (50%):** [UPFRONT_PAYMENT]
- **Balance Due (50%):** [BALANCE_DUE] on delivery/launch.

---

## 📜 Terms & Engagement

- **Payment:** 50% upfront, 50% at delivery.
- **Timeline:** [TIMELINE] based on package selection.
- **Revisions:** Defined by package scope.
- **Ownership:** All final assets transfer upon full payment.

---

## 🚀 Next Steps

1. Select your package (Crest, Arsenal, Throne, or Conquest).
2. Sign agreement & pay 50% upfront invoice.
3. Begin the journey from **name** → **empire**.

---

**KING**  
_We don't build brands. We crown kings._`;

/**
 * Generate proposal content from brand data and proposal data
 */
export const generateProposal = (context: ProposalContext): string => {
  const { brandData, proposalData, totalPrice, upfrontPayment, balanceDue } = context;
  const packageInfo = PACKAGES[proposalData.selectedPackage];
  const paymentBreakdown = calculatePaymentBreakdown(totalPrice);

  // Map brand data to template variables
  const templateVariables = {
    '[CLIENT_PROJECT_NAME]': proposalData.clientInfo.company || brandData.brand_name || 'Brand Project',
    '[VENDOR_NAME]': 'KING',
    '[TIMELINE]': proposalData.customizations.timeline || packageInfo.timeline,
    '[DATE]': new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    '[CLIENT_PAIN_POINTS]': brandData.challenges || 
      `${brandData.industry || 'Your industry'} brand visibility and market presence challenges`,
    '[SPECIFIC_OUTCOMES]': generateSpecificOutcomes(brandData, packageInfo),
    '[MEASURABLE_METRICS]': generateMeasurableMetrics(brandData, packageInfo),
    '[PACKAGE_NAME]': packageInfo.name,
    '[PACKAGE_DESCRIPTION]': packageInfo.description,
    '[PACKAGE_FEATURES]': generatePackageFeatures(packageInfo),
    '[TOTAL_PRICE]': paymentBreakdown.totalFormatted,
    '[UPFRONT_PAYMENT]': paymentBreakdown.upfrontFormatted,
    '[BALANCE_DUE]': paymentBreakdown.balanceFormatted
  };

  // Replace template variables
  let proposal = PROPOSAL_TEMPLATE;
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  Object.entries(templateVariables).forEach(([placeholder, value]) => {
    const safePlaceholder = new RegExp(escapeRegExp(placeholder), 'g');
    proposal = proposal.replace(safePlaceholder, value);
  });

  return proposal;
};

/**
 * Generate specific outcomes based on brand data and package
 */
const generateSpecificOutcomes = (brandData: any, packageInfo: any): string => {
  const outcomes: string[] = [];

  // Strategic anchor points from onboarding
  const usp = brandData.usp || brandData.uniqueValue || null;
  const marketingGoals = brandData.marketingGoals || brandData.goals || null;
  const visionMission = brandData.visionMission || brandData.vision || brandData.mission || null;

  if (usp) {
    outcomes.push(`Leverage your unique value proposition to achieve clear market differentiation`);
  }
  if (marketingGoals) {
    outcomes.push(`Align creative and delivery with stated marketing goals to drive measurable impact`);
  }
  if (visionMission) {
    outcomes.push(`Ensure all brand outputs are consistent with your long-term vision and mission`);
  }

  // Industry-specific outcomes
  switch (brandData.industry) {
    case 'Technology':
      outcomes.push('Modern, tech-forward identity and experience that builds credibility');
      break;
    case 'E-commerce':
      outcomes.push('Conversion-optimized brand system across product, cart, and post-purchase touchpoints');
      break;
    case 'Fashion':
      outcomes.push('Trend-aware visual language and social assets that drive engagement');
      break;
    default:
      outcomes.push('Professional identity and cohesive system that build brand recognition');
  }

  // Channel/platform alignment
  const channels = brandData.brand_personality?.distributionChannels || brandData.distributionChannels;
  const platforms = brandData.brand_personality?.preferredPlatforms || brandData.preferredPlatforms;
  if (Array.isArray(channels) && channels.length > 0) {
    outcomes.push(`Consistent execution across key distribution channels (${channels.join(', ')})`);
  }
  if (Array.isArray(platforms) && platforms.length > 0) {
    outcomes.push(`Platform-native creative for (${platforms.join(', ')}) to maximize reach and retention`);
  }

  // Package-specific outcomes (kept concise)
  if (packageInfo.id === 'crest') {
    outcomes.push('Solid brand foundation with logo and essential guidelines');
  } else if (packageInfo.id === 'arsenal') {
    outcomes.push('Complete brand system with strategy, assets, and rollout kit');
  } else if (packageInfo.id === 'throne') {
    outcomes.push('Enterprise-grade brand system with comprehensive brand book');
  } else if (packageInfo.id === 'conquest') {
    outcomes.push('Go-to-market readiness with launch support and content system');
  }

  // Return as a clean, comma-separated sentence
  return outcomes.join(', ');
};

/**
 * Generate measurable metrics based on brand data and package
 */
const generateMeasurableMetrics = (brandData: any, packageInfo: any): string => {
  const metrics: string[] = [];

  // Always include awareness/engagement baselines
  metrics.push('Brand recognition increase (baseline to be established)');
  metrics.push('Social media engagement improvement');

  // Map to marketing goals if available
  const goalsText: string = Array.isArray(brandData.marketingGoals)
    ? brandData.marketingGoals.join(', ')
    : (brandData.marketingGoals || '');
  if (goalsText) {
    metrics.push(`Progress against marketing goals (${goalsText})`);
  }

  // Business-model specific
  if (brandData.businessModel === 'B2B') {
    metrics.push('Lead generation and pipeline velocity improvement');
    metrics.push('Sales enablement asset utilization');
  } else if (brandData.businessModel === 'B2C') {
    metrics.push('Customer acquisition cost reduction');
    metrics.push('Repeat purchase and retention uplift');
  }

  // Package and channel specifics
  const hasWebsite = packageInfo.features.some((f: string) => /website/i.test(f));
  const hasSocial = packageInfo.features.some((f: string) => /social/i.test(f));
  if (hasWebsite) {
    metrics.push('Website conversion rate and funnel completion');
    metrics.push('Time on site and bounce rate improvements');
  }
  if (hasSocial) {
    metrics.push('Content reach, saves, and share rates');
    metrics.push('Follower growth and click-through rates');
  }

  return metrics.join(', ');
};

/**
 * Generate package features list
 */
const generatePackageFeatures = (packageInfo: any): string => {
  return packageInfo.features
    .map((feature: string, index: number) => `${index + 1}. ${feature}`)
    .join('\n');
};

/**
 * Generate proposal summary for preview
 */
export const generateProposalSummary = (context: ProposalContext): {
  title: string;
  client: string;
  package: string;
  investment: string;
  timeline: string;
  keyFeatures: string[];
} => {
  const { brandData, proposalData, totalPrice } = context;
  const packageInfo = PACKAGES[proposalData.selectedPackage];
  const paymentBreakdown = calculatePaymentBreakdown(totalPrice);

  return {
    title: `${proposalData.clientInfo.company || brandData.brand_name} Brand Proposal`,
    client: proposalData.clientInfo.company || brandData.brand_name || 'Client',
    package: packageInfo.name,
    investment: paymentBreakdown.totalFormatted,
    timeline: proposalData.customizations.timeline || packageInfo.timeline,
    keyFeatures: packageInfo.features.slice(0, 3) // Show first 3 features
  };
};
