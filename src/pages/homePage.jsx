import React, { useState } from "react";
import { KeyRound, Upload, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from "react-router";
import ImageUploadModal from '../components/imageModal'
import PasswordChangeModal from "../components/passwordModal";
import Header from '../components/header'; 

const HomePage = () => {
  const [isAddImageModalOpen, setAddImageModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 relative">
      <Header className="absolute top-0 left-0 z-10" /> 

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-96 text-center space-y-6">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">Welcome</h2>
          <p className="text-gray-600 mb-8">
            Manage your images, security, and account settings with ease.
          </p>

          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md"
              onClick={() => setAddImageModalOpen(true)}
            >
              <Upload className="w-5 h-5" />
              <span>Add Images</span>
            </button>

            <button
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out shadow-md"
              onClick={() => setChangePasswordModalOpen(true)}
            >
              <KeyRound className="w-5 h-5" />
              <span>Change Password</span>
            </button>

            <button
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out shadow-md"
              onClick={() => navigate('/gallery')}
            >
              <ImageIcon className="w-5 h-5" />
              <span>View Images</span>
            </button>
          </div>
        </div>
      </div>

      {isAddImageModalOpen && (
        <ImageUploadModal
          isOpen={isAddImageModalOpen}
          onClose={() => setAddImageModalOpen(false)}
        />
      )}

      {isChangePasswordModalOpen && (
        <PasswordChangeModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HomePage;