import React, { useState } from "react";
import "../../styles/CreateCategory.css"; 
import { useSelector } from "react-redux";
import { BrandAPI } from "../../services/api"; 
import { showToast } from "../../../libs/utils";

const CreateBrand = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userId = currentUser?.userId || "";

  const [brand, setBrand] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("⚠️ Bạn cần đăng nhập để tạo thương hiệu!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId,
        name: brand.name,
        description: brand.description,
      };

      const res = await BrandAPI.create(payload);
      showToast("✅ Tạo thương hiệu thành công!");
      console.log("Response:", res);

      setBrand({ name: "", description: "" });
    } catch (error) {
      console.error("❌ Lỗi tạo thương hiệu:", error);
      alert("❌ Không thể tạo thương hiệu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-category container mt-5">
      <h2 className="fw-bold mb-3">Tạo thương hiệu mới</h2>
      <a href="/admin/brands" className="text-decoration-none text-primary">
        ← Quay lại danh sách
      </a>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-sm border mt-3"
      >
        <div className="mb-3">
          <label className="form-label fw-semibold">Tên thương hiệu</label>
          <input
            name="name"
            className="form-control"
            value={brand.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Mô tả</label>
          <textarea
            name="description"
            className="form-control"
            value={brand.description}
            onChange={handleChange}
            required
            rows="3"
          ></textarea>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo thương hiệu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBrand;
