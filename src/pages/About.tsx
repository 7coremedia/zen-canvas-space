import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About – KING</title>
        <meta name="description" content="Crowned in Creativity. Ruthless in Strategy. Building empires out of ideas with force, fire, and flawless execution." />
        <link rel="canonical" href="/about" />
      </Helmet>

      {/* Hero Section with Full Background Image */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/home/about-hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headlines */}
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight mb-4 text-white">
                  Crowned in Creativity.
                  <span className="block text-accent">Ruthless in Strategy.</span>
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Not every creative wears a crown. But I do — because I've earned it.
                </p>
              </div>
            </div>

            {/* Right: CTAs */}
            <div className="flex flex-col gap-4 lg:items-end animate-fade-in">
              <a href="tel:+2349137145159">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  <Phone className="mr-2" />
                  Call the King
                </Button>
              </a>
              <a href="https://wa.me/2348160891799" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black">
                  <MessageCircle className="mr-2" />
                  Message on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Dark Theme */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-8 text-lg leading-relaxed">
              <p className="animate-fade-in font-medium text-3xl text-white">
                I don't just design. I don't just brand. I <strong className="text-accent">build empires out of ideas</strong>.
              </p>
              
              <p className="animate-fade-in text-white/90 text-xl">
                Every project I touch carries the same weight: <strong className="text-white">dominate your market or don't bother calling me.</strong>
              </p>

              <p className="animate-fade-in text-white/90 text-xl">
                I've spent years sharpening one weapon — <strong className="text-accent">brand power</strong>. The kind of power that flips customers into believers, turns noise into influence, and makes competitors whisper your name like a threat.
              </p>

              <p className="animate-fade-in text-white/90 text-xl">
                If you're looking for "just another creative," I'm not your guy.
              </p>

              <p className="animate-fade-in text-2xl font-medium text-white">
                If you want someone who brings <strong className="text-accent">force, fire, and flawless execution</strong> — then you've already found your king. 👑
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Light Grey Background */}
      <section className="py-20 bg-[#f2f2f2]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-2xl font-display text-primary mb-8">
              "Stop scrolling. Start conquering. Your brand deserves a crown."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+2349137145159">
                <Button variant="premium" size="lg" className="w-full sm:w-auto">
                  <Phone className="mr-2" />
                  Crown Your Brand — Call Now
                </Button>
              </a>
              <a href="https://wa.me/2348160891799" target="_blank" rel="noopener noreferrer">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="mr-2" />
                  Claim Your Throne on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}