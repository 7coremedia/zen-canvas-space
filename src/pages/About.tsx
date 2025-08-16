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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Crown Image */}
            <div className="relative">
              <img
                src="/home/the-king.png"
                alt="KING wearing crown - Brand strategist and creative director"
                className="w-full max-w-lg mx-auto animate-scale-in hover-scale"
                loading="eager"
              />
            </div>

            {/* Right: Headlines & CTAs */}
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight mb-4">
                  Crowned in Creativity.
                  <span className="block text-accent">Ruthless in Strategy.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Not every creative wears a crown. But I do — because I've earned it.
                </p>
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+2349137145159">
                  <Button variant="gold" size="lg" className="w-full sm:w-auto">
                    <Phone className="mr-2" />
                    Call the King
                  </Button>
                </a>
                <a href="https://wa.me/2348160891799" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <MessageCircle className="mr-2" />
                    Message on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="animate-fade-in font-medium text-2xl">
                I don't just design. I don't just brand. I <strong className="text-accent">build empires out of ideas</strong>.
              </p>
              
              <p className="animate-fade-in">
                Every project I touch carries the same weight: <strong>dominate your market or don't bother calling me.</strong>
              </p>

              <p className="animate-fade-in">
                I've spent years sharpening one weapon — <strong className="text-accent">brand power</strong>. The kind of power that flips customers into believers, turns noise into influence, and makes competitors whisper your name like a threat.
              </p>

              <p className="animate-fade-in">
                If you're looking for "just another creative," I'm not your guy.
              </p>

              <p className="animate-fade-in text-2xl font-medium">
                If you want someone who brings <strong className="text-accent">force, fire, and flawless execution</strong> — then you've already found your king. 👑
              </p>
            </div>

            {/* About Section CTAs */}
            <div className="pt-12 space-y-4">
              <p className="text-center text-xl font-display text-accent mb-8">
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
        </div>
      </section>

      {/* Floating CTAs */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a 
          href="https://wa.me/2348160891799" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative"
          title="Message KING directly"
        >
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-elegant pulse"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </a>
        
        <a 
          href="tel:+2349137145159"
          className="group relative"
          title="Speak to KING now"
        >
          <Button 
            size="icon" 
            variant="gold" 
            className="h-14 w-14 rounded-full shadow-elegant pulse"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </a>
      </div>
    </>
  );
}