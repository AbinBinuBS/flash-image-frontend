import { BrowserRouter, Route, Routes } from "react-router"
import LoginPage from "./pages/loginPage"
import RegisterPage from "./pages/register"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./pages/homePage";
import PublicRoute from "./protectiveChecks/privateRoute";
import ProtectedRoute from "./protectiveChecks/protectedRoute";
import GalleryPage from "./pages/galleryPage.jsx";
import DragDropGallery from "./pages/testComponent.jsx";


function App() {

  return (
   <>
    <BrowserRouter>
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage/></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><GalleryPage/></ProtectedRoute>} />
        <Route path="/test" element={<ProtectedRoute><DragDropGallery/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
   </>
  )
}

export default App
