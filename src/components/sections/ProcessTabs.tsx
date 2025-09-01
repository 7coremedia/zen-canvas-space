import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessItem {
  id: string;
  title: string;
  description: string;
}

const processItems: ProcessItem[] = [
  { id: 'idea', title: 'Idea', description: 'Initial concept development and validation through market research and stakeholder feedback.' },
  { id: 'mandate', title: 'Mandate Setup', description: 'Establishing clear project scope, objectives, and success criteria for the branding initiative.' },
  { id: 'stakeholder', title: 'Stakeholder Mapping', description: 'Identifying and analyzing all key stakeholders who will influence or be affected by the brand.' },
  { id: 'governance', title: 'Governance Model', description: 'Creating decision-making frameworks and approval processes for brand development.' },
  { id: 'team', title: 'Team Assembly', description: 'Building cross-functional teams with the right expertise and stakeholder representation.' },
  { id: 'budget', title: 'Budget Planning', description: 'Allocating resources across all phases of the branding project and timeline.' },
  { id: 'timeline', title: 'Timeline Design', description: 'Creating detailed project schedules with milestones and critical path analysis.' },
  { id: 'risk', title: 'Risk Register', description: 'Identifying potential challenges and developing mitigation strategies for each phase.' },
  { id: 'market-research', title: 'Market Research', description: 'Comprehensive analysis of market dynamics, trends, and opportunities.' },
  { id: 'customer-insights', title: 'Customer Insights', description: 'Deep understanding of target audience needs, behaviors, and motivations.' },
  { id: 'industry-trends', title: 'Industry Trends', description: 'Analysis of emerging patterns and innovations within the industry landscape.' },
  { id: 'competitor', title: 'Competitor Analysis', description: 'Evaluating competitive positioning and identifying differentiation opportunities.' },
  { id: 'swot', title: 'SWOT Synthesis', description: 'Consolidating strengths, weaknesses, opportunities, and threats into strategic insights.' },
  { id: 'brand-strategy', title: 'Brand Strategy', description: 'Developing the core strategic foundation that guides all brand decisions.' },
  { id: 'positioning', title: 'Positioning', description: 'Defining the unique space the brand occupies in the market and minds of consumers.' },
  { id: 'core-promise', title: 'Core Promise', description: 'Articulating the fundamental commitment the brand makes to its stakeholders.' },
  { id: 'value-prop', title: 'Value Proposition', description: 'Creating compelling statements of the unique value the brand delivers.' },
  { id: 'naming', title: 'Naming', description: 'Developing brand names that are memorable, meaningful, and legally available.' },
  { id: 'tagline', title: 'Tagline Options', description: 'Creating concise, impactful phrases that capture the brand essence.' },
  { id: 'narrative', title: 'Narrative Spine', description: 'Building the core story structure that supports all brand communications.' },
  { id: 'story-pillars', title: 'Story Pillars', description: 'Establishing key themes and messages that form the foundation of brand storytelling.' },
  { id: 'message-matrix', title: 'Message Matrix', description: 'Organizing messages by audience, channel, and communication objective.' },
  { id: 'tone', title: 'Tone Guidelines', description: 'Defining the personality and voice that brings the brand to life.' },
  { id: 'proof-points', title: 'Proof Points', description: 'Identifying evidence and examples that support brand claims and promises.' },
  { id: 'brand-alignment', title: 'Brand Alignment', description: 'Ensuring consistency between brand strategy and organizational culture.' },
  { id: 'cultural-audit', title: 'Cultural Audit', description: 'Assessing organizational values and culture to align with brand positioning.' },
  { id: 'heritage', title: 'Heritage Mapping', description: 'Documenting and leveraging the organization\'s history and legacy.' },
  { id: 'innovation', title: 'Innovation Narrative', description: 'Crafting stories that position the brand as forward-thinking and innovative.' },
  { id: 'product-story', title: 'Product Story', description: 'Developing compelling narratives around products and their benefits.' },
  { id: 'founder-story', title: 'Founder Story', description: 'Sharing authentic stories about the brand\'s origins and leadership.' },
  { id: 'customer-story', title: 'Customer Story', description: 'Highlighting real customer experiences and success stories.' },
  { id: 'influencer', title: 'Influencer Strategy', description: 'Identifying and partnering with key opinion leaders and advocates.' },
  { id: 'partnership', title: 'Partnership Strategy', description: 'Developing strategic alliances that enhance brand credibility and reach.' },
  { id: 'campaign', title: 'Campaign Concepts', description: 'Creating integrated marketing campaigns that bring the brand to life.' },
  { id: 'launch', title: 'Launch Narrative', description: 'Developing compelling stories for brand introduction and market entry.' },
  { id: 'visual-identity', title: 'Visual Identity', description: 'Creating the complete visual system that represents the brand.' },
  { id: 'logo', title: 'Logo', description: 'Designing the primary symbol that embodies the brand essence.' },
  { id: 'iconography', title: 'Iconography System', description: 'Developing a comprehensive set of visual symbols and icons.' },
  { id: 'typography', title: 'Typography', description: 'Selecting and customizing typefaces that reflect brand personality.' },
  { id: 'color', title: 'Color System', description: 'Creating a strategic color palette that supports brand recognition.' },
  { id: 'photography', title: 'Photography Direction', description: 'Establishing visual style guidelines for brand photography.' },
  { id: 'video', title: 'Video Language', description: 'Defining the visual and narrative style for brand video content.' },
  { id: 'motion', title: 'Motion Identity', description: 'Creating animated elements that bring the brand to life.' },
  { id: 'music', title: 'Music Identity', description: 'Developing audio signatures and musical guidelines for the brand.' },
  { id: 'packaging', title: 'Packaging Design', description: 'Creating packaging that reflects brand values and enhances product appeal.' },
  { id: 'product-branding', title: 'Product Branding', description: 'Applying brand elements consistently across all product touchpoints.' },
  { id: 'spatial', title: 'Spatial Branding', description: 'Creating branded environments and physical brand experiences.' },
  { id: 'merchandise', title: 'Merchandise System', description: 'Developing branded merchandise and promotional materials.' },
  { id: 'signage', title: 'Signage Standards', description: 'Establishing guidelines for branded signage and wayfinding.' },
  { id: 'digital-ecosystem', title: 'Digital Ecosystem', description: 'Creating cohesive digital experiences across all online platforms.' },
  { id: 'website', title: 'Website Experience', description: 'Designing websites that reflect brand values and drive engagement.' },
  { id: 'app', title: 'App Experience', description: 'Creating mobile applications that deliver on brand promises.' },
  { id: 'social', title: 'Social Playbook', description: 'Developing strategies for social media engagement and community building.' },
  { id: 'content', title: 'Content Calendars', description: 'Planning and scheduling content that supports brand objectives.' },
  { id: 'hashtag', title: 'Hashtag Strategy', description: 'Creating branded hashtags and social media campaigns.' },
  { id: 'seo', title: 'SEO Architecture', description: 'Optimizing digital presence for search engine visibility.' },
  { id: 'data', title: 'Data Governance', description: 'Establishing policies for data collection, usage, and privacy.' },
  { id: 'guidelines', title: 'Brand Guidelines', description: 'Creating comprehensive documentation for brand implementation.' },
  { id: 'training', title: 'Training Toolkits', description: 'Developing resources to educate teams on brand standards.' },
  { id: 'partner-onboarding', title: 'Partner Onboarding', description: 'Creating processes to align partners with brand standards.' },
  { id: 'procurement', title: 'Procurement Guidelines', description: 'Establishing standards for brand-related purchases and partnerships.' },
  { id: 'legal', title: 'Legal Clearance', description: 'Ensuring all brand elements meet legal and regulatory requirements.' },
  { id: 'ip', title: 'IP Protection', description: 'Securing intellectual property rights for brand assets and innovations.' },
  { id: 'accessibility', title: 'Accessibility Compliance', description: 'Ensuring brand experiences are accessible to all audiences.' },
  { id: 'localization', title: 'Localization', description: 'Adapting brand elements for different markets and cultures.' },
  { id: 'crisis', title: 'Crisis Playbook', description: 'Developing protocols for managing brand reputation during crises.' },
  { id: 'reputation', title: 'Reputation Management', description: 'Monitoring and protecting brand reputation across all channels.' },
  { id: 'measurement', title: 'Measurement Framework', description: 'Establishing metrics and KPIs to track brand performance.' },
  { id: 'kpi', title: 'KPI Dashboard', description: 'Creating tools to monitor and report on brand performance indicators.' },
  { id: 'sentiment', title: 'Sentiment Tracking', description: 'Monitoring public perception and sentiment toward the brand.' },
  { id: 'brand-health', title: 'Brand Health', description: 'Regular assessment of brand strength and market position.' },
  { id: 'test-markets', title: 'Test Markets', description: 'Piloting brand initiatives in select markets before full rollout.' },
  { id: 'phased-launch', title: 'Phased Launch', description: 'Implementing brand rollout in strategic phases and markets.' },
  { id: 'internal-rollout', title: 'Internal Rollout', description: 'Introducing the brand to employees and internal stakeholders.' },
  { id: 'public-rollout', title: 'Public Rollout', description: 'Launching the brand to external audiences and markets.' },
  { id: 'ongoing-governance', title: 'Ongoing Governance', description: 'Establishing processes for long-term brand management.' },
  { id: 'quarterly-reviews', title: 'Quarterly Reviews', description: 'Regular assessment and optimization of brand performance.' },
  { id: 'annual-refresh', title: 'Annual Refresh', description: 'Updating and evolving brand elements based on performance data.' },
  { id: 'legacy', title: 'Legacy Stewardship', description: 'Preserving and building upon the brand\'s heritage and achievements.' },
  { id: 'evolve', title: 'Evolve', description: 'Continuously adapting and growing the brand to meet changing market needs.' }
];

