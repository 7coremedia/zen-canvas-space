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
      { type: "breakdown", hero: { src: "/src/assets/portfolio-1.jpg" }, sections: [
        { heading: "Client Want", body: "A premium dashboard that teaches while reporting, with a luxury presentation that builds trust.", src: "/src/assets/portfolio-2.jpg", mediaLeft: true },
        { heading: "Problem", body: "Complex data overwhelmed users and diluted brand presence across touchpoints.", src: "/src/assets/portfolio-3.jpg", mediaLeft: false },
        { heading: "Challenge", body: "Unify education and reporting while maintaining an elevated aesthetic and performance.", src: "/src/assets/portfolio-2.jpg", mediaLeft: true },
        { heading: "Solution", body: "A modular system with intelligent motion and a typographic hierarchy that guides attention.", src: "/src/assets/portfolio-1.jpg", mediaLeft: false },
        { heading: "Results", body: "Time-to-Insight -32%, Adoption +42%, NPS +18. A brand presence that signals clarity and confidence." }
      ] },
      { type: "full-bleed", src: "/src/assets/portfolio-3.jpg", height: "screen", caption: "Interaction details" },
      { type: "bento", items: [
        { src: "/src/assets/portfolio-1.jpg", title: "Design System", className: "md:col-span-3" },
        { src: "/src/assets/portfolio-2.jpg", title: "Color & Motion", className: "md:col-span-3" },
        { src: "/src/assets/portfolio-3.jpg", title: "Data Visualization", className: "md:col-span-2" },
        { src: "/src/assets/portfolio-2.jpg", title: "UX Flows", className: "md:col-span-4" },
      ] },
      { type: "cta", headline: "Ready to build your brand?", sub: "Let’s craft something with weight.", primaryHref: "/onboarding", primaryLabel: "Start My Strategy" },
    ],
  },
];

