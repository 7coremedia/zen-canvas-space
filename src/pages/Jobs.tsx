import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const openRoles = [
  { id: "gd-ft", title: "Graphic Designer — Full-time" },
  { id: "gd-pt", title: "Graphic Designer — Part-time" },
  { id: "md-ft", title: "Motion Designer — Full-time" },
  { id: "md-pt", title: "Motion Designer — Part-time" },
  { id: "pm", title: "Product Manager" },
];

const takenRoles = [
  { id: "chief-gd", title: "Chief Graphics Designer (Taken)" },
  { id: "head-mkt", title: "Head of Marketing (Taken)" },
  { id: "coo", title: "COO (Taken)" },
  { id: "gm", title: "General Manager (Taken)" },
];

const partnershipTypes = [
  "Freelancer / Contractor",
  "Printing Press",
  "Production House",
  "Photo/Video Studio",
  "Copywriting",
  "Media Buying",
  "Influencer / KOL",
  "Other Vendor",
];

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  track: z.enum(["job", "partnership"]),
  role: z.string().optional(),
  partnership: z.string().optional(),
  message: z.string().min(10),
  portfolio: z.string().optional(),
});

type Values = z.infer<typeof Schema>;

export default function Jobs() {
  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { track: "job" },
  });

  const onSubmit = (v: Values) => {
    const subject = encodeURIComponent(
      v.track === "job" ? "Job Application – KING" : "Partnership Application – KING"
    );
    const roleOrPartner = v.track === "job" ? `Role: ${v.role ?? "Any"}` : `Partnership: ${v.partnership ?? "General"}`;
    const body = encodeURIComponent(
      `Name: ${v.name}\nEmail: ${v.email}\nPhone: ${v.phone}\n${roleOrPartner}\nPortfolio: ${v.portfolio ?? "-"}\n\nMessage:\n${v.message}`
    );
    window.location.href = `mailto:kingedmundbrand@gmail.com?subject=${subject}&body=${body}`;
  };

  const track = form.watch("track");

  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Jobs & Partnerships – KING</title>
        <meta name="description" content="Apply for roles or partner with KING. Designers, motion, PM – plus partnerships for vendors and freelancers." />
        <link rel="canonical" href="/jobs" />
      </Helmet>

      {/* Page header in gravity tone */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-black mb-1">
          Ready to build with KING?
        </h1>
        <p className="text-gray-700 text-base font-light">
          Join the team or partner with us to move brands with gravity.
        </p>
      </div>

      {/* Two columns: roles on left, application on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Roles and partnerships list */}
        <section className="lg:col-span-6 space-y-8">
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="font-display text-2xl mb-4">Open Roles</h2>
            <ul className="space-y-3">
              {openRoles.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border p-3">
                  <span className="text-sm">{r.title}</span>
                  <Button size="sm" variant="gold" onClick={() => { form.setValue("track", "job"); form.setValue("role", r.title); document.getElementById("apply-anchor")?.scrollIntoView({ behavior: "smooth" }); }}>
                    Apply
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="font-display text-2xl mb-4">Taken Roles</h2>
            <p className="text-sm text-muted-foreground mb-4">
              These seats are currently filled, but we accept standout applications for future openings.
            </p>
            <ul className="space-y-3">
              {takenRoles.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border p-3">
                  <span className="text-sm">{r.title}</span>
                  <Button size="sm" variant="outline" onClick={() => { form.setValue("track", "job"); form.setValue("role", r.title.replace(" (Taken)", "")); document.getElementById("apply-anchor")?.scrollIntoView({ behavior: "smooth" }); }}>
                    Send speculative
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="font-display text-2xl mb-4">Partnerships</h2>
            <p className="text-sm text-muted-foreground mb-4">
              If you’re a specialist vendor or independent pro, partner with us.
            </p>
            <ul className="flex flex-wrap gap-2">
              {partnershipTypes.map((p) => (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => { form.setValue("track", "partnership"); form.setValue("partnership", p); document.getElementById("apply-anchor")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="px-3 py-1 text-xs rounded-full bg-black text-white hover:bg-black/90"
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Unified Application Form */}
        <section className="lg:col-span-6">
          <div id="apply-anchor" className="rounded-[2rem] border bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl mb-1">Apply now</h2>
            <p className="text-sm text-muted-foreground mb-6">
              We review every application carefully. Highlight outcomes, not just activities.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input className="rounded-2xl" placeholder="Your name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input className="rounded-2xl" type="email" placeholder="you@brand.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input className="rounded-2xl" placeholder="+234..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="track" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="rounded-2xl">
                            <SelectValue placeholder="Choose type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="job">Job</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {track === "job" ? (
                  <FormField name="role" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role you’re applying for</FormLabel>
                      <FormControl><Input className="rounded-2xl" placeholder="e.g., Motion Designer – Full-time" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ) : (
                  <FormField name="partnership" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partnership category</FormLabel>
                      <FormControl><Input className="rounded-2xl" placeholder="e.g., Printing Press" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}

                <FormField name="portfolio" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio / Work Links</FormLabel>
                    <FormControl><Input className="rounded-2xl" placeholder="Website, Behance, Drive, etc." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="message" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl><Textarea rows={5} className="rounded-3xl" placeholder="Tell us about outcomes you achieved and how you work." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="gold" type="submit">Submit Application</Button>
                  <Button variant="hero" type="button" onClick={() => form.reset({ track })}>Reset</Button>
                </div>
              </form>
            </Form>
          </div>
        </section>
      </div>
    </main>
  );
}
