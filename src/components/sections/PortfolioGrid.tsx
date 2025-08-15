import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { caseStudies } from '@/data/caseStudies';
import { cn } from '@/lib/utils';

const filters = ['All', 'Branding', 'Logo', 'Marketing'] as const;

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = React.useState<(typeof filters)[number]>('All');

  const filteredItems = React.useMemo(() => {
    if (activeFilter === 'All') return caseStudies;
    return caseStudies.filter(item => {
      if (activeFilter === 'Marketing') {
        return item.category === 'Poster' || item.category === 'Other';
      }
      return item.category === activeFilter;
    });
  }, [activeFilter]);

  return (
    <section className="container mx-auto py-12">
      {/* Filter Pills */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-2 md:space-x-4 rounded-full p-1.5 bg-gray-100/80 backdrop-blur-sm">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'relative rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors focus:outline-none',
                {
                  'text-black': activeFilter === filter,
                }
              )}
            >
              {activeFilter === filter && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-md"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{filter}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.slug}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="group"
          >
            <Link to={`/portfolio/${item.slug}`}>
              <div className="overflow-hidden mb-4 bg-gray-100">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
              </div>
              <h3 className="font-display text-xl font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.category}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
