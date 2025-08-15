import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// This would typically come from an API or data file
const CASE_STUDIES = {
  periscope: {
    title: 'Periscope',
    tagline: 'A modern branding project with a focus on clean aesthetics and user experience.',
    heroImage: '/src/assets/aaluxury-branding-presentation-hero.jpg',
    mobileHeroImage: '/src/assets/aaluxury-intro-hero-mobile.png',
    services: ['Branding', 'UI/UX', 'Web Design'],
    year: '2024',
    client: 'Periscope Inc.',
    category: 'Branding',
  },
  // Add more case studies here
};

type CaseStudyParams = {
  slug: string;
};

export default function CaseStudy() {
  const { slug } = useParams<CaseStudyParams>();
  const caseStudy = CASE_STUDIES[slug as keyof typeof CASE_STUDIES] || CASE_STUDIES.periscope;

  if (!caseStudy) {
    return <div>Case study not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{caseStudy.title} – Case Study | KING</title>
        <meta name="description" content={caseStudy.tagline} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <picture>
            <source media="(max-width: 768px)" srcSet={caseStudy.mobileHeroImage} />
            <img 
              src={caseStudy.heroImage} 
              alt={`${caseStudy.title} - ${caseStudy.tagline}`}
              className="w-full h-full object-cover object-center"
            />
          </picture>
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 text-sm font-medium bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              {caseStudy.category} • {caseStudy.year}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              {caseStudy.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              {caseStudy.tagline}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {caseStudy.services.map((service) => (
                <span key={service} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                  {service}
                </span>
              ))}
            </div>
            <Button 
              size="lg" 
              className="group bg-white text-foreground hover:bg-white/90 px-8 py-6 text-base"
            >
              View Live Project
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm text-white/80 mb-2">Scroll to explore</span>
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* Next section will go here */}
    </div>
  );
}
