import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { volumes } from "@/data/volumes";

export default function VolumeDetail() {
  const { id } = useParams<{ id: string }>();
  const volume = volumes.find((item) => item.id === id);

  if (!volume) {
    return <Navigate to="/volumes" replace />;
  }

  const [leadParagraph, ...insightParagraphs] = volume.content;

  return (
    <main className="bg-[#1a1b1d] text-white">
      <Helmet>
        <title>{`${volume.title} – KING Volumes`}</title>
        <meta
          name="description"
          content={`Read ${volume.title} by ${volume.writer}. A KING Volume focused on ${volume.goal}`}
        />
        <link rel="canonical" href={`/volumes/${volume.id}`} />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" aria-hidden="true" />
        <div className="container mx-auto px-4 pt-28 pb-16 md:pt-32 md:pb-20 relative">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.45em] text-white/60">
                <span>{volume.number}</span>
                <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
                <span>Masterclass Edition</span>
              </div>
              <motion.h1
                className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-white"
                style={{ WebkitTextStroke: "0.6px rgba(255,255,255,0.18)" }}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              >
                {volume.title}
              </motion.h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <span className="font-medium text-white">{volume.writer}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden="true" />
                <span className="max-w-[32ch]">{volume.goal}</span>
              </div>
              <p className="max-w-3xl text-base md:text-lg text-white/80 leading-relaxed">
                {volume.summary}
              </p>
              {leadParagraph && (
                <motion.blockquote
                  className="relative max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-base md:text-lg text-white/85 leading-relaxed"
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.6, ease: "easeOut" }}
                >
                  <span className="absolute -top-4 left-6 bg-[#1a1b1d] px-3 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
                    Editorial Lede
                  </span>
                  {leadParagraph}
                </motion.blockquote>
              )}
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-lg border-white/25 bg-transparent px-6 py-2 text-xs uppercase tracking-[0.35em] text-white transition hover:bg-white/10 hover:text-white"
                >
                  <Link to="/volumes">Back to Volumes</Link>
                </Button>
                <Button
                  variant="gold"
                  className="rounded-lg px-6 py-2 text-xs uppercase tracking-[0.35em]"
                >
                  Subscribe
                </Button>
              </div>
            </motion.div>

            <div className="space-y-6 lg:pl-6">
              <div className="rounded-4xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm">
                <div className="mt-4 space-y-4 text-sm text-white/75">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                    A culture-first masterclass crafted for founders, creative directors, and teams across Africa.
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                    Built as a living playbook—ready to copy into pitch decks, launch sprints, and internal handbooks.
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                    Anchored in KING’s editorial design language: sharp typography, clear grids, and brave storytelling.
                  </div>
                </div>
              </div>

              <div className="rounded-4xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.45em] text-white/60">
                  <span>Contributors</span>
                  <span className="text-white/40">KING Studio</span>
                </div>
                <dl className="mt-4 space-y-4 text-sm text-white/75">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                    <dt className="text-white/60">Lead Editor</dt>
                    <dd className="text-right text-white">{volume.writer}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                    <dt className="text-white/60">Series</dt>
                    <dd className="text-right text-white">KING Volumes</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-white/60">Focus</dt>
                    <dd className="text-right text-white/85">{volume.goal}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <article className="mx-auto max-w-3xl space-y-10 text-base md:text-lg leading-relaxed text-white/80">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.45em] text-white/55">Field Notes</p>
            <p>{leadParagraph ?? volume.summary}</p>
          </div>

          {insightParagraphs.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-white">Key Moves</h2>
              <ul className="list-disc space-y-3 pl-5">
                {insightParagraphs.map((paragraph, index) => (
                  <li key={index}>{paragraph}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
