import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  QrCode,
  Truck,
  MapPin,
  Package,
  User,
  Mail,
  Phone,
} from "lucide-react";
import "../../styles/Checkout.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { OrderAPI, CartAPI } from "../../services/api";
import LoadingPage from "../../components/LoadingPage";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán khi nhận hàng"
  );
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (location.state?.buyNowItem) {
          setCartItems([location.state.buyNowItem]);
        } else if (checkoutItems?.length > 0) {
          setCartItems(checkoutItems);
        } else {
          const data = await CartAPI.getMyCart();
          setCartItems(data.items || []);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy giỏ hàng:", error);
      }
    };

    fetchCart();
  }, [location.state, checkoutItems]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.variantId?.price || 0) * (item.quantity || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ nhận hàng!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      variantId: item.variantId?._id || item.variantId,
      quantity: item.quantity,
    }));

    const orderData = {
      orderItems,
      shippingAddress: address,
      paymentMethod,
    };

    try {
      setLoading(true);
      const response = await OrderAPI.create(orderData);
      showToast("Bạn đã đặt hàng thành công!");
      await CartAPI.clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("❌ Lỗi khi tạo đơn hàng:", error);
      showToast("Lỗi khi đặt hàng!");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `
      <div class="toast-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
<span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  if (loading) return <LoadingPage />;

  return (
    <>
      <Header />
      <div className="checkout-page">
        <div className="checkout-container">
          <h1 className="checkout-title">Thanh Toán</h1>

          <div className="checkout-content">
            {/* Cột trái - Form thông tin */}
            <div className="checkout-form-section">
              <form onSubmit={handleSubmit}>
                <div className="info-section">
                  <h2 className="section-title">
                    <User size={20} />
                    Thông tin khách hàng
                  </h2>
                  <div className="form-grid">
                    <div className="input-wrapper">
                      <User size={16} className="input-icon" />
                      <input
                        type="text"
                        placeholder="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-wrapper">
                      <Phone size={16} className="input-icon" />
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-wrapper full-width">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="address-section">
                  <h2 className="section-title">
                    <MapPin size={20} />
                    Địa chỉ giao hàng
                  </h2>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Nhập địa chỉ nhận hàng (VD: 123 Nguyễn Huệ, Quận 1, TP. HCM)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="full-width"
                    />
                  </div>
                </div>
                <div className="payment-section">
                  <h2 className="section-title">Phương thức thanh toán</h2>
                  <div className="payment-options">
                    <div
                      className={`payment-option ${
                        paymentMethod === "Thanh toán khi nhận hàng"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setPaymentMethod("Thanh toán khi nhận hàng")
                      }
                    >
                      <Truck className="payment-icon" />
                      <div className="payment-text">
                        <p className="payment-title">
                          Thanh toán khi nhận hàng
                        </p>
                        <p className="payment-desc">
                          Thanh toán bằng tiền mặt khi nhận hàng (COD)
                        </p>
                      </div>
                    </div>

                    <div
                      className={`payment-option ${
                        paymentMethod === "QR Code" ? "active" : ""
                      }`}
                      onClick={() => setPaymentMethod("QR Code")}
                    >
                      <QrCode className="payment-icon" />
                      <div className="payment-text">
                        <p className="payment-title">Thanh toán bằng QR Code</p>
                        <p className="payment-desc">
                          Quét mã QR để thanh toán ngay
                        </p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === "QR Code" && (
                    <div className="qr-section">
                      <p className="qr-title">Quét mã để thanh toán</p>
                      <img
                        src="/public/qr_code.png"
                        alt="QR Code"
                        className="qr-image"
                      />
                      <p className="qr-note">
                        Vui lòng thanh toán và giữ lại biên lai
                      </p>
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  <CheckCircle size={20} />
                  {loading ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
                </button>
              </form>
            </div>

            {/* Cột phải - Tóm tắt đơn hàng */}
            <div className="order-summary">
              <h2 className="summary-title">
                <Package size={20} />
                Đơn hàng của bạn
              </h2>

              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <Package size={48} />
                  <p>Không có sản phẩm nào</p>
                </div>
              ) : (
                <>
                  <div className="checkout-list">
                    {cartItems.map((item) => (
                      <div
                        key={item._id || item.variantId?._id}
                        className="checkout-item"
                      >
                        <div className="checkout-image">
                          <img
                            src={`http://localhost:8000${item.variantId?.image}`}
                            alt={item.variantId?.productId?.name || "Sản phẩm"}
                          />
                        </div>
                        <div className="checkout-details">
                          <p className="checkout-name">
                            {item.variantId?.productId?.name}
                          </p>
                          <p className="checkout-quantity">
                            Số lượng: {item.quantity}
                          </p>
                          <p className="checkout-price">
                            {(
                              item.variantId?.price * item.quantity
                            ).toLocaleString("vi-VN")}
                            ₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="summary-divider"></div>

                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Tạm tính</span>
                      <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="price-row">
                      <span>Phí vận chuyển</span>
                      <span>Miễn phí</span>
                    </div>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="total-price">
                    <span>Tổng cộng</span>
                    <span className="total-amount">
                      {totalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
