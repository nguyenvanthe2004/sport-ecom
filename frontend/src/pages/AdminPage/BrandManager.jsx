import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandAPI } from "../../services/api"; // API Brand
import "../../styles/CategoryManager.css"; 
import { showToast } from "../../../libs/utils";
import LoadingPage from "../../components/LoadingPage";
import { BadgePercent } from "lucide-react";

const BrandManager = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Lấy danh sách brand
  const fetchBrands = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await BrandAPI.getAll();
      setBrands(data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Xóa brand
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này không?")) return;

    try {
      await BrandAPI.delete(id);
      showToast("Đã xóa thương hiệu!");
      setBrands(brands.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.message || "Xóa thương hiệu thất bại");
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="category-manager container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            <BadgePercent size={30} /> Quản lý thương hiệu
          </h2>
          <p className="page-subtitle">Theo dõi và quản lý tất cả thương hiệu</p>
        </div>

        <Link to="/admin/brands/create" className="btn btn-primary">
          + Thêm thương hiệu
        </Link>
      </div>

      {error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table table-bordered table-striped align-middle">
          <thead className="table">
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Tên thương hiệu</th>
              <th>Mô tả</th>
              <th style={{ width: "150px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((b, index) => (
                <tr key={b._id}>
                  <td>{index + 1}</td>
                  <td>{b.name}</td>
                  <td>{b.description}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/admin/brands/edit/${b._id}`)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(b._id)}
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
                  Không có thương hiệu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BrandManager;
