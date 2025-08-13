import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import CategoryStrip from "@/components/sections/CategoryStrip";
import Testimonials from "@/components/sections/Testimonials";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

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
      <section className="container mx-auto py-16">
        <div className="rounded-xl border bg-card p-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl">Ready to build a brand with gravity?</h2>
          <p className="mt-2 text-muted-foreground">Let’s turn your vision into a decisive identity.</p>
          <div className="mt-6">
            <NavLink to="/onboarding"><Button variant="premium" size="lg">Work With Me</Button></NavLink>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
