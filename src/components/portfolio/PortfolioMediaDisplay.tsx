import React, { useState } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaFile {
  id: string;
  url: string;
  type: string;
  name: string;
}

interface PortfolioMediaDisplayProps {
  coverImage?: MediaFile;
  mediaFiles?: MediaFile[];
  className?: string;
}

export default function PortfolioMediaDisplay({ 
  coverImage, 
  mediaFiles = [], 
  className = "" 
}: PortfolioMediaDisplayProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Combine cover and media files for display
  const allMedia = [
    ...(coverImage ? [coverImage] : []),
    ...mediaFiles
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allMedia.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? allMedia.length - 1 : lightboxIndex - 1);
    }
  };

  const renderMedia = (media: MediaFile, index: number) => {
    const isClickable = media.type === 'image' || media.type === 'gif';
    
    switch (media.type) {
      case 'image':
      case 'gif':
        return (
          <img
            key={media.id}
            src={media.url}
            alt={media.name}
            className={`w-full block ${isClickable ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''}`}
            onClick={isClickable ? () => openLightbox(index) : undefined}
            loading="lazy"
          />
        );
      
      case 'video':
        return (
          <div key={media.id} className="relative w-full">
            <video
              src={media.url}
              className="w-full block"
              controls
              preload="metadata"
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div key={media.id} className="w-full bg-gray-100 p-8 flex flex-col items-center justify-center min-h-[200px]">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-600 p-4 rounded-lg text-white mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">{media.name}</p>
            <Button
              onClick={() => window.open(media.url, '_blank')}
              variant="outline"
            >
              View PDF
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (allMedia.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`space-y-0 ${className}`}>
        {allMedia.map((media, index) => renderMedia(media, index))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative max-w-full max-h-full p-4">
            {/* Close Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={closeLightbox}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Navigation Buttons */}
            {allMedia.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Image */}
            <img
              src={allMedia[lightboxIndex].url}
              alt={allMedia[lightboxIndex].name}
              className="max-w-full max-h-full object-contain"
            />

            {/* Counter */}
            {allMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {lightboxIndex + 1} / {allMedia.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
