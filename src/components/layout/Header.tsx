import { NavLink, useLocation } from "react-router-dom";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, Briefcase } from "lucide-react";
import logoUrl from "@/assets/king-logo.svg";
import mobileLogoUrl from "@/assets/king-logo-mobile.svg";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const location = useLocation();
  const isCasePage = location.pathname.startsWith("/portfolio/");
  const isLight = !(location.pathname === "/" || isCasePage);
  const isMobile = useIsMobile();

  const [isHidden, setIsHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      const threshold = 8;

      if (currentY < 10) {
        setIsHidden(false);
      } else if (delta > threshold) {
        setIsHidden(true);
      } else if (delta < -threshold) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener("scroll", onScroll as EventListener);
  }, []);

  const logoSrc = isMobile && isLight ? mobileLogoUrl : logoUrl;
  return (
    <header className={cn(
      "absolute inset-x-0 top-1.5 z-50 h-16 bg-transparent transition-transform duration-300 will-change-transform",
      isHidden ? "-translate-y-full" : "translate-y-0"
    )}>
      <div className={cn("container mx-auto flex h-full items-center justify-between", isLight ? "text-black" : "text-white")}> 
        {/* Left: Menu + Portfolio pill */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(isLight ? "text-black/90 hover:bg-black/5" : "text-white/90 hover:bg-white/10")}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="mt-8 grid gap-3">
                <NavLink to="/services" className="text-lg">Services</NavLink>
                <NavLink to="/about" className="text-lg">About</NavLink>
                <NavLink to="/contact" className="text-lg">Contact</NavLink>
              </nav>
            </SheetContent>
          </Sheet>

          <NavLink to="/portfolio" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              className={cn(
                "bg-transparent",
                isLight ? "border-black/30 text-black hover:bg-black/5" : "border-white/30 text-white hover:bg-white/10"
              )}
            >
              Portfolio <Briefcase className="ml-1" />
            </Button>
          </NavLink>
        </div>

        {/* Center: Logo */}
        <NavLink to="/" aria-label="Home" className="inline-flex items-center">
          <img src={logoSrc} alt="KING" className={cn("h-7 md:h-9", !isLight && "invert")} />
        </NavLink>

        {/* Right: Contact + CTA */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/contact"
            className={cn(
              "hidden sm:inline-flex items-center text-sm",
              isLight ? "text-black hover:text-black/80" : "text-white hover:text-white/90"
            )}
          >
            Contact Us <Heart className="ml-2 h-4 w-4" />
          </NavLink>
          <NavLink to="/onboarding">
            <Button variant="gold" className="px-4">Start My Brand</Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
