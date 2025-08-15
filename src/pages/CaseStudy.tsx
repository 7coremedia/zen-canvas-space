import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

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
  const cs = CASE_STUDIES[slug as keyof typeof CASE_STUDIES] || CASE_STUDIES.periscope;
  
  if (!cs) {
    return <main className="container mx-auto py-16">Case study not found</main>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{cs.title} – Case Study | KING</title>
        <meta name="description" content={cs.tagline} />
        <link rel="canonical" href={`/portfolio/${cs.slug}`} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <picture>
            <source media="(max-width: 768px)" srcSet={cs.mobileHeroImage} />
            <img 
              src={cs.heroImage} 
              alt={`${cs.title} - ${cs.tagline}`}
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
              {cs.category} • {cs.year}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              {cs.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              {cs.tagline}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {cs.services.map((service) => (
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

      {/* 1. Full Screen Hero Image */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop"
          alt={cs.title}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-8 md:p-16">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-6xl lg:text-7xl text-white"
            >
              {cs.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-2xl text-lg text-white/90"
            >
              {cs.tagline}
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. Client Request Section */}
      <section className="py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl md:text-4xl mb-6">CLIENT REQUEST</h2>
            <blockquote className="text-lg md:text-xl mb-4">
              "King I need a logo for my brand and a revamp. Luxury, Highend my goal is to sell outside of Africa"
            </blockquote>
            <cite className="text-muted-foreground">— Amara O., CEO, Aalux Labs</cite>
            
            <div className="mt-12">
              <h3 className="font-display text-xl mb-4">PROCESS</h3>
              <p className="text-muted-foreground">
                "Our creative process doesn't come first. Research does. It's the first process"
              </p>
              <cite className="text-sm text-muted-foreground">— Abby. K, CCO, King Labs</cite>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop"
              alt="Client request visual"
              className="w-full rounded-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Creative Process - Research Meets Creative Thinking */}
      <section className="py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start px-8 md:px-16">
          {/* Image Container with Overlapping Images */}
          <div className="relative">
            <motion.img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=1000&fit=crop"
              alt="Research process"
              className="w-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <motion.img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
              alt="Creative thinking"
              className="absolute -bottom-16 -right-8 w-3/4 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:mt-16"
          >
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              RESEARCH MEETS<br />CREATIVE THINKING
            </h2>
            <p className="text-muted-foreground mb-8">
              THE RESULTS<br />ARE IN THE<br />RESEARCH
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. Problem & Solution Section */}
      <section className="py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop"
              alt="Problem visualization"
              className="w-full rounded-lg"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl mb-6">PROBLEM</h2>
              <p className="text-muted-foreground">
                The brand had existed and served clients in and out of the UK but clients complained about poor packaging and presentation
              </p>
            </div>
            
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-6">KING</h2>
              <p className="text-muted-foreground">
                We had to use the information from our research to build three moodboards and let the client pick one which will shape our final decision. But that's not all
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Visual Gallery Section */}
      <section className="py-16 md:py-24">
        <div className="px-8 md:px-16">
          <div className="grid md:grid-cols-3 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-1"
            >
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop"
                alt="Visual 1"
                className="w-full rounded-lg"
              />
            </motion.div>
            
            <div className="md:col-span-2 relative">
              <motion.img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
                alt="Visual 2"
                className="w-full rounded-lg"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
              <motion.img
                src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop"
                alt="Visual 3"
                className="absolute -bottom-12 -right-8 w-2/3 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Solution Section */}
      <section className="py-16 md:py-24">
        <div className="px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl mb-6">SOLUTION</h2>
            <p className="text-muted-foreground max-w-2xl">
              We used the information based on research and built a brand image that not just looks good but speaks directly to the customers and target audience
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop"
              alt="Solution showcase"
              className="w-full rounded-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* 7. Others Section */}
      <section className="py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl md:text-4xl mb-6">OTHERS</h2>
            <p className="text-muted-foreground">
              The brand asked for a more vibrant vibe and packaging for a wider audience which they decided to market as the norm while their luxury is kept for high end customers.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
              alt="Others showcase"
              className="w-full rounded-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* 8. Final Showcase Image */}
      <section className="py-16 md:py-24">
        <div className="px-8 md:px-16">
          <motion.img
            src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&h=800&fit=crop"
            alt="Final showcase"
            className="w-full rounded-lg"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </section>

      {/* 9. Next Case Study & CTA */}
      <section className="py-16 md:py-24">
        <div className="px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-2xl mb-4">NEXT CASE STUDY</h2>
            <div className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <span>View Next Project</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center rounded-3xl border bg-card p-12"
          >
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              READY TO BUILD A BRAND WITH GRAVITY?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's turn your vision into a decisive identity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/onboarding">Start My Strategy</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/portfolio">My Portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
