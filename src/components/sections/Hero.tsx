import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-king.jpg";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Briefcase } from "lucide-react";
import GlowingInput from "./GlowingInput";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useABTest } from "@/hooks/useABTest";

// Copy variants for A/B testing
const copyVariants = [
  {
    id: 'warlike',
    title: 'We craft brands that nuke the competition.',
    subtitle: 'We don\'t design—we crown ideas into empires.',
    description: 'We craft brands that dominate, disrupt, and dethrone.',
    tagline: 'While others play safe, we build movements that make rivals wonder how they lost it all.'
  },
  {
    id: 'regal',
    title: 'We crown ideas into movements.',
    subtitle: 'We craft brands that command attention, crush competitors, and turn markets into kingdoms.',
    description: 'The brands we build don\'t just lead—they reign.',
    tagline: ''
  },
  {
    id: 'spellbinding',
    title: 'We craft brands that cast a spell.',
    subtitle: 'Movements that pull crowds, keep people waiting, and make the media chase.',
    description: 'We don\'t design—we ignite obsessions.',
    tagline: 'Competitors don\'t just lose customers—they lose control.'
  }
];

// Function to apply italics to specific words
const applyItalics = (text: string, wordsToItalicize: string[]) => {
  let result = text;
  wordsToItalicize.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, `<em>${word.toLowerCase()}</em>`);
  });
  return result;
};

export default function Hero() {
  const selectedCopy = useABTest(copyVariants, 'hero-copy');
  const [showTypewriter, setShowTypewriter] = useState(false);
  
  // Typewriter effect for the subtitle and description
  const typewriterWords = [
    selectedCopy.subtitle,
    selectedCopy.description,
    selectedCopy.tagline
  ].filter(Boolean).map(text => {
    if (selectedCopy.id === 'warlike') {
      return applyItalics(text, ['craft', 'competition']);
    } else if (selectedCopy.id === 'regal') {
      return applyItalics(text, ['crown', 'movements']);
    } else {
      return applyItalics(text, ['craft', 'spell']);
    }
  });

  const { text: typewriterText, isTyping } = useTypewriter({
    words: typewriterWords,
    typeSpeed: 80,
    deleteSpeed: 40,
    delaySpeed: 2000,
    loop: true
  });

  // Start typewriter effect after title animation
  useEffect(() => {
    const timer = setTimeout(() => setShowTypewriter(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[520px] sm:min-h-[620px] w-full overflow-hidden">
      <Helmet>
        <title>KING – Branding & Creative Portfolio</title>
        <meta name="description" content="Crafting brands that command attention. Explore work, services, and start your brand journey with KING." />
        <link rel="canonical" href="/" />
      </Helmet>
      
      {/* Background Image */}
      <img
        src={heroImage}
        alt="KING hero background"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 animate-gradient bg-[length:400%_400%] pointer-events-none" />

      {/* Hero Content - Hidden on larger screens */}
      <div className="relative z-10 flex h-full items-start justify-center px-4 pt-32 md:hidden pointer-events-none">
        <div className="mx-auto max-w-4xl text-center text-white">
          {/* Main Title - Bold and Static with Playfair Display */}
          <h1 
            className="mb-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
            dangerouslySetInnerHTML={{
              __html: selectedCopy.id === 'warlike' 
                ? applyItalics(selectedCopy.title, ['craft', 'competition'])
                : selectedCopy.id === 'regal'
                ? applyItalics(selectedCopy.title, ['crown', 'movements'])
                : applyItalics(selectedCopy.title, ['craft', 'spell'])
            }}
          />

          {/* Typewriter Section - 14px size */}
          {showTypewriter && (
            <div className="mb-6 min-h-[60px] text-sm font-medium leading-relaxed md:text-base lg:text-lg">
              <span 
                className="text-white/90"
                dangerouslySetInnerHTML={{ __html: typewriterText }}
              />
              {/* Blinking Cursor */}
              <span className={`ml-1 inline-block h-4 w-0.5 bg-yellow-400 md:h-6 ${isTyping ? 'animate-blink' : ''}`} />
            </div>
          )}
        </div>
      </div>

      {/* Glowing Input Component */}
      <div className="absolute inset-x-0 bottom-32 z-20 flex justify-center px-4">
        <GlowingInput />
      </div>

      {/* Bottom CTA buttons - Animated with gold shimmer */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center px-6 text-white">
        <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-4">
          <NavLink to="/contact" className="flex-1">
            <Button 
              size="default"
              className="w-full gold-shimmer px-6 py-4 text-sm font-semibold text-black backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl touch-manipulation"
            >
              Start With KING
            </Button>
          </NavLink>
          
          <NavLink to="/portfolio" className="flex-1">
            <Button 
              variant="outline" 
              size="default"
              className="w-full border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg touch-manipulation"
            >
              View Portfolio <Briefcase className="ml-2 h-4 w-4" />
            </Button>
          </NavLink>
        </div>
      </div>
    </section>
  );
}
