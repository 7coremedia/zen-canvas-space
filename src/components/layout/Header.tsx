import { NavLink, useLocation } from "react-router-dom";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, Briefcase, LogOut, User, FileText, X } from "lucide-react";
import logoUrl from "@/assets/king-logo.svg";
import mobileLogoUrl from "@/assets/king-logo-mobile.svg";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/usePortfolioAuth";

export default function Header() {
  const location = useLocation();
  const isVolumeRoute = location.pathname.startsWith("/volumes");
  const isLight = !isVolumeRoute;
  const isHome = location.pathname === "/";
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { role } = useUser();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [isAtTop, setIsAtTop] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    if (isHome) {
      setIsHidden(false);
      setIsAtTop(true);
      return;
    }

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      const threshold = 8;
      const atTop = currentY < 10;
      setIsAtTop(atTop);
      if (atTop) {
        setIsHidden(false);
      } else if (delta > threshold) {
        setIsHidden(true);
      } else if (delta < -threshold) {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const logoSrc = isMobile && isLight ? mobileLogoUrl : logoUrl;
  const positionClass = isHome ? "absolute" : "fixed";
  const topClass = isVolumeRoute ? "top-0" : "top-1.5";
  const backgroundClass = isAtTop
    ? "bg-transparent"
    : isLight
      ? "bg-white/85 backdrop-blur-xl border-b border-black/5 shadow-[0_18px_40px_rgba(15,18,22,0.08)]"
      : "bg-[#1a1b1d]/90 backdrop-blur-sm border-b border-white/10 shadow-[0_24px_45px_rgba(6,7,12,0.35)]";

  return (
    <header
      className={cn(
        positionClass,
        "inset-x-0 z-50 h-16 transition-transform duration-300 will-change-transform",
        topClass,
        backgroundClass,
        isHidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div
        className={cn(
          "container mx-auto grid h-full grid-cols-[auto_1fr_auto] items-center",
          isLight ? "text-black" : "text-white"
        )}
      >
        {/* Left: Menu + Portfolio pill */}
        <div className="flex items-center gap-3">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  isLight ? "text-black/90 hover:bg-black/5" : "text-white/90 hover:bg-white/10"
                )}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full h-full bg-background p-0 border-none max-w-full sm:max-w-md">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <img src={logoUrl} alt="KING" className="h-8" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSheetOpen(false)}
                    className="text-foreground hover:bg-muted"
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-12 overflow-y-auto">
                  <div className="space-y-10">
                    <NavLink
                      to="/services"
                      className="block font-display font-medium text-4xl md:text-5xl lg:text-6xl text-foreground hover:text-accent transition-colors tracking-tight"
                      onClick={() => setSheetOpen(false)}
                    >
                      SERVICES
                    </NavLink>
                    <NavLink
                      to="/about"
                      className="block font-display font-medium text-4xl md:text-5xl lg:text-6xl text-foreground hover:text-accent transition-colors tracking-tight"
                      onClick={() => setSheetOpen(false)}
                    >
                      ABOUT
                    </NavLink>
                    <NavLink
                      to="/jobs"
                      className="block font-display font-medium text-4xl md:text-5xl lg:text-6xl text-foreground hover:text-accent transition-colors tracking-tight"
                      onClick={() => setSheetOpen(false)}
                    >
                      JOBS
                    </NavLink>
                    <NavLink
                      to="/contact"
                      className="block font-display font-medium text-4xl md:text-5xl lg:text-6xl text-foreground hover:text-accent transition-colors tracking-tight"
                      onClick={() => setSheetOpen(false)}
                    >
                      CONTACT
                    </NavLink>
                    <NavLink
                      to="/portfolio"
                      className="block font-display font-medium text-4xl md:text-5xl lg:text-6xl text-foreground hover:text-accent transition-colors tracking-tight"
                      onClick={() => setSheetOpen(false)}
                    >
                      PORTFOLIO
                    </NavLink>
                    <NavLink
                      to="/contracts"
                      className="block font-display font-medium text-4xl md:text-5xl lg:text-6xl text-foreground hover:text-accent transition-colors tracking-tight"
                      onClick={() => setSheetOpen(false)}
                    >
                      CONTRACTS
                    </NavLink>

                    {user ? (
                      <div className="border-t border-muted pt-10 mt-10">
                        <h3 className="text-sm font-medium text-muted-foreground mb-6 tracking-wider">
                          ACCOUNT
                        </h3>
                        <div className="space-y-6">
                          <NavLink
                            to="/dashboard"
                            className="flex items-center gap-3 font-display font-medium text-2xl text-foreground hover:text-accent transition-colors"
                            onClick={() => setSheetOpen(false)}
                          >
                            <FileText className="h-6 w-6" />
                            My Brands
                          </NavLink>
                          {(role?.is_admin || role?.is_moderator || role?.is_worker) && (
                            <NavLink
                              to="/management"
                              className="flex items-center gap-3 font-display font-medium text-2xl text-foreground hover:text-accent transition-colors"
                              onClick={() => setSheetOpen(false)}
                            >
                              <Briefcase className="h-6 w-6" />
                              Management Dashboard
                            </NavLink>
                          )}
                          <button
                            onClick={async () => {
                              await signOut();
                              setSheetOpen(false);
                            }}
                            className="flex items-center gap-3 font-display font-medium text-2xl text-foreground hover:text-accent transition-colors w-full text-left"
                          >
                            <LogOut className="h-6 w-6" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-muted pt-10 mt-10">
                        <h3 className="text-sm font-medium text-muted-foreground mb-6 tracking-wider">
                          ACCOUNT
                        </h3>
                        <div className="space-y-4">
                          <NavLink
                            to="/auth"
                            className="inline-flex items-center justify-center w-full px-4 py-3 text-base font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setSheetOpen(false)}
                            state={{
                              fromMenu: true,
                            }}
                          >
                            Sign In / Sign Up
                          </NavLink>
                          <p className="text-sm text-muted-foreground text-center">
                            Create an account to save your progress
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-muted mt-auto">
                  <p className="text-sm text-muted-foreground"> 2024 KING. All rights reserved.</p>
                </div>
              </div>
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
        <div className="flex items-center justify-center pl-10 md:pl-16">
          <NavLink to="/" aria-label="Home" className="inline-flex items-center">
            <img src={logoSrc} alt="KING" className={cn("h-7 md:h-9", !isLight && "invert")} />
          </NavLink>
        </div>

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
          {user ? (
            <NavLink to="/dashboard">
              <Button
                variant="dashboard"
                className={cn(
                  "px-4 flex items-center gap-2 text-base",
                  isLight
                    ? "text-black border-black hover:text-black/80 hover:border-black/80"
                    : "text-slate-50 border-slate-50 hover:text-slate-50/90 hover:border-slate-50/90"
                )}
              >
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            </NavLink>
          ) : (
            <NavLink to="/onboarding">
              <Button variant="gold" className="px-4">
                Start My Brand
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}