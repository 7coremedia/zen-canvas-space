import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import heroImageDesktop from "@/assets/king-comes-for-his-crown.webp";
import heroImageMobile from "@/assets/the-crown-is-his-mobile.webp";

import heroImageMuseum from "@/assets/hero-image-museum.webp";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";


const rotatingTerms = [
  "Brand",
  "UI/UX",
  "Ads",
  "Music",
  "Film"
];

const ctaOptions = [
  { label: "Commission Contract", to: "/contracts" },
  { label: "Partnership", to: "/jobs" },
  { label: "Jobs", to: "/jobs" },
  { label: "About", to: "/about" },
];

export default function Hero() {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeInTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ctaIndex, setCtaIndex] = useState(0);
  const [isCtaTransitioning, setIsCtaTransitioning] = useState(false);
  const ctaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ctaFadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ctaFadeInTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contractButtonRef = useRef<HTMLButtonElement | null>(null);
  const contractLabelRef = useRef<HTMLSpanElement | null>(null);
  const [ctaWidth, setCtaWidth] = useState<number | null>(null);

  useEffect(() => {
    const triggerTransition = () => {
      setIsTransitioning(true);
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);
      if (fadeInTimeoutRef.current) clearTimeout(fadeInTimeoutRef.current);

      fadeOutTimeoutRef.current = setTimeout(() => {
        setActiveWordIndex((prev) => (prev + 1) % rotatingTerms.length);
      }, 220);

      fadeInTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 620);
    };

    intervalRef.current = setInterval(triggerTransition, 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);
      if (fadeInTimeoutRef.current) clearTimeout(fadeInTimeoutRef.current);
    };
  }, []);

  const activeWord = rotatingTerms[activeWordIndex];
  const activeCta = ctaOptions[ctaIndex];

  const headlineLines = [
    (
      <>
        <span className="font-normal">We</span>{" "}
        <span className="font-normal">are</span>{" "}
        <span className="font-bold">Africa’s</span>
      </>
    ),
    (
      <>
        <span className="font-bold italic">Largest</span>{" "}
        <span
          key={activeWord}
          className={`rotating-word italic font-normal inline-block transition-all duration-600 ease-out ${isTransitioning ? "opacity-0 translate-y-3 blur-[2px]" : "opacity-100 translate-y-0 blur-0 rotating-word-active"
            }`}
        >
          {activeWord}
        </span>
      </>
    ),
    (
      <>
        <span className="italic font-normal">Design</span>{" "}
        <span className="font-normal">Agency</span>
      </>
    )
  ];

  useEffect(() => {
    const triggerCtaTransition = () => {
      setIsCtaTransitioning(true);
      if (ctaFadeOutTimeoutRef.current) clearTimeout(ctaFadeOutTimeoutRef.current);
      if (ctaFadeInTimeoutRef.current) clearTimeout(ctaFadeInTimeoutRef.current);

      ctaFadeOutTimeoutRef.current = setTimeout(() => {
        setCtaIndex((prev) => (prev + 1) % ctaOptions.length);
      }, 220);

      ctaFadeInTimeoutRef.current = setTimeout(() => {
        setIsCtaTransitioning(false);
      }, 620);
    };

    ctaIntervalRef.current = setInterval(triggerCtaTransition, 30000);

    return () => {
      if (ctaIntervalRef.current) clearInterval(ctaIntervalRef.current);
      if (ctaFadeOutTimeoutRef.current) clearTimeout(ctaFadeOutTimeoutRef.current);
      if (ctaFadeInTimeoutRef.current) clearTimeout(ctaFadeInTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (!contractButtonRef.current || !contractLabelRef.current) {
        setCtaWidth(null);
        return;
      }

      const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches;
      if (!isDesktop) {
        setCtaWidth(null);
        return;
      }

      const labelWidth = contractLabelRef.current.scrollWidth;
      const computedStyle = getComputedStyle(contractButtonRef.current);
      const paddingLeft = parseFloat(computedStyle.paddingLeft || "0");
      const paddingRight = parseFloat(computedStyle.paddingRight || "0");
      const horizontalPadding = paddingLeft + paddingRight;
      setCtaWidth(labelWidth + horizontalPadding);
    };

    requestAnimationFrame(updateWidth);
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [ctaIndex]);

  return (
    <section className="relative h-[100svh] min-h-[520px] sm:min-h-[620px] w-full overflow-hidden">
      <Helmet>
        <title>The Design Agency Defining the Future of African Culture | Branding, Design &amp; UI/UX</title>
        <meta name="description" content="Crafting brands that command attention. Explore work, services, and start your brand journey with KING." />
        <link rel="canonical" href="/" />
      </Helmet>

      {/* Background Image */}
      <picture className="absolute inset-0 h-full w-full pointer-events-none">
        <source media="(max-width: 767px)" srcSet={heroImageMobile} />
        <img
          src={heroImageDesktop}
          alt="KING hero background"
          loading="eager"
          className="h-full w-full object-cover pointer-events-none"
        />
      </picture>

      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-start justify-center px-6 pt-40 md:pt-48 pointer-events-none">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start text-left text-black gap-10 pointer-events-auto lg:flex-row lg:items-end lg:justify-between">
          <div className="flex w-full flex-col items-start gap-12 sm:gap-10">
            <h1 className="home-hero-headline leading-[1.05] tracking-[-0.06em] text-[13.5vw] sm:text-[40px] md:text-[48px] lg:text-[56px]">
              {headlineLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="flex flex-col gap-1.5 text-left font-sans text-[13px] text-black/70 sm:text-sm md:text-base max-w-md">
              <p className="leading-relaxed">
                Brands. Websites. Apps. Movies. Books. Fashion. Commercials. Music. Advertisements.
              </p>
              <p className="leading-relaxed">
                We are Africa’s largest and most collaborative design agency shaping creativity for it all.
              </p>
              <p className="leading-snug text-black/80">
                We are <span className="font-bold">Africa’s Cultural DNA</span> in art form.
              </p>
            </div>

            <div className="flex w-full flex-row flex-wrap items-center gap-3 sm:gap-4">
              <NavLink to="/contact" className="flex-1 min-w-[150px] sm:min-w-0 sm:w-auto">
                <Button
                  size="default"
                  className="w-full px-5 py-3 text-sm font-semibold text-black bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Contact KING
                </Button>
              </NavLink>
              <NavLink to={activeCta.to} className="flex-1 min-w-[150px] sm:min-w-0 sm:w-auto">
                <Button
                  variant="outline"
                  size="default"
                  ref={contractButtonRef}
                  style={ctaWidth ? { width: `${ctaWidth}px`, transition: "width 0.4s ease" } : undefined}
                  className="w-full border-black/20 bg-white/80 px-5 py-3 text-sm font-semibold text-black hover:bg-black/5 transition-all duration-300"
                >
                  <span
                    ref={contractLabelRef}
                    key={activeCta.label}
                    className={`inline-block transition-all duration-600 ease-out ${isCtaTransitioning ? "opacity-0 translate-y-2 blur-[2px]" : "opacity-100 translate-y-0 blur-0"
                      }`}
                  >
                    {activeCta.label}
                  </span>
                </Button>
              </NavLink>
            </div>


          </div>

          <div className="relative hidden w-full max-w-md lg:block">
            <div className="relative h-[360px] overflow-hidden rounded-[32px] bg-black/5 backdrop-blur-sm transition-transform duration-300 lg:-translate-y-16">
              <img
                src={heroImageMuseum}
                alt="Gallery installation"
                className="h-full w-full object-cover origin-center scale-[1.6]"
                loading="eager"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
