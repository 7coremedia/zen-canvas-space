import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";
import ProcessTabs from "@/components/sections/ProcessTabs";
import { CornerRightDown, ChevronDown } from 'lucide-react';
import PortfolioShowcase from "@/components/sections/PortfolioShowcase";
import { usePublicPortfolio } from "@/hooks/usePublicPortfolio";
import ProjectInfoOverlay, { ProjectDetails } from "@/components/smart-blocks/ProjectInfoOverlay";
import DesignSelector from "@/components/smart-blocks/smart-overlay-action";

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
import aaluxResuInSea from "@/assets/aalux-resu-in-sea.png";
import brandsWorkedWith from "@/assets/brands-worked-with.png";

const Index = () => {
  const [showDesignSelector, setShowDesignSelector] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hint animation for horizontal scroll on mobile
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const hintScroll = () => {
        if (window.innerWidth < 768 && container.scrollLeft === 0) {
          container.scrollTo({ left: 60, behavior: 'smooth' });
          setTimeout(() => {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          }, 800);
        }
      };

      // Delay slightly for initial render/layout
      const timer = setTimeout(hintScroll, 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  const portraitStripPlaceholders = Array.from({ length: 8 });
  const ambitionCardImages = [
    {
      src: "https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/T-DB%20Leave%20out%20guess%20work.png",
      alt: "T-DB Leave out guess work",
      fit: "contain" as const,
      aspect: "aspect-[4/5]" as const,
    },
    {
      src: "https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/T-DB%20Burnout%20is%20real.png",
      alt: "T-DB Burnout is real",
      fit: "contain" as const,
      aspect: "aspect-[4/5]" as const,
    },
    {
      src: "https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/Emerald%20Course%20Book.png",
      alt: "Emerald Course Book cover",
      aspect: "aspect-[4/5]" as const,
    },
    {
      src: "https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/Emerald%20course%20book%20inside.png",
      alt: "Emerald course book inside spread",
      aspect: "aspect-[4/5]" as const,
    },
  ];
  const positioningPreviewTiles = [
    { aspect: "aspect-[4/3]", position: "0% 0%" },
    { aspect: "aspect-[4/5]", position: "100% 0%" },
    { aspect: "aspect-square", position: "0% 100%" },
    { aspect: "aspect-[16/10]", position: "100% 100%" },
  ];
  const [showSample, setShowSample] = useState(false);
  const [visibleSections, setVisibleSections] = useState(1);

  const sampleSections = [
    {
      title: "Client Request",
      content: (
        <>
          <p className="text-sm text-neutral-700">
            “King I need a logo for my brand and a revamp. Luxury, Highend my goal is to sell outside of Africa”
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
            — Amara O., CEO. Aalux Labs
          </p>
        </>
      ),
      images: [
        {
          src: "/home/client-req-home.png",
          alt: "Aaluxury Brand Presentation",
        },
      ],
    },
    {
      title: "Process",
      content: (
        <>
          <p className="text-sm text-neutral-700">
            “Our creative process dosent come first. Research does. It's the first process”
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
            — Abby. K, CCO, King Labs
          </p>
        </>
      ),
    },
    {
      title: "Problem",
      reverse: true,
      content: (
        <p className="text-sm text-neutral-700">
          Aalux Labs, a beginning luxury brand, sought a distinctive visual identity to penetrate the competitive global market. Their
          challenge was to create a logo and branding that conveyed luxury and sophistication while resonating with an international
          audience.
        </p>
      ),
      images: [
        {
          src: "/home/prob-king-sol.png",
          alt: "Aaluxury Intro Hero Mobile",
        },
      ],
    },
    {
      title: "King",
      content: (
        <p className="text-sm text-neutral-700">
          Our approach began with in-depth market research and brand strategy development. We crafted a logo that blends classic elegance
          with modern simplicity, utilizing a custom typeface and a refined color palette to embody the brand's high-end aspirations and
          global vision.
        </p>
      ),
    },
    {
      title: "Solution",
      content: (
        <p className="text-sm text-neutral-700">
          Based on the chosen moodboard, we developed a comprehensive brand identity system. This included the final logo design, a refined
          color palette, typography guidelines, and imagery standards, all carefully crafted to elevate Aalux Labs' presence in the luxury
          market and support their goal of global expansion.
        </p>
      ),
      images: [
        {
          src: "/home/aalux-bento.png",
          alt: "Aaluxury Brand Presentation",
        },
      ],
    },
    {
      title: "Others",
      content: (
        <p className="text-sm text-neutral-700">
          The brand asked for a more vibrant vibe and packaging for a wider audience which they decided to market as the norm while their
          luxury is kept for high end customers. So, we delivered.
        </p>
      ),
      images: [
        {
          src: "/home/alux-label.png",
          alt: "Other Project Image",
        },
      ],
    },
    {
      title: "Additional Visuals",
      content: (
        <p className="text-sm text-neutral-700">
          Supplemental imagery from the identity rollout to further illustrate the brand's visual direction.
        </p>
      ),
      stacked: true,
      images: [
        {
          src: "home/aalux-resu-in-sea.png",
          alt: "Aaluxury products in a seaside setting",
        },
        {
          src: "/home/aalux-body-img.png",
          alt: "Aaluxury Moodboard",
        },
        {
          src: "/home/alux-bento-vibe.png",
          alt: "Full width packaging image",
        },
      ],
    },
  ];

  const handleToggleSample = () => {
    setShowSample((prev) => {
      const next = !prev;
      if (!next) {
        setVisibleSections(1);
      }
      return next;
    });
  };

  const showNextSection = () => {
    setVisibleSections((prev) => Math.min(sampleSections.length, prev + 1));
  };

  const showPreviousSection = () => {
    setVisibleSections((prev) => Math.max(1, prev - 1));
  };

  const buildPricingContactUrl = (planName: string) => {
    const message = `Hi King, I'm interested in the ${planName} plan. I'd like to discuss pricing and next steps.`;
    return `/contact?plan=${encodeURIComponent(planName)}&message=${encodeURIComponent(message)}`;
  };

  // Mock data for the new ProjectInfoOverlay
  const mockProjectData: ProjectDetails = {
    client: "Aalux Labs",
    industry: "Luxury Beauty",
    location: "Lagos, Nigeria",
    our_role: "Full Brand Identity & Strategy",
    the_challenge: "Aalux Labs, a beginning luxury brand, sought a distinctive visual identity to penetrate the competitive global market. Their challenge was to create a logo and branding that conveyed luxury and sophistication while resonating with an international audience.",
    the_solution: "Our approach began with in-depth market research and brand strategy development. We crafted a logo that blends classic elegance with modern simplicity, utilizing a custom typeface and a refined color palette to embody the brand's high-end aspirations and global vision.",
    notes: { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Initial research focused on competitor analysis in the EU and US luxury cosmetics markets. Moodboard V2 was selected by the client for its emphasis on 'quiet luxury'." }] }] },
    is_notes_downloadable: true,
  };

  // Add scroll effect for DesignSelector
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        // Show the design selector when scrolled past the hero section
        setShowDesignSelector(window.scrollY > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="bg-[#f2f2f2] relative">
      <Helmet>
        <title>The Design Agency Defining the Future of African Culture | Branding, Design &amp; UI/UX</title>
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

      <div ref={heroRef}>
        <Hero />
      </div>

      {/* Floating Project Info Overlay */}
      {/* Floating Design Selector */}
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ${showDesignSelector ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
        <DesignSelector />
      </div>

      <section className="px-4 py-12 md:py-16 bg-[#f2f2f2]">
        <div className="container mx-auto">
          <div className="hidden md:block w-full h-24 relative overflow-hidden mb-12 max-w-5xl mx-auto opacity-95">
            <img
              src={brandsWorkedWith}
              alt="Brands we have worked with"
              className="absolute bottom-0 left-0 w-full h-auto"
            />
          </div>
          <h2 className="font-display normal-case text-4xl md:text-6xl font-medium tracking-tight mb-8">
            Featured <em className="italic">projects</em>
          </h2>
          <div
            ref={scrollRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 lg:gap-12 overflow-x-auto md:overflow-visible pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory md:snap-none items-start"
          >
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
                title: "New Identity, New Logo",
                tag: "Fragrance & Beauty",
                to: "/portfolio/new-identity,-new-logo-(brand-logo)",
                cover: "https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/1vmg5mladruh.jpg",
              },
            ].map((item, i) => (
              <article
                key={i}
                className="min-w-[80vw] md:min-w-0 snap-center md:snap-align-none group h-full transition-transform duration-300 ease-out md:hover:-translate-y-2"
              >
                <a
                  href={(item as any).to ?? undefined}
                  className="block h-full"
                  aria-label={`Open project ${item.title}`}
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-200 transition-shadow duration-300 group-hover:shadow-xl">
                    {(item as any).cover ? (
                      <img
                        src={(item as any).cover}
                        alt={`${item.title} cover`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                  <p className="text-xs uppercase tracking-wide text-neutral-500">{item.tag}</p>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PortfolioShowcase />

      {/* Case Studies Spotlight */}
      <section className="px-4 py-12 md:py-16 bg-[#f2f2f2]">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <h2 className="font-display normal-case text-4xl md:text-6xl font-medium tracking-[-0.04em]">
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
          <h2 className="font-display normal-case text-4xl md:text-6xl font-medium tracking-[-0.02em] mb-10">
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
              <Button asChild variant="gold" className="w-full">
                <a href={buildPricingContactUrl("Starter")}>Request Pricing</a>
              </Button>
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
              <Button asChild variant="gold" className="w-full">
                <a href={buildPricingContactUrl("Growth")}>Request Pricing</a>
              </Button>
            </div>
            <div className="border border-black/10 rounded-xl p-6 bg-white/70 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
              <p className="text-sm text-muted-foreground mb-4">For established teams and product suites.</p>
              <ul className="text-sm text-neutral-700 space-y-2 mb-6">
                <li>• Brand Architecture</li>
                <li>• Multi-Channel Rollout</li>
                <li>• Ongoing Creative Support</li>
              </ul>
              <Button asChild variant="gold" className="w-full">
                <a href={buildPricingContactUrl("Enterprise")}>Request Pricing</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Open Letter to business owners */}
      <section className="px-4 py-16 md:py-24 bg-[#f2f2f2]">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <h2 className="font-display normal-case text-4xl md:text-6xl font-medium tracking-[-0.02em]">A letter to <em className="italic">founders</em> & builders</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-base md:text-lg text-neutral-800 leading-relaxed mb-6">
              You don’t just need a logo—you need a brand that moves people. A brand that makes decisions easier, prices higher, and growth faster. That’s why we build systems, not trends. Systems that carry your story and make your customers the <em className="italic">hero</em>.
            </p>
            <p className="text-base md:text-lg text-neutral-800 leading-relaxed mb-6">
              We work in tight sprints with honest feedback loops. You’ll see progress quickly, test it with real users, and get a brand that feels inevitable. If you’re ready to build what lasts, we’re ready to crown the next king.
            </p>
            <img
              src="https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/King-Crowns-Brands.png"
              alt="King Crowns branding collage"
              className="w-full rounded object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Luxury color billboard with Playfair headline */}
      <section className="relative bg-[#1b1917] text-white overflow-hidden py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-10">
          <div className="space-y-6">
            <h2 className="font-display normal-case text-5xl md:text-7xl font-medium leading-tight tracking-[-0.025em] max-w-5xl">
              Design that turns <em className="italic">ambition</em> into <em className="italic">authority</em>.
            </h2>
            <p className="max-w-2xl text-white/80">
              For founders, operators, and creators building brands that last. Strategy-first, execution-obsessed.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {ambitionCardImages.map(({ src, alt, aspect, fit }, index) => (
              <div
                key={index}
                className={`${aspect ?? "aspect-[1350/1920]"} w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 md:max-h-[420px] transition-transform duration-500 ease-out hover:-translate-y-2 hover:scale-[1.03] flex items-center justify-center`}
              >
                <img
                  src={src}
                  alt={alt}
                  className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <img
          src="https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/Nature-is-art.png"
          alt="Nature-inspired art collage"
          className="w-full h-auto"
          loading="lazy"
        />
      </section>

      {/* Centered image with creative text layout around */}
      <section className="px-4 pt-28 md:pt-36 pb-0 bg-[#394223] text-white overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 order-2 md:order-1">
            <h3 className="font-display normal-case text-4xl md:text-6xl tracking-[-0.02em] leading-tight">
              Make your <em className="italic">customer</em> the hero.
            </h3>
            <p className="mt-4 text-white/85">We build brands around the journeys your users actually take—then design every touchpoint to feel inevitable.</p>
          </div>
          <div className="md:col-span-4 order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#394223] via-[#394223]/80 to-transparent" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#394223] via-[#394223]/80 to-transparent" aria-hidden="true" />
              <div className="flex animate-marquee gap-6">
                {portraitStripPlaceholders.concat(portraitStripPlaceholders).map((_, index) => (
                  <div
                    key={index}
                    className="group relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm transition-transform duration-500 ease-out hover:-translate-y-1 hover:scale-[1.05] sm:w-32 md:w-36 lg:w-40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" aria-hidden="true" />
                    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 px-5">
                      <span className="block h-16 w-16 rounded-full bg-white/20" aria-hidden="true" />
                      <span className="block h-3 w-3/4 rounded-full bg-white/25" aria-hidden="true" />
                      <span className="block h-3 w-2/3 rounded-full bg-white/15" aria-hidden="true" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-4 order-3">
            <p className="text-white/85">From the first impression to the final click: identity, web, content, and launch—delivered with craftsmanship and speed.</p>
          </div>
        </div>
        <div className="mt-16 w-full px-0">
          <img
            src="https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/make%20them%20the%20hero.gif"
            alt="Make them the hero animated collage"
            className="block w-full h-auto"
            loading="lazy"
          />
        </div>
      </section>

      {/* Process-inspired immersive sections */}
      {/* Market Research – light on dark with right-aligned image */}
      <section className="relative min-h-screen bg-[#1b1917] text-white flex items-center overflow-hidden py-20 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-6">
            <h2 className="font-display normal-case text-4xl md:text-6xl tracking-[-0.025em] leading-tight mb-6">
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
          <div className="md:col-span-6 flex justify-center items-start">
            <img
              src="https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/king%20books.png"
              alt="Market research books and strategy materials"
              className="w-full max-w-2xl aspect-[3/2] rounded-xl border border-white/10 object-cover transition-transform duration-500 ease-out hover:-translate-y-3 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Visual Identity – deep green with centered image */}
      <section className="min-h-screen bg-[#0f3d2e] text-white flex items-center py-20 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-4">
            <h2 className="font-display normal-case text-4xl md:text-6xl tracking-[-0.02em] leading-tight mb-6">Visual <em className="italic">Identity</em></h2>
            <p className="text-white/85">Logo systems, typography, color, and art direction crafted for longevity and clarity.</p>
          </div>
          <div className="md:col-span-4 flex justify-center items-start">
            <img
              src="https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/Positioning-1.png"
              alt="Visual identity showcase"
              className="w-full max-w-xl aspect-[4/5] rounded-xl object-cover transition-transform duration-500 ease-out hover:-translate-y-3 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <div className="md:col-span-4">
            <p className="text-white/80">From symbol to motion identity—built modularly, documented thoroughly, and ready to scale.</p>
          </div>
        </div>
      </section>

      {/* Positioning – cream band with bold/regular mix and mosaic placeholders */}
      <section className="min-h-screen bg-[#f4efe9] text-[#1b1917] flex items-center py-20 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-100/5 p-4">
              <div className="relative grid grid-cols-2 gap-3">
                {positioningPreviewTiles.map(({ aspect, position }, index) => (
                  <div
                    key={index}
                    className={`group relative ${aspect} overflow-hidden rounded-xl transition-transform duration-500 ease-out hover:-translate-y-2 hover:scale-[1.04]`}
                  >
                    <img
                      src="https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/Positioning-4.png"
                      alt="Positioning detail preview"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: position }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-7 order-1 md:order-2">
            <h2 className="font-display normal-case text-4xl md:text-6xl tracking-[-0.025em] leading-tight mb-4">
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
      <section className="min-h-screen bg-[#131313] text-white flex items-center py-20 md:py-24">
        <div className="container mx-auto px-4 text-center flex flex-col items-center justify-start">
          <h2 className="font-display normal-case text-5xl md:text-7xl tracking-[-0.03em] leading-tight mb-6">
            The <span className="italic">Narrative</span> Spine
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto mb-10">
            Your brand’s core story architecture—built from pillars, proof points, and a message matrix that scales from landing page to investor deck.
          </p>
          <img
            src="https://hnuwgbalqqgnxtajjywh.supabase.co/storage/v1/object/public/portfolio-assets/king-creativity-book-launch.png"
            alt="King creativity book launch spread"
            className="mx-auto w-full max-w-4xl h-auto rounded-xl border border-white/10 transition-transform duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </section>

      {/* See Our Process */}
      <section className="py-16 px-4 bg-[#f2f2f2]">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3">
            <h2 className="font-display normal-case text-2xl md:text-4xl font-medium">See Our Process</h2>
            <CornerRightDown className="w-12 h-12 md:w-16 md:h-16" style={{ color: '#16181d', transform: 'translateY(18px)' }} />
          </div>
        </div>
      </section>

      {/* Process Tabs */}
      <ProcessTabs />

      {/* Sample brand identity */}
      <section className="py-16 px-4 bg-[#f2f2f2]">
        <div className="container mx-auto max-w-6xl">
          <button
            type="button"
            onClick={handleToggleSample}
            className="flex w-full items-center justify-between rounded-full bg-[#f2f2f2] px-6 py-4 text-left transition"
            aria-expanded={showSample}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-800">See sample brand identity</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showSample ? "rotate-180" : ""}`} />
          </button>

          {showSample && (
            <div className="mt-8 space-y-8">
              {sampleSections.slice(0, visibleSections).map((section, index) => {
                const isLastVisible = index === visibleSections - 1;
                const canShowMore = isLastVisible && visibleSections < sampleSections.length;
                const canShowLess = isLastVisible && visibleSections > 1;

                return (
                  <article
                    key={section.title}
                    className="rounded-3xl bg-[#f2f2f2] p-6 md:p-10"
                  >
                    <div
                      className={`grid grid-cols-1 gap-6 md:gap-10 ${section.stacked ? "" : "md:grid-cols-2 md:items-center"
                        }`}
                    >
                      <div className={section.reverse ? "order-2 md:order-1" : "order-1"}>
                        <h3 className="font-display text-3xl md:text-4xl font-medium normal-case mb-4">{section.title}</h3>
                        <div className="leading-relaxed text-neutral-700 space-y-4 text-sm">
                          {section.content}
                        </div>
                      </div>

                      {section.images && section.images.length > 0 && (
                        section.stacked ? (
                          <div className="order-2 flex flex-col gap-4">
                            {section.images.map((image) => (
                              <img
                                key={image.src}
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-auto rounded-2xl object-contain"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className={`${section.reverse ? "order-1 md:order-2" : "order-2"} flex justify-center`}>
                            <img
                              src={section.images[0].src}
                              alt={section.images[0].alt}
                              className="w-full h-auto rounded-2xl object-contain"
                            />
                          </div>
                        )
                      )}
                    </div>

                    {(canShowMore || canShowLess) && (
                      <div className="mt-6 flex items-center justify-between">
                        {canShowLess ? (
                          <Button variant="ghost" className="px-0 text-sm font-semibold" onClick={showPreviousSection}>
                            See less
                          </Button>
                        ) : <span />}

                        {canShowMore ? (
                          <Button variant="ghost" className="px-0 text-sm font-semibold" onClick={showNextSection}>
                            See next
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </article>
                );
              })}

              {visibleSections === sampleSections.length && (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    className="rounded-full px-6"
                    onClick={() => setVisibleSections(1)}
                  >
                    Reset sections
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-0 text-sm font-semibold"
                    onClick={handleToggleSample}
                  >
                    Hide sample
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
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
              className={`h-2.5 w-2.5 rounded-full ${index === currentIndex ? "bg-neutral-900" : "bg-neutral-300"
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
