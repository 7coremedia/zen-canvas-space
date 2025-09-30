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

  // Auto-fill form with portfolio information from URL params
  useEffect(() => {
    const portfolioTitle = searchParams.get('portfolio');
    const portfolioUrl = searchParams.get('url');
    const planName = searchParams.get('plan');
    const planMessage = searchParams.get('message');

    const parts: string[] = [];

    if (planName || planMessage) {
      const header = planName ? `I'm interested in the ${planName} plan.` : "";
      parts.push([header, planMessage].filter(Boolean).join("\n\n"));
    }

    if (portfolioTitle && portfolioUrl) {
      parts.push(`I want this: ${portfolioTitle}\n\nPortfolio Link: ${portfolioUrl}`);
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
      <h1 className="font-display text-4xl">Contact</h1>
      <div className="mt-6 max-w-xl rounded-xl border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="you@brand.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="message" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl><Textarea rows={5} placeholder="How can I help?" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="pt-2"><Button variant="premium" type="submit">Send to WhatsApp</Button></div>
          </form>
        </Form>
      </div>
    </main>
  );
}