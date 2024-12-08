import React from "react";
import { Camera, LogOut, Home } from 'lucide-react';
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { clearToken } from "../redux/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    try {
      dispatch(clearToken());
      navigate('/');
      toast.success("Logout Successfully");
    } catch (error) {
      console.log("Unexpected error during logout");
    }
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Camera className="w-8 h-8" />
          <h1 className="text-2xl font-semibold tracking-wide">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          {location.pathname !== '/home' && (
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition duration-300 ease-in-out"
              onClick={handleHome}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
          )}
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition duration-300 ease-in-out"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;