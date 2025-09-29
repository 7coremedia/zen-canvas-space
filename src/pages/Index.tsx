import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";
import ProcessTabs from "@/components/sections/ProcessTabs";
import { CornerRightDown } from 'lucide-react';
import PortfolioShowcase from "@/components/sections/PortfolioShowcase";
import { usePublicPortfolio } from "@/hooks/usePublicPortfolio";

import aaluxuryBrandingPresentationHero from "@/assets/My Uploads/aaluxury-branding-presentation-hero.jpg";
import aaluxuryFull from "@/assets/My Uploads/aaluxury-branding-presentation-hero.jpg";
import aaluxuryBrandPres from "@/assets/aaluxury-brand-pres.jpg";
import mInMarketing from "@/assets/m-in-marketing.svg";
import aaluxuryIntroHeroMobile from "@/assets/aaluxury-intro-hero-mobile.png";
import ooInLogo from "@/assets/oo-in-logo.svg";
import heroKing from "@/assets/hero-king.png";
import FullScreenImage from "@/components/sections/FullScreenImage";
import heroKingJpg from "@/assets/hero-king.jpg";
import aaluxuryMoodboard from "@/assets/aaluxury-brand-pres.jpg";
import aaluxResuInSea from "@/assets/aalux-resu-in-sea.png"; // Import the new image

