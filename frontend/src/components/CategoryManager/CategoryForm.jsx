import React, { useState } from "react";
import "../../styles/CategoryManager/CategoryForm.css";

export default function CategoryForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    title: "",
    desc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", url: "", title: "", desc: "" });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>THÊM DANH MỤC</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Tên Danh mục <span>*</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Tên Danh mục"
            />
          </label>

          <label>
            URL <span>*</span>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="URL danh mục"
            />
          </label>

          <label>
            Tiêu đề
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Tiêu đề 70 - 100 ký tự"
            />
          </label>

          <label>
            Mô tả
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Mô tả danh mục"
            ></textarea>
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn btn-blue">
              Lưu
            </button>
            <button type="button" onClick={onClose} className="btn btn-gray">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
