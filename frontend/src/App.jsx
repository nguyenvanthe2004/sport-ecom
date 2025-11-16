import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser, clearCurrentUser } from "./redux/slices/currentUser";
import { getCurrentUser } from "./services/api";
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
import CartPage from "./pages/HomePage/CartPage";
import Checkout from "./pages/HomePage/Checkout";
import LoadingPage from "./components/LoadingPage";
import OrderPage from "./pages/HomePage/OrderPage";
import AdminOrders from "./pages/AdminPage/AdminOrders";
import ProfilePage from "./pages/HomePage/ProfilePage";
import UserManager from "./pages/AdminPage/UserManager";
import DashboardPage from "./pages/AdminPage/DashboardPage";
import AuthPage from "./pages/AuthPage";
import BrandManager from "./pages/AdminPage/BrandManager";
import CreateBrand from "./pages/AdminPage/CreateBrand";
import UpdateBrand from "./pages/AdminPage/UpdateBrand";
import ScrollToTop from "./components/ScrollToTop";
import Register from "./components/Register";

function App() {
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
      } catch (error) {
        console.log("Error: ", error);
        dispatch(clearCurrentUser());
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [dispatch]);
  if (loading) return <LoadingPage />;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<AuthPage formType="login" />} />
        <Route path="/register" element={<AuthPage formType="register" />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:slug" element={<ProductDetail />} />

        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="user">
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/orders" element={<OrderPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <ProfilePage />
            </ProtectedRoute>
          }
        />

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
          <Route path="brands">
            <Route index element={<BrandManager />} />{" "}
            <Route path="create" element={<CreateBrand />} />{" "}
            <Route path="edit/:id" element={<UpdateBrand />} />{" "}
          </Route>
          <Route path="orderAdmin" element={<AdminOrders />} />{" "}
          <Route path="users" element={<UserManager />} />{" "}
          <Route path="dashboard" element={<DashboardPage />} />{" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
