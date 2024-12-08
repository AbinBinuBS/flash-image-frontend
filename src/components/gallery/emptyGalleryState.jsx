import React from 'react';
import { ImagePlus } from 'lucide-react';

const EmptyGalleryState = () => {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-md">
      <ImagePlus className="mx-auto text-indigo-400 mb-4" size={64} />
      <p className="text-xl text-gray-600">No images in your gallery</p>
    </div>
  );
};

export default EmptyGalleryState