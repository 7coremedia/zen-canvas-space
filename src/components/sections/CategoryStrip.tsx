import { Link } from "react-router-dom";
import brandingSvg from "@/assets/b-for-branding.svg";
import logoSvg from "@/assets/oo-in-logo.svg";
import marketingSvg from "@/assets/m-in-marketing.svg";

export default function CategoryStrip() {
  return (
    <section className="w-full select-none px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12">
      <h2 className="mb-4 font-display text-xl md:text-2xl">SERVICES</h2>
      <div className="grid grid-cols-3 items-center gap-3 sm:gap-4 md:gap-6">
        <Link to="/browse/branding" aria-label="Explore Branding">
          <img
            src={brandingSvg}
            alt="Branding"
            className="h-auto w-full max-w-full select-none"
            draggable={false}
          />
        </Link>
        <Link to="/browse/logo" aria-label="Explore Logos">
          <img
            src={logoSvg}
            alt="Logo"
            className="h-auto w-full max-w-full select-none"
            draggable={false}
          />
        </Link>
        <Link to="/browse/marketing" aria-label="Explore Media & Marketing">
          <img
            src={marketingSvg}
            alt="Media & Marketing"
            className="h-auto w-full max-w-full select-none"
            draggable={false}
          />
        </Link>
      </div>
    </section>
  );
}

