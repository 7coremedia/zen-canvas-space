import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="bg-[#ffffff] min-h-screen">
      <Header />
      <main className="px-4 md:px-8 lg:px-16">
        <section className="py-16">
          {/* Thumbnail Container */}
          <div className="relative mb-24">
            <img
              src="/public/home/about-tumb.png"
              alt="About Hero Thumbnail"
              className="w-full h-auto object-cover aspect-video"
            />
          </div>

          <div className="relative -mt-40">
            <div className="flex flex-col md:flex-row items-start justify-between">
              {/* Left side: Profile Pic and Details */}
              <div className="flex items-start space-x-4">
                <img
                  src="/public/home/the-king.png"
                  alt="Edmund Chan"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover"
                />
                <div className="pt-24 md:pt-32">
                  <h1 className="text-2xl md:text-3xl font-bold">Edmund Chan</h1>
                  <p className="text-muted-foreground">@KingEdmundChan</p>
                  <p className="text-muted-foreground">Leader of The Forceful Company</p>
                </div>
              </div>

              {/* Right side: CTA Buttons */}
              <div className="flex items-center space-x-4 mt-4 md:mt-32">
                <a href="tel:+2349137145159">
                  <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black">
                    call now
                  </Button>
                </a>
                <a href="https://wa.me/2348160891799" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black">
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
