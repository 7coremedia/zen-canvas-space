import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import MediaUpload from "@/components/admin/MediaUpload";
import PartnerManager from "@/components/admin/PartnerManager";
import { PortfolioItem } from "@/hooks/usePortfolio";

export const portfolioFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  client: z.string().optional(),
  category: z.enum(["Branding", "Logo", "Poster", "Other"]),
  tagline: z.string().optional(),
  year: z.string().optional(),
  is_multiple_partners: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

type PortfolioFormProps = {
  initialData?: PortfolioItem;
  onSubmit: (data: PortfolioFormValues & { 
    media_url: string;
    full_image_url?: string;
  }) => void | Promise<void>;
  isLoading?: boolean;
};

export default function PortfolioForm({ 
  initialData,
  onSubmit,
  isLoading 
}: PortfolioFormProps) {
  const navigate = useNavigate();
  const [mediaUrl, setMediaUrl] = useState(initialData?.media_url || "");
  const [fullImageUrl, setFullImageUrl] = useState(initialData?.full_image_url || "");

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: initialData || {
      title: "",
      category: "Branding",
      is_multiple_partners: false,
      is_published: false,
    },
  });

  const handleSubmit = async (values: PortfolioFormValues) => {
    if (!mediaUrl) {
      form.setError("root", { message: "Please upload a cover image" });
      return;
    }

    await onSubmit({
      ...values,
      media_url: mediaUrl,
      full_image_url: fullImageUrl,
    });
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Media Upload Section */}
          <div className="space-y-4">
            <FormLabel>Cover Image</FormLabel>
            <MediaUpload
              value={mediaUrl}
              onChange={setMediaUrl}
              accept="image/*"
              maxSize={5242880} // 5MB
            />
            
            <FormLabel>Full Project Image (Optional)</FormLabel>
            <MediaUpload
              value={fullImageUrl}
              onChange={setFullImageUrl}
              accept="image/*"
              maxSize={10485760} // 10MB
            />
          </div>

          {/* Basic Info */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Branding">Branding</SelectItem>
                    <SelectItem value="Logo">Logo</SelectItem>
                    <SelectItem value="Poster">Poster</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Partner Configuration */}
          <FormField
            control={form.control}
            name="is_multiple_partners"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Multiple Partners</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Enable if this project involves multiple collaborating brands
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("is_multiple_partners") && (
            <PartnerManager
              portfolioId={initialData?.id}
              onError={(error) => form.setError("root", { message: error })}
            />
          )}

          {/* Publication Status */}
          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Make this portfolio item visible to the public
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Form Error Message */}
          {form.formState.errors.root && (
            <div className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/portfolio")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Portfolio"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}