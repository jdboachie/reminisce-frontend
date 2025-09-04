'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, User, Calendar } from 'lucide-react';

interface ImageViewerProps {
  images: Array<{
    _id: string;
    albumName: string;
    albumId: string;
    pictureURL: string;
    uploadedBy: string;
    referenceNumber?: string;
    departmentId: string;
    workspace: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
  }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}) => {
  const currentImage = images[currentIndex];

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        if (currentIndex < images.length - 1) {
          onNavigate(currentIndex + 1);
        }
        break;
    }
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.pictureURL;
    link.download = `image-${currentImage._id}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all duration-200"
        aria-label="Close image viewer"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          {currentIndex > 0 && (
            <button
              onClick={() => onNavigate(currentIndex - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Next Button */}
          {currentIndex < images.length - 1 && (
            <button
              onClick={() => onNavigate(currentIndex + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center w-full max-w-7xl">
          <div className="relative max-w-full max-h-full">
            <img
              src={currentImage.pictureURL}
              alt={`Image uploaded by ${currentImage.referenceNumber || 'Unknown'}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>
        </div>

        {/* Image Info Panel */}
        <div className="w-full max-w-4xl mt-4 bg-black bg-opacity-50 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            {/* Image Details */}
            <div className="flex items-center space-x-6">
              {currentImage.referenceNumber && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Ref: {currentImage.referenceNumber}</span>
                </div>
              )}
              {currentImage.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(currentImage.createdAt)}</span>
                </div>
              )}
            </div>

            {/* Image Counter and Download */}
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {currentIndex + 1} of {images.length}
              </span>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
                aria-label="Download image"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="w-full max-w-4xl mt-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image._id}
                  onClick={() => onNavigate(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-white shadow-lg'
                      : 'border-transparent hover:border-white hover:border-opacity-50'
                  }`}
                >
                  <img
                    src={image.pictureURL}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
