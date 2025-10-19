import React, { useEffect, useState } from "react";
import "../../styles/CartPage.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CartAPI } from "../../services/api";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn =
    document.cookie.includes("token") || localStorage.getItem("user");

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await CartAPI.getMyCart();
      setCart(data?.cartItems || []);
    } catch (error) {
      console.error("❌ Lỗi khi tải giỏ hàng:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  const updateQuantity = async (variantId, amount) => {
    const item = cart.find((i) => i._id === variantId);
    if (!item) return;

    const newQuantity = Math.max(item.quantity + amount, 1);

    try {
      await CartAPI.updateCartItem(variantId, { quantity: newQuantity });
      await fetchCart();

      showToast("Đã cập nhật giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật số lượng:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await CartAPI.removeCartItem(id);
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      console.error("Lỗi xoá sản phẩm:", error);
    }
  };

  const clearCart = async () => {
    try {
      await CartAPI.clearCart();
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Đã làm trống giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa toàn bộ giỏ hàng:", error);
    }
  };

  const totalPrice = cart.reduce(
    (sum, i) => sum + (i.variantId?.price || 0) * (i.quantity || 1),
    0
  );

  const handleClick = () => (window.location.href = "/home");

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

  if (loading)
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải giỏ hàng...</p>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Giỏ hàng</h1>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Giỏ hàng của bạn đang trống</p>
              <button className="continue-shopping" onClick={handleClick}>
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <div className="item-img">
                      <img
                        src={`http://localhost:8000${item.variantId?.image}`}
                        alt={item.variantId?.productId?.name}
                      />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">
                        {item.variantId?.productId?.name} -{" "}
                        {item.variantId?.nameDetail}
                      </h3>
                      <p className="item-price">
                        {item.variantId?.price?.toLocaleString("vi-VN")}₫
                      </p>
                      <button
                        className="item-remove"
                        onClick={() => removeItem(item._id)}
                      >
                        Xóa
                      </button>
                    </div>
                    <div className="item-quantity">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, -1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      <p className="total-price">
                        {(
                          (item.variantId?.price || 0) * (item.quantity || 0)
                        ).toLocaleString("vi-VN")}
                        ₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2 className="summary-title">Tóm tắt đơn hàng</h2>
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row summary-total">
                  <span>Tổng cộng</span>
                  <span className="total-amount">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <button className="checkout-btn">Thanh toán</button>
                <button className="clear-btn" onClick={clearCart}>
                  Xóa toàn bộ
                </button>
                <button className="continue-btn" onClick={handleClick}>
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
