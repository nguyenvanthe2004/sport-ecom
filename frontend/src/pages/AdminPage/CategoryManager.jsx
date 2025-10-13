import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryAPI } from "../../services/api"; // import API của bạn
import "../../styles/CategoryManager.css";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy danh sách categories từ API
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await CategoryAPI.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xóa danh mục
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này không?")) return;

    try {
      await CategoryAPI.delete(id);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message || "Xóa danh mục thất bại");
    }
  };

  return (
    <div className="category-manager container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Quản lý danh mục</h2>
        <Link to="/admin/categories/create" className="btn btn-primary">
          + Thêm danh mục
        </Link>
      </div>

      {loading ? (
        <p>Đang tải danh mục...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table table-bordered table-striped align-middle">
          <thead className="table">
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th style={{ width: "150px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/admin/categories/edit/${c._id}`}
                        className="btn-action btn-edit"
                      >
                        Sửa
                      </Link>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(c._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Không có danh mục nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryManager;
