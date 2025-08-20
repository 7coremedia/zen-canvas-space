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
      {/* The header content has been moved into PortfolioGrid for the Behance-inspired layout. */}
      <PortfolioGrid />
      <Cta />
    </main>
  );
}
