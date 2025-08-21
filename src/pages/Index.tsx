import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import Testimonials from "@/components/sections/Testimonials";

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

      {/* Existing CTA buttons */}
      <section className="py-16 px-4 bg-[#f2f2f2]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
          {/* Left Column: All Text */}
          <div className="flex flex-col justify-between h-full">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold mb-4 font-display">CLIENT REQUEST</h2>
              <p className="text-sm text-muted-foreground mb-4">
                “King I need a logo for my brand and a revamp. Luxury, Highend my goal is to sell outside of Africa”
                <br />— Amara O., CEO. Aalux Labs
              </p>
            </div>

            <div className="hidden md:block max-w-md">
              <h2 className="text-4xl font-bold font-display mb-2">PROCESS</h2>
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
            <h2 className="text-4xl font-bold font-display mb-2">PROCESS</h2>
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
          <h2 className="text-4xl font-bold mb-4 font-display">PROBLEM</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Aalux Labs, a beginning luxury brand, sought a distinctive visual identity to penetrate the competitive global market. Their challenge was to create a logo and branding that conveyed luxury and sophistication while resonating with an international audience.
          </p>
          <h2 className="text-4xl font-bold mb-4 font-display">KING</h2>
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
            <h2 className="text-4xl font-bold mb-4 font-display">SOLUTION</h2>
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
    <h2 className="text-4xl font-bold mb-4 font-display">OTHERS</h2>
    <p className="text-sm text-muted-foreground">The brand asked fora
more vibrant vibe and
packaging for a wider audience
which they decided to market as
the norm while their luxury
is kept for high end customers.
So, we delivered. </p>
  </div>
  {/* Right Column: Image */}
  <img src="/home/alux-label.png" alt="Other Project Image" />
    </section>

      <section className="py-15 py-4 px-4 bg-[#f2f2f2]">
        <img src="/home/alux-bento-vibe.png" alt="Full width image" className="w-full h-auto" />
      </section>
    </main>
  );
};
export default Index;
