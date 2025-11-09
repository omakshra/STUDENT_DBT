// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children, onShowLogin }) => {
  if (!user) {
    onShowLogin(); // triggers login modal
    return null;   // don’t render the page yet
  }
  return children;
};

export default ProtectedRoute;
