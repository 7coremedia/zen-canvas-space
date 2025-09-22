import * as React from 'react';

interface CaseStudyMediaDisplayProps {
  mediaUrl: string;
  mediaType?: 'image' | 'video' | 'animation'; // 'animation' could imply a GIF or a Lottie animation
  altText?: string;
}

export default function CaseStudyMediaDisplay({
  mediaUrl,
  mediaType = 'image',
  altText = 'Case study media',
}: CaseStudyMediaDisplayProps) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div className="w-full h-auto bg-gray-100 flex items-center justify-center">
      {mediaType === 'image' && (
        <div className="relative w-full flex justify-center">
          {/* Skeleton placeholder */}
          <div
            className={`absolute inset-0 mx-auto max-w-[1600px] min-h-[40vh] animate-pulse bg-gray-200 ${loaded ? 'hidden' : ''}`}
          />
          <img
            src={mediaUrl}
            alt={altText}
            className={`w-full h-auto object-contain max-w-[1600px] transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </div>
      )}
      {mediaType === 'video' && (
        <video
          src={mediaUrl}
          controls
          className="w-full h-auto object-contain max-w-[1600px]"
          style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
        >
          Your browser does not support the video tag.
        </video>
      )}
      {/* Add logic for 'animation' type if needed, e.g., for Lottie or other formats */}
    </div>
  );
}
