import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ProductImageGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);

  const openImageModal = (index) => {
    if (!images) return;
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const closeImageModal = () => {
    setImageViewerOpen(false);
  };

  const navigateImage = (direction) => {
    if (!images) return;
    setSelectedImageIndex(prev => {
      if (direction === 'prev') {
        return prev === 0 ? images.length - 1 : prev - 1;
      } else {
        return prev === images.length - 1 ? 0 : prev + 1;
      }
    });
  };

  const displayedThumbnails = showAllThumbnails ? images : images.slice(0, 5);
  const hasMoreThumbnails = images.length > 5;

  return (
    <div className="bg-white rounded-lg border border-green-100 shadow-sm overflow-hidden">
      {images?.length > 0 ? (
        <div>
          {/* Main Image Display */}
          <div 
            className="h-80 w-full bg-white flex items-center justify-center"
            onClick={() => openImageModal(activeImage)}
          >
            <img 
              src={images[activeImage]} 
              alt="Main product"
              className="max-h-full max-w-full object-contain"
              style={{ backgroundColor: 'white' }}
            />
          </div>
          
          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="p-2 bg-white border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {displayedThumbnails.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-16 h-16 rounded border-2 flex-shrink-0 overflow-hidden ${
                      index === activeImage 
                        ? 'border-green-600 ring-2 ring-green-400' 
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                    style={{ backgroundColor: 'white' }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{ backgroundColor: 'white' }}
                    />
                  </button>
                ))}
                
                {hasMoreThumbnails && !showAllThumbnails && (
                  <button
                    onClick={() => setShowAllThumbnails(true)}
                    className="w-16 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600"
                    style={{ backgroundColor: 'white' }}
                  >
                    +{images.length - 5}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-80 bg-gray-100 flex items-center justify-center text-gray-400">
          <span>No Image Available</span>
        </div>
      )}

      {/* Enhanced Image Viewer Modal */}
      {imageViewerOpen && images?.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close image viewer"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button 
            onClick={() => navigateImage('prev')}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <div className="max-w-4xl w-full h-full flex items-center justify-center">
            <img 
              src={images[selectedImageIndex]} 
              alt={`Product view ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          <button 
            onClick={() => navigateImage('next')}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          {/* Thumbnail strip at the bottom */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="container mx-auto px-4">
              <div className="flex overflow-x-auto space-x-2 py-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-white ring-2 ring-white' 
                        : 'border-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;