import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Schema = z.object({
  org: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  sector: z.string().min(2), // Government, Private, NGO, Startup
  budget: z.string().optional(),
  timeline: z.string().optional(),
  brief: z.string().min(20),
  links: z.string().optional(),
});

type Values = z.infer<typeof Schema>;

export default function Contracts() {
  const form = useForm<Values>({ resolver: zodResolver(Schema) });

  const onSubmit = (v: Values) => {
    const subject = encodeURIComponent("Contract Award / RFP – KING");
    const body = encodeURIComponent(
      `Organization: ${v.org}\nSector: ${v.sector}\nContact: ${v.contactName}\nEmail: ${v.email}\nPhone: ${v.phone}\nBudget: ${v.budget ?? "-"}\nTimeline: ${v.timeline ?? "-"}\nLinks: ${v.links ?? "-"}\n\nBrief:\n${v.brief}`
    );
    window.location.href = `mailto:kingedmundbrand@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Award a Contract – KING</title>
        <meta name="description" content="Commission KING for branding and creative contracts. Submit a professional brief." />
        <link rel="canonical" href="/contracts" />
      </Helmet>

      {/* Header tone */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-black mb-1">
          Commission KING for your next contract
        </h1>
        <p className="text-gray-700 text-base font-light">
          Government, private, and NGO projects—handled with strategy and rigor.
        </p>
      </div>

      <div className="max-w-4xl mx-auto rounded-[2rem] border bg-white p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="org" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl><Input className="rounded-2xl" placeholder="Company / Ministry / Agency" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="sector" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Select a sector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="NGO">NGO</SelectItem>
                      <SelectItem value="Startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="contactName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl><Input className="rounded-2xl" placeholder="Full name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input className="rounded-2xl" type="email" placeholder="you@org.gov" {...field} /></FormControl>
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
              <FormField name="budget" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (optional)</FormLabel>
                  <FormControl><Input className="rounded-2xl" placeholder="Range or amount" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="timeline" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline (optional)</FormLabel>
                  <FormControl><Input className="rounded-2xl" placeholder="E.g., 8–12 weeks" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name="links" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Links (RFP/Brief, site, assets)</FormLabel>
                <FormControl><Input className="rounded-2xl" placeholder="Drive, website, docs" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="brief" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Project Brief</FormLabel>
                <FormControl><Textarea rows={6} className="rounded-3xl" placeholder="Objective, scope, outcomes, stakeholders, constraints…" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-3 pt-2">
              <Button variant="gold" type="submit">Submit Contract</Button>
              <Button variant="hero" type="button" onClick={() => form.reset()}>Reset</Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
