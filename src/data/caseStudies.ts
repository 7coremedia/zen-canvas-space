import type { CaseBlock } from "@/components/sections/case/blocks";
// Import images correctly so Vite bundles them
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
// Hookr assets
import hookrCover from "@/assets/Portfolio/hookr/hookr-port-cover-img.webp";
import hookrFull from "@/assets/Portfolio/hookr/hoork-portfolio.webp";

export type Partner = {
  id: string;
  name: string;
  socialName: string;
  imageUrl?: string;
  socialLink?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  client?: string;
  category: "Branding" | "Logo" | "Poster" | "Other";
  tagline: string;
  cover: string;
  // Optional long, scrollable image for the full project view
  fullImage?: string;
  year: string;
  sections: CaseBlock[];
  // Partner information
  isMultiplePartners?: boolean;
  brandName?: string; // For multiple partners, this is the brand name (e.g., "Periscope")
  partners?: Partner[]; // For multiple partners
  singlePartner?: {
    name: string;
    type?: string; // e.g., "By KING"
  }; // For single partner
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
    fullImage: portfolio1,
    // Multiple partners example
    isMultiplePartners: true,
    brandName: "Periscope", // Same as title
    partners: [
      {
        id: "1",
        name: "Brand Name",
        socialName: "Social name",
        socialLink: "https://instagram.com/thedrawingboard.ng",
      },
      {
        id: "2", 
        name: "Brand Name",
        socialName: "Social name",
        socialLink: "https://instagram.com/thedrawingboard.ng",
      },
      {
        id: "3",
        name: "Brand Name", 
        socialName: "Social name",
        socialLink: "https://instagram.com/thedrawingboard.ng",
      },
    ],
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
    title: "Reflection",
    client: "Elegance Couture",
    category: "Branding",
    year: "2023",
    tagline: "Redefining luxury fashion with timeless elegance and modern aesthetics.",
    cover: portfolio2,
    fullImage: portfolio2,
    // Single partner example
    isMultiplePartners: false,
    singlePartner: {
      name: "Reflection", // Same as title
      type: "By KING",
    },
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
    fullImage: portfolio3,
    // Single partner example
    isMultiplePartners: false,
    singlePartner: {
      name: "Minimalist Logo", // Same as title
      type: "By KING",
    },
    sections: [],
  },
  // New: Hookr project
  {
    slug: "hookr-branding-ui-ux",
    title: "Hookr - Branding, UI & UX",
    client: "Hookr",
    category: "Branding",
    year: "2025",
    tagline: "Hookr is a platform for mutual consenting adults to just do what you're thinking... HookUp.",
    cover: hookrCover,
    fullImage: hookrFull,
    isMultiplePartners: false,
    singlePartner: {
      name: "Hookr",
      type: "By KING",
    },
    sections: [],
  },
];

