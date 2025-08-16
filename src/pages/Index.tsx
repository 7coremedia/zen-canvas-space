import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import CategoryStrip from "@/components/sections/CategoryStrip";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";
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
const Index = () => {
  return (
    <main>
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
            sameAs: [
              "https://instagram.com/",
              "https://www.linkedin.com/"
            ]
          })}
        </script>
      </Helmet>

      <Hero />
      <CategoryStrip />
      <Testimonials />
      <Cta />
      <FullScreenImage imageSrc={aaluxuryBrandPres} />

      <section className="py-16 px-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Client Request */}
        <div>
          <h2 className="text-4xl font-bold mb-4 font-display">CLIENT REQUEST</h2>
          <p className="text-sm text-muted-foreground mb-4">
            “King I need a logo for my brand and a revamp. Luxury, Highend my goal is to sell outside of Africa”
            <br />— Amara O., CEO. Aalux Labs
          </p>
           {/* Process */}
           <div className="mt-11"> {/* Adjust spacing as needed */}
              <h2 className="text-4xl font-bold font-display">PROCESS</h2>
              <p className="text-sm text-muted-foreground mb-4">
                “Our creative process dosent come first. Research does. It's the first process”
                <br />— Abby. K, CCO, King Labs
              </p>
            </div>
        </div>
        <div className="flex flex-col items-center">
          <img src={aaluxuryBrandingPresentationHero} alt="Aaluxury Brand Presentation" className="max-w-full h-auto rounded-lg shadow-lg mb-4" />
        </div>
      </section>

      <section className="py-16 px-4 relative">
        <div className="container mx-auto flex flex-col items-center">
          {/* Large Image at the top */}
          <img src={aaluxuryFull} alt="Aaluxury Full Logo" className="w-full max-w-3xl mb-8" />

          {/* Card with Form-like Structure */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative z-10 -mt-20"> {/* Adjust -mt- value for overlap */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Top Competitor 1</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Name or URL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Top Competitor 2</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Name or URL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Top Competitor 3</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Name or URL" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">What do you like about their branding?</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" rows={2} placeholder="Strengths to learn from"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">What do you dislike about their branding?</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" rows={2} placeholder="Gaps to exploit"></textarea>
            </div>
            <div className="flex justify-between mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Back
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                Next
              </button>
            </div>
          </div>

          {/* Text on the sides */}
          <div className="grid grid-cols-2 gap-8 w-full mt-8">
            <div className="text-left text-muted-foreground text-sm">RESEARCH MEETS CREATIVE THINKING</div>
            <div className="text-right text-muted-foreground text-sm">THE RESULTS ARE IN THE RESEARCH</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Image */}
        <div>
          <img src={aaluxuryIntroHeroMobile} alt="Aaluxury Intro Hero Mobile" className="max-w-full h-auto rounded-lg shadow-lg" />
        </div>
        {/* Right Column: Headings and Text */}
        <div>
          <h2 className="text-4xl font-bold mb-4 font-display">PROBLEM</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Aalux Labs, a burgeoning luxury brand, sought a distinctive visual identity to penetrate the competitive global market. Their challenge was to create a logo and branding that conveyed luxury and sophistication while resonating with an international audience.
          </p>
          <h2 className="text-4xl font-bold mb-4 font-display">KING</h2>
          <p className="text-sm text-muted-foreground">
            Our approach began with in-depth market research and brand strategy development. We crafted a logo that blends classic elegance with modern simplicity, utilizing a custom typeface and a refined color palette to embody the brand's high-end aspirations and global vision.
          </p>
        </div>
      </section>

      <section className="py-16">
        <img src={aaluxuryMoodboard} alt="Aaluxury Moodboard" className="w-full h-auto" />
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4 font-display">SOLUTION</h2>
            <p className="text-sm text-muted-foreground">
              Based on the chosen moodboard, we developed a comprehensive brand identity system. This included the final logo design, a refined color palette, typography guidelines, and imagery standards, all carefully crafted to elevate Aalux Labs' presence in the luxury market and support their goal of global expansion.
            </p>
          </div>
          <div className="w-full flex justify-center">
            <img
              src={heroKingJpg}
              alt="Aaluxury Brand Presentation"
              className="w-full max-w-4xl h-auto object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Text */}
        <div>
          <h2 className="text-4xl font-bold mb-4 font-display">OTHERS</h2>
          <p className="text-sm text-muted-foreground">
           Content about other projects or aspects can go here.
          </p>
        </div>
        {/* Right Column: Image */}
        <div>
          <img src="/src/assets/portfolio-1.jpg" alt="Other Project Image" className="max-w-full h-auto rounded-lg shadow-lg" />
        </div>
      </section>

      <section className="py-16">
        <img src="/src/assets/portfolio-2.jpg" alt="Full width image" className="w-full h-auto" />
      </section>

      {/* Ready to build section */}
 <section className="py-16 px-4">
 <div className="container mx-auto flex justify-center">
 <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center max-w-2xl">
 <h2 className="text-4xl font-bold mb-4 font-display">READY TO BUILD A BRAND WITH GRAVITY?</h2>
 <p className="text-sm text-muted-foreground mb-8">
              Let's turn your vision into a decisive identity.
 </p>
 <div className="flex justify-center space-x-4">
 <Button variant="outline" className="px-6 py-3 text-lg">
                My Portfolio
 </Button>
 <Button variant="default" className="px-6 py-3 text-lg bg-black text-white hover:bg-gray-800">
                Start My Brand
 </Button>
 </div>
 </div>
 </div>
 </section>

    </main>
  );
};

export default Index;