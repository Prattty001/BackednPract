import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = sessionStorage.getItem('token');
  
  // Check if the user is logged in
  if (!token) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
