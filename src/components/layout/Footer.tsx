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
                KING is Africa’s leading design agency. We help brands in Lagos, Abuja, Port Harcourt, Ibadan, Kano and across Nigeria bring their ideas to life with world-class logos, branding, and creative work.
              </p>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-800">
                From simple logos to full campaigns, fashion ads, movies, music, books, and digital content—we design for all of Africa. Our team is home to some of the best logo designers in Nigeria and across the continent.
              </p>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-800">
                But KING is more than design. We are Africa’s first and largest collaborative design platform. We shape how people see Africa, how they feel about it, and what they believe. Our work is about culture as much as business.
              </p>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-800">
                We offer design consultation, brand identity, advertising, fashion and lifestyle campaigns, creative direction, and more. If it needs design, KING makes it happen.
              </p>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-800">
                We don’t just design. We build culture.
              </p>
            </div>
          </div>

          {/* Giant KING logo */}
          <div className="w-full max-w-7xl">
            <img
              src={logoUrl}
              alt="KING logo"
              className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto object-contain"
              loading="lazy"
            />
          </div>

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
