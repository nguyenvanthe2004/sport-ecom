import React, { useState } from "react";
import SearchBar from "./SearchBar";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import "../../styles/CategoryManager/CategoryManager.css";

export default function CategoryManager() {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleAddClick = () => setShowForm(true);
  const handleClose = () => setShowForm(false);

  const handleSubmit = (newCategory) => {
    setCategories([...categories, newCategory]);
    setShowForm(false);
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <h3>
          <b>Danh mục</b>
        </h3>
        <div className="category-actions">
          <button className="btn btn-green">Cache</button>
          <button className="btn btn-blue" onClick={handleAddClick}>
            + Danh mục
          </button>
        </div>
      </div>

      <SearchBar />
      <CategoryList categories={categories} />

      {showForm && (
        <CategoryForm onClose={handleClose} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
