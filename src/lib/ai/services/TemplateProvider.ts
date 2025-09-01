export class TemplateProvider {
  static getMarketingPlanTemplate(): string {
    return `
## Marketing Plan Framework Template

### 1. Strategic Foundation
**Market Analysis**
- Industry size and growth rate
- Key trends and disruption factors
- Regulatory considerations

**Competitive Landscape**
- Direct competitors analysis
- Indirect competition assessment
- Market positioning opportunities

### 2. Target Market Definition
**Primary Audience**
- Demographics: [Age, Income, Location, Education]
- Psychographics: [Values, Interests, Lifestyle]
- Behavioral patterns: [Purchase behavior, Media consumption]

**Secondary Markets**
- [Define secondary segments]

### 3. Marketing Strategy Framework
**Positioning Statement**
For [target customer] who [customer need], [product/service] is [category] that [key benefit] unlike [competition] because [differentiator].

**Marketing Mix Strategy**
- Product: [Core offering and extensions]
- Price: [Pricing strategy and rationale]
- Place: [Distribution channels and partnerships]
- Promotion: [Communication strategy and channels]

### 4. Implementation Roadmap
**Phase 1 (Months 1-3): Foundation**
- [Specific tactics and timeline]

**Phase 2 (Months 4-6): Scale**
- [Growth tactics and expansion]

**Phase 3 (Months 7-12): Optimization**
- [Refinement and optimization strategies]

### 5. Success Metrics Dashboard
| Metric Category | KPI | Target | Measurement Tool | Frequency |
|-----------------|-----|--------|------------------|-----------|
| Awareness | Brand recognition | [%] | Survey | Quarterly |
| Acquisition | Lead generation | [#] | CRM | Monthly |
| Engagement | Content interaction | [rate] | Analytics | Weekly |
| Conversion | Sales conversion | [%] | CRM/Analytics | Monthly |
| Retention | Customer lifetime value | [$] | CRM | Quarterly |

### 6. Budget Allocation
| Channel | Monthly Budget | Annual Budget | Expected ROI |
|---------|---------------|---------------|--------------|
| [Channel 1] | $[amount] | $[amount] | [X]% |
| [Channel 2] | $[amount] | $[amount] | [X]% |
| **Total** | **$[total]** | **$[total]** | **[X]%** |
    `;
  }
  
  static getBrandStrategyTemplate(): string {
    return `
## Brand Strategy Development Framework

### 1. Brand Foundation Analysis
**Brand Purpose**
- Why does this brand exist beyond profit?
- What change does it want to create in the world?

**Brand Vision**
- Where does the brand aspire to be in 5-10 years?
- What future state is it working toward?

**Brand Values**
- What principles guide all brand decisions?
- How do these manifest in daily operations?

### 2. Brand Positioning Framework
**Target Audience Profile**
- Primary: [Detailed persona]
- Secondary: [Additional segments]
- Tertiary: [Future opportunities]

**Competitive Positioning Map**
[Create visual map showing brand position relative to competitors across key attributes]

**Unique Value Proposition**
- Functional benefits: [What the brand does]
- Emotional benefits: [How it makes customers feel]
- Self-expressive benefits: [What it says about the customer]

### 3. Brand Architecture
**Brand Hierarchy**
- Master brand: [Role and positioning]
- Sub-brands: [Relationship and positioning]
- Product brands: [Integration strategy]

**Brand Extension Strategy**
- Natural extension categories: [Opportunities]
- Stretch extension potential: [Long-term possibilities]
- Extension guidelines: [Decision criteria]

### 4. Brand Expression Guidelines
**Brand Personality**
- [5-7 key personality traits with descriptions]

**Tone of Voice**
- [Communication style and characteristics]

**Visual Identity Principles**
- [Design approach and rationale]

### 5. Brand Measurement System
| Metric | Current | Target | Method | Frequency |
|--------|---------|--------|---------|-----------|
| Brand Awareness | [%] | [%] | Survey | Quarterly |
| Brand Consideration | [%] | [%] | Survey | Quarterly |
| Brand Preference | [%] | [%] | Survey | Quarterly |
| Net Promoter Score | [score] | [score] | Survey | Monthly |
| Brand Equity Value | [$] | [$] | Financial Model | Annually |
    `;
  }
  
  static getBusinessPlanTemplate(): string {
    return `
## Business Plan Framework Template

### 1. Executive Summary
**Business Concept**
- [One-sentence description of the business]
- [Key value proposition]
- [Target market size and opportunity]

**Financial Highlights**
- [Revenue projections for 3-5 years]
- [Key financial metrics]
- [Funding requirements]

### 2. Business Model
**Revenue Streams**
- [Primary revenue sources]
- [Pricing strategy]
- [Revenue projections]

**Cost Structure**
- [Fixed costs]
- [Variable costs]
- [Break-even analysis]

### 3. Market Analysis
**Market Size and Trends**
- [Total addressable market]
- [Market growth rate]
- [Key market trends]

**Competitive Analysis**
- [Direct competitors]
- [Competitive advantages]
- [Market positioning]

### 4. Marketing and Sales Strategy
**Go-to-Market Strategy**
- [Customer acquisition strategy]
- [Sales channels]
- [Marketing approach]

**Customer Segments**
- [Primary target customers]
- [Customer personas]
- [Customer journey mapping]

### 5. Operations Plan
**Key Activities**
- [Core business processes]
- [Key partnerships]
- [Resource requirements]

**Implementation Timeline**
- [Key milestones]
- [Resource allocation]
- [Risk mitigation]
    `;
  }
  
  static getTemplateForQuery(query: string): string | null {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('marketing plan')) {
      return this.getMarketingPlanTemplate();
    } else if (queryLower.includes('brand strategy')) {
      return this.getBrandStrategyTemplate();
    } else if (queryLower.includes('business plan')) {
      return this.getBusinessPlanTemplate();
    } else {
      return null; // No specific template needed
    }
  }
}
