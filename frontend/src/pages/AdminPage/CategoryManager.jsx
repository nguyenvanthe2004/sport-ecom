import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryAPI } from "../../services/api"; // import API của bạn
import "../../styles/CategoryManager.css";
import { showErrorToast, showToast } from "../../../libs/utils";
import LoadingPage from "../../components/LoadingPage";
import { FolderOpen } from "lucide-react";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      showToast("Đã xóa danh mục!");
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      showErrorToast("Lỗi xóa danh mục!")
    }
  };

  if (loading) return <LoadingPage />;
  return (
    <div className="category-manager container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            <FolderOpen size={30} /> Quản lý danh mục
          </h2>
          <p className="page-subtitle">Theo dõi và quản lý tất cả danh mục</p>
        </div>

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
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          navigate(`/admin/categories/edit/${c._id}`)
                        }
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
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