const Index = () => {
  return (
    <main className="bg-[#f2f2f2]">
      <Helmet>
        <title>KING – Branding & Creative Portfolio</title>
        <meta name="description" content="Premium branding, logo design, and creative portfolio by KING. Explore work, services, and start your brand journey." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "KING Edmund",
            url: "/",
            jobTitle: "Brand Designer",
            sameAs: ["https://instagram.com/", "https://www.linkedin.com/"]
          })}
        </script>
      </Helmet>

      <Hero />

      {/* New premium content blocks */}
      <PortfolioShowcase />

      {/* Featured Projects */}
      <section className="px-4 py-12 md:py-16 bg-[#f2f2f2]">
        <div className="container mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight mb-8">
            Featured <em className="italic">projects</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Aalux Labs',
                tag: 'Luxury Beauty',
                to: '/portfolio/luxury-that-makes-you-aspire!--branding',
                cover: 'https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/c2hz5ssc1a5.png',
              },
              {
                title: 'Reflection',
                tag: 'Skincare',
                to: '/portfolio/increasing-sales-through-website',
                cover: 'https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/c65g2s60x15.png',
              },
              {
                title: 'H202 Labs',
                tag: 'Tech & Medicine',
                to: '/portfolio/skincare-from-within',
                cover: 'https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/3a5abacjjan.png',
              },
            ].map((item, i) => (
              <article key={i} className="group">
                <a href={(item as any).to ?? undefined} className="block" aria-label={`Open project ${item.title}`}>
                  <img
                    src={(item as any).cover ?? ''}
                    alt={`${item.title} cover`}
                    className="w-full aspect-[16/9] object-cover rounded mb-3 bg-neutral-200"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  { !(item as any).cover && (
                    <div className="w-full aspect-[16/9] bg-neutral-200 rounded mb-3" aria-hidden="true" />
                  )}
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-xs uppercase tracking-wide text-neutral-500">{item.tag}</p>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Spotlight */}
      <section className="px-4 py-12 md:py-16 bg-[#f2f2f2]">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.04em]">
              Case <em className="italic">studies</em>
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.45em] text-neutral-500">Featured</p>
          </div>
          <CaseStudySpotlight />
        </div>
      </section>

      {/* Pricing (enhanced transparent style) */}
      <section className="px-4 py-16 md:py-24 bg-[#f2f2f2] relative">
        {/* Decorative subtle rings */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.06),transparent_60%)]" aria-hidden="true" />
        <div className="container mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.02em] mb-10">
            Transparent <em className="italic">pricing</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-black/10 rounded-xl p-6 bg-white/70 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Starter</h3>
              <p className="text-sm text-muted-foreground mb-4">For new ventures validating their brand.</p>
              <ul className="text-sm text-neutral-700 space-y-2 mb-6">
                <li>• Strategy Sprint</li>
                <li>• Logo & Basic Identity</li>
                <li>• Launch Toolkit</li>
              </ul>
              <Button variant="gold" className="w-full">Request Pricing</Button>
            </div>
            <div className="relative border border-black/10 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-md md:scale-[1.02] md:-translate-y-2">
              <div className="absolute -top-3 left-6 text-xs px-2 py-1 rounded-full bg-[#1b1917] text-white">Most Popular</div>
              <h3 className="font-semibold text-lg mb-2">Growth</h3>
              <p className="text-sm text-muted-foreground mb-4">For scaling brands seeking consistency.</p>
              <ul className="text-sm text-neutral-700 space-y-2 mb-6">
                <li>• Positioning & Messaging</li>
                <li>• Full Identity System</li>
                <li>• Website & Content Kit</li>
              </ul>
              <Button variant="gold" className="w-full">Request Pricing</Button>
            </div>
            <div className="border border-black/10 rounded-xl p-6 bg-white/70 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
              <p className="text-sm text-muted-foreground mb-4">For established teams and product suites.</p>
              <ul className="text-sm text-neutral-700 space-y-2 mb-6">
                <li>• Brand Architecture</li>
                <li>• Multi-Channel Rollout</li>
                <li>• Ongoing Creative Support</li>
              </ul>
              <Button variant="gold" className="w-full">Request Pricing</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Open Letter to business owners */}
      <section className="px-4 py-16 md:py-24 bg-[#f2f2f2]">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.02em]">A letter to <em className="italic">founders</em> & builders</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-base md:text-lg text-neutral-800 leading-relaxed mb-6">
              You don’t just need a logo—you need a brand that moves people. A brand that makes decisions easier, prices higher, and growth faster. That’s why we build systems, not trends. Systems that carry your story and make your customers the <em className="italic">hero</em>.
            </p>
            <p className="text-base md:text-lg text-neutral-800 leading-relaxed mb-6">
              We work in tight sprints with honest feedback loops. You’ll see progress quickly, test it with real users, and get a brand that feels inevitable. If you’re ready to build what lasts, we’re ready to crown the next king.
            </p>
            <div className="w-full aspect-[21/9] bg-neutral-200 rounded" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Luxury color billboard with Playfair headline */}
      <section className="relative min-h-[120vh] md:min-h-[140vh] flex items-center bg-[#1b1917] text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-5xl md:text-7xl font-medium leading-tight tracking-[-0.025em] max-w-5xl">
            Design that turns <em className="italic">ambition</em> into <em className="italic">authority</em>.
          </h2>
          <p className="mt-6 max-w-2xl text-white/80">
            For founders, operators, and creators building brands that last. Strategy-first, execution-obsessed.
          </p>
        </div>
      </section>

      {/* Full-screen image placeholder */}
      <section className="min-h-[160vh] md:min-h-[180vh] bg-neutral-200 flex items-center justify-center">
        <div className="text-neutral-500">Full-screen image placeholder</div>
      </section>

      {/* Centered image with creative text layout around */}
      <section className="px-4 py-28 md:py-36 bg-[#0f3d2e] text-white min-h-[160vh] md:min-h-[180vh] overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 order-2 md:order-1">
            <h3 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-tight">
              Make your <em className="italic">customer</em> the hero.
            </h3>
            <p className="mt-4 text-white/85">We build brands around the journeys your users actually take—then design every touchpoint to feel inevitable.</p>
          </div>
          <div className="md:col-span-4 order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-md aspect-square bg-neutral-100 rounded" aria-hidden="true" />
          </div>
          <div className="md:col-span-4 order-3">
            <p className="text-white/85">From the first impression to the final click: identity, web, content, and launch—delivered with craftsmanship and speed.</p>
          </div>
        </div>
      </section>

      {/* Process-inspired immersive sections */}
      {/* Market Research – light on dark with right-aligned image */}
      <section className="relative min-h-[160vh] md:min-h-[180vh] bg-[#1b1917] text-white flex items-center overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.025em] leading-tight mb-6">
              Market <span className="italic">Research</span>
            </h2>
            <p className="text-white/80 max-w-xl mb-8">
              Comprehensive analysis of market dynamics, trends, and opportunities. We turn noise into signal and give your brand a
              terrain map—so every move compounds.
            </p>
            <p className="text-white/70 max-w-xl">
              Methods include qualitative interviews, competitive audits, and field studies. Outputs include a research report, insight themes,
              and decision frameworks.
            </p>
          </div>
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-2xl aspect-[3/2] bg-neutral-200/20 rounded border border-white/10" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Brand Strategy – ivory band with left image */}
      <section className="min-h-[160vh] md:min-h-[180vh] bg-[#faf7f2] text-[#1b1917] flex items-center">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 order-2 md:order-1">
            <div className="w-full max-w-2xl aspect-[3/2] bg-neutral-300 rounded" aria-hidden="true" />
          </div>
          <div className="md:col-span-5 order-1 md:order-2">
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-tight mb-6">
              Brand <em className="italic">Strategy</em>
            </h2>
            <p className="text-neutral-700 max-w-xl mb-6">
              The core strategic foundation that guides all brand decisions—positioning, promise, and value proposition synthesized into a
              living playbook.
            </p>
            <p className="text-neutral-700/90 max-w-xl">
              Deliverables: strategy brief, narrative spine, message matrix, and tone guidelines—ready for design and go-to-market.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Identity – deep green with centered image */}
      <section className="min-h-[160vh] md:min-h-[180vh] bg-[#0f3d2e] text-white flex items-center">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4">
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-tight mb-6">Visual <em className="italic">Identity</em></h2>
            <p className="text-white/85">Logo systems, typography, color, and art direction crafted for longevity and clarity.</p>
          </div>
          <div className="md:col-span-4 flex justify-center">
            <div className="w-full max-w-xl aspect-[4/5] bg-neutral-100 rounded" aria-hidden="true" />
          </div>
          <div className="md:col-span-4">
            <p className="text-white/80">From symbol to motion identity—built modularly, documented thoroughly, and ready to scale.</p>
          </div>
        </div>
      </section>

      {/* Launch Narrative – rich brown with quote style */}
      <section className="min-h-[160vh] md:min-h-[180vh] bg-[#2a211b] text-white flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl">
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-tight mb-6">Launch <em className="italic">Narrative</em></h2>
            <p className="text-white/80 mb-8">We choreograph how the story lands—internally and in-market—so the brand debuts with momentum.</p>
            <blockquote className="text-2xl md:text-3xl font-display italic tracking-tight text-white/90">
              “Design is not just about problem solving, it’s about asking the right questions.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* Positioning – cream band with bold/regular mix and mosaic placeholders */}
      <section className="min-h-[160vh] md:min-h-[180vh] bg-[#f4efe9] text-[#1b1917] flex items-center">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 order-2 md:order-1 grid grid-cols-2 gap-3">
            <div className="aspect-[4/3] bg-neutral-300 rounded" aria-hidden="true" />
            <div className="aspect-[4/5] bg-neutral-300 rounded" aria-hidden="true" />
            <div className="aspect-square bg-neutral-300 rounded" aria-hidden="true" />
            <div className="aspect-[16/10] bg-neutral-300 rounded" aria-hidden="true" />
          </div>
          <div className="md:col-span-7 order-1 md:order-2">
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.025em] leading-tight mb-4">
              <span className="font-medium">Positioning</span> that claims your category.
            </h2>
            <p className="text-lg text-neutral-800 mb-6">
              We define the unique space your brand occupies in the market and the minds of customers—so every message lands where it matters.
            </p>
            <p className="text-neutral-700 max-w-2xl">Outputs include a category map, competitor gap analysis, and message hierarchy ready for sales and marketing activation.</p>
          </div>
        </div>
      </section>

      {/* Narrative Spine – dark band with centered type focus */}
      <section className="min-h-[160vh] md:min-h-[180vh] bg-[#131313] text-white flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em] leading-tight mb-6">
            The <span className="italic">Narrative</span> Spine
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto mb-10">
            Your brand’s core story architecture—built from pillars, proof points, and a message matrix that scales from landing page to investor deck.
          </p>
          <div className="mx-auto w-full max-w-4xl aspect-[21/9] bg-neutral-200/10 rounded border border-white/10" aria-hidden="true" />
        </div>
      </section>

      {/* See Our Process */}
      <section className="py-16 px-4 bg-[#f2f2f2]">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3">
            <h2 className="font-display text-2xl md:text-4xl font-medium">See Our Process</h2>
            <CornerRightDown className="w-12 h-12 md:w-16 md:h-16" style={{ color: '#16181d', transform: 'translateY(18px)' }} />
          </div>
        </div>
      </section>

      {/* Process Tabs */}
      <ProcessTabs />

      {/* Existing CTA buttons */}
      <section className="py-16 px-4 bg-[#f2f2f2]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
          {/* Left Column: All Text */}
          <div className="flex flex-col justify-between h-full">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold mb-4 font-display">Client Request</h2>
              <p className="text-sm text-muted-foreground mb-4">
                “King I need a logo for my brand and a revamp. Luxury, Highend my goal is to sell outside of Africa”
                <br />— Amara O., CEO. Aalux Labs
              </p>
            </div>

            <div className="hidden md:block max-w-md">
              <h2 className="text-4xl font-bold font-display mb-2">Process</h2>
              <p className="text-sm text-muted-foreground">
                “Our creative process dosent come first. Research does. It's the first process”
                <br />— Abby. K, CCO, King Labs
              </p>
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="flex flex-col items-center">
            <img src="/home/client-req-home.png" alt="Aaluxury Brand Presentation" className="w-full h-auto object-contain" />
          </div>
        </div>

        {/* Mobile/Tablet View for PROCESS text */}
        <div className="md:hidden mt-8">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold font-display mb-2">Process</h2>
            <p className="text-sm text-muted-foreground">
              “Our creative process dosent come first. Research does. It's the first process”
              <br />— Abby. K, CCO, King Labs
            </p>
          </div>
        </div>
      </section>

      {/* New section with full-width image */}
      <section className="py-16 px-4 bg-[#f2f2f2]">
        <img src="home/aalux-resu-in-sea.png" alt="Aaluxury products in a seaside setting" className="w-full h-auto" />
      </section>

      <section className="py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Right Column (Text) first on mobile) */}
        <div className="order-1 md:order-2">
          <h2 className="text-4xl font-bold mb-4 font-display">Problem</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Aalux Labs, a beginning luxury brand, sought a distinctive visual identity to penetrate the competitive global market. Their challenge was to create a logo and branding that conveyed luxury and sophistication while resonating with an international audience.
          </p>
          <h2 className="text-4xl font-bold mb-4 font-display">King</h2>
          <p className="text-sm text-muted-foreground">
            Our approach began with in-depth market research and brand strategy development. We crafted a logo that blends classic elegance with modern simplicity, utilizing a custom typeface and a refined color palette to embody the brand's high-end aspirations and global vision.
          </p>
        </div>

        {/* Left Column (Image) */}
        <div className="order-2 md:order-1 flex justify-center">
          <img src="/home/prob-king-sol.png" alt="Aaluxury Intro Hero Mobile" className="w-full h-auto object-contain" />
        </div>
      </section>

      <section className="py-16 px-4">
        <img src="/home/aalux-body-img.png" alt="Aaluxury Moodboard" className="w-full h-auto" />
      </section>


      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4 font-display">Solution</h2>
            <p className="text-muted-foreground mx-0 my-0 px-0 py-0 text-sm text-left left text">
              Based on the chosen moodboard, we developed a comprehensive brand identity system. This included the final logo design, a refined color palette, typography guidelines, and imagery standards, all carefully crafted to elevate Aalux Labs' presence in the luxury market and support their goal of global expansion.
            </p>
          </div>
          <div className="w-full flex justify-center">
            <img src="/home/aalux-bento.png" alt="Aaluxury Brand Presentation" className="w-full max-w-10xl h-auto object-cover" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Text */}
        <div>
          <h2 className="text-4xl font-bold mb-4 font-display">Others</h2>
          <p className="text-sm text-muted-foreground">
            The brand asked for a more vibrant vibe and packaging for a wider audience which they decided to market as the norm while their luxury is kept for high end customers. So, we delivered.
          </p>
        </div>
        {/* Right Column: Image */}
        <img src="/home/alux-label.png" alt="Other Project Image" />
      </section>

      <section className="py-15 py-4 px-4 bg-[#f2f2f2]">
        <img src="/home/alux-bento-vibe.png" alt="Full width image" className="w-full h-auto" />
      </section>

      <Cta />
    </main>
  );
};

const CaseStudySpotlight = () => {
  const { data: portfolioItems } = usePublicPortfolio();
  const caseStudies = portfolioItems?.filter((item) => item.portfolio_type === "case_study") || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (caseStudies.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % caseStudies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [caseStudies.length]);

  if (!caseStudies.length) {
    return null;
  }

  const activeCase = caseStudies[currentIndex];

  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center">
      <div className="relative aspect-[9/12] w-full max-w-md bg-white/5 backdrop-blur-sm">
        {activeCase.cover_url && (
          <img
            src={activeCase.cover_url}
            alt={activeCase.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}

        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 px-4">
          <Button
            asChild
            variant="ghost"
            className="rounded-sm border border-white/30 bg-white/20 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.4em] text-neutral-900 backdrop-blur-md font-display hover:bg-white/25"
          >
            <a href={`/portfolio/${activeCase.slug}`}>
              View Case Study
            </a>
          </Button>
          <div className="rounded-sm border border-white/25 bg-white/15 px-3 py-1.5 text-center text-xs text-neutral-900 backdrop-blur-md font-display uppercase tracking-[0.2em]">
            {activeCase.title}
          </div>
        </div>
      </div>

      {caseStudies.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {caseStudies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 w-2.5 rounded-full ${
                index === currentIndex ? "bg-neutral-900" : "bg-neutral-300"
              }`}
              aria-label={`View case study ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
