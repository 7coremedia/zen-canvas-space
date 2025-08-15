import { Helmet } from "react-helmet-async";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import Cta from "@/components/sections/Cta";

export default function Portfolio() {
  return (
    <main className="pb-16">
      <Helmet>
        <title>Portfolio – KING</title>
        <meta name="description" content="Branding, logo design, and creative projects by KING." />
        <link rel="canonical" href="/portfolio" />
      </Helmet>
      <header className="container mx-auto py-12">
        <h1 className="font-display text-4xl">Portfolio</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Categorized work across Branding, Logos, Graphic Design, Marketing Materials, and Special Projects.</p>
      </header>
      <PortfolioGrid />
      <Cta />
    </main>
  );
}
