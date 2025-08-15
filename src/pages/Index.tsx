import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import CategoryStrip from "@/components/sections/CategoryStrip";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";

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
      
    </main>
  );
};

export default Index;