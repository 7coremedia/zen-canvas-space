import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardHoverReveal, CardHoverRevealContent, CardHoverRevealMain } from '@/components/ui/reveal-on-hover';
import { ScrollXCarousel, ScrollXCarouselContainer, ScrollXCarouselProgress, ScrollXCarouselWrap } from '@/components/ui/scroll-x-carousel';

const PORTFOLIO_ITEMS = [
  {
    id: 'periscope',
    title: 'Periscope',
    description: 'A modern branding project with a focus on clean aesthetics and user experience.',
    services: ['Branding', 'UI/UX', 'Web Design'],
    type: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1688733720228-4f7a18681c4f?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'monogram',
    title: 'Monogram Exploration',
    description: 'Exploring unique monogram designs that represent brand identity with simplicity and impact.',
    services: ['Logo Design', 'Brand Identity'],
    type: 'Logo',
    imageUrl: 'https://images.unsplash.com/photo-1624996752380-8ec242e0f85d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'campaign-poster',
    title: 'Campaign Poster',
    description: 'Vibrant poster design for a marketing campaign that captures attention and communicates effectively.',
    services: ['Print Design', 'Marketing'],
    type: 'Poster',
    imageUrl: 'https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'saas-platform',
    title: 'SaaS Platform',
    description: 'Designing a comprehensive SaaS platform with a focus on user experience and scalability.',
    services: ['UI/UX', 'Web App', 'Development'],
    type: 'Web',
    imageUrl: 'https://images.unsplash.com/photo-1654618977232-a6c6dea9d1e8?q=80&w=2486&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'seo-optimization',
    title: 'SEO Optimization',
    description: 'Comprehensive SEO strategy and implementation for better online visibility and performance.',
    services: ['SEO', 'Analytics', 'Content Strategy'],
    type: 'Marketing',
    imageUrl: 'https://images.unsplash.com/photo-1726066012698-bb7a3abce786?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const filters = ['All', 'Branding', 'Logo', 'Poster', 'Web', 'Marketing'] as const;

export default function PortfolioGrid() {
  const [active, setActive] = React.useState<(typeof filters)[number]>('All');
  const filtered = PORTFOLIO_ITEMS.filter((item) => active === 'All' || item.type === active);

  return (
    <section className="relative py-12">
      <div className="container mx-auto mb-8">
        <h2 className="font-display text-3xl md:text-4xl">Selected Work</h2>
        <p className="mt-2 text-muted-foreground">Branding, logos, and design systems built to lead.</p>
      </div>

      <div className="mb-6 container mx-auto flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={active === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActive(filter)}
            className="rounded-full"
          >
            {filter}
          </Button>
        ))}
      </div>

      <ScrollXCarousel className="h-[150vh]">
        <ScrollXCarouselContainer className="h-dvh place-content-center flex flex-col gap-8 py-12">
          <div className="pointer-events-none w-[12vw] h-[103%] absolute inset-[0_auto_0_0] z-10 bg-[linear-gradient(90deg,_var(--background)_35%,_transparent)]" />
          <div className="pointer-events-none bg-[linear-gradient(270deg,_var(--background)_35%,_transparent)] w-[15vw] h-[103%] absolute inset-[0_0_0_auto] z-10" />

          <ScrollXCarouselWrap className="flex-4/5 flex space-x-8 [&>*:first-child]:ml-8">
            {filtered.map((item) => (
              <CardHoverReveal
                key={item.id}
                className="min-w-[70vw] md:min-w-[38vw] shadow-xl border xl:min-w-[30vw] rounded-xl overflow-hidden"
              >
                <CardHoverRevealMain>
                  <img
                    alt={item.title}
                    src={item.imageUrl}
                    className="size-full aspect-square object-cover"
                  />
                </CardHoverRevealMain>
                <CardHoverRevealContent className="space-y-4 rounded-2xl bg-[rgba(0,0,0,.7)] backdrop-blur-3xl p-6">
                  <div className="space-y-2">
                    <h3 className="text-sm text-white/80">Type</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="capitalize rounded-full bg-indigo-500">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm text-white/80">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.services.map((service) => (
                        <Badge
                          key={service}
                          className="capitalize rounded-full"
                          variant={'secondary'}
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h3 className="text-white capitalize font-medium text-xl">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                    <Button variant="outline" size="sm" className="mt-4 border-white/20 text-white hover:bg-white/10">
                      View Case Study
                    </Button>
                  </div>
                </CardHoverRevealContent>
              </CardHoverReveal>
            ))}
          </ScrollXCarouselWrap>
          
          <ScrollXCarouselProgress
            className="bg-secondary mx-8 h-1.5 rounded-full overflow-hidden"
            progressStyle="size-full bg-indigo-500/80 rounded-full"
          />
        </ScrollXCarouselContainer>
      </ScrollXCarousel>
    </section>
  );
}
