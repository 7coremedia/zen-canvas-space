import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type BlockBase = { id?: string } & Record<string, unknown>;

export type BlockHeroMedia = BlockBase & {
  type: "hero";
  media?: string; // image or video url
  headline: string;
  sub?: string;
};

export type BlockFullBleedImage = BlockBase & {
  type: "full-bleed";
  src: string;
  alt?: string;
  height?: "screen" | "tall" | "medium";
  caption?: string;
};

export type BlockSplitMediaText = BlockBase & {
  type: "split";
  mediaLeft?: boolean;
  src: string;
  alt?: string;
  title?: string;
  body?: string;
};

export type BlockBreakdown = BlockBase & {
  type: "breakdown";
  hero: { src: string; alt?: string };
  sections: Array<{ heading: string; body: string; src?: string; alt?: string; mediaLeft?: boolean }>;
};

export type BlockBentoGrid = BlockBase & {
  type: "bento";
  items: Array<{ src: string; alt?: string; title?: string; text?: string; className?: string }>;
};

export type BlockGallery = BlockBase & {
  type: "gallery";
  images: Array<{ src: string; alt?: string }>;
};

export type BlockQuote = BlockBase & {
  type: "quote";
  quote: string;
  author?: string;
  role?: string;
};

export type BlockStats = BlockBase & {
  type: "stats";
  items: Array<{ label: string; value: string }>;
};

export type BlockCTA = BlockBase & {
  type: "cta";
  headline?: string;
  sub?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export type CaseBlock =
  | BlockHeroMedia
  | BlockFullBleedImage
  | BlockSplitMediaText
  | BlockBentoGrid
  | BlockGallery
  | BlockQuote
  | BlockStats
  | BlockCTA
  | BlockBreakdown;

export function HeroBlock({ media, headline, sub }: BlockHeroMedia) {
  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      {media && (
        <motion.img
          src={media}
          alt="hero"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <div className="absolute inset-0 bg-black/35" />
      <div className="container relative z-10 mx-auto flex h-full items-end pb-12">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="font-display text-4xl md:text-6xl text-white">
            {headline}
          </motion.h1>
          {sub && (
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mt-3 max-w-3xl text-white/90">
              {sub}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}

export function BreakdownBlock({ hero, sections }: BlockBreakdown) {
  return (
    <section className="w-full">
      <div className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
        <motion.img
          src={hero.src}
          alt={hero.alt || "breakdown hero"}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.08, y: 8 }}
          whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="container mx-auto py-10 md:py-16 space-y-12">
        {sections.map((s, i) => (
          <div key={i} className="grid items-start gap-8 md:grid-cols-2">
            {(s.mediaLeft ?? true) && s.src && (
              <motion.img
                src={s.src}
                alt={s.alt || s.heading}
                className="w-full rounded-xl border object-cover"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            )}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <h3 className="font-display text-2xl md:text-3xl">{s.heading}</h3>
              <p className="mt-3 text-muted-foreground whitespace-pre-wrap">{s.body}</p>
            </motion.div>
            {!(s.mediaLeft ?? true) && s.src && (
              <motion.img
                src={s.src}
                alt={s.alt || s.heading}
                className="w-full rounded-xl border object-cover"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function FullBleedImageBlock({ src, alt, height = "tall", caption }: BlockFullBleedImage) {
  const h = height === "screen" ? "h-screen" : height === "tall" ? "h-[80vh]" : "h-[60vh]";
  return (
    <section className={`relative w-full ${h} overflow-hidden`}>
      <img src={src} alt={alt || "visual"} className="absolute inset-0 h-full w-full object-cover" />
      {caption && <div className="absolute bottom-4 right-4 rounded-md bg-black/40 px-3 py-1 text-xs text-white">{caption}</div>}
    </section>
  );
}

export function SplitMediaTextBlock({ mediaLeft = true, src, alt, title, body }: BlockSplitMediaText) {
  return (
    <section className="container mx-auto py-8 md:py-12">
      <div className={`grid items-center gap-8 md:grid-cols-2`}>
        {mediaLeft && (
          <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <img src={src} alt={alt || "visual"} className="w-full rounded-xl border object-cover" />
          </motion.div>
        )}
        <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
          {title && <h3 className="font-display text-2xl md:text-3xl">{title}</h3>}
          {body && <p className="mt-3 text-muted-foreground whitespace-pre-wrap">{body}</p>}
        </motion.div>
        {!mediaLeft && (
          <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <img src={src} alt={alt || "visual"} className="w-full rounded-xl border object-cover" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function BentoGridBlock({ items }: BlockBentoGrid) {
  return (
    <section className="container mx-auto">
      <div className="grid auto-rows-[180px] gap-4 md:auto-rows-[220px] md:grid-cols-6">
        {items.map((it, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className={`relative overflow-hidden rounded-xl border bg-card ${it.className || "md:col-span-3"}`}
          >
            <img src={it.src} alt={it.alt || "bento"} className="absolute inset-0 h-full w-full object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
              {it.title && <div className="font-semibold">{it.title}</div>}
              {it.text && <div className="text-xs opacity-90">{it.text}</div>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function GalleryBlock({ images }: BlockGallery) {
  return (
    <section className="container mx-auto">
      <div className="grid gap-4 md:grid-cols-3">
        {images.map((img, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="overflow-hidden rounded-xl border">
            <img src={img.src} alt={img.alt || "gallery"} className="h-full w-full object-cover" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function QuoteBlock({ quote, author, role }: BlockQuote) {
  return (
    <section className="container mx-auto">
      <figure className="mx-auto max-w-3xl rounded-xl border bg-card p-8 text-center">
        <blockquote className="text-xl md:text-2xl">“{quote}”</blockquote>
        {(author || role) && <figcaption className="mt-2 text-sm text-muted-foreground">— {author}{author && role ? ", " : ""}{role}</figcaption>}
      </figure>
    </section>
  );
}

export function StatsBlock({ items }: BlockStats) {
  return (
    <section className="container mx-auto">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-xl border bg-card p-6 text-center">
            <div className="font-display text-3xl">{it.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{it.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CTABlock({ headline = "Let’s build your brand", sub = "Book your strategy session — I’ll walk you through your personalized plan.", primaryHref = "/onboarding", primaryLabel = "Start My Transformation", secondaryHref = "/portfolio", secondaryLabel = "Back to Portfolio" }: BlockCTA) {
  return (
    <section className="container mx-auto">
      <div className="rounded-xl border bg-card p-8 text-center">
        <h3 className="font-display text-2xl md:text-3xl">{headline}</h3>
        {sub && <p className="mt-2 text-muted-foreground">{sub}</p>}
        <div className="mt-6 flex justify-center gap-3">
          <Button 
            asChild 
            variant="premium" 
            className="transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Link to={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="transition-all duration-300 hover:scale-105"
          >
            <Link to={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

