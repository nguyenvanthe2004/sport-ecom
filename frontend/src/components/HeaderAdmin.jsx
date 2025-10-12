import React from "react";
import "../styles/HeaderAdmin.css";
import { useNavigate } from "react-router-dom";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      navigate("/login");
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <header className="header-admin">
      <h1 className="logo">Sport Admin</h1>

      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm..." />
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>

      <div className="actions">
        <button>🔔</button>
        <button onClick={handleSubmit}>👤</button>
      </div>
    </header>
  );
};

export default HeaderAdmin;
