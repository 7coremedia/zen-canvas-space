import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import MediaPreview from "./MediaPreview";
import DraggableMediaList from "./DraggableMediaList";

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif' | 'pdf';
  name: string;
  size?: number;
  file?: File;
}

interface EnhancedMediaUploadProps {
  coverImage?: MediaFile;
  mediaFiles?: MediaFile[];
  onCoverChange: (file: MediaFile | null) => void;
  onMediaFilesChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function EnhancedMediaUpload({
  coverImage,
  mediaFiles = [],
  onCoverChange,
  onMediaFilesChange,
  maxFiles = 10,
  acceptedTypes = ['image/*', 'video/*', '.pdf']
}: EnhancedMediaUploadProps) {
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const getFileType = (file: File): 'image' | 'video' | 'gif' | 'pdf' => {
    if (file.type.startsWith('image/')) {
      return file.type === 'image/gif' ? 'gif' : 'image';
    }
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'pdf';
    return 'image'; // fallback
  };

  const uploadToSupabase = async (file: File, bucket: string = 'portfolio-assets'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const onCoverDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploadingCover(true);
    try {
      const file = acceptedFiles[0];
      const url = await uploadToSupabase(file);
      
      const mediaFile: MediaFile = {
        id: Math.random().toString(36).slice(2),
        url,
        type: getFileType(file),
        name: file.name,
        size: file.size,
        file
      };
      
      onCoverChange(mediaFile);
    } catch (error) {
      console.error('Cover upload failed:', error);
    } finally {
      setUploadingCover(false);
    }
  }, [onCoverChange]);

  const onMediaDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploadingMedia(true);
    try {
      const uploadPromises = acceptedFiles.slice(0, maxFiles - mediaFiles.length).map(async (file) => {
        const url = await uploadToSupabase(file);
        
        return {
          id: Math.random().toString(36).slice(2),
          url,
          type: getFileType(file),
          name: file.name,
          size: file.size,
          file
        } as MediaFile;
      });

      const newFiles = await Promise.all(uploadPromises);
      onMediaFilesChange([...mediaFiles, ...newFiles]);
    } catch (error) {
      console.error('Media upload failed:', error);
    } finally {
      setUploadingMedia(false);
    }
  }, [mediaFiles, maxFiles, onMediaFilesChange]);

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    onDrop: onCoverDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false,
  });

  const { getRootProps: getMediaRootProps, getInputProps: getMediaInputProps, isDragActive: isMediaDragActive } = useDropzone({
    onDrop: onMediaDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - mediaFiles.length,
    multiple: true,
  });

  const removeCover = () => {
    onCoverChange(null);
  };

  const removeMediaFile = (fileId: string) => {
    onMediaFilesChange(mediaFiles.filter(f => f.id !== fileId));
  };

  const reorderMediaFiles = (reorderedFiles: MediaFile[]) => {
    onMediaFilesChange(reorderedFiles);
  };

  return (
    <div className="space-y-6">
      {/* Cover Image Upload */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cover Image</h3>
        
        {coverImage ? (
          <div className="space-y-4">
            <MediaPreview
              file={coverImage}
              size="cover"
              onRemove={removeCover}
              className="max-w-md mx-auto"
            />
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => document.getElementById('cover-input')?.click()}
                disabled={uploadingCover}
              >
                {uploadingCover ? 'Uploading...' : 'Change Cover'}
              </Button>
              <input
                id="cover-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) onCoverDrop(files);
                }}
              />
            </div>
          </div>
        ) : (
          <div
            {...getCoverRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isCoverDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${uploadingCover ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getCoverInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {uploadingCover ? 'Uploading...' : 'Upload Cover Image'}
            </p>
            <p className="text-sm text-gray-500">
              {isCoverDragActive ? 'Drop the image here' : 'Drag & drop or click to browse'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Recommended: 1920x1080px (16:9 aspect ratio)
            </p>
          </div>
        )}
      </Card>

      {/* Media Files Upload */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Media Files</h3>
          <span className="text-sm text-gray-500">
            {mediaFiles.length} / {maxFiles} files
          </span>
        </div>

        {/* Upload Area */}
        {mediaFiles.length < maxFiles && (
          <div
            {...getMediaRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-6
              ${isMediaDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${uploadingMedia ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getMediaInputProps()} />
            <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="font-medium text-gray-900 mb-1">
              {uploadingMedia ? 'Uploading...' : 'Add Media Files'}
            </p>
            <p className="text-sm text-gray-500">
              {isMediaDragActive ? 'Drop files here' : 'Images, videos, GIFs, or PDFs'}
            </p>
          </div>
        )}

        {/* Media Grid Preview */}
        {mediaFiles.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mediaFiles.map((file) => (
                <MediaPreview
                  key={file.id}
                  file={file}
                  size="medium"
                  showRemove={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Draggable File List */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Files {mediaFiles.length > 0 && '(drag to reorder)'}
          </h4>
          <DraggableMediaList
            files={mediaFiles}
            onReorder={reorderMediaFiles}
            onRemove={removeMediaFile}
          />
        </div>
      </Card>
    </div>
  );
}
