import { useLocation } from "react-router-dom";
import logoUrl from "@/assets/king-logo.svg";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { pathname } = useLocation();
  const isVolumeRoute = pathname.startsWith("/volumes");

  return (
    <footer
      className={cn(
        "border-t bg-white transition-colors duration-300",
        isVolumeRoute && "border-white/10 bg-[#1a1b1d]"
      )}
    >
      <div className="container mx-auto py-12 md:py-20">
        <div className="flex flex-col items-start gap-10 md:gap-12">
          {/* New Business Inquiry row */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <div className="md:col-span-3">
              <span
                className={cn(
                  "text-sm font-medium tracking-wide text-neutral-700",
                  isVolumeRoute && "text-white/70"
                )}
              >
                New Business Inquiry
              </span>
            </div>
            <div className="md:col-start-7 md:col-span-5 lg:col-start-8 lg:col-span-4">
              <a
                href="mailto:kingedmundau@gmail.com"
                className={cn(
                  "text-sm md:text-base text-neutral-900 hover:underline",
                  isVolumeRoute && "text-white hover:text-white/80"
                )}
              >
                kingedmundau@gmail.com
              </a>
            </div>
          </div>

          {/* About row */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <div className="md:col-span-3">
              <span
                className={cn(
                  "text-sm font-medium tracking-wide text-neutral-700",
                  isVolumeRoute && "text-white/70"
                )}
              >
                About
              </span>
            </div>
            <div className="md:col-start-7 md:col-span-5 lg:col-start-8 lg:col-span-4">
              <p
                className={cn(
                  "text-sm md:text-base leading-relaxed text-neutral-800",
                  isVolumeRoute && "text-white/75"
                )}
              >
                KING is Africa’s leading design agency. We help brands in Lagos, Abuja, Port Harcourt, Ibadan, Kano and across Nigeria bring their ideas to life with world-class logos, branding, and creative work.
              </p>
              <p
                className={cn(
                  "mt-4 text-sm md:text-base leading-relaxed text-neutral-800",
                  isVolumeRoute && "text-white/75"
                )}
              >
                From simple logos to full campaigns, fashion ads, movies, music, books, and digital content—we design for all of Africa. Our team is home to some of the best logo designers in Nigeria and across the continent.
              </p>
              <p
                className={cn(
                  "mt-4 text-sm md:text-base leading-relaxed text-neutral-800",
                  isVolumeRoute && "text-white/75"
                )}
              >
                But KING is more than design. We are Africa’s first and largest collaborative design platform. We shape how people see Africa, how they feel about it, and what they believe. Our work is about culture as much as business.
              </p>
              <p
                className={cn(
                  "mt-4 text-sm md:text-base leading-relaxed text-neutral-800",
                  isVolumeRoute && "text-white/75"
                )}
              >
                We offer design consultation, brand identity, advertising, fashion and lifestyle campaigns, creative direction, and more. If it needs design, KING makes it happen.
              </p>
              <p
                className={cn(
                  "mt-4 text-sm md:text-base leading-relaxed text-neutral-800",
                  isVolumeRoute && "text-white/75"
                )}
              >
                We don’t just design. We build culture.
              </p>
            </div>
          </div>

          {/* Giant KING logo */}
          <div className="w-full max-w-7xl">
            <img
              src={logoUrl}
              alt="KING logo"
              className={cn(
                "h-20 sm:h-24 md:h-32 lg:h-40 w-auto object-contain",
                isVolumeRoute && "invert brightness-[1.6]"
              )}
              loading="lazy"
            />
          </div>

          {/* Row: copyright (left) and links (right) on one straight line */}
          <div className="flex w-full items-center justify-between">
            <div
              className={cn(
                "text-xs sm:text-sm text-neutral-600",
                isVolumeRoute && "text-white/60"
              )}
            >
              © 2025 KING Edmund. All rights reserved.
            </div>
            <nav
              className={cn(
                "flex items-center gap-6 text-sm text-neutral-700",
                isVolumeRoute && "text-white/70"
              )}
            >
              <a
                href="/portfolio"
                className={cn(
                  "transition-colors hover:text-neutral-900",
                  isVolumeRoute && "hover:text-white"
                )}
              >
                Portfolio
              </a>
              <a
                href="/services"
                className={cn(
                  "transition-colors hover:text-neutral-900",
                  isVolumeRoute && "hover:text-white"
                )}
              >
                Services
              </a>
              <a
                href="/about"
                className={cn(
                  "transition-colors hover:text-neutral-900",
                  isVolumeRoute && "hover:text-white"
                )}
              >
                About
              </a>
              <a
                href="/contact"
                className={cn(
                  "transition-colors hover:text-neutral-900",
                  isVolumeRoute && "hover:text-white"
                )}
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
