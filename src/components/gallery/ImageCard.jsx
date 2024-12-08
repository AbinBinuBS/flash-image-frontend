import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ImageCard = ({ image, onEdit, onDelete }) => {
  return (
    <div 
      className="relative group overflow-hidden rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
    >
      <img 
        src={image.image} 
        alt={image.title} 
        className="w-full h-64 object-cover"
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition duration-300">
        <h3 className="text-lg font-semibold">{image.title}</h3>
      </div>

      <div className="absolute top-2 right-2 flex space-x-2">
        <button 
          onClick={() => onEdit(image)}
          className="bg-white/70 hover:bg-white p-2 rounded-full transition duration-300"
        >
          <Edit className="w-5 h-5 text-indigo-600" />
        </button>
        <button 
          onClick={() => onDelete(image._id)}
          className="bg-white/70 hover:bg-white p-2 rounded-full transition duration-300"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </div>
  );
};


export default ImageCard