import { PackageType, PACKAGES } from '@/config/packages';
import { calculatePaymentBreakdown } from '@/lib/pricing/calculator';

export interface InvoiceData {
  clientInfo: {
    name: string;
    contact: string;
    email: string;
    company: string;
    address?: string;
  };
  selectedPackage: PackageType;
  customizations: {
    finalPrice: number;
    adjustments: Array<{
      reduction: number;
      feature: string;
      description: string;
    }>;
    paymentTerms: string;
  };
}

export interface InvoiceContext {
  brandData: any;
  invoiceData: InvoiceData;
  invoiceNumber: string;
  dueDate: string;
}

// Main invoice template
const INVOICE_TEMPLATE = `# INVOICE

**Invoice No:** [INVOICE_NUMBER]  
**Date Issued:** [DATE_ISSUED]  
**Due Date:** [DUE_DATE]

**Bill To:**  
Client: [CLIENT_COMPANY]  
Contact: [CLIENT_CONTACT]  
Email: [CLIENT_EMAIL]  
[CLIENT_ADDRESS]

---

## ⚔️ Selected Package

- **Package:** [PACKAGE_NAME]
- **Description:** [PACKAGE_DESCRIPTION]

---

## 💰 Investment

- **Total Project Fee:** [TOTAL_PRICE]
- **Upfront Payment (50%):** [UPFRONT_PAYMENT]
- **Balance Due (50%):** [BALANCE_DUE] on delivery/launch.

[ADJUSTMENTS_SECTION]

---

## 🧾 Payment Details

- **Bank Name:** [BANK_NAME]
- **Account Name:** KING
- **Account Number:** [ACCOUNT_NUMBER]
- **Currency:** Nigerian Naira (₦)

---

## 📜 Terms

1. 50% deposit required before project kickoff.
2. Remaining 50% due upon completion & before final asset transfer.
3. Timeline based on package selection ([TIMELINE]).
4. Assets and ownership rights transfer only after full payment.

---

## 🚀 Next Steps

1. Pay deposit to secure project start.
2. Schedule Discovery Session (Throne Room).
3. Begin the journey from **name → empire**.

---

**KING**  
_We don't build brands. We crown kings._`;

/**
 * Generate invoice number
 */
const generateInvoiceNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `SCM-${year}${month}${day}-${random}`;
};

/**
 * Calculate due date (30 days from issue date)
 */
const calculateDueDate = (): string => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  
  return dueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Generate invoice content from brand data and invoice data
 */
export const generateInvoice = (context: InvoiceContext): string => {
  const { brandData, invoiceData, invoiceNumber, dueDate } = context;
  const packageInfo = PACKAGES[invoiceData.selectedPackage];
  const paymentBreakdown = calculatePaymentBreakdown(invoiceData.customizations.finalPrice);

  // Map brand data to template variables
  const templateVariables = {
    '[INVOICE_NUMBER]': invoiceNumber,
    '[DATE_ISSUED]': new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    '[DUE_DATE]': dueDate,
    '[CLIENT_COMPANY]': invoiceData.clientInfo.company || brandData.brand_name || 'Client Company',
    '[CLIENT_CONTACT]': invoiceData.clientInfo.contact || 'Client Contact',
    '[CLIENT_EMAIL]': invoiceData.clientInfo.email || 'client@email.com',
    '[CLIENT_ADDRESS]': invoiceData.clientInfo.address ? `Address: ${invoiceData.clientInfo.address}` : '',
    '[PACKAGE_NAME]': packageInfo.name,
    '[PACKAGE_DESCRIPTION]': packageInfo.description,
    '[TOTAL_PRICE]': paymentBreakdown.totalFormatted,
    '[UPFRONT_PAYMENT]': paymentBreakdown.upfrontFormatted,
    '[BALANCE_DUE]': paymentBreakdown.balanceFormatted,
    '[ADJUSTMENTS_SECTION]': generateAdjustmentsSection(invoiceData.customizations.adjustments),
    '[BANK_NAME]': 'Your Bank Name', // This should be configurable
    '[ACCOUNT_NUMBER]': 'Your Account Number', // This should be configurable
    '[TIMELINE]': packageInfo.timeline
  };

  // Replace template variables
  let invoice = INVOICE_TEMPLATE;
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  Object.entries(templateVariables).forEach(([placeholder, value]) => {
    const safePlaceholder = new RegExp(escapeRegExp(placeholder), 'g');
    invoice = invoice.replace(safePlaceholder, value);
  });

  return invoice;
};

/**
 * Generate adjustments section if there are any
 */
const generateAdjustmentsSection = (adjustments: Array<{
  reduction: number;
  feature: string;
  description: string;
}>): string => {
  if (adjustments.length === 0) {
    return '';
  }

  const adjustmentsList = adjustments
    .map(adj => `- **${adj.feature}** (₦${adj.reduction.toLocaleString()} reduction): ${adj.description}`)
    .join('\n');

  return `\n**Package Adjustments:**\n${adjustmentsList}\n`;
};

/**
 * Generate invoice summary for preview
 */
export const generateInvoiceSummary = (context: InvoiceContext): {
  invoiceNumber: string;
  client: string;
  package: string;
  totalAmount: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid';
} => {
  const { brandData, invoiceData, invoiceNumber, dueDate } = context;
  const packageInfo = PACKAGES[invoiceData.selectedPackage];
  const paymentBreakdown = calculatePaymentBreakdown(invoiceData.customizations.finalPrice);

  return {
    invoiceNumber,
    client: invoiceData.clientInfo.company || brandData.brand_name || 'Client',
    package: packageInfo.name,
    totalAmount: paymentBreakdown.totalFormatted,
    dueDate,
    status: 'draft'
  };
};

/**
 * Generate payment instructions
 */
export const generatePaymentInstructions = (): string => {
  return `
## 💳 Payment Instructions

### Bank Transfer
- **Bank:** [Your Bank Name]
- **Account Name:** KING
- **Account Number:** [Your Account Number]
- **Reference:** [Invoice Number]

### Payment Confirmation
After payment, please send proof of payment to:
- **Email:** [Your Email]
- **WhatsApp:** [Your Phone Number]

### Payment Terms
- 50% deposit required before project kickoff
- Remaining 50% due upon completion
- All payments in Nigerian Naira (₦)
- Payment confirmation required before work begins
`;
};

/**
 * Generate invoice context from brand data and invoice data
 */
export const createInvoiceContext = (
  brandData: any,
  invoiceData: InvoiceData
): InvoiceContext => {
  return {
    brandData,
    invoiceData,
    invoiceNumber: generateInvoiceNumber(),
    dueDate: calculateDueDate()
  };
};

/**
 * Generate proposal context from brand data and proposal data
 */
export const createProposalContext = (
  brandData: any,
  proposalData: any,
  totalPrice: number
): any => {
  const paymentBreakdown = calculatePaymentBreakdown(totalPrice);
  
  return {
    brandData,
    proposalData,
    totalPrice,
    upfrontPayment: paymentBreakdown.upfront,
    balanceDue: paymentBreakdown.balance
  };
};