export default function ProcessTabs() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
              <section className="py-1 bg-[#f2f2f2]">
       <div className="w-full px-2">
        <div className="relative">
                     {/* Scroll Buttons - Hidden on Mobile */}
           <button
             onClick={scrollLeft}
             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 -ml-2 hidden md:block"
           >
             <ChevronLeft className="w-5 h-5 text-gray-600" />
           </button>
           
           <button
             onClick={scrollRight}
             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 -mr-2 hidden md:block"
           >
             <ChevronRight className="w-5 h-5 text-gray-600" />
           </button>

                     {/* Scrollable Container */}
           <div
             ref={scrollContainerRef}
             className="flex gap-2 overflow-x-auto scrollbar-hide px-2 py-1"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
           >
                                                                                                                                                                           {processItems.map((item, index) => (
                  <div key={item.id} className="flex-shrink-0 flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button className="relative group">
                        <div className="gold-shimmer rounded-2xl px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 w-[140px] h-[50px] flex items-center justify-center">
                          <h3 className="font-display text-xs font-medium text-black text-center">
                            {item.title}
                          </h3>
                        </div>
                        
                        {/* Info section always visible below the button */}
                        <div className="bg-gray-100 rounded-b-2xl px-2 py-2 w-[140px] h-[80px] border border-gray-200 flex flex-col items-center justify-center">
                          <div className="flex items-center justify-center mb-1">
                            <Info className="w-2 h-2 text-gray-600" />
                          </div>
                          <p className="text-[10px] text-gray-700 text-center leading-tight px-1">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    </motion.div>
                    
                    {/* Arrow between items (except after the last one) */}
                    {index < processItems.length - 1 && (
                      <div className="flex-shrink-0 flex items-center px-1">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>

        
      </div>
    </section>
  );
}
