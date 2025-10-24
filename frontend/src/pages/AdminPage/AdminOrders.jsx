// AdminOrders.jsx
import React, { useState, useEffect } from "react";
import "../../styles/AdminOrders.css";
import { Eye, Trash2, Edit, Package, Search, Filter, X, Check, Clock, Truck, XCircle, CheckCircle } from "lucide-react";

const AdminOrders = () => {
  const fakeOrders = [
    {
      _id: "ORD001",
      userId: { fullname: "Nguyễn Văn A" },
      shippingAddress: "123 Nguyễn Trãi, Hà Nội",
      totalPrice: 1500000,
      status: "pending",
      paymentStatus: "paid",
      createAt: "2025-10-10T10:00:00Z",
      orderItems: [
        { _id: "ITEM001", variantId: { nameDetail: "Áo Polo trắng", price: 500000 }, quantity: 2 },
        { _id: "ITEM002", variantId: { nameDetail: "Quần Jean xanh", price: 500000 }, quantity: 1 },
      ],
    },
    {
      _id: "ORD002",
      userId: { fullname: "Trần Thị B" },
      shippingAddress: "456 Lê Lợi, TP.HCM",
      totalPrice: 820000,
      status: "shipped",
      paymentStatus: "unpaid",
      createAt: "2025-10-09T15:30:00Z",
      orderItems: [
        { _id: "ITEM003", variantId: { nameDetail: "Váy hoa xanh", price: 410000 }, quantity: 2 },
      ],
    },
    {
      _id: "ORD003",
      userId: { fullname: "Lê Văn C" },
      shippingAddress: "789 Trần Hưng Đạo, Đà Nẵng",
      totalPrice: 2100000,
      status: "delivered",
      paymentStatus: "paid",
      createAt: "2025-10-08T09:15:00Z",
      orderItems: [
        { _id: "ITEM004", variantId: { nameDetail: "Áo khoác da", price: 1500000 }, quantity: 1 },
        { _id: "ITEM005", variantId: { nameDetail: "Giày thể thao", price: 600000 }, quantity: 1 },
      ],
    },
  ];

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOrders(fakeOrders);
    }, 500);
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending": return <Clock size={16} />;
      case "shipped": return <Truck size={16} />;
      case "delivered": return <CheckCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy"
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId.fullname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleView = (order) => {
    setSelectedOrder(order);
    setEditMode(false);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setEditMode(true);
  };

  const handleUpdate = () => {
    setOrders(prev =>
      prev.map(o =>
        o._id === selectedOrder._id ? { ...o, status: status } : o
      )
    );
    setEditMode(false);
    setSelectedOrder(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;
    setOrders(prev => prev.filter(o => o._id !== id));
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            <Package size={32} />
            Quản lý đơn hàng
          </h1>
          <p className="page-subtitle">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {[
            { key: "all", label: "Tất cả", color: "blue" },
            { key: "pending", label: "Chờ xử lý", color: "yellow" },
            { key: "shipped", label: "Đang giao", color: "purple" },
            { key: "delivered", label: "Đã giao", color: "green" },
            { key: "cancelled", label: "Đã hủy", color: "red" },
          ].map(stat => (
            <div 
              key={stat.key}
              onClick={() => setFilterStatus(stat.key)}
              className={`stat-card ${filterStatus === stat.key ? 'active' : ''}`}
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

        {/* Search & Filter Bar */}
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
              <Filter size={20} />
              Bộ lọc
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
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <span className="order-id">{order._id}</span>
                      </td>
                      <td>
                        <span className="customer-name">{order.userId.fullname}</span>
                      </td>
                      <td>
                        <span className="address">{order.shippingAddress}</span>
                      </td>
                      <td>
                        <span className="total-price">
                          {order.totalPrice.toLocaleString("vi-VN")}₫
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${order.status}`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td>
                        <span className={`payment-badge payment-${order.paymentStatus}`}>
                          {order.paymentStatus === "paid" ? <Check size={14} /> : <X size={14} />}
                          {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </td>
                      <td className="date-cell">
                        {new Date(order.createAt).toLocaleDateString("vi-VN")}
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

        {/* View Modal */}
        {selectedOrder && !editMode && (
          <div className="modal-overlay">
            <div className="modal-dialog modal-view">
              <div className="modal-header">
                <h3>Chi tiết đơn hàng</h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-details-grid">
                  <div className="detail-section">
                    <div className="detail-item">
                      <p className="detail-label">Mã đơn hàng</p>
                      <p className="detail-value">{selectedOrder._id}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Khách hàng</p>
                      <p className="detail-value">{selectedOrder.userId.fullname}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Địa chỉ giao hàng</p>
                      <p className="detail-value">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <div className="detail-item">
                      <p className="detail-label">Trạng thái đơn hàng</p>
                      <span className={`status-badge status-${selectedOrder.status}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Thanh toán</p>
                      <span className={`payment-badge payment-${selectedOrder.paymentStatus}`}>
                        {selectedOrder.paymentStatus === "paid" ? <Check size={14} /> : <X size={14} />}
                        {selectedOrder.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Tổng tiền</p>
                      <p className="total-price-large">
                        {selectedOrder.totalPrice.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-items-section">
                  <h4>Sản phẩm đã đặt</h4>
                  <div className="order-items-list">
                    {selectedOrder.orderItems.map(item => (
                      <div key={item._id} className="order-item">
                        <div className="item-info">
                          <p className="item-name">{item.variantId.nameDetail}</p>
                          <p className="item-quantity">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          <p className="price-label">Đơn giá</p>
                          <p className="price-value">
                            {item.variantId.price.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-primary"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editMode && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-dialog modal-edit">
              <div className="modal-header">
                <h3>Cập nhật trạng thái</h3>
              </div>
              
              <div className="modal-body">
                <label className="form-label">
                  Chọn trạng thái mới
                </label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setEditMode(false)}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleUpdate}
                  className="btn btn-primary"
                >
                  Xác nhận
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