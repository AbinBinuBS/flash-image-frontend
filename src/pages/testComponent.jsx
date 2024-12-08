import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  SortableContext,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableImage = ({ image }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '200px',
    height: '200px',
    cursor: 'move'
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes}
      {...listeners}
    >
      <img
        src={image.url}
        alt={image.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          border: '1px solid black'
        }}
      />
    </div>
  );
};

const DragDropGallery = () => {
  const [images, setImages] = useState([
    { id: '1', url: 'https://example.com/image1.jpg', title: 'Image 1' },
    { id: '2', url: 'https://example.com/image2.jpg', title: 'Image 2' },
    { id: '3', url: 'https://example.com/image3.jpg', title: 'Image 3' }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setImages((images) => {
        const oldIndex = images.findIndex((img) => img.id === active.id);
        const newIndex = images.findIndex((img) => img.id === over.id);
        
        return arrayMove(images, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={images.map(img => img.id)} 
        strategy={rectSortingStrategy}
      >
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px' 
        }}>
          {images.map((image) => (
            <SortableImage 
              key={image.id} 
              image={image} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DragDropGallery;