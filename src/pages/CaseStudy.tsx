import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { caseStudies } from "@/data/caseStudies";

// Replaceable hero + content images (use any luxury photography)
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop";
const SUPPORT_IMAGE =
  "https://images.unsplash.com/photo-1516054719048-38394d4a9a5a?q=80&w=1600&auto=format&fit=crop";
const RESEARCH_IMAGE =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2000&auto=format&fit=crop";
const PROCESS_IMAGE =
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=2000&auto=format&fit=crop";
const FINAL_A =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2000&auto=format&fit=crop";
const FINAL_B =
  "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2000&auto=format&fit=crop";
const FINAL_C =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2000&auto=format&fit=crop";

// Optional: light mock map to make title/meta feel “connected” by slug
const CASE_META: Record<
  string,
  { title: string; client: string; role: string; year: string }
> = {
  "aaluxury-identity": {
    title: "AA Luxury – Identity System",
    client: "AA Luxury",
    role: "Branding",
    year: "2024",
  },
  "royal-monogram": {
    title: "Royal Monogram Exploration",
    client: "Monarch Atelier",
    role: "Logo",
    year: "2023",
  },
  "atelier-campaign-ss24": {
    title: "Atelier SS24 Campaign",
    client: "Atelier No. 9",
    role: "Marketing",
    year: "2024",
  },
};

export default function CaseStudy() {
  const { slug } = useParams();
  const study = caseStudies.find((c) => c.slug === slug);
  const isAALuxury = slug === "aaluxury-identity";
  const meta = study
    ? {
        title: study.title,
        client: study.client ?? "",
        role: study.category,
        year: study.year,
      }
    : (slug && CASE_META[slug]) || {
        title: "Signature Identity Collection",
        client: "Maison d’Or",
        role: "Branding",
        year: "2024",
      };

  return (
    <>
      <Helmet>
        <title>{meta.title} – KING</title>
        <meta
          name="description"
          content={`${meta.title} for ${meta.client} – a refined case study by KING.`}
        />
        <link rel="canonical" href={`/portfolio/${slug ?? "case"}`} />
      </Helmet>

      {/* Hero */}
      <section className={isAALuxury ? "relative h-screen w-full" : "relative h-[70vh] w-full"}>
        <img
          src={study?.cover || HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.onerror = null;
            t.src = "https://placehold.co/2000x1200";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-4 pb-12 md:pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.6, 0.05, -0.01, 0.9] }}
              className="font-display font-medium text-4xl md:text-5xl lg:text-6xl tracking-tight text-white"
            >
              {meta.title}
            </motion.h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs uppercase tracking-wider text-black">
                {meta.client}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs uppercase tracking-wider text-gray-700">
                {meta.role}
              </span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs uppercase tracking-wider text-gray-700">
                {meta.year}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* Overview */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl tracking-tight uppercase mb-10">
              Project Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="font-display font-medium text-2xl md:text-3xl uppercase tracking-tight mb-4">
                  The Challenge
                </h3>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  Establish a timeless identity across print and digital without
                  sacrificing purity. The goal was a signature system capable of
                  scaling from boutique packaging to large-format campaigns.
                </p>
                <h3 className="font-display font-medium text-2xl md:text-3xl uppercase tracking-tight mb-4">
                  The Solution
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  We engineered a modular typographic suite, a calibrated grid,
                  and a restrained palette—delivering a luxurious, flexible
                  system that amplifies brand equity across every touchpoint.
                </p>
              </div>
              <div className={isAALuxury ? "relative h-[80vh] overflow-hidden" : "relative h-80 md:h-96 rounded-2xl overflow-hidden"}>
                <img
                  src={SUPPORT_IMAGE}
                  alt="Project showcase"
                  className={isAALuxury ? "h-full w-full object-cover" : "h-full w-full object-cover"}
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.onerror = null;
                    t.src = "https://placehold.co/1200x800";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Research */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl tracking-tight uppercase mb-10">
              Research & Discovery
            </h2>
            <div className={isAALuxury ? "relative w-full h-[85vh] overflow-hidden mb-10" : "relative w-full h-80 md:h-[28rem] rounded-2xl overflow-hidden mb-10"}>
              <img
                src={RESEARCH_IMAGE}
                alt="Research findings"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = "https://placehold.co/1600x900";
                }}
              />
            </div>
            <div className="prose max-w-3xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                We mapped audience expectations and audited competitive
                identities to surface whitespace. Insights shaped the
                typography-first direction, emphasizing proportion, materials,
                and detail as performance levers for perceived quality.
              </p>
            </div>
          </div>
        </section>

        {/* Design Process */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl tracking-tight uppercase text-center mb-12">
              Design Process
            </h2>
            <div className={isAALuxury ? "relative w-full h-[85vh] overflow-hidden mb-12" : "relative w-full h-80 md:h-[32rem] rounded-2xl overflow-hidden mb-12"}>
              <img
                src={PROCESS_IMAGE}
                alt="Design process"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = "https://placehold.co/1600x900";
                }}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Wireframing",
                  description:
                    "Structural studies for layouts, ratios, and typographic rhythm.",
                },
                {
                  title: "Prototyping",
                  description:
                    "Interactive previews to validate transitions and hierarchy.",
                },
                {
                  title: "User Testing",
                  description:
                    "Feedback loops to calibrate clarity, legibility, and impact.",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-gray-100"
                >
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Design */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl tracking-tight uppercase text-center mb-12">
              Final Design
            </h2>
            <div className="space-y-16">
              {[FINAL_A, FINAL_B, FINAL_C].map((src, i) => (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Signature Screen {i + 1}
                  </h3>
                  <div className={isAALuxury ? "relative w-full h-[85vh] overflow-hidden" : "relative w-full h-80 md:h-[28rem] rounded-2xl overflow-hidden"}>
                    <img
                      src={src}
                      alt={`Screen ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.onerror = null;
                        t.src = "https://placehold.co/1600x900";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display font-medium text-3xl md:text-4xl lg:text-5xl tracking-tight uppercase mb-12">
              Results & Impact
            </h2>
            <div className="relative mx-auto mb-12 h-64 w-full max-w-4xl overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
                alt="Results visualization"
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = "https://placehold.co/1200x600";
                }}
              />
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { value: "75%", label: "Increase in engagement" },
                { value: "40%", label: "Reduction in support tickets" },
                { value: "4.8/5", label: "User satisfaction score" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="font-display font-medium text-4xl text-blue-600">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-14">
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 text-sm uppercase tracking-wider text-gray-700 hover:bg-gray-50"
              >
                Browse More Work
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}