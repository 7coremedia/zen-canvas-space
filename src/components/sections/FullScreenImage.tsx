import { FC } from 'react';

interface FullScreenImageProps {
  imageSrc: string;
  alt?: string;
}

const FullScreenImage: FC<FullScreenImageProps> = ({ 
  imageSrc, 
  alt = "Full screen image" 
}) => {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </section>
  );
};

export default FullScreenImage;
