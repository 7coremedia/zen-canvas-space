import { motion } from "framer-motion";

interface ResearchSectionProps {
  title: string;
  subtitle: string;
  mainImage: string;
  overlayImage?: string;
  overlayPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

export function ResearchSection({
  title,
  subtitle,
  mainImage,
  overlayImage,
  overlayPosition = "bottom-right",
  className = ""
}: ResearchSectionProps) {
  // Position classes for overlay image
  const positionClasses = {
    "top-right": "top-0 right-0 -translate-y-1/2 translate-x-1/4",
    "top-left": "top-0 left-0 -translate-y-1/2 -translate-x-1/4",
    "bottom-right": "bottom-0 right-0 translate-y-1/2 translate-x-1/4",
    "bottom-left": "bottom-0 left-0 translate-y-1/2 -translate-x-1/4",
  };

  return (
    <section className={`py-16 md:py-24 bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image Container */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative z-10 overflow-hidden rounded-2xl bg-foreground/5 aspect-[4/5] w-full">
              <img
                src={mainImage}
                alt="Research and creative process"
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            {overlayImage && (
              <motion.div 
                className={`absolute ${positionClasses[overlayPosition]} z-20 w-3/4 max-w-xs shadow-2xl rounded-lg overflow-hidden border-4 border-background`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <img
                  src={overlayImage}
                  alt="Research insights"
                  className="w-full h-auto"
                />
              </motion.div>
            )}
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 -z-10 hidden md:block" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 border-2 border-foreground/5 rounded-lg -z-10 hidden md:block" />
          </motion.div>
          
          {/* Text Content */}
          <motion.div
            className="md:pl-8 lg:pl-16"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl">
              {subtitle}
            </p>
            
            <div className="mt-12 space-y-8">
              <div className="space-y-4">
                <h3 className="font-display text-xl">OUR APPROACH</h3>
                <p className="text-muted-foreground">
                  We believe in data-driven design. Our process begins with in-depth research to understand user needs, market trends, and business goals before any creative work begins.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-foreground/5">
                <div>
                  <div className="text-3xl font-display text-primary mb-2">75%</div>
                  <p className="text-sm text-muted-foreground">of our time is spent on research and strategy</p>
                </div>
                <div>
                  <div className="text-3xl font-display text-primary mb-2">90%</div>
                  <p className="text-sm text-muted-foreground">of clients see improved metrics after implementation</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
