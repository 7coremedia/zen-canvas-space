import type { BlocksData } from '@/components/editor/BlocksEditor';
import { PACKAGES } from '@/config/packages';
import logoUrl from '@/assets/king-logo.svg';

interface InvoiceContextLike {
  brandData: any;
  invoiceData: {
    clientInfo: { company: string; contact: string; email: string };
    selectedPackage: keyof typeof PACKAGES;
    customizations: { finalPrice: number };
  };
  invoiceNumber: string;
  dueDate: string;
}

export const generateInvoiceBlocks = (ctx: InvoiceContextLike): BlocksData => {
  const { brandData, invoiceData, invoiceNumber, dueDate } = ctx;
  const pkg = PACKAGES[invoiceData.selectedPackage];
  const total = invoiceData.customizations.finalPrice;
  const upfront = Math.round(total * 0.5);
  const balance = total - upfront;
  const phone = (brandData as any)?.brand_personality?.meta?.contactPhone || (brandData as any)?.sender_phone || '';

  const blocks: BlocksData = {
    time: Date.now(),
    version: '2.29.0',
    blocks: [
      // Header
      { type: 'paragraph', data: { text: `<img src="${logoUrl}" alt="KING" style="float:right;height:32px;width:auto;object-fit:contain;"/>` } },
      { type: 'header', data: { text: 'KING Branding & Creative Agency', level: 2 } },
      { type: 'header', data: { text: 'INVOICE', level: 2 } },

      // Info as simple paragraphs (previous layout)
      { type: 'paragraph', data: { text: `<strong>Bill To</strong>` } },
      { type: 'paragraph', data: { text: `${invoiceData.clientInfo.company || brandData.brand_name || 'Client'}` } },
      { type: 'paragraph', data: { text: `${invoiceData.clientInfo.contact || ''}${phone ? ' — ' + phone : ''}` } },
      { type: 'paragraph', data: { text: `${invoiceData.clientInfo.email || ''}` } },
      { type: 'paragraph', data: { text: `<span style="float:right;"><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</span>` } },
      { type: 'paragraph', data: { text: `<span style="float:right;"><strong>Invoice No:</strong> <b>${invoiceNumber}</b></span>` } },

      // Description/Amount table
      { type: 'table', data: { content: [
        ['<strong>DESCRIPTION</strong>', '<strong>AMOUNT</strong>'],
        [`First Investment:\n₦${upfront.toLocaleString()}\nTimeline:\n${pkg.timeline}\nKey Features:\n• ${pkg.features[0]}\n• ${pkg.features[1]}\n• ${pkg.features[2] || ''}`, `${upfront.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        [`Package Selection\nRecommended: ${pkg.name} based on your budget\n\n${pkg.name}\n${pkg.description}\n\nInvestment:\n${PACKAGES[invoiceData.selectedPackage].priceRange ? `₦${PACKAGES[invoiceData.selectedPackage].priceRange[0].toLocaleString()} - ₦${PACKAGES[invoiceData.selectedPackage].priceRange[1].toLocaleString()}` : ''}\nTimeline:\n${pkg.timeline}\nKey Features:\n${pkg.features.map(f => '• ' + f).join('\n')}`, `${(total - upfront).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ['<strong style="text-align:right; display:block;">TOTAL</strong>', `<strong>₦${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>`],
      ] } },

      // Terms and Account
      { type: 'header', data: { text: 'Terms and Conditions & Account Information', level: 3 } },
      { type: 'paragraph', data: { text: 'First Investment is due within 15 days. If payment has not been made, the order will be automatically cancelled. The next payment will be due 5 weeks after the 1st payment. We also accept full payment upfront.' } },
      { type: 'paragraph', data: { text: '<strong>Account No.</strong> 610 853 8494' } },
      { type: 'paragraph', data: { text: '<strong>Bank:</strong> OPay' } },
      { type: 'paragraph', data: { text: '<strong>Name:</strong> EDMOND ODEY' } },

      { type: 'paragraph', data: { text: '<em>Thank you!</em>' } },
    ],
  };

  return blocks;
};
