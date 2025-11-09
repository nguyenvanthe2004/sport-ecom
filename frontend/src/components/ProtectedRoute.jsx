import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { clearCurrentUser, setCurrentUser } from "../redux/slices/currentUser";
import { getCurrentUser } from "../services/api";

const ProtectedRoute = ({ children, role }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser();
        
        if (res.user) {
          dispatch(setCurrentUser(res.user));
        }
        else {
          if (role == "admin")  return <Navigate to="/login" replace />;
          else  return <Navigate to="/home" replace />;
         
        }
      } catch (error) {
        console.log("Error: ", error);
        dispatch(clearCurrentUser());
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [dispatch]);

  if (loading) {
    return <LoadingPage />
  }
  

  return children;
};

export default ProtectedRoute;
