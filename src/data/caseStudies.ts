import type { CaseBlock } from "@/components/sections/case/blocks";
// Import images correctly so Vite bundles them
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

export type CaseStudy = {
  slug: string;
  title: string;
  client?: string;
  category: "Branding" | "Logo" | "Poster" | "Other";
  tagline: string;
  cover: string;
  year: string;
  sections: CaseBlock[];
};

// Sample case studies with proper image imports
export const caseStudies: CaseStudy[] = [
  {
    slug: "periscope",
    title: "Periscope",
    client: "Periscope",
    category: "Branding",
    year: "2024",
    tagline: "A beautiful and simple financial dashboard that educates while reporting.",
    cover: portfolio1,
    sections: [
      { 
        type: "breakdown", 
        hero: { src: portfolio1 }, 
        sections: [
          { 
            heading: "Client Want", 
            body: "A premium dashboard that teaches while reporting, with a luxury presentation that builds trust.", 
            src: portfolio2, 
            mediaLeft: true 
          },
          { 
            heading: "Problem", 
            body: "Complex data overwhelmed users and diluted brand presence across touchpoints.", 
            src: portfolio3, 
            mediaLeft: false 
          },
          { 
            heading: "Challenge", 
            body: "Unify education and reporting while maintaining an elevated aesthetic and performance.", 
            src: portfolio2, 
            mediaLeft: true 
          },
          { 
            heading: "Solution", 
            body: "A modular system with intelligent motion and a typographic hierarchy that guides attention.", 
            src: portfolio1, 
            mediaLeft: false 
          },
          { 
            heading: "Results", 
            body: "Time-to-Insight -32%, Adoption +42%, NPS +18. A brand presence that signals clarity and confidence." 
          }
        ] 
      },
      { 
        type: "full-bleed", 
        src: portfolio3, 
        height: "screen", 
        caption: "Interaction details" 
      },
      { 
        type: "bento", 
        items: [
          { src: portfolio1, title: "Design System", className: "md:col-span-3" },
          { src: portfolio2, title: "Color & Motion", className: "md:col-span-3" },
          { src: portfolio3, title: "Data Visualization", className: "md:col-span-2" },
          { src: portfolio2, title: "UX Flows", className: "md:col-span-4" },
        ] 
      },
      { 
        type: "cta", 
        headline: "Ready to build your brand?", 
        sub: "Let's craft something with weight.", 
        primaryHref: "/onboarding", 
        primaryLabel: "Start My Strategy" 
      },
    ],
  },
  // Add more case studies as needed
  {
    slug: "luxury-fashion",
    title: "Luxury Fashion",
    client: "Elegance Couture",
    category: "Branding",
    year: "2023",
    tagline: "Redefining luxury fashion with timeless elegance and modern aesthetics.",
    cover: portfolio2,
    sections: [],
  },
  {
    slug: "minimalist-logo",
    title: "Minimalist Logo",
    client: "Pure Forms",
    category: "Logo",
    year: "2023",
    tagline: "Simplicity meets impact in this clean and versatile logo design.",
    cover: portfolio3,
    sections: [],
  },
];

