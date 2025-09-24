import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    portfolio_type: 'gallery' | 'case_study';
    pdf_url?: string | null;
    partners?: Array<{ name: string; social_name: string; social_link: string; image_url: string }>
  }) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<PortfolioFormData> & {
    media_url?: string;
    full_image_url?: string;
    media_files?: MediaFile[];
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

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      client: initialData?.client ?? "",
      category: initialData?.category ?? "Branding",
      tagline: initialData?.tagline ?? "",
      year: initialData?.year ?? "",
      is_published: initialData?.is_published ?? true,
      is_multiple_partners: initialData?.is_multiple_partners ?? false,
      brand_name: initialData?.brand_name ?? "",
    }
  });

  const watchIsMultiplePartners = watch("is_multiple_partners");

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

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input id="title" {...register("title")} placeholder="Enter project title" className="mt-1" />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Client */}
            <div>
              <Label htmlFor="client">Client</Label>
              <Input id="client" {...register("client")} placeholder="Client name" className="mt-1" />
            </div>

            {/* Category and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value as any)} defaultValue={initialData?.category}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Branding">Branding</SelectItem>
                    <SelectItem value="Logo">Logo</SelectItem>
                    <SelectItem value="Poster">Poster</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" {...register("year")} placeholder="2024" className="mt-1" />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <Label htmlFor="tagline">Tagline *</Label>
              <Textarea id="tagline" {...register("tagline")} placeholder="A brief description of the project" className="mt-1 min-h-[80px]" />
              {errors.tagline && <p className="text-red-500 text-sm mt-1">{errors.tagline.message}</p>}
            </div>

            {/* Multiple Partners Toggle */}
            <div className="flex items-center space-x-2">
              <Switch id="is_multiple_partners" checked={watchIsMultiplePartners} onCheckedChange={(checked) => setValue("is_multiple_partners", checked)} />
              <Label htmlFor="is_multiple_partners">Multiple Partners/Team Project</Label>
            </div>

            {/* Brand/Project Name */}
            {watchIsMultiplePartners && (
              <div>
                <Label htmlFor="brand_name">Brand/Project Name</Label>
                <Input id="brand_name" {...register("brand_name")} placeholder="Brand or project name" className="mt-1" />
              </div>
            )}

            {/* Publish Toggle */}
            <div className="flex items-center space-x-2">
              <Switch id="is_published" checked={watch("is_published")} onCheckedChange={(checked) => setValue("is_published", checked)} />
              <Label htmlFor="is_published">Publish Immediately</Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
              {isLoading ? "Saving..." : mode === 'gallery' ? "Create Portfolio Item" : "Create Case Study"}
            </Button>
          </form>
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
            acceptedTypes={['image/*', 'video/*', '.pdf']}
          />
        )}
      </div>
    </div>
  );
}
