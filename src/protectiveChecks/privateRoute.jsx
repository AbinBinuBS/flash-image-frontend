import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const accessToken = useSelector((state) => state.token.value);
  const location = useLocation();
  if (accessToken) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};

export default PublicRoute;