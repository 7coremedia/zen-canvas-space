import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { caseStudies } from "@/data/caseStudies";

const titleByCategory: Record<string, string> = {
  branding: "Branding",
  logo: "Logo",
  marketing: "Media & Marketing",
};

export default function Browse() {
  const { category = "branding" } = useParams();
  const pageTitle = titleByCategory[category] || "Browse";

  const items = useMemo(() => {
    return caseStudies
      .filter((c) => {
        if (category === "branding") return c.category === "Branding";
        if (category === "logo") return c.category === "Logo";
        if (category === "marketing") return c.category === "Poster" || c.category === "Other";
        return true;
      })
      .map((c) => ({
        src: c.cover,
        title: c.title,
        category: c.category,
        slug: c.slug,
      }));
  }, [category]);

  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 18, mass: 0.4 });
  const scale = useTransform(spring, [0, 1], [1, 0.98]);
  const y = useTransform(spring, [0, 1], [0, -16]);

  return (
    <main className="pb-16">
      <Helmet>
        <title>{pageTitle} – Browse – KING</title>
        <meta name="description" content={`Explore ${pageTitle} projects by KING.`} />
        <link rel="canonical" href={`/browse/${category}`} />
      </Helmet>
      <section className="container mx-auto py-10 md:py-14">
        <motion.header style={{ scale, y }} className="mb-8 md:mb-10">
          <h1 className="font-display text-3xl md:text-5xl">{pageTitle}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">A living feed of recent work. Click any project to view the deep-dive.</p>
        </motion.header>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {items.map((it, idx) => (
            <motion.div
              key={it.slug}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="group overflow-hidden border bg-card">
                <CardContent className="p-0">
                  <Link to={`/portfolio/${it.slug}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={it.src}
                        alt={`${it.title} – ${it.category}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3 rounded-full bg-gradient-primary px-3 py-1 text-[10px] uppercase tracking-wider text-foreground">{it.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs text-muted-foreground">View</div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

