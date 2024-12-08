import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ImageEditSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title cannot exceed 50 characters'),
});

const ImageEditModal = ({ 
  image, 
  onClose, 
  onUpdate 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = (values) => {
    onUpdate(values, selectedFile);  
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-96 relative">
        <button 
          onClick={() => {
            onClose();
            setSelectedFile(null);
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Edit Image</h2>

        <Formik
          initialValues={{
            title: image.title,
          }}
          validationSchema={ImageEditSchema}
          onSubmit={handleSubmit} 
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-6">
                <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
                <Field 
                  name="title" 
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.title && touched.title 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter image title"
                />
                <ErrorMessage 
                  name="title" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 mb-2">Replace Image</label>
                <input 
                  type="file" 
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-4">
                <img 
                  src={selectedFile 
                    ? URL.createObjectURL(selectedFile) 
                    : image.image
                  } 
                  alt={image.title} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Update Image
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};


export default ImageEditModal