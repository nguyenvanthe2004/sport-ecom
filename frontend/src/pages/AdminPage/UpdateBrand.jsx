import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BrandAPI } from "../../services/api";
import { showToast } from "../../../libs/utils";

const UpdateBrand = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  const [brand, setBrand] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy thông tin brand khi component mount
  const fetchBrand = async () => {
    setLoading(true);
    setError("");
    try {
      const b = await BrandAPI.getBrandById(id); // lấy toàn bộ brand
      if (!b) throw new Error("Thương hiệu không tồn tại");
      setBrand({
        name: b.name,
        description: b.description,
      });
    } catch (err) {
      setError(err.message || "Lỗi khi tải thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await BrandAPI.update(id, brand);
      showToast("Cập nhật thương hiệu thành công");
      navigate("/admin/brands"); // quay về trang manager
    } catch (err) {
      setError(err.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Cập nhật thương hiệu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên thương hiệu</label>
          <input
            type="text"
            name="name"
            value={brand.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            name="description"
            value={brand.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Cập nhật
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/admin/brands")}
        >
          Hủy
        </button>
      </form>
    </div>
  );
};

export default UpdateBrand;
