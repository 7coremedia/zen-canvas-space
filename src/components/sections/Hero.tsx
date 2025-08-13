import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/hero-king.jpg";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Helmet>
        <title>KING – Branding & Creative Portfolio</title>
        <meta name="description" content="Crafting brands that command attention. Explore work, services, and start your brand journey with KING." />
        <link rel="canonical" href="/" />
      </Helmet>
      <div className="relative mx-auto max-w-7xl">
        <div className="relative h-[60vh] min-h-[420px] w-full rounded-xl border bg-card">
          <img
            src={heroImage}
            alt="Premium white and gold abstract hero background for KING portfolio"
            loading="eager"
            className="absolute inset-0 h-full w-full rounded-xl object-cover"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/70 via-background/30 to-transparent" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight animate-fade-in">
              Crafting Brands That Command Attention
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground animate-fade-in">
              From identity to impact—see how I turn ideas into unforgettable brands.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-enter">
              <NavLink to="/portfolio"><Button variant="premium" size="lg">View My Work</Button></NavLink>
              <NavLink to="/onboarding"><Button variant="hero" size="lg">Start Your Brand Journey</Button></NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
