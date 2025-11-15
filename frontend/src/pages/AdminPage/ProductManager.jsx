import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductAPI } from "../../services/api";
import "../../styles/ProductManager.css";
import { showErrorToast, showToast } from "../../../libs/utils";
import LoadingPage from "../../components/LoadingPage";
import { Package } from "lucide-react";
import { BASE_URL } from "../../constants";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  // 🔹 Lấy danh sách sản phẩm từ API
  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      const res = await ProductAPI.getAll(page, limit);
      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách sản phẩm:", err);
      showErrorToast("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // 🔹 Xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      try {
        await ProductAPI.delete(id);
        showToast("Đã xóa sản phẩm!");
        // Reload dữ liệu trang hiện tại
        fetchProducts(page);
      } catch (err) {
        console.error("❌ Lỗi xóa sản phẩm:", err);
        showErrorToast("Không thể xóa sản phẩm!");
      }
    }
  };

  // 🔹 Toggle hiện/ẩn variants
  const toggleVariants = (productId) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            <Package size={32} /> Quản lý sản phẩm
          </h2>
          <p className="page-subtitle">Theo dõi và quản lý tất cả sản phẩm</p>
        </div>

        <Link to="/admin/products/create" className="btn btn-primary">
          + Thêm sản phẩm
        </Link>
      </div>

      {/* Bảng sản phẩm */}
      <div className="table-responsive shadow-sm rounded bg-white">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Slug</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Mô tả</th>
              <th>Biến thể</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p, index) => (
                <React.Fragment key={p._id}>
                  <tr>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>
                      {p.variants?.[0]?.image ? (
                        <img
                          src={`${BASE_URL}${p.variants[0].image}`}
                          alt={p.name}
                          width="55"
                          height="55"
                          className="rounded"
                        />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.slug}</td>
                    <td>{p.brandId?.name || "—"}</td>
                    <td>{p.categoryId?.name || "—"}</td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {p.description || "—"}
                    </td>
                    <td>{p.variants?.length || 0}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            navigate(`/admin/products/edit/${p._id}`)
                          }
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => toggleVariants(p._id)}
                        >
                          {expandedProductId === p._id
                            ? "Ẩn biến thể"
                            : "Xem biến thể"}
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(p._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Hiện danh sách biến thể */}
                  {expandedProductId === p._id && (
                    <tr>
                      <td colSpan="9">
                        {p.variants && p.variants.length > 0 ? (
                          <div className="p-3 bg-light rounded border">
                            <h6 className="fw-semibold mb-3">
                              Biến thể của {p.name}
                            </h6>
                            <div className="row">
                              {p.variants.map((v, i) => (
                                <div
                                  key={i}
                                  className="col-md-3 col-sm-6 mb-3 text-center"
                                >
                                  <div className="card border-0 shadow-sm">
                                    <img
                                      src={`${BASE_URL}${v.image}`}
                                      alt={v.nameDetail || "variant"}
                                      className="card-img-top rounded-top"
                                      height="120"
                                    />
                                    <div className="card-body p-2">
                                      <p className="mb-1 fw-semibold">
                                        {v.nameDetail || "—"}
                                      </p>
                                      <p className="mb-1 text-muted small">
                                        Giá: {v.price?.toLocaleString("vi-VN")}đ
                                      </p>
                                      <p className="mb-0 text-muted small">
                                        Tồn kho: {v.stock}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted text-center p-3">
                            Không có biến thể nào
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-muted">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="pagination mt-3 text-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
