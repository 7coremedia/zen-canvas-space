import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileImage, 
  FileVideo, 
  X, 
  Plus,
  Trash2,
  ImageIcon,
  VideoIcon,
  FileIcon,
  CheckCircle
} from "lucide-react";

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().optional(),
  category: z.enum(["Branding", "Logo", "Poster", "Other"]),
  tagline: z.string().min(1, "Tagline is required"),
  year: z.string().optional(),
  is_published: z.boolean().default(true),
  is_multiple_partners: z.boolean().default(false),
  brand_name: z.string().optional(),
  partners: z.array(z.object({
    name: z.string().min(1, "Partner name is required"),
    social_name: z.string().optional(),
    social_link: z.string().optional(),
    image_url: z.string().optional(),
  })).optional(),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
}

interface CreatePortfolioFormProps {
  onSubmit: (data: PortfolioFormData & { media_url: string; full_image_url?: string }) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<PortfolioFormData> & {
    media_url?: string;
    full_image_url?: string;
    partners?: Array<{ name: string; social_name: string; social_link: string; image_url: string }>
  };
}

export default function CreatePortfolioForm({ onSubmit, isLoading, initialData }: CreatePortfolioFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    if (initialData?.media_url) {
      return [{
        id: 'existing',
        file: new File([new Blob()], 'existing'),
        preview: initialData.media_url,
        progress: 100,
        status: 'completed',
        url: initialData.media_url,
      }];
    }
    return [];
  });
  const [dragActive, setDragActive] = useState(false);
  const [partners, setPartners] = useState<Array<{
    name: string;
    social_name: string;
    social_link: string;
    image_url: string;
  }>>((initialData?.partners as any) || []);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title ?? undefined,
      client: initialData?.client ?? undefined,
      category: initialData?.category as any,
      tagline: initialData?.tagline ?? undefined,
      year: initialData?.year ?? undefined,
      is_published: initialData?.is_published ?? true,
      is_multiple_partners: initialData?.is_multiple_partners ?? false,
      brand_name: initialData?.brand_name ?? undefined,
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const preview = URL.createObjectURL(file);
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        progress: 0,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);
      uploadFile(newFile);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.webm']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const uploadFile = async (fileObj: UploadedFile) => {
    try {
      const fileExt = fileObj.file.name.split('.').pop();
      const fileName = `${fileObj.id}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, fileObj.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setUploadedFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, progress: 100, status: 'completed', url: data.publicUrl }
          : f
      ));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: 'error' }
          : f
      ));
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <VideoIcon className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onFormSubmit = async (data: PortfolioFormData) => {
    const coverFile = uploadedFiles.find(f => f.status === 'completed');
    const existingUrl = initialData?.media_url;
    const finalUrl = coverFile?.url || existingUrl;
    if (!finalUrl) {
      alert('Please upload at least one media file');
      return;
    }

    await onSubmit({
      ...data,
      media_url: finalUrl,
      full_image_url: finalUrl,
      partners: partners.filter(p => p.name.trim() !== ''),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side - Form */}
      <div className="space-y-6">
        <Card className="p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Portfolio Details</h2>
          
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter project title"
                className="rounded-lg"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                {...register("client")}
                placeholder="Client name (optional)"
                className="rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value as any)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Branding">Branding</SelectItem>
                    <SelectItem value="Logo">Logo</SelectItem>
                    <SelectItem value="Poster">Poster</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  {...register("year")}
                  placeholder="2024"
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline *</Label>
              <Textarea
                id="tagline"
                {...register("tagline")}
                placeholder="Brief description of the project"
                rows={3}
                className="rounded-lg"
              />
              {errors.tagline && (
                <p className="text-sm text-red-500">{errors.tagline.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="multiple-partners"
                  checked={watch("is_multiple_partners")}
                  onCheckedChange={(checked) => setValue("is_multiple_partners", checked)}
                />
                <Label htmlFor="multiple-partners">Multiple Partners/Team Project</Label>
              </div>

              {watch("is_multiple_partners") && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <Label htmlFor="brand-name">Brand/Project Name</Label>
                    <Input
                      id="brand-name"
                      {...register("brand_name")}
                      placeholder="e.g., Periscope, KING Collective"
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Partners</Label>
                    <div className="space-y-3 mt-2">
                      {partners.map((partner, index) => (
                        <div key={index} className="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-white">
                          <div>
                            <Label className="text-xs text-muted-foreground">Name</Label>
                            <Input
                              placeholder="Partner name"
                              value={partner.name}
                              onChange={(e) => {
                                const newPartners = [...partners];
                                newPartners[index].name = e.target.value;
                                setPartners(newPartners);
                              }}
                              className="rounded-lg"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Social Handle</Label>
                            <Input
                              placeholder="@username"
                              value={partner.social_name}
                              onChange={(e) => {
                                const newPartners = [...partners];
                                newPartners[index].social_name = e.target.value;
                                setPartners(newPartners);
                              }}
                              className="rounded-lg"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Website/Social Link</Label>
                            <Input
                              placeholder="https://..."
                              value={partner.social_link}
                              onChange={(e) => {
                                const newPartners = [...partners];
                                newPartners[index].social_link = e.target.value;
                                setPartners(newPartners);
                              }}
                              className="rounded-lg"
                            />
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newPartners = partners.filter((_, i) => i !== index);
                                setPartners(newPartners);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPartners([...partners, { name: "", social_name: "", social_link: "", image_url: "" }])}
                        className="w-full rounded-lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Partner
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={watch("is_published")}
                onCheckedChange={(checked) => setValue("is_published", checked)}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || uploadedFiles.length === 0}
              className="w-full rounded-lg bg-black hover:bg-gray-800"
            >
              {isLoading ? "Creating..." : "Create Portfolio Item"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Right Side - File Upload */}
      <div className="space-y-6">
        <Card className="p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Upload Media</h2>
          
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop your files here or browse</p>
                <p className="text-sm text-muted-foreground">Max file size up to 50 MB</p>
              </div>
              <Button variant="outline" className="rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium">Uploaded Files</h3>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {getFileIcon(file.file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file.size)}
                      </p>
                      {file.status === 'uploading' && (
                        <Progress value={file.progress} className="mt-1 h-1" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <span className="text-xs text-red-500">Error</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Preview */}
        {uploadedFiles.some(f => f.status === 'completed') && (
          <Card className="p-6 rounded-xl">
            <h3 className="font-medium mb-4">Preview</h3>
            <div className="space-y-3">
              {uploadedFiles.filter(f => f.status === 'completed').map((file) => (
                <div key={file.id} className="relative group">
                  {file.file.type.startsWith('image/') ? (
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                      <VideoIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
