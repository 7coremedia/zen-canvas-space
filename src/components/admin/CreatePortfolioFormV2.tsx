import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartnerManager from "./PartnerManager";
import EnhancedMediaUpload from "./EnhancedMediaUpload";
import { supabase } from "@/integrations/supabase/client";

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().optional(),
  category: z.enum(["Branding", "Logo", "Poster", "Other"]),
  // New "About Project" fields
  industry: z.string().optional(),
  location: z.string().optional(),
  our_role: z.string().optional(),
  the_challenge: z.string().optional(),
  the_solution: z.string().optional(),
  notes: z.any().optional(),
  is_notes_downloadable: z.boolean().default(true),
  // End of new fields
  tagline: z.string().min(1, "Tagline is required"),
  year: z.string().optional(),
  is_published: z.boolean().default(true),
  is_multiple_partners: z.boolean().default(false),
  brand_name: z.string().optional(),

});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif' | 'pdf';
  name: string;
  size?: number;
}

interface CreatePortfolioFormV2Props {
  onSubmit: (data: PortfolioFormData & { 
    media_url: string; 
    full_image_url?: string;
    media_files?: MediaFile[];
    // New "About Project" fields for initialData
    industry?: string;
    location?: string;
    our_role?: string;
    the_challenge?: string;
    the_solution?: string;
    notes?: any;
    is_notes_downloadable?: boolean;
    portfolio_type: 'gallery' | 'case_study';
    pdf_url?: string | null;
    partners?: Array<{ name: string; social_name: string; social_link: string; image_url: string }>
  }) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<PortfolioFormData> & {
    media_url?: string;
    full_image_url?: string;
    media_files?: MediaFile[];
    industry?: string;
    location?: string;
    our_role?: string;
    the_challenge?: string;
    the_solution?: string;
    notes?: any;
    is_notes_downloadable?: boolean;
    portfolio_type?: 'gallery' | 'case_study';
    pdf_url?: string | null;
    partners?: Array<{ name: string; social_name: string; social_link: string; image_url: string }>
  };
}

