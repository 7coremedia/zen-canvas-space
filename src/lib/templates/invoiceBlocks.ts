import type { BlocksData } from '@/components/editor/BlocksEditor';
import { PACKAGES } from '@/config/packages';

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

  const blocks: BlocksData = {
    time: Date.now(),
    version: '2.29.0',
    blocks: [
      { type: 'header', data: { text: '🧾 Invoice', level: 1 } },
      { type: 'paragraph', data: { text: `Invoice No: <b>${invoiceNumber}</b>` } },
      { type: 'paragraph', data: { text: `Date Issued: ${new Date().toLocaleDateString()}` } },
      { type: 'paragraph', data: { text: `Due Date: ${dueDate}` } },

      { type: 'header', data: { text: 'Bill To', level: 2 } },
      { type: 'paragraph', data: { text: `Client: <b>${invoiceData.clientInfo.company || brandData.brand_name || 'Client'}</b>` } },
      { type: 'paragraph', data: { text: `Contact: ${invoiceData.clientInfo.contact || ''}` } },
      { type: 'paragraph', data: { text: `Email: ${invoiceData.clientInfo.email || ''}` } },

      { type: 'header', data: { text: '⚔️ Selected Package', level: 2 } },
      { type: 'paragraph', data: { text: `Package: <b>${pkg.name}</b>` } },
      { type: 'paragraph', data: { text: `Description: ${pkg.description}` } },

      { type: 'header', data: { text: '💰 Investment', level: 2 } },
      { type: 'table', data: { content: [
        ['Total Project Fee', `₦${total.toLocaleString()}`],
        ['Upfront (50%)', `₦${upfront.toLocaleString()}`],
        ['Balance (50%)', `₦${balance.toLocaleString()}`],
      ] } },

      { type: 'header', data: { text: '🧾 Payment Details', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: [
        'Bank Name: [Your Bank Name]',
        'Account Name: KING',
        'Account Number: [Your Account Number]',
        'Currency: Nigerian Naira (₦)'
      ] } },

      { type: 'header', data: { text: '📜 Terms', level: 2 } },
      { type: 'list', data: { style: 'unordered', items: [
        '50% deposit required before project kickoff',
        'Remaining 50% due upon completion & before asset transfer',
        'Timeline based on package selection',
      ] } },
    ],
  };

  return blocks;
};
