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
import { useNavigate } from "react-router-dom";

const provinces = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "TP. Hồ Chí Minh" },
  { id: 3, name: "Đà Nẵng" },
  { id: 4, name: "Cần Thơ" },
  { id: 5, name: "Hải Phòng" },
];

const districts = {
  1: ["Ba Đình", "Cầu Giấy", "Hoàn Kiếm", "Thanh Xuân"],
  2: ["Quận 1", "Quận 3", "Bình Thạnh", "Tân Bình"],
  3: ["Hải Châu", "Thanh Khê", "Sơn Trà"],
  4: ["Ninh Kiều", "Bình Thủy"],
  5: ["Hồng Bàng", "Ngô Quyền", "Lê Chân"],
};

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán khi nhận hàng"
  );
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();
  const checkoutItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await CartAPI.getMyCart();
        setCartItems(data.items || []);
      } catch (error) {
        console.error("❌ Lỗi khi lấy giỏ hàng:", error);
      }
    };
    fetchCart();
  }, []);

  const totalPrice = checkoutItems.reduce(
    (sum, item) => sum + (item.variantId?.price || 0) * (item.quantity || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!province || !district || !address) {
      alert("Vui lòng nhập đầy đủ địa chỉ nhận hàng!");
      return;
    }

    if (checkoutItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    const shippingAddress = {
      province: provinces.find((p) => p.id === Number(province))?.name,
      district,
      ward,
      address,
    };

    const orderItems = checkoutItems.map((item) => ({
      variantId: item.variantId?._id || item.variantId,
      quantity: item.quantity,
    }));

    const orderData = {
      orderItems,
      shippingAddress: JSON.stringify({
        province: provinces.find((p) => p.id === Number(province))?.name,
        district,
        ward,
        address,
      }),
      paymentMethod,
    };

    try {
      setLoading(true);
      const response = await OrderAPI.create(orderData);
      console.log("📤 Dữ liệu gửi đi:", orderData);
      console.log("✅ Phản hồi từ server:", response);
      alert("Đặt hàng thành công!");
      await CartAPI.clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("❌ Lỗi khi tạo đơn hàng:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
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
                {/* Thông tin khách hàng */}
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

                {/* Địa chỉ giao hàng */}
                <div className="address-section">
                  <h2 className="section-title">
                    <MapPin size={20} />
                    Địa chỉ giao hàng
                  </h2>
                  <div className="form-grid">
                    <select
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                        setDistrict("");
                      }}
                      required
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      disabled={!province}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {province &&
                        districts[province]?.map((d, i) => (
                          <option key={i} value={d}>
                            {d}
                          </option>
                        ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Phường/Xã"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      required
                      className="full-width"
                    />

                    <input
                      type="text"
                      placeholder="Số nhà, tên đường..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="full-width"
                    />
                  </div>
                </div>

                {/* Phương thức thanh toán */}
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

              {checkoutItems.length === 0 ? (
                <div className="empty-cart">
                  <Package size={48} />
                  <p>Không có sản phẩm nào</p>
                </div>
              ) : (
                <>
                  <div className="checkout-list">
                    {checkoutItems.map((item) => (
                      <div key={item._id} className="checkout-item">
                        <div className="checkout-image">
                          <img
                            src={`http://localhost:8000${item.variantId?.image}`}
                            alt={item.variantId?.productId?.name}
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
