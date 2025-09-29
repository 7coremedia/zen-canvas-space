import logoUrl from "@/assets/king-logo.svg";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto py-12 md:py-20">
        <div className="flex flex-col items-start gap-10 md:gap-12">
          {/* New Business Inquiry row */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <div className="md:col-span-3">
              <span className="text-sm font-medium tracking-wide text-neutral-700">New Business Inquiry</span>
            </div>
            <div className="md:col-start-7 md:col-span-5 lg:col-start-8 lg:col-span-4">
              <a
                href="mailto:kingedmundau@gmail.com"
                className="text-sm md:text-base text-neutral-900 hover:underline"
              >
                kingedmundau@gmail.com
              </a>
            </div>
          </div>

          {/* About row */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <div className="md:col-span-3">
              <span className="text-sm font-medium tracking-wide text-neutral-700">About</span>
            </div>
            <div className="md:col-start-7 md:col-span-5 lg:col-start-8 lg:col-span-4">
              <p className="text-sm md:text-base leading-relaxed text-neutral-800">
                KING’S EMPIRE is the branding force that shapes culture through design. We don’t build brands—we crown kings. With strategy, creativity, and relentless execution, we transform names into legacies. For visionaries who demand power, presence, and permanence, there is no alternative—only the Empire.
              </p>
            </div>
          </div>

          {/* Giant KING logo in #1b1917, aligned left */}
          <div
            aria-label="KING logo"
            className="w-full max-w-7xl h-20 sm:h-24 md:h-32 lg:h-40 bg-[#1b1917]"
            style={{
              WebkitMaskImage: `url(${logoUrl})`,
              maskImage: `url(${logoUrl})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />

          {/* Row: copyright (left) and links (right) on one straight line */}
          <div className="flex w-full items-center justify-between">
            <div className="text-xs sm:text-sm text-neutral-600">
              © 2025 KING Edmund. All rights reserved.
            </div>
            <nav className="flex items-center gap-6 text-sm text-neutral-700">
              <a href="/portfolio" className="hover:text-neutral-900 transition-colors">Portfolio</a>
              <a href="/services" className="hover:text-neutral-900 transition-colors">Services</a>
              <a href="/about" className="hover:text-neutral-900 transition-colors">About</a>
              <a href="/contact" className="hover:text-neutral-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
