import type { BlocksData } from '@/components/editor/BlocksEditor';
import { calculatePaymentBreakdown } from '@/lib/pricing/calculator';
import { PACKAGES } from '@/config/packages';

interface ProposalContext {
  brandData: any;
  proposalData: any;
  totalPrice: number;
}

export const generateProposalBlocks = (context: ProposalContext): BlocksData => {
  const { brandData, proposalData, totalPrice } = context;
  const pkg = PACKAGES[proposalData.selectedPackage];
  const pay = calculatePaymentBreakdown(totalPrice);

  const visionMission = brandData.brand_personality?.visionMission || brandData.visionMission || brandData.one_year_vision || brandData.five_year_vision || '';
  const marketingGoals: string[] = brandData.brand_personality?.marketingGoals || brandData.marketingGoals || [];

  const blocks: BlocksData = {
    time: Date.now(),
    version: '2.29.0',
    blocks: [
      { type: 'header', data: { text: '⚡ Project Proposal', level: 1 } },
      { type: 'paragraph', data: { text: `Client: <b>${proposalData.clientInfo.company || brandData.brand_name || 'Client'}</b>` } },
      { type: 'paragraph', data: { text: `Vendor: <b>KING</b>` } },
      { type: 'paragraph', data: { text: `Date: ${new Date().toLocaleDateString()}` } },
      { type: 'paragraph', data: { text: `Timeline: ${proposalData.customizations.timeline || pkg.timeline}` } },

      { type: 'header', data: { text: '🎯 Purpose', level: 2 } },
      { type: 'paragraph', data: { text: brandData.challenges || brandData.brand_personality?.audiencePainPoints || 'We aim to solve visibility and growth challenges.' } },

      { type: 'header', data: { text: '📊 Target Outcomes', level: 2 } },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            `Specific: ${brandData.usp || 'Clear differentiation in your market'}`,
            `Measurable: ${proposalData.customizations.specificNeeds || 'KPIs to be finalized during strategy'}`,
            `Achievable: Within ${proposalData.customizations.timeline || pkg.timeline}`,
            `Realistic: Calibrated to ${brandData.industry || 'your market'}`,
            `Timely: Delivered on schedule`,
            visionMission ? `Vision & Mission: ${visionMission}` : undefined,
            Array.isArray(marketingGoals) && marketingGoals.length ? `Marketing Goals: ${marketingGoals.join(', ')}` : undefined,
          ].filter(Boolean) as string[],
        },
      },

      { type: 'header', data: { text: '🛠 Proposed Solution', level: 2 } },
      { type: 'paragraph', data: { text: `We will leverage your offerings (${brandData.offerings || 'core offerings'}) across distribution (${brandData.brand_personality?.distributionChannels?.join(', ') || 'relevant channels'}) and platforms (${brandData.brand_personality?.preferredPlatforms?.join(', ') || 'priority platforms'}) to scale your brand.` } },

      { type: 'header', data: { text: `⚔️ Selected Package: ${pkg.name}`, level: 2 } },
      { type: 'paragraph', data: { text: pkg.description } },
      { type: 'list', data: { style: 'unordered', items: pkg.features } },

      { type: 'header', data: { text: '💰 Investment', level: 2 } },
      { type: 'table', data: { content: [
        ['Total Project Fee', pay.totalFormatted],
        ['Upfront (50%)', pay.upfrontFormatted],
        ['Balance (50%)', pay.balanceFormatted],
      ] } },

      { type: 'header', data: { text: '📜 Terms', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: [
        '50% upfront, 50% on delivery',
        `Timeline aligned to ${proposalData.customizations.timeline || pkg.timeline}`,
        'Revisions defined by package scope',
        'Ownership transfers upon full payment',
      ] } },
    ],
  };

  return blocks;
};
