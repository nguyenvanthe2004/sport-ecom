import React, { useState, useEffect } from "react";
import "../../styles/AdminOrders.css";
import {
  Eye,
  Trash2,
  Edit,
  Package,
  Search,
  Filter,
  X,
  Check,
  Clock,
  Truck,
  XCircle,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import { OrderAPI } from "../../services/api";
import LoadingPage from "../../components/LoadingPage";
import { showToast } from "../../../libs/utils";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "delivered":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  // ✅ Lọc đơn hàng theo tìm kiếm + trạng thái
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ✅ Xem chi tiết
  const handleView = (order) => {
    setSelectedOrder(order);
    setEditMode(false);
  };

  // ✅ Bật chế độ sửa
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setPaymentStatus(order.paymentStatus);
    setEditMode(true);
  };

  // ✅ Gọi API cập nhật trạng thái
  const handleUpdate = async () => {
    try {
      await OrderAPI.updateStatus(selectedOrder._id, { status, paymentStatus });
      showToast("Bạn đã cập nhật thành công!");
      setEditMode(false);
      setSelectedOrder(null);
      const data = await OrderAPI.getAll();
      setOrders(data);
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      showToast("Cập nhật thất bại!");
    }
  };

  // ✅ Gọi API xóa đơn hàng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;
    try {
      await OrderAPI.delete(id);
      alert("🗑️ Đã xóa đơn hàng thành công!");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
    }
  };

  // ✅ Thống kê trạng thái
  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (loading) return <LoadingPage />;
  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            <ShoppingCart size={32} /> Quản lý đơn hàng
          </h1>
          <p className="page-subtitle">Theo dõi và quản lý tất cả đơn hàng</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {[
            { key: "all", label: "Tất cả", color: "blue" },
            { key: "pending", label: "Chờ xử lý", color: "yellow" },
            { key: "shipped", label: "Đang giao", color: "purple" },
            { key: "delivered", label: "Đã giao", color: "green" },
            { key: "cancelled", label: "Đã hủy", color: "red" },
          ].map((stat) => (
            <div
              key={stat.key}
              onClick={() => setFilterStatus(stat.key)}
              className={`stat-card ${
                filterStatus === stat.key ? "active" : ""
              }`}
            >
              <div className="stat-content">
                <div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{statusCounts[stat.key]}</p>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  {getStatusIcon(stat.key)}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-wrapper">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-button"
            >
              <Filter size={20} /> Bộ lọc
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <p>Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Địa chỉ</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thanh toán</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="order-id">{order._id}</span>
                      </td>
                      <td>
                        <span className="customer-name">
                          {order.userId?.fullname || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="address">{order.shippingAddress}</span>
                      </td>
                      <td>
                        <span className="total-price">
                          {order.totalPrice?.toLocaleString("vi-VN")}₫
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${order.status}`}>
                          {getStatusIcon(order.status)}{" "}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`payment-badge payment-${order.paymentStatus}`}
                        >
                          {order.paymentStatus === "paid" ? (
                            <Check size={14} />
                          ) : (
                            <X size={14} />
                          )}
                          {order.paymentStatus === "paid"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleView(order)}
                            className="action-btn view-btn"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(order)}
                            className="action-btn edit-btn"
                            title="Sửa trạng thái"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="action-btn delete-btn"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ✅ Modal chỉnh sửa */}
        {editMode && selectedOrder && (
          <div className="modal-overlay" onClick={() => setEditMode(false)}>
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click bên trong
            >
              <h3 className="modal-title">Cập nhật trạng thái đơn hàng</h3>

              <div className="form-group">
                <label className="form-label">Trạng thái đơn hàng</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trạng thái thanh toán</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="unpaid">Chưa thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="pending">Đang xử lý</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setEditMode(false)}
                >
                  Hủy
                </button>
                <button className="btn-primary" onClick={handleUpdate}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
