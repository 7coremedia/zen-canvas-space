import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
export default function Cta() {
  return <section className="container mx-auto py-16">
      <div className="border p-8 text-center bg-[#f2f2f2] rounded-3xl">
        <h2 className="font-display text-2xl md:text-3xl">Ready to build a brand with gravity?</h2>
        <p className="mt-2 text-muted-foreground">Let’s turn your vision into a decisive identity.</p>
        <div className="mt-6">
          <NavLink to="/onboarding"><Button variant="premium" size="lg">Work With Me</Button></NavLink>
        </div>
      </div>
    </section>;
}