'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImage } from '@/types';

interface GalleryCarouselProps {
  images: GalleryImage[];
  title?: string;
}

export default function GalleryCarousel({ images, title }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Main Carousel */}
      <div className="space-y-4">
        {title && <h3 className="text-xl font-bold">{title}</h3>}

        {/* Main Image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer group">
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            className="object-cover"
            onClick={() => setIsLightboxOpen(true)}
          />

          {/* Navigation Overlay */}
          <div className="absolute inset-0 flex items-center justify-between bg-black/0 group-hover:bg-black/20 transition-colors p-4">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-black" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-black" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-16 rounded flex-shrink-0 overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Lightbox Image */}
            <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                fill
                className="object-contain"
              />
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={32} className="text-white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
