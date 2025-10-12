import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!currentUser || !currentUser.userId) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
