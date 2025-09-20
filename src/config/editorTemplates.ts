export const EDITOR_TEMPLATES = {
  proposal: `
    <h1>⚡ Project Proposal</h1>
    <p><strong>Client:</strong> [[CLIENT]]</p>
    <p><strong>Vendor:</strong> [[VENDOR]]</p>
    <p><strong>Date:</strong> [[DATE]]</p>
    <p><strong>Timeline:</strong> [[TIMELINE]]</p>
    <hr />

    <h2>🎯 Purpose</h2>
    <p>[[PURPOSE]]</p>

    <h2>📊 Target Outcomes</h2>
    <ul>
      [[OUTCOMES_LIST]]
    </ul>

    <h2>🛠 Proposed Solution</h2>
    <p>[[SOLUTION]]</p>

    <h2>📏 Scope & Deliverables</h2>
    <p>[[SCOPE]]</p>

    <h2>💰 Investment</h2>
    <ul>
      <li><strong>Total:</strong> [[TOTAL_PRICE]]</li>
      <li><strong>Upfront (50%):</strong> [[UPFRONT_PAYMENT]]</li>
      <li><strong>Balance (50%):</strong> [[BALANCE_DUE]]</li>
    </ul>

    <h2>📜 Terms</h2>
    <ul>
      <li>50% upfront, 50% on delivery</li>
      <li>Revisions defined by package scope</li>
      <li>Ownership transfers upon full payment</li>
    </ul>

    <hr />
    <p><strong>[[VENDOR]]</strong><br/><em>We don't build brands. We crown kings.</em></p>
  `,
  invoice: `
    <h1>🧾 Invoice</h1>
    <p><strong>Invoice No:</strong> [[INVOICE_NUMBER]]</p>
    <p><strong>Date Issued:</strong> [[DATE]]</p>
    <hr />

    <h2>Bill To</h2>
    <p><strong>Client:</strong> [[CLIENT_COMPANY]]</p>
    <p><strong>Contact:</strong> [[CLIENT_CONTACT]]</p>
    <p><strong>Email:</strong> [[CLIENT_EMAIL]]</p>

    <h2>⚔️ Selected Package</h2>
    <p><strong>Package:</strong> [[PACKAGE_NAME]]</p>
    <p><strong>Description:</strong> [[PACKAGE_DESCRIPTION]]</p>

    <h2>💰 Investment</h2>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="text-align:left;">Item</th>
          <th style="text-align:right;">Amount (₦)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total Project Fee</td>
          <td style="text-align:right;">[[TOTAL_FEE]]</td>
        </tr>
        <tr>
          <td>Upfront Payment (50%)</td>
          <td style="text-align:right;">[[UPFRONT_FEE]]</td>
        </tr>
        <tr>
          <td>Balance on Delivery</td>
          <td style="text-align:right;">[[BALANCE_FEE]]</td>
        </tr>
      </tbody>
    </table>

    <h2>🧾 Payment Details</h2>
    <p><strong>Bank Name:</strong> [[BANK_NAME]]</p>
    <p><strong>Account Name:</strong> [[ACCOUNT_NAME]]</p>
    <p><strong>Account Number:</strong> [[ACCOUNT_NUMBER]]</p>

    <h2>📜 Terms</h2>
    <ul>
      <li>50% deposit required before project kickoff</li>
      <li>Remaining 50% due upon completion & before asset transfer</li>
      <li>Timeline based on package selection</li>
    </ul>

    <hr />
    <p><strong>[[VENDOR]]</strong><br/><em>We don't build brands. We crown kings.</em></p>
  `,
};
