import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
const testimonials = [{
  quote: "King transformed our scattered ideas into a decisive brand system. We saw immediate lift in trust and conversions.",
  author: "Amara O.",
  role: "CMO, Aether Labs"
}, {
  quote: "Bold, elegant, and unforgettable. The logo and guidelines gave us a voice that finally matches our ambition.",
  author: "Marcus K.",
  role: "Founder, Northline"
}, {
  quote: "Every detail felt intentional. The launch assets were stunning and plug-and-play for our team.",
  author: "Jade R.",
  role: "Brand Lead, Velta"
}];
export default function Testimonials() {
  return <section className="container mx-auto py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl md:text-4xl">What Clients Say</h2>
        <p className="mt-2 text-muted-foreground">Results and relationships that stand the test of time.</p>
      </div>
      <div className="relative">
        <Carousel className="mx-auto max-w-3xl" opts={{
        loop: true,
        align: "start"
      }}>
          <CarouselContent>
            {testimonials.map((t, i) => <CarouselItem key={i} className="basis-full">
                <figure className="mx-auto max-w-2xl border p-6 shadow-sm bg-[#f2f2f2] rounded-3xl px-[25px] py-[27px]">
                  <blockquote className="text-lg md:text-xl">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">
                    — {t.author}, {t.role}
                  </figcaption>
                </figure>
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="-left-10" />
          <CarouselNext className="-right-10" />
        </Carousel>
      </div>
    </section>;
}