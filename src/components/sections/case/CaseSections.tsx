import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CaseHeroSection({ headline, sub, image }: { headline: string; sub?: string; image?: string }) {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-card">
      {image && (
        <img src={image} alt="Case hero" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 p-10 md:p-16">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="font-display text-3xl md:text-5xl text-white">
          {headline}
        </motion.h2>
        {sub && (
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-3 max-w-3xl text-white/90">
            {sub}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export function CaseBriefSection({ text }: { text: string }) {
  return (
    <section className="relative rounded-xl border bg-card p-6 md:p-10">
      <div className="absolute left-0 top-0 h-full w-1 bg-[hsl(46_92%_50%)]" />
      <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <h3 className="font-display text-2xl md:text-3xl mb-3">The Brief</h3>
        <p className="text-muted-foreground text-base md:text-lg">{text}</p>
      </motion.div>
    </section>
  );
}

export function CaseProcessSection({ steps }: { steps: Array<{ title: string; text: string; image?: string }> }) {
  return (
    <section className="space-y-6">
      <h3 className="font-display text-2xl md:text-3xl">Process Timeline</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="rounded-xl border bg-card p-6">
            <div className="text-sm text-muted-foreground">Step {i + 1}</div>
            <div className="mt-1 font-semibold">{s.title}</div>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">{s.text}</p>
            {s.image && (
              <img src={s.image} alt={s.title} className="mt-4 h-40 w-full rounded-md object-cover" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CaseFinalSection({ images }: { images: string[] }) {
  return (
    <section className="space-y-4">
      <h3 className="font-display text-2xl md:text-3xl">Final Showcase</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {images.map((src, i) => (
          <motion.div key={src + i} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="overflow-hidden rounded-xl border bg-card">
            <img src={src} alt="Final visual" className="h-full w-full object-cover" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CaseCTASection() {
  return (
    <section className="rounded-xl border bg-card p-8 text-center">
      <h3 className="font-display text-2xl md:text-3xl">Let’s build your brand</h3>
      <p className="mt-2 text-muted-foreground">Book your strategy session — I’ll walk you through your personalized plan.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button 
          asChild 
          variant="premium" 
          className="transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Link to="/onboarding">Start My Transformation</Link>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          className="transition-all duration-300 hover:scale-105"
        >
          <Link to="/portfolio">Back to Portfolio</Link>
        </Button>
      </div>
    </section>
  );
}

