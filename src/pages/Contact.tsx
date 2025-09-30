import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Schema = z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(10) });

type Values = z.infer<typeof Schema>;

export default function Contact() {
  const [searchParams] = useSearchParams();
  const form = useForm<Values>({ resolver: zodResolver(Schema) });
  const whatsappNumber = "2348160891799"; // Your WhatsApp number without + sign
  const callNumber = "+2349137145159";

  // Auto-fill form with portfolio information from URL params
  useEffect(() => {
    const portfolioTitle = searchParams.get('portfolio');
    const portfolioUrl = searchParams.get('url');
    const planName = searchParams.get('plan');
    const planMessage = searchParams.get('message');
    const service = searchParams.get('service');

    const parts: string[] = [];

    if (planName || planMessage) {
      const header = planName ? `I'm interested in the ${planName} plan.` : "";
      parts.push([header, planMessage].filter(Boolean).join("\n\n"));
    }

    if (portfolioTitle && portfolioUrl) {
      parts.push(`I want this: ${portfolioTitle}\n\nPortfolio Link: ${portfolioUrl}`);
    }

    if (service) {
      parts.unshift(`I want design for: ${service}`);
    }

    if (parts.length) {
      form.setValue('message', parts.join('\n\n'));
    }
  }, [searchParams, form]);

  const sendToWhatsApp = (values: Values) => {
    const message = `Hi! I'm ${values.name}.

Email: ${values.email}
Message: ${values.message}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({ 
      title: "Redirecting to WhatsApp", 
      description: "Opening WhatsApp with your message." 
    });
    
    form.reset();
  };

  const onSubmit = (v: Values) => {
    sendToWhatsApp(v);
  };

  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Contact – KING</title>
        <meta name="description" content="Contact KING for branding and creative projects." />
        <link rel="canonical" href="/contact" />
      </Helmet>
      {/* CTA-style header borrowed from gravity block */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-black mb-1">
          READY TO BUILD A BRAND WITH GRAVITY?
        </h1>
        <p className="text-gray-700 text-base font-light">Let's turn your vision into a decisive identity.</p>
      </div>

      {/* Elevated rounded container */}
      <div className="mt-2 max-w-4xl mx-auto rounded-[2rem] border border-grey bg-white p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField name="message" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl><Textarea rows={5} className="rounded-3xl" placeholder="How can I help?" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* Action buttons inspired by CTA block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              <div className="flex gap-3">
                <Button variant="gold" type="submit">Send via WhatsApp</Button>
                <Button
                  type="button"
                  variant="hero"
                  onClick={() => {
                    const values = form.getValues();
                    const subject = encodeURIComponent("Brand enquiry – KING");
                    const body = encodeURIComponent(
                      `Hi KING,\n\n${values.message || ''}\n\n— ${values.name || ''} (${values.email || ''})`
                    );
                    window.location.href = `mailto:kingedmundbrand@gmail.com?subject=${subject}&body=${body}`;
                  }}
                >
                  Email us
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(`tel:${callNumber}`, '_self')}
              >
                Call now
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}