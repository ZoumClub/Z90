import NextImage from 'next/image';
import { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function Image({ 
  src, 
  alt,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  sizes
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <NextImage
      src={src}
      alt={alt}
      className={`
        duration-700 ease-in-out
        ${isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0'}
        ${className}
      `}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      sizes={sizes}
      onLoadingComplete={() => setIsLoading(false)}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}