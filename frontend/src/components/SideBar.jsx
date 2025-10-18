import React from "react";
import { Link } from "react-router-dom";
import "../styles/SideBar.css";
import { useSelector } from "react-redux";

const SidebarAdmin = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  return (
    <aside className="sidebar-admin">
      <div className="sidebar-top">
        <img
          src="/public/easports.jpg"
          alt="avatar"
          className="avatar"
        />
        <h3>{currentUser.fullname}</h3>
      </div>

      <ul>
        <li>
          <Link to="/admin/dashboard">📊 Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/products">📦 Products</Link>
        </li>
        <li>
          <Link to="/admin/categories">📂 Categories</Link>
        </li>
        <li>
          <Link to="/admin/users">👥 Customer</Link>
        </li>
        <li>
          <Link to="/admin/orders">🛒 Orders</Link>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarAdmin;
