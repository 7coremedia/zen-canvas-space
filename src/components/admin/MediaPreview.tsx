import React, { useState } from "react";
import { X, Play, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif' | 'pdf';
  name: string;
  size?: number;
}

interface MediaPreviewProps {
  file: MediaFile;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  showRemove?: boolean;
  size?: 'small' | 'medium' | 'large' | 'cover';
}

export default function MediaPreview({ 
  file, 
  onRemove, 
  onClick, 
  className = "", 
  showRemove = true,
  size = 'medium'
}: MediaPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24", 
    large: "w-32 h-32",
    cover: "w-full aspect-video" // 16:9 aspect ratio for cover images
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (size === 'cover' && (file.type === 'image' || file.type === 'gif')) {
      setIsFullscreen(true);
    }
  };

  const renderPreview = () => {
    switch (file.type) {
      case 'image':
      case 'gif':
        if (imageError) {
          return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          );
        }
        return (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        );
      
      case 'video':
        return (
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
            <video
              src={file.url}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-yellow-600 flex flex-col items-center justify-center rounded-lg text-white font-bold">
            <FileText className="w-6 h-6 mb-1" />
            <span className="text-xs">PDF</span>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
        );
    }
  };

  return (
    <>
      <div 
        className={`relative ${sizeClasses[size]} ${className} ${
          onClick || (size === 'cover' && (file.type === 'image' || file.type === 'gif')) 
            ? 'cursor-pointer hover:opacity-90 transition-opacity' 
            : ''
        }`}
        onClick={handleClick}
      >
        {renderPreview()}
        
        {showRemove && onRemove && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (file.type === 'image' || file.type === 'gif') && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
