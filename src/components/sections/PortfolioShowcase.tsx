import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePublicPortfolio } from "@/hooks/usePublicPortfolio";

const DEFAULT_PORTFOLIO_TITLE = "Logos That are destined to work!";

export default function PortfolioShowcase() {
  const { data: portfolioItems, isLoading } = usePublicPortfolio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!portfolioItems?.length || hasInitialized) return;

    const defaultIndex = portfolioItems.findIndex((item) =>
      item.title?.trim().toLowerCase() === DEFAULT_PORTFOLIO_TITLE.toLowerCase()
    );

    setCurrentIndex(defaultIndex >= 0 ? defaultIndex : 0);
    setHasInitialized(true);
  }, [portfolioItems, hasInitialized]);

  if (isLoading) {
    return (
      <section className="relative min-h-screen w-full bg-[#f2f2f2] flex items-center justify-center">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
          Loading portfolio showcase…
        </p>
      </section>
    );
  }

  if (!portfolioItems?.length) {
    return null;
  }

  const activeItem = portfolioItems[currentIndex];

  const goTo = (index: number) => {
    const total = portfolioItems.length;
    const normalized = ((index % total) + total) % total;
    setCurrentIndex(normalized);
  };

  return (
    <section className="group relative min-h-[65vh] sm:min-h-[75vh] md:min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {portfolioItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== currentIndex}
          >
            <img
              src={item.cover_url}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-[65vh] sm:min-h-[75vh] md:min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-5">
        <span className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
          We design
        </span>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-md border border-white/20 bg-black/20 px-5 py-2 text-sm font-display tracking-tight text-white/90 backdrop-blur-sm md:text-base">
            {activeItem?.category || "Brand experiences"}
          </span>
          <span className="rounded-md border border-white/20 bg-black/20 px-5 py-2 text-sm font-display tracking-tight text-white/90 backdrop-blur-sm md:text-base">
            for {activeItem?.client || "visionary brands"}
          </span>
        </div>

        <div className="mt-8 sm:mt-10 flex items-center gap-3 sm:gap-4 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => goTo(currentIndex - 1)}
            className="rounded-full border border-white/40 bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            className="rounded-full border border-white/40 bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Next project"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:gap-3 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        {portfolioItems.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-6 md:left-10 z-10 max-w-xs text-left">
        <div className="rounded-md border border-white/20 bg-black/25 px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm">
          <p className="font-display text-[0.625rem] uppercase tracking-[0.25em] text-white/70">
            {activeItem?.title || "Featured Project"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/80">
            {activeItem?.tagline ||
              "Strategy-led, design-driven work. Tailored systems that move audiences and accelerate growth."}
          </p>
        </div>
      </div>
    </section>
  );
}
