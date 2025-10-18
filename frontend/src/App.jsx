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
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateProduct from "./pages/AdminPage/CreateProduct";
import ProductManagement from "./pages/AdminPage/ProductManager";
import CategoryManager from "./pages/AdminPage/CategoryManager";
import CreateCategory from "./pages/AdminPage/CreateCategory";
import UpdateCategory from "./pages/AdminPage/UpdateCategory";
import UpdateProduct from "./pages/AdminPage/UpdateProduct";
import ProductDetail from "./pages/HomePage/ProductDetail";
import ProductsPage from "./pages/HomePage/ProductsPage";

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
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        

        {/* Khu vực Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="products">
            <Route index element={<ProductManagement />} />{" "}
            
            <Route path="create" element={<CreateProduct />} />{" "}
            <Route path="edit/:id" element={<UpdateProduct />} />
            
          </Route>
          <Route path="categories">
            <Route index element={<CategoryManager />} />{" "}
            
            <Route path="create" element={<CreateCategory />} />{" "}
            <Route path="edit/:id" element={<UpdateCategory />} />{" "}
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
