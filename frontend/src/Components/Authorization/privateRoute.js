import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token'); // Adjust based on your storage mechanism

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  try {
    const { role } = jwtDecode(token);
    console.log("role",role)

    if (allowedRoles.includes(role)) {
      return children;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    console.error('Invalid token', error);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
