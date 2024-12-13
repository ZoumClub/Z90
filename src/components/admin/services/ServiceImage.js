import { Image } from '@/components/common/Image';

export function ServiceImage({ src, alt }) {
  return (
    <div className="h-10 w-10 flex-shrink-0">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover"
      />
    </div>
  );
}