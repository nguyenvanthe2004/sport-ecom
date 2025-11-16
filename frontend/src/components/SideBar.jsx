import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Users,
  ShoppingCart,
  BadgePercent,
} from "lucide-react";
import "../styles/SideBar.css";
import { useSelector } from "react-redux";
import { FRONTEND_URL } from "../constants";

const SidebarAdmin = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <aside className="sidebar-admin">
      <div className="sidebar-top">
        <img src={`${FRONTEND_URL}avatar.avif`} alt="avatar" className="avatar" />
        <h3>{currentUser.fullname}</h3>
      </div>

      <ul>
        <li>
          <Link to="/admin/dashboard">
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/products">
            <Package />
            <span>Products</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/categories">
            <FolderOpen />
            <span>Categories</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/brands">
            <BadgePercent />
            <span>Brands</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/users">
            <Users />
            <span>Customer</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/orderAdmin">
            <ShoppingCart />
            <span>Orders</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarAdmin;
