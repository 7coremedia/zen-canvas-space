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
  return (
    <div className="w-full h-auto bg-gray-100 flex items-center justify-center">
      {mediaType === 'image' && (
        <img
          src={mediaUrl}
          alt={altText}
          className="w-full h-auto object-contain max-w-full"
          style={{ objectFit: 'contain', width: '100%', height: 'auto' }} // Ensure image scales without cropping
        />
      )}
      {mediaType === 'video' && (
        <video
          src={mediaUrl}
          controls
          className="w-full h-auto object-contain max-w-full"
          style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
        >
          Your browser does not support the video tag.
        </video>
      )}
      {/* Add logic for 'animation' type if needed, e.g., for Lottie or other formats */}
    </div>
  );
}
