import React, { useEffect, useState } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy, 
  SortableContext, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImagePlus, Move, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/header';
import userApiClient from "../services/userApi";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import EmptyGalleryState from '../components/gallery/emptyGalleryState';
import ImageEditModal from '../components/gallery/imageEditModal';
import { BASEURL } from "../constant/constants";

const SortableImageCard = ({ image, onEdit, onDelete, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: image._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, 
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="relative group overflow-hidden rounded-xl shadow-lg"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute inset-0 z-10 cursor-move"
      />
      
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

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]); 
  const [editingImage, setEditingImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const imagesPerPage = 9;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await userApiClient.get(`${BASEURL}/getImages`);
      
      const sortedImages = data.images.map((img, index) => ({
        ...img,
        order: img.order !== undefined ? img.order : index,
      })).sort((a, b) => a.order - b.order);
      
      setImages(sortedImages);
      setOriginalImages(sortedImages); 
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch images");
      setIsLoading(false);
    }
  };

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditImage = (image) => {
    if (!isRearrangeMode) {
      setEditingImage(image);
    }
  };

  const handleDeleteImage = async (id) => {
    if (isRearrangeMode) return;

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this image?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await userApiClient.delete(`${BASEURL}/deleteImage/${id}`);
        const updatedImages = images.filter((image) => image._id !== id);
        setImages(updatedImages);
        setOriginalImages(updatedImages);  
        
        if (currentPage > Math.ceil(updatedImages.length / imagesPerPage)) {
          setCurrentPage(Math.max(1, Math.ceil(updatedImages.length / imagesPerPage)));
        }
        
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over.id) {
      setImages((currentImages) => {
        const oldIndex = currentImages.findIndex(img => img._id === active.id);
        const newIndex = currentImages.findIndex(img => img._id === over.id);

        const updatedImages = arrayMove(currentImages, oldIndex, newIndex);

        return updatedImages.map((image, index) => ({
          ...image,
          order: index
        }));
      });
    }
  };
       
  const saveRearrangedImages = async () => {
    try {
      await userApiClient.put(`${BASEURL}/updateImageOrder`, {
        images: images.map((img) => ({
          _id: img._id,
          order: img.order,  
        })),
      });
      
      setOriginalImages([...images]);
      toast.success("Image order updated successfully");
      setIsRearrangeMode(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update image order");
    }
  };

  const cancelRearranging = () => {
    setImages([...originalImages]);
    setIsRearrangeMode(false);
  };

  const handleUpdateImage = async (updatedValues, selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("title", updatedValues.title);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }      
      await userApiClient.put(`${BASEURL}/updateImage/${editingImage._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });      
      toast.success("Image updated successfully");
      setEditingImage(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update image");
    }
  };
  

  const renderRearrangeMode = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl h-[calc(100vh-120px)] overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-800 flex items-center">
              <Move className="mr-4 text-indigo-600" size={40} />
              Rearrange Gallery
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={cancelRearranging}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={saveRearrangedImages}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Save Order
              </button>
            </div>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={currentImages.map(img => img._id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentImages.map((image) => (
                  <SortableImageCard
                    key={image._id}
                    image={image}
                    onEdit={() => handleEditImage(image)}
                    onDelete={() => handleDeleteImage(image._id)}
                    isDragging={image._id === activeId}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
                  <div className="rounded-xl shadow-2xl opacity-80">
                    <img 
                      src={currentImages.find(img => img._id === activeId)?.image} 
                      alt="Dragged" 
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          
          {renderPagination()}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(images.length / imagesPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button 
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 bg-indigo-500 text-white rounded disabled:opacity-50"
        >
          <ChevronLeft />
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded ${
              currentPage === number 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {number}
          </button>
        ))}
        <button 
          onClick={() => paginate(Math.min(pageNumbers.length, currentPage + 1))}
          disabled={currentPage === pageNumbers.length}
          className="p-2 bg-indigo-500 text-white rounded disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-indigo-800">Loading...</div>
      </div>
    );
  }

  if (isRearrangeMode) {
    return renderRearrangeMode();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl h-[calc(100vh-120px)] overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 flex items-center">
            <ImagePlus className="mr-4 text-indigo-600" size={40} />
            My Gallery
          </h1>
          <button
            onClick={() => setIsRearrangeMode(true)}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            <Move className="mr-2" size={20} />
            Rearrange
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentImages.map((image) => (
            <div key={image._id} className="relative">
              <img 
                src={image.image} 
                alt={image.title} 
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  onClick={() => handleEditImage(image)}
                  className="bg-white/70 hover:bg-white p-2 rounded-full transition duration-300"
                >
                  <Edit className="w-5 h-5 text-indigo-600" />
                </button>
                <button 
                  onClick={() => handleDeleteImage(image._id)}
                  className="bg-white/70 hover:bg-white p-2 rounded-full transition duration-300"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {images.length === 0 && <EmptyGalleryState />}
        
        {renderPagination()}
      </div>
      {editingImage && (
        <ImageEditModal 
        image={editingImage} 
        onClose={() => setEditingImage(null)} 
        onUpdate={handleUpdateImage} 
      />      
      )}
    </div>
  );
};

export default GalleryPage;