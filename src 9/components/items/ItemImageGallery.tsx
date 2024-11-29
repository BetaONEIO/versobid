import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ItemImageGalleryProps {
  images: string[];
}

export default function ItemImageGallery({ images }: ItemImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <div className="aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Item image ${currentIndex + 1}`}
          className="object-cover w-full h-full"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}