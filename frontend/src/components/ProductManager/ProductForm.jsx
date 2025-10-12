import React, { useState, useEffect } from "react";
import "../../styles/ProductManager/ProductForm.css";

export default function ProductForm({ onAdd, onClose }) {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    color: "",
    size: "",
    brand: "",
    image: "",
  });

  const [sizeOptions, setSizeOptions] = useState([]);

  useEffect(() => {
    if (product.category.toLowerCase() === "áo") {
      setSizeOptions(["S", "M", "L", "XL", "XXL"]);
    } else if (product.category.toLowerCase() === "giày") {
      setSizeOptions(Array.from({ length: 9 }, (_, i) => (36 + i).toString()));
    } else {
      setSizeOptions([]);
    }
  }, [product.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(product);
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form-popup">
        <div className="form-header">
          <h3>🛒 Thêm sản phẩm mới</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-left">
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Danh mục</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                <option value="Áo">Áo</option>
                <option value="Giày">Giày</option>
              </select>
            </div>

            <div className="form-group">
              <label>Giá (VND)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Hãng</label>
              <input
                name="brand"
                value={product.brand}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label>Màu sắc</label>
              <input
                name="color"
                value={product.color}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Size</label>
              <select
                name="size"
                value={product.size}
                onChange={handleChange}
                disabled={sizeOptions.length === 0}
                required
              >
                <option value="">-- Chọn size --</option>
                {sizeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ảnh sản phẩm (URL)</label>
              <input
                name="image"
                value={product.image}
                onChange={handleChange}
              />
            </div>

            {product.image && (
              <img src={product.image} alt="preview" className="preview" />
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="save-btn">
              Lưu sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
