import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type MediaUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSize?: number;
};

export default function MediaUpload({
  value,
  onChange,
  accept = "image/*",
  maxSize = 5242880, // 5MB default
}: MediaUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        
        // Generate a unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("portfolio_media")
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("portfolio_media")
          .getPublicUrl(data.path);

        onChange(publicUrl);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [accept]: [],
    },
    maxSize,
    multiple: false,
  });

  const removeFile = async () => {
    try {
      // Extract filename from URL
      const fileName = value?.split("/").pop();
      if (!fileName) return;

      // Delete from Supabase Storage
      await supabase.storage
        .from("portfolio_media")
        .remove([fileName]);

      onChange("");
    } catch (error) {
      console.error("Failed to remove file:", error);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          {accept.includes("image") ? (
            <img
              src={value}
              alt="Uploaded media"
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              src={value}
              controls
              className="h-full w-full object-cover"
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            flex aspect-video w-full cursor-pointer flex-col items-center 
            justify-center rounded-lg border border-dashed p-4 transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-input"}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the file here"
              : "Drag & drop or click to upload"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
          </p>
        </div>
      )}
    </div>
  );
}