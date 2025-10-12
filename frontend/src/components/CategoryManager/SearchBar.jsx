import React from "react";
import "../../styles/CategoryManager/SearchBar.css";

export default function SearchBar() {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Nhập tên danh mục" />
      <button className="btn btn-blue">Tìm</button>
    </div>
  );
}
