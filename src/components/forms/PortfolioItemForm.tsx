import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProjectDetails } from "@/components/smart-blocks/ProjectInfoOverlay";

// This schema should align with your Supabase table structure for 'portfolio_items'
const portfolioItemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters."),
  cover_url: z.string().url("Must be a valid URL."),
  portfolio_type: z.enum(["case_study", "project"]).default("project"),
  
  // New Project Details fields
  client: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  our_role: z.string().optional(),
  the_challenge: z.string().optional(),
  the_solution: z.string().optional(),
  notes: z.any().optional(), // For the rich-text editor content
  is_notes_downloadable: z.boolean().default(true),
  is_published: z.boolean().default(false),
});

type PortfolioItemFormValues = z.infer<typeof portfolioItemSchema>;

type Props = {
  initialData?: Partial<PortfolioItemFormValues>;
  onSubmit: (data: PortfolioItemFormValues) => void;
  isSubmitting?: boolean;
};

export default function PortfolioItemForm({ initialData, onSubmit, isSubmitting }: Props) {
  const form = useForm<PortfolioItemFormValues>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      cover_url: "",
      portfolio_type: "project",
      client: "",
      industry: "",
      location: "",
      our_role: "",
      the_challenge: "",
      the_solution: "",
      notes: undefined,
      is_notes_downloadable: true,
      is_published: false,
    },
  });

  // Helper to render a form field for the project details
  const renderDetailField = (name: keyof ProjectDetails, label: string, placeholder: string, isTextarea = false) => (
    <FormField
      control={form.control}
      name={name as keyof PortfolioItemFormValues}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea placeholder={placeholder} {...field} className="min-h-[100px]" />
            ) : (
              <Input placeholder={placeholder} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Core Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Project Title" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input placeholder="project-slug-for-url" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="cover_url" render={({ field }) => (
              <FormItem><FormLabel>Cover Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>About Project</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderDetailField("client", "Client", "e.g., Aalux Labs")}
              {renderDetailField("industry", "Industry", "e.g., Luxury Beauty")}
              {renderDetailField("location", "Location", "e.g., Lagos, Nigeria")}
              {renderDetailField("our_role", "Our Role", "e.g., Full Brand Identity")}
            </div>
            {renderDetailField("the_challenge", "The Challenge", "Describe the client's problem.", true)}
            {renderDetailField("the_solution", "The Solution", "Describe how you solved it.", true)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Project Notes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Editable)</FormLabel>
                    <FormControl>
                       {/* 
                         This is where your rich-text editor component will go.
                         You will pass it `field.value` and `field.onChange`.
                         For now, a simple textarea is a placeholder.
                       */}
                      <Textarea
                        placeholder="Add detailed project notes, research, and insights here..."
                        className="min-h-[250px] prose prose-sm max-w-none p-3"
                        value={typeof field.value === 'object' ? JSON.stringify(field.value) : field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>This content can be made downloadable on the portfolio page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField control={form.control} name="is_notes_downloadable" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5"><FormLabel>Allow Notes Download</FormLabel><FormDescription>Let visitors download the project notes.</FormDescription></div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="is_published" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5"><FormLabel>Publish Project</FormLabel><FormDescription>Make this portfolio item visible to the public.</FormDescription></div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Create Project")}
        </Button>
      </form>
    </Form>
  );
}