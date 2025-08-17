import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="bg-[#ffffff] min-h-screen">
      <Header />
      <main className="px-4 md:px-8 lg:px-16">
        <section className="py-16">
          {/* Thumbnail Image */}
          <div className="relative mb-24">
            <img
              src="/public/home/about-tumb.png"
              alt="About Hero Thumbnail"
              // The classes below make the image responsive
              className="w-full h-auto max-w-full object-contain aspect-video"
            />
          </div>

          <div className="relative -mt-40">
            <div className="flex flex-col md:flex-row items-start justify-end">
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