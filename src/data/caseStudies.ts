import type { CaseBlock } from "@/components/sections/case/blocks";

export type CaseStudy = {
  slug: string;
  title: string;
  client?: string;
  category: "Branding" | "Logo" | "Poster" | "Other";
  tagline: string;
  cover: string;
  sections: CaseBlock[];
};

// Placeholder sample using existing public images; replace with your assets
export const caseStudies: CaseStudy[] = [
  {
    slug: "periscope",
    title: "Periscope",
    client: "Periscope",
    category: "Branding",
    tagline: "A beautiful and simple financial dashboard that educates while reporting.",
    cover: "/src/assets/portfolio-1.jpg",
    sections: [
      { type: "hero", headline: "From Quiet to Unmissable", sub: "We turned complexity into clarity.", media: "/src/assets/portfolio-1.jpg" },
      { type: "split", mediaLeft: true, src: "/src/assets/portfolio-2.jpg", title: "The Brief", body: "They needed a dashboard that teaches while reporting. We re-framed complexity into a narrative of clarity." },
      { type: "full-bleed", src: "/src/assets/portfolio-3.jpg", height: "screen", caption: "Interaction details" },
      { type: "bento", items: [
        { src: "/src/assets/portfolio-1.jpg", title: "Design System", className: "md:col-span-3" },
        { src: "/src/assets/portfolio-2.jpg", title: "Color & Motion", className: "md:col-span-3" },
        { src: "/src/assets/portfolio-3.jpg", title: "Data Visualization", className: "md:col-span-2" },
        { src: "/src/assets/portfolio-2.jpg", title: "UX Flows", className: "md:col-span-4" },
      ] },
      { type: "split", mediaLeft: false, src: "/src/assets/portfolio-2.jpg", title: "Design Decisions", body: "We chose a sober palette with restrained gold accents and a typography stack that communicates authority without noise." },
      { type: "full-bleed", src: "/src/assets/portfolio-1.jpg", height: "tall" },
      { type: "gallery", images: [
        { src: "/src/assets/portfolio-3.jpg" },
        { src: "/src/assets/portfolio-2.jpg" },
        { src: "/src/assets/portfolio-1.jpg" },
      ] },
      { type: "stats", items: [
        { label: "Time-to-Insight", value: "-32%" },
        { label: "User NPS", value: "+18" },
        { label: "Adoption", value: "+42%" },
        { label: "Bug Reports", value: "-27%" },
      ] },
      { type: "cta", headline: "Ready to build your brand?", sub: "Let’s craft something with weight.", primaryHref: "/onboarding", primaryLabel: "Start My Strategy" },
    ],
  },
];

