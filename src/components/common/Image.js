import NextImage from 'next/image';

export function Image({ src, alt, className = '', ...props }) {
  return (
    <NextImage
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      {...props}
    />
  );
}