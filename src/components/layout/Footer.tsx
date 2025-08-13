export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} KING Edmund. All rights reserved.</div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</a>
            <a href="/services" className="hover:text-foreground transition-colors">Services</a>
            <a href="/about" className="hover:text-foreground transition-colors">About</a>
            <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
