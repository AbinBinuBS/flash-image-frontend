import React, { useState } from "react";
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { X } from 'lucide-react';
import { toast } from "react-toastify";
import userApiClient from "../services/userApi";
import { BASEURL } from "../constant/constants";

const MultiImageUploadSchema = Yup.object().shape({
  images: Yup.array()
    .min(1, 'Please upload at least one image')
    .required('Please upload images'),
  titles: Yup.array()
    .of(
      Yup.string()
        .trim()
        .required('Title is required for each image')
        .min(1, 'Title cannot be empty')
    )
    .min(1, 'Please provide titles for all images')
    .test(
      'titles-match-images',
      'Number of titles must match number of images',
      function(titles) {
        const { images } = this.parent;
        return titles && images && titles.length === images.length;
      }
    )
});

const ImageUploadModal = ({ isOpen, onClose }) => {
  const [imageDetails, setImageDetails] = useState([]);

  const handleImageUpload = (event, setFieldValue) => {
    const files = Array.from(event.currentTarget.files);
    
    const newImageDetails = files.map(file => ({
      file,
      title: '',
      preview: URL.createObjectURL(file)
    }));

    setImageDetails(newImageDetails);
    setFieldValue('images', files);
    setFieldValue('titles', new Array(files.length).fill(''));
  };
    const updateImageTitle = (index, title, setFieldValue, values) => {
    const updatedImageDetails = [...imageDetails];
    updatedImageDetails[index].title = title;
    setImageDetails(updatedImageDetails);
    const updatedTitles = [...values.titles];
    updatedTitles[index] = title;
    setFieldValue('titles', updatedTitles);
  };

  const handleAddImages = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      
      imageDetails.forEach((imageDetail, index) => {
        formData.append('images', imageDetail.file);
        formData.append(`titles`, values.titles[index] || `Image ${index + 1}`);
      });

      const response = await userApiClient.post(`${BASEURL}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onClose();
      resetForm();
      setImageDetails([]);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Image upload failed', error);
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Images</h2>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Formik
          initialValues={{ images: [], titles: [] }}
          validationSchema={MultiImageUploadSchema}
          onSubmit={handleAddImages}
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-indigo-800">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(event) => handleImageUpload(event, setFieldValue)}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg"
                  accept="image/*"
                />
                {errors.images && touched.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                )}
              </div>

              {imageDetails.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {imageDetails.map((image, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-3 flex flex-col items-center space-y-2"
                    >
                      <img 
                        src={image.preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder={`Title for image ${index + 1}`}
                        value={values.titles[index] || ''}
                        onChange={(e) => updateImageTitle(index, e.target.value, setFieldValue, values)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {errors.titles && touched.titles && errors.titles[index] && (
                        <p className="text-red-500 text-sm mt-1">{errors.titles[index]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => {
                    setImageDetails([]);
                    setFieldValue('images', []);
                    setFieldValue('titles', []);
                  }}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || imageDetails.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Images'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ImageUploadModal;