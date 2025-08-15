import { motion } from "framer-motion";

interface ProblemSolutionSectionProps {
  problem: {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt?: string;
  };
  solution: {
    title: string;
    description: string;
    imageUrl?: string;
    imageAlt?: string;
    stats?: Array<{
      value: string;
      label: string;
    }>;
  };
  className?: string;
}

export function ProblemSolutionSection({
  problem,
  solution,
  className = "",
}: ProblemSolutionSectionProps) {
  return (
    <section className={`py-16 md:py-24 bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Problem Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
              <div className="pl-8">
                <h2 className="font-display text-3xl md:text-4xl mb-6">
                  {problem.title}
                </h2>
                <p className="text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-xl bg-foreground/5">
              <img
                src={problem.imageUrl}
                alt={problem.imageAlt || "Problem illustration"}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
          
          {/* Solution Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary rounded-full" />
              <div className="pl-8">
                <h2 className="font-display text-3xl md:text-4xl mb-6">
                  {solution.title}
                </h2>
                <p className="text-muted-foreground">
                  {solution.description}
                </p>
              </div>
            </div>
            
            {solution.imageUrl && (
              <div className="overflow-hidden rounded-xl bg-foreground/5">
                <img
                  src={solution.imageUrl}
                  alt={solution.imageAlt || "Solution illustration"}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            {solution.stats && solution.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 pt-6 mt-6 border-t border-foreground/10">
                {solution.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-display text-primary mb-2">
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden md:block">
          <div className="absolute -left-20 top-1/2 w-40 h-40 rounded-full bg-primary/5 -z-10" />
          <div className="absolute -right-20 bottom-1/4 w-60 h-60 rounded-full bg-primary/5 -z-10" />
        </div>
      </div>
    </section>
  );
}
