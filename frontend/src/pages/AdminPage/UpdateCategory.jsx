import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CategoryAPI } from "../../services/api";
import { showErrorToast, showToast } from "../../../libs/utils";

const UpdateCategory = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy thông tin category khi component mount
  const fetchCategory = async () => {
    setLoading(true);
    setError("");
    try {
      const cat = await CategoryAPI.getCategoryById(id); // lấy toàn bộ category
      if (!cat) throw new Error("Danh mục không tồn tại");
      setCategory({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      });
    } catch (err) {
      setError(err.message || "Lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await CategoryAPI.update(id, category);
      showToast("Cập nhật danh mục thành công");
      navigate("/admin/categories"); // quay về trang manager
    } catch (err) {
      setError(err.message || "Cập nhật thất bại");
      showErrorToast("Lỗi cập nhật danh mục!")
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Cập nhật danh mục</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên danh mục</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            name="description"
            value={category.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary me-2" >
          Cập nhật
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/admin/categories")}
        >
          Hủy
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
