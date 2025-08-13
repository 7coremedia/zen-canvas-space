import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "text-primary"
    : "text-muted-foreground hover:text-foreground transition-colors";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <NavLink to="/" className="font-display text-xl tracking-wide">
          KING
        </NavLink>

        <nav className="hidden gap-6 md:flex">
          <NavLink to="/portfolio" className={navLinkClass} end>
            Portfolio
          </NavLink>
          <NavLink to="/services" className={navLinkClass} end>
            Services
          </NavLink>
          <NavLink to="/about" className={navLinkClass} end>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass} end>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to="/onboarding">
            <Button variant="premium" size="sm" className="hover-scale">Start Your Brand</Button>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
