import React, { useState } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import "../../styles/ProductManager/ProductManager.css";

export default function ProductManager() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Áo Thể Thao Nike",
      price: 450000,
      category: "Áo",
      brand: "Nike",
      image:
        "https://product.hstatic.net/1000061481/product/a45fb5d280794feb8f4414c90ef5018f_f9a8490a73714341a3f03d70d5ba8b99_1024x1024.jpg",
      createdAt: "2025-10-12",
      variants: [{ color: "Trắng", size: "L", quantity: 20, image: "" }],
    },
    {
      id: 2,
      name: "Giày Đá Bóng Nike",
      price: 2100000,
      category: "Giày",
      brand: "Nike",
      image:
        "https://cdn.hstatic.net/products/1000061481/anh_sp_add-01-01-01-04-03-023-2_bf6360b2b30a41ac978c993ce8734c15_1024x1024.jpg",
      createdAt: "2025-10-12",
      variants: [{ color: "Hồng", size: "40", quantity: 50, image: "" }],
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  // ➕ Thêm sản phẩm mới
  const handleAddProduct = (newProduct) => {
    const date = new Date().toISOString().split("T")[0];
    setProducts([
      ...products,
      { ...newProduct, id: Date.now(), createdAt: date, variants: [] },
    ]);
    setShowForm(false);
  };

  // 🧩 Thêm chi tiết (bao gồm số lượng)
  const handleAddDetail = (productId, detail) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, variants: [...(p.variants || []), detail] }
          : p
      )
    );
  };

  return (
    <div className="product-manager-wrapper">
      <div className="product-container">
        <div className="product-header">
          <h2>🛍️ Quản lý sản phẩm thể thao</h2>
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Thêm sản phẩm
          </button>
        </div>

        <div className="product-body">
          {/* Danh sách sản phẩm */}
          <ProductList products={products} onAddDetail={handleAddDetail} />

          {/* Form thêm sản phẩm */}
          {showForm && (
            <ProductForm
              onAdd={handleAddProduct}
              onClose={() => setShowForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
