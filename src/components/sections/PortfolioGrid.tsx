import * as React from "react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const items = [
  { src: p1, title: "Periscope", category: "Branding", slug: "periscope" },
  { src: p2, title: "Monogram Exploration", category: "Logo", slug: "monogram" },
  { src: p3, title: "Campaign Poster", category: "Poster", slug: "campaign-poster" },
];

const filters = ["All", "Branding", "Logo", "Poster"] as const;

export default function PortfolioGrid() {
  const [active, setActive] = React.useState<(typeof filters)[number]>("All");
  const filtered = items.filter((it) => active === "All" || it.category === active);
  return (
    <section className="container mx-auto py-12">
      <div className="mb-8">
        <h2 className="font-display text-3xl md:text-4xl">Selected Work</h2>
        <p className="mt-2 text-muted-foreground">Branding, logos, and design systems built to lead.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button key={f} variant={active === f ? "premium" : "outline"} size="sm" onClick={() => setActive(f)}>
            {f}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it, idx) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
          >
            <Card className="group overflow-hidden border bg-card">
              <CardContent className="p-0">
                <Link to={`/portfolio/${it.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={it.src} alt={`${it.title} – ${it.category} by KING`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/0" />
                      <div className="absolute bottom-3 right-3 rounded-full bg-gradient-primary px-3 py-1 text-xs text-foreground">View Case Study</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground">{it.category}</div>
                    <div className="mt-1 font-medium">{it.title}</div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
