import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const Schema = z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(10) });

type Values = z.infer<typeof Schema>;

export default function Contact() {
  const form = useForm<Values>({ resolver: zodResolver(Schema) });

  const onSubmit = (v: Values) => {
    console.log("contact submit", v);
    toast({ title: "Message sent", description: "I’ll get back to you soon." });
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
            <div className="pt-2"><Button variant="premium">Send</Button></div>
          </form>
        </Form>
      </div>
    </main>
  );
}