export default function CreatePortfolioFormV2({ 
  onSubmit, 
  isLoading, 
  initialData 
}: CreatePortfolioFormV2Props) {
  const [coverImage, setCoverImage] = useState<MediaFile | null>(() => {
    if (initialData?.media_url) {
      return {
        id: 'existing-cover',
        url: initialData.media_url,
        type: 'image',
        name: 'Cover Image',
      };
    }
    return null;
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(
    initialData?.media_files || []
  );

  // Mode tabs: gallery vs case study
  const [mode, setMode] = useState<'gallery' | 'case_study'>(initialData?.portfolio_type || 'gallery');
  const [pdfFile, setPdfFile] = useState<{ url: string; name: string; size?: number } | null>(
    initialData?.pdf_url ? { url: initialData.pdf_url, name: 'Case Study', size: undefined } : null
  );

  const [partners, setPartners] = useState<Array<{
    name: string;
    social_name: string;
    social_link: string;
    image_url: string;
  }>>(initialData?.partners || []);
  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      client: initialData?.client ?? "",
      category: initialData?.category ?? "Branding",
      tagline: initialData?.tagline ?? "",
      year: initialData?.year ?? "",
      // New "About Project" fields
      industry: initialData?.industry ?? "",
      location: initialData?.location ?? "",
      our_role: initialData?.our_role ?? "",
      the_challenge: initialData?.the_challenge ?? "",
      the_solution: initialData?.the_solution ?? "",
      notes: initialData?.notes,
      is_notes_downloadable: initialData?.is_notes_downloadable ?? true,
      is_published: initialData?.is_published ?? true,
      is_multiple_partners: initialData?.is_multiple_partners ?? false,
      brand_name: initialData?.brand_name ?? "",
    }
  });

  const watchIsMultiplePartners = form.watch("is_multiple_partners");

  const onFormSubmit = async (data: PortfolioFormData) => {
    if (!coverImage?.url) {
      alert('Please upload a cover image');
      return;
    }

    if (mode === 'case_study' && !pdfFile?.url) {
      alert('Please upload the Case Study PDF');
      return;
    }

    await onSubmit({
      ...data,
      media_url: coverImage.url,
      full_image_url: coverImage.url,
      media_files: mode === 'gallery' ? mediaFiles : [],
      // New "About Project" fields
      industry: data.industry,
      location: data.location,
      our_role: data.our_role,
      the_challenge: data.the_challenge,
      the_solution: data.the_solution,
      notes: data.notes,
      is_notes_downloadable: data.is_notes_downloadable,
      portfolio_type: mode,
      pdf_url: mode === 'case_study' ? (pdfFile?.url || null) : null,
      partners: partners.filter(p => p.name.trim() !== ''),
    });
  };

  const uploadPdf = async (file: File) => {
    const ext = file.name.split('.').pop();
    const name = `${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from('portfolio-assets').upload(name, file);
    if (error) throw error;
    const { data: pub } = supabase.storage.from('portfolio-assets').getPublicUrl(data.path);
    return pub.publicUrl;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side - Form */}
      <div className="space-y-6">
        <Card className="p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Portfolio Details</h2>

          {/* Mode Tabs */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="gallery">Upload Project</TabsTrigger>
              <TabsTrigger value="case_study">Upload Case Study (PDF)</TabsTrigger>
            </TabsList>
          </Tabs>

          <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Title */}
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Project Title *</FormLabel><FormControl><Input placeholder="Enter project title" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            {/* Client */}
            <FormField control={form.control} name="client" render={({ field }) => (
              <FormItem><FormLabel>Client</FormLabel><FormControl><Input placeholder="Client name" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            {/* Category and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Branding">Branding</SelectItem>
                      <SelectItem value="Logo">Logo</SelectItem>
                      <SelectItem value="Poster">Poster</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem><FormLabel>Year</FormLabel><FormControl><Input placeholder="2024" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            {/* Tagline */}
            <FormField control={form.control} name="tagline" render={({ field }) => (
              <FormItem><FormLabel>Tagline *</FormLabel><FormControl><Textarea placeholder="A brief description of the project" className="min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            {/* About Project Section */}
            <Card>
              <CardHeader><CardTitle>About Project</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="industry" render={({ field }) => (
                    <FormItem><FormLabel>Industry</FormLabel><FormControl><Input placeholder="e.g., Luxury Beauty" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Lagos, Nigeria" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="our_role" render={({ field }) => (
                  <FormItem><FormLabel>Our Role</FormLabel><FormControl><Input placeholder="e.g., Full Brand Identity" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="the_challenge" render={({ field }) => (
                  <FormItem><FormLabel>The Challenge</FormLabel><FormControl><Textarea placeholder="Describe the client's problem." {...field} className="min-h-[100px]" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="the_solution" render={({ field }) => (
                  <FormItem><FormLabel>The Solution</FormLabel><FormControl><Textarea placeholder="Describe how you solved it." {...field} className="min-h-[100px]" /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Project Notes Section */}
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
              </CardContent>
            </Card>

            {/* Multiple Partners Toggle */}
            <FormField control={form.control} name="is_multiple_partners" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Multiple Partners/Team Project</FormLabel></FormItem>
            )} />

            {/* Brand/Project Name */}
            {watchIsMultiplePartners && (
              <FormField control={form.control} name="brand_name" render={({ field }) => (
                <FormItem><FormLabel>Brand/Project Name</FormLabel><FormControl><Input placeholder="Brand or project name" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            )}

            {/* Publish Toggle */}
            <FormField control={form.control} name="is_published" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Publish Immediately</FormLabel></FormItem>
            )} />

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
              {isLoading ? "Saving..." : mode === 'gallery' ? "Create Portfolio Item" : "Create Case Study"}
            </Button>
          </form>
          </Form>
        </Card>

        {/* Partners Section */}
        {watchIsMultiplePartners && (
          <PartnerManager portfolioId={(initialData as any)?.id} onError={(message) => console.error(message)} />
        )}
      </div>

      {/* Right Side - Media Upload */}
      <div className="space-y-6">
        {mode === 'case_study' ? (
          <>
            <EnhancedMediaUpload coverImage={coverImage} mediaFiles={[]} onCoverChange={setCoverImage} onMediaFilesChange={() => {}} maxFiles={0} acceptedTypes={['image/*']} />
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Case Study PDF</h3>
              {!pdfFile ? (
                <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-gray-400">
                  <input type="file" accept="application/pdf" className="hidden" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      const url = await uploadPdf(f);
                      setPdfFile({ url, name: f.name, size: f.size });
                    } catch (err) {
                      console.error('PDF upload failed', err);
                      alert('Failed to upload PDF');
                    }
                  }} />
                  <div className="text-sm text-gray-600">Drop PDF here or click to browse</div>
                  <div className="text-xs text-gray-400 mt-1">Max 500 MB</div>
                </label>
              ) : (
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium text-sm">{pdfFile.name}</div>
                    <div className="text-xs text-gray-500">{pdfFile.size ? `${(pdfFile.size/1024/1024).toFixed(1)} MB` : ''}</div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setPdfFile(null)}>Remove</Button>
                </div>
              )}
            </Card>
          </>
        ) : (
          <EnhancedMediaUpload
            coverImage={coverImage}
            mediaFiles={mediaFiles}
            onCoverChange={setCoverImage}
            onMediaFilesChange={setMediaFiles}
            maxFiles={10}
            acceptedTypes={['image/*', 'video/*', 'application/pdf']}
          />
        )}
      </div>
    </div>
  );
}
