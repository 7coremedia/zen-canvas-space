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
const generateSpecificOutcomes = (brandData: OnboardingResponse, packageInfo: any): string => {
  const outcomes = [];
  
  // Industry-specific outcomes
  if (brandData.industry === 'Technology') {
    outcomes.push('Modern, tech-forward brand identity that appeals to your target audience');
    outcomes.push('Professional digital presence that builds trust and credibility');
  } else if (brandData.industry === 'E-commerce') {
    outcomes.push('Conversion-optimized brand identity that drives sales');
    outcomes.push('Cohesive visual system across all customer touchpoints');
  } else if (brandData.industry === 'Fashion') {
    outcomes.push('Trend-setting brand identity that stands out in the fashion market');
    outcomes.push('Instagram-ready visual assets that drive engagement');
  } else {
    outcomes.push('Professional brand identity that differentiates you from competitors');
    outcomes.push('Cohesive visual system that builds brand recognition');
  }

  // Package-specific outcomes
  if (packageInfo.id === 'crest') {
    outcomes.push('Essential brand foundation with logo and basic guidelines');
  } else if (packageInfo.id === 'arsenal') {
    outcomes.push('Complete brand system with strategy and digital assets');
  } else if (packageInfo.id === 'throne') {
    outcomes.push('Comprehensive brand empire with offline and online presence');
  } else if (packageInfo.id === 'conquest') {
    outcomes.push('Market-dominating brand system with launch support');
  }

  return outcomes.join(', ');
};

/**
 * Generate measurable metrics based on brand data and package
 */
const generateMeasurableMetrics = (brandData: OnboardingResponse, packageInfo: any): string => {
  const metrics = [];
  
  // Brand awareness metrics
  metrics.push('Brand recognition increase (baseline to be established)');
  metrics.push('Social media engagement improvement');
  
  // Business metrics
  if (brandData.businessModel === 'B2B') {
    metrics.push('Lead generation improvement');
    metrics.push('Client conversion rate increase');
  } else if (brandData.businessModel === 'B2C') {
    metrics.push('Customer acquisition cost reduction');
    metrics.push('Brand loyalty metrics improvement');
  }

  // Package-specific metrics
  if (packageInfo.features.includes('Website')) {
    metrics.push('Website conversion rate improvement');
    metrics.push('User engagement metrics');
  }
  
  if (packageInfo.features.includes('Social Media')) {
    metrics.push('Social media follower growth');
    metrics.push('Content engagement rates');
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
