import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentUser,
  clearCurrentUser,
  setLoading,
} from "./redux/slices/currentUser";
import { getCurrentUser } from "./services/api";
import AuthPage from "./pages/authPage";
import Home from "./pages/HomePage/Home";
import AdminLayout from "./pages/AdminPage/Home";
import ProductManager from "./components/ProductManager/ProductManager";
import CategoryManager from "./components/CategoryManager/CategoryManager";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./pages/HomePage/CartPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      dispatch(setLoading());
      try {
        const res = await getCurrentUser();
        if (res.user) {
          dispatch(setCurrentUser(res.user));
        }
      } catch (error) {
        console.log("Error: ", error);
        dispatch(clearCurrentUser());
      }
    };
    fetchCurrentUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<AuthPage formType="login" />} />
        <Route path="/register" element={<AuthPage formType="register" />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Khu vực Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Các route con nằm trong AdminLayout */}
          <Route path="dashboard" element={<h1>Dashboard</h1>} />
          <Route path="products" element={<ProductManager />} />
          <Route path="categories" element={<CategoryManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
