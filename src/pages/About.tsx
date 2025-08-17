import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="bg-[#ffffff] min-h-screen">
      <Header />
      <main className="px-4 md:px-8 lg:px-16">
        <section className="pt-0 pb-4">
          {/* Thumbnail Image */}
          <div className="relative mb-4">
            <img
              src="/home/about-tumb.png"
              alt="About Hero Thumbnail"
              // The classes below make the image responsive
              className="w-full h-auto max-w-full object-contain aspect-video"
            />
          </div>
        </section>

        {/* CTA Buttons - Moved and Centered */}
        <section className="py-2 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+2349137145159">
              <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black flex items-center space-x-2">
                <img src="/home/call-icon.png" alt="Call Icon" className="w-4 h-4" />
                <span>call now</span>
              </Button>
            </a>
            <a href="https://wa.me/2348160891799" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black">
                WhatsApp
              </Button>
            </a>
            <a href="https://www.instagram.com/kingedmundau" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black">
                Instagram
              </Button>
            </a>
            <a href="https://www.youtube.com/@KingEdmundChan" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black">
                YouTube
              </Button>
            </a>
          </div>
        </section>

        {/* New Section with the Image */}
        <section className="pt-2 pb-4">
          <img
            src="/home/about-cont.png"
            alt="About Content Image"
            className="w-full h-auto object-contain"
          />
        </section>

        {/* CTA Buttons - Duplicated for last CTA */}
        <section className="pt-2 pb-16 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+2349137145159">
              <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black flex items-center space-x-2">
                <img src="/home/call-icon.png" alt="Call Icon" className="w-4 h-4" />
                <span>call now</span>
              </Button>
            </a>
            <a href="https://wa.me/2348160891799" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black">
                WhatsApp
              </Button>
            </a>
            <a href="https://www.instagram.com/kingedmundau" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black">
                Instagram
              </Button>
            </a>
            <a href="https://www.youtube.com/@KingEdmundChan" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#e0a113] hover:bg-[#e0a113]/90 text-black">
                YouTube
              </Button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;