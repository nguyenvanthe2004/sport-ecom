import React, { useEffect, useState } from "react";
import {
  Edit2,
  LogOut,
  Heart,
  Package,
  MapPin,
  User,
  Lock,
  ShoppingBag,
  TrendingUp,
  Award,
  Settings,
  ChevronRight,
  Star,
} from "lucide-react";
import "../../styles/Profile.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { changePassword, editUser, OrderAPI } from "../../services/api";
import LoadingPage from "../../components/LoadingPage";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showToast } from "../../../libs/utils";
import { FRONTEND_URL } from "../../constants";

function Price({ v }) {
  return <span className="price-text">{v.toLocaleString("vi-VN")}₫</span>;
}

export default function ProfilePage() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [user, setUser] = useState({
    name: currentUser?.fullname || "Nguyễn Văn A",
    email: currentUser?.email,
  });
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: user.fullname,
    email: user.email,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await OrderAPI.getMyOrders();
        setOrders(res.orders || res);
      } catch (err) {
        console.error("❌ Lỗi khi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );
  const deliveredOrders = orders
    .filter((order) => order.status === "delivered")
    .slice(-3)
    .reverse();

  const saveProfile = async () => {
    try {
      await editUser(profileForm.email, profileForm.name);
      setUser((s) => ({
        ...s,
        name: profileForm.name,
        email: profileForm.email,
      }));
      setEditing(false);
      showToast("Cập nhật thông tin thành công!");
    } catch (error) {
      showErrorToast("Lỗi khi cập nhật thông tin: " + error.message);
    }
  };

  const avatarInitials = (name) => {
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getLoyaltyColor = (tier) => {
    const colors = {
      Gold: "loyalty-gold",
      Silver: "loyalty-silver",
      Platinum: "loyalty-platinum",
      Bronze: "loyalty-bronze",
    };
    return colors[tier] || "loyalty-bronze";
  };
  const handleLogout = () => {
    navigate("/login");
  };
  const handleOrders = () => {
    navigate("/orders");
  };
  const getShippingAddressList = (orders) => {
    if (!orders || orders.length === 0) return [];
    const addresses = orders
      .map((order) => order.shippingAddress)
      .filter((addr) => typeof addr === "string" && addr.trim() !== "");

    return [...new Set(addresses)];
  };
  const handleChangePassword = async () => {
    if (!newPassword.old || !newPassword.new || !newPassword.confirm) {
      showErrorToast("Vui lòng nhập đầy đủ các trường mật khẩu!");
      return;
    }

    if (newPassword.new !== newPassword.confirm) {
      showErrorToast("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await changePassword(newPassword.old, newPassword.new);
      showToast("Đổi mật khẩu thành công!");
      setNewPassword({ old: "", new: "", confirm: "" });
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      showErrorToast("Đổi mật khẩu thất bại!");
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <>
      <div className="profile-container">
        <Header />
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="avatar-wrapper">
              <div className="avatar">
                {user.avatar ? (
                  <img
                    src={`${FRONTEND_URL}avatar.avif`}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  avatarInitials(user.name)
                )}
              </div>
              <div
                className={`loyalty-badge ${getLoyaltyColor(user.loyaltyTier)}`}
              >
                <Award size={14} />
                {user.loyaltyTier}
              </div>
            </div>

            <div className="user-info">
              <h1>{user.name}</h1>
              <div className="user-meta">
                <div className="user-meta-item">
                  <User size={16} />
                  {user.email}
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                onClick={() => setEditing(true)}
                className="btn btn-white"
              >
                <Edit2 size={18} />
                Chỉnh sửa
              </button>
              <button onClick={handleLogout} className="btn btn-danger">
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">
              <Package size={24} />
            </div>
            <div className="stat-label">Tổng đơn hàng</div>
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-trend">
              <TrendingUp size={14} />
              +3 tháng này
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-pink">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-label">Tổng chi tiêu</div>
            <div className="stat-value">
              <Price v={totalSpent} />
            </div>
            <div className="stat-trend">
              <TrendingUp size={14} />
              +12% so với tháng trước
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="card full-width" style={{ marginBottom: "24px" }}>
          <div className="card-header">
            <div className="card-title">
              <Package size={24} />
              Đơn hàng hoàn thành
            </div>
            <div className="card-action" onClick={handleOrders}>
              Xem đơn hàng
              <ChevronRight size={16} />
            </div>
          </div>

          <table className="order-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {deliveredOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order._id}</td>
                  <td>
                    {new Date(order.createAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>{order.orderItems?.length || 0} sản phẩm</td>
                  <td>{order.totalPrice?.toLocaleString("vi-VN")}₫</td>
                  <td>
                    <span
                      className={`status-badge ${order.status === "delivered"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-view">Xem</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Addresses & Wishlist */}
        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <MapPin size={24} />
                Địa chỉ đặt hàng
              </div>
            </div>

            <div className="address-list">
              {getShippingAddressList(orders).map((address, index) => (
                <div
                  key={index}
                  className={`address-card ${index === 0 ? "default" : ""}`}
                >
                  <div className="address-label">
                    Địa chỉ {index + 1}
                    {index === 0 && (
                      <span className="default-badge">Mặc định</span>
                    )}
                  </div>

                  <div className="address-text">{address}</div>

                  <div className="address-meta">
                    {currentUser?.name || "Người dùng"} •{" "}
                    {currentUser?.fullName}
                  </div>

                  <div className="address-actions">
                    <button className="btn-sm">Chỉnh sửa</button>
                    <button className="btn-sm">Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card full-width" style={{ marginTop: "24px" }}>
          <div className="card-header">
            <div className="card-title">
              <Lock size={24} />
              Bảo mật & Cài đặt
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            <div className="address-card">
              <div className="address-label">Đổi mật khẩu</div>
              <div className="address-meta">Thay đổi lần cuối: 03/01/2025</div>
              <div className="address-actions">
                <button
                  className="btn-sm"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Cập nhật thông tin</h2>

            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                className="form-input"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((s) => ({ ...s, name: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((s) => ({ ...s, email: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                className="form-input"
                type="tel"
                value={profileForm.phone || ""}
                onChange={(e) =>
                  setProfileForm((s) => ({ ...s, phone: e.target.value }))
                }
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditing(false)}>
                Hủy
              </button>
              <button className="btn-primary" onClick={saveProfile}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 🔒 MODAL ĐỔI MẬT KHẨU --- */}
      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Đổi mật khẩu</h2>

            <div className="form-group">
              <label className="form-label">Mật khẩu hiện tại</label>
              <input
                type="password"
                className="form-input"
                value={newPassword.old}
                onChange={(e) =>
                  setNewPassword((s) => ({ ...s, old: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                className="form-input"
                value={newPassword.new}
                onChange={(e) =>
                  setNewPassword((s) => ({ ...s, new: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                className="form-input"
                value={newPassword.confirm}
                onChange={(e) =>
                  setNewPassword((s) => ({ ...s, confirm: e.target.value }))
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Hủy
              </button>
              <button className="btn-primary" onClick={handleChangePassword}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
