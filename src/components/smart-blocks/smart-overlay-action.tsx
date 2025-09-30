"use client";

import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface Category {
  name: string;
  items: string[];
}

const categories: Category[] = [
  {
    name: "Brand & Identity",
    items: ["Logo Design", "Brand Identity Systems", "Packaging Design", "Typography & Color Systems", "Brand Guidelines"],
  },
  {
    name: "Digital & Experience",
    items: ["UI/UX Design", "Website / Landing Page Design", "Mobile App Design", "Interactive Prototypes", "Dashboards & Platforms"],
  },
  {
    name: "Products & Objects",
    items: ["Product Design (physical goods)", "3D Visualization & Renders", "Mockups & Prototypes"],
  },
  {
    name: "Publications & Media",
    items: ["Book Design (covers + layouts)", "Magazine / Editorial Design", "Annual Reports", "Whitepapers / eBooks"],
  },
  {
    name: "Marketing & Campaigns",
    items: ["Advertising Campaigns (online + offline)", "Social Media Post Design", "Motion Graphics / Video Ads", "Out-of-Home (billboards, posters, transit ads)"],
  },
  {
    name: "Special Creative",
    items: ["Creative Concepts (from scratch)", "Brand Collaterals (cards, stationery, merch)", "Event / Campaign Visual Identity", "Presentations & Pitch Decks"],
  },
];

export function DesignSelector() {
  const [open, setOpen] = useState(false);

  // Prevent page scroll when panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="relative w-full flex justify-center mt-12">
      {/* Floating Bar */}
      <div
        onClick={() => setOpen(true)}
        className="backdrop-blur-md bg-white/10 border border-white/20 text-white 
                   px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer
                   shadow-lg hover:bg-white/20 transition"
      >
        <span className="font-medium">I want design for</span>
        <ChevronDown size={18} />
      </div>

      {/* Popup Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative bg-white/10 backdrop-blur-lg text-white border border-white/20
                        w-11/12 max-w-5xl rounded-2xl p-8 shadow-2xl 
                        max-h-[85vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
              aria-label="Close panel"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-6">Select a design category</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <div key={index} className="pb-2">
                  <h3 className="font-medium text-lg mb-4 text-white/90 border-b border-white/20 pb-2">{category.name}</h3>
                  <div className="flex flex-col gap-2">
                    {category.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        className="px-4 py-2.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 
                                  cursor-pointer transition-all duration-200 text-left 
                                  border border-white/10 hover:border-white/20"
                        onClick={() => {
                          console.log(`Selected: ${item}`);
                          // Handle item selection here
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignSelector;