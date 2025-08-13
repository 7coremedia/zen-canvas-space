import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { caseStudies } from "@/data/caseStudies";
import { motion } from "framer-motion";
import { HeroBlock, FullBleedImageBlock, SplitMediaTextBlock, BentoGridBlock, GalleryBlock, QuoteBlock, StatsBlock, CTABlock, BreakdownBlock, type CaseBlock } from "@/components/sections/case/blocks";

export default function CaseStudy() {
  const { slug } = useParams();
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return <main className="container mx-auto py-16">Not found</main>;

  return (
    <main className="pb-16">
      <Helmet>
        <title>{cs.title} – Case Study – KING</title>
        <meta name="description" content={cs.tagline} />
        <link rel="canonical" href={`/portfolio/${cs.slug}`} />
      </Helmet>

      {/* Full-screen hero with cover under the header */}
      <HeroBlock type="hero" media={cs.cover} headline={cs.title} sub={cs.tagline} />

      <section className="mt-0 space-y-12">
        {(cs.sections as CaseBlock[]).map((s, idx) => {
          switch (s.type) {
            case "hero":
              return <HeroBlock key={idx} type="hero" media={(s as any).media || cs.cover} headline={(s as any).headline} sub={(s as any).sub} />;
            case "full-bleed":
              return <FullBleedImageBlock key={idx} type="full-bleed" src={(s as any).src} alt={(s as any).alt} height={(s as any).height} caption={(s as any).caption} />;
            case "split":
              return <SplitMediaTextBlock key={idx} type="split" mediaLeft={(s as any).mediaLeft} src={(s as any).src} alt={(s as any).alt} title={(s as any).title} body={(s as any).body} />;
            case "bento":
              return <BentoGridBlock key={idx} type="bento" items={(s as any).items || []} />;
            case "gallery":
              return <GalleryBlock key={idx} type="gallery" images={(s as any).images || []} />;
            case "quote":
              return <QuoteBlock key={idx} type="quote" quote={(s as any).quote} author={(s as any).author} role={(s as any).role} />;
            case "stats":
              return <StatsBlock key={idx} type="stats" items={(s as any).items || []} />;
            case "cta":
              return <CTABlock key={idx} type="cta" headline={(s as any).headline} sub={(s as any).sub} primaryHref={(s as any).primaryHref} primaryLabel={(s as any).primaryLabel} secondaryHref={(s as any).secondaryHref} secondaryLabel={(s as any).secondaryLabel} />;
            case "breakdown":
              return <BreakdownBlock key={idx} type="breakdown" hero={(s as any).hero} sections={(s as any).sections || []} />;
            default:
              return null;
          }
        })}
      </section>
    </main>
  );
}

