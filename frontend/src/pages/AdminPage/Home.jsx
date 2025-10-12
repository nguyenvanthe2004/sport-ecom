import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import SidebarAdmin from "../../components/SideBar";
import "../../styles/AdminLayout.css";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <SidebarAdmin />
      <div className="main-content">
        <HeaderAdmin />
        <div className="page-content">
          {/* Các route con (products, categories...) sẽ hiện ở đây */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
