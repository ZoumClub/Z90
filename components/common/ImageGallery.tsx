import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out any invalid image URLs
  const validImages = images.filter(url => url && url.trim().length > 0);
  if (!validImages.length) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
  };

  return (
    <div className="space-y-2">
      {/* Main Image */}
      <div 
        className="relative h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => openLightbox(0)}
      >
        <Image
          src={validImages[0]}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:opacity-95 transition-opacity"
          priority
        />
      </div>

      {/* Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className={`relative h-20 bg-gray-100 rounded overflow-hidden transition-opacity ${
                index === currentIndex ? 'ring-2 ring-blue-500' : 'hover:opacity-80'
              }`}
            >
              <Image
                src={image}
                alt={`${alt} - ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => goToPrevious(e)}
                className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => goToNext(e)}
                className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Current Image */}
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[80vh]">
              <Image
                src={validImages[currentIndex]}
                alt={`${alt} - ${currentIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="text-white text-center mt-4">
              {currentIndex + 1} / {validImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}