import React from "react";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import MediaPreview from "./MediaPreview";

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif' | 'pdf';
  name: string;
  size?: number;
}

interface DraggableMediaListProps {
  files: MediaFile[];
  onReorder: (files: MediaFile[]) => void;
  onRemove: (fileId: string) => void;
  className?: string;
}

export default function DraggableMediaList({ 
  files, 
  onReorder, 
  onRemove, 
  className = "" 
}: DraggableMediaListProps) {
  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= files.length) return;
    
    const items = Array.from(files);
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);
    
    onReorder(items);
  };

  if (files.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>No media files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {files.map((file, index) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm"
        >
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveItem(index, index - 1)}
              disabled={index === 0}
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveItem(index, index + 1)}
              disabled={index === files.length - 1}
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
          </div>
          
          <MediaPreview
            file={file}
            size="small"
            showRemove={false}
            className="flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {file.type} • {file.size ? formatFileSize(file.size) : 'Unknown size'}
            </p>
          </div>
          
          <button
            onClick={() => onRemove(file.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
