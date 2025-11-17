import React, { useState } from "react";
import "../../styles/CreateCategory.css";
import { useSelector } from "react-redux";
import { CategoryAPI } from "../../services/api";
import { showErrorToast, showToast } from "../../../libs/utils";
import { Link } from "react-router-dom";

const CreateCategory = () => {
  const currentUser = useSelector((state) => state.auth.currentUser); 
   const userId = currentUser?.userId || "";
  
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("⚠️ Bạn cần đăng nhập để tạo danh mục!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId,
        name: category.name,
        description: category.description,
      };

      const res = await CategoryAPI.create(payload);
      showToast("Tạo danh mục thành công!");
      console.log("Response:", res);

      setCategory({ name: "", description: "" });
    } catch (error) {
      console.error("❌ Lỗi tạo danh mục:", error);
      showErrorToast("Lỗi tạo danh mục!")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-category container mt-5">
      <h2 className="fw-bold mb-3">Tạo danh mục mới</h2>
      <Link href="/admin/categories" className="text-decoration-none text-primary">
        ← Quay lại danh sách
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-sm border mt-3"
      >
        <div className="mb-3">
          <label className="form-label fw-semibold">Tên danh mục</label>
          <input
            name="name"
            className="form-control"
            value={category.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Mô tả</label>
          <textarea
            name="description"
            className="form-control"
            value={category.description}
            onChange={handleChange}
            required
            rows="3"
          ></textarea>
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo danh mục"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
