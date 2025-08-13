import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/hero-king.jpg";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Briefcase } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <Helmet>
        <title>KING – Branding & Creative Portfolio</title>
        <meta name="description" content="Crafting brands that command attention. Explore work, services, and start your brand journey with KING." />
        <link rel="canonical" href="/" />
      </Helmet>
      <img
        src={heroImage}
        alt="KING hero background"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Bottom CTA buttons (white text per design) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex items-center justify-center px-6 text-white">
        <div className="pointer-events-auto mx-auto flex w-full max-w-xl items-center justify-center gap-4">
          <NavLink to="/onboarding">
            <Button variant="gold" className="px-6 py-4 text-sm">Start My Brand</Button>
          </NavLink>

          <NavLink to="/portfolio">
            <Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
              My Portfolio <Briefcase className="ml-2" />
            </Button>
          </NavLink>
        </div>
      </div>
    </section>
  );
}
