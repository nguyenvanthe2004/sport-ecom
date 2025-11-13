import React, { useEffect, useState } from "react";
import "../../styles/CartPage.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, updateCartQuantity,clearCart } from "../../redux/slices/cartSlice";
import LoadingPage from "../../components/LoadingPage";
import { useNavigate } from "react-router-dom";
import { setCheckoutItems } from "../../redux/slices/cartSlice";
import { showToast } from "../../../libs/utils";
import { BASE_URL } from "../../constants";


const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const isLoggedIn = currentUser.role === "user";
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadCart = async () => {
      dispatch(fetchCart());
      setLoading(false);
    };
    loadCart();
  }, [dispatch]);

  const totalPages = Math.ceil(cart.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = cart.slice(startIndex, startIndex + itemsPerPage);

  const updateQuantity = async (variantId, amount) => {
    const item = cart.find((i) => i._id === variantId);
    if (!item) return;
    const newQuantity = Math.max(item.quantity + amount, 1);

    try {
      dispatch(updateCartQuantity(variantId, newQuantity));
      showToast("Đã cập nhật giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật số lượng:", error);
    }
  };

const removeItem = async (id) => {
    try {
      dispatch(removeFromCart(id));
      showToast("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa sản phẩm:", error);
    }
  };
  const handleClearCart = async () => {
    try {
      dispatch(clearCart());
      showToast("Đã làm trống giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa toàn bộ giỏ hàng:", error);
    }
  };

  const totalPrice = cart.reduce(
    (sum, i) => sum + (i.variantId?.price || 0) * (i.quantity || 1),
    0
  );

  const handleClick = () => (navigate("/home"));
  const handleCheckout = () => {
    if (isLoggedIn) {
      dispatch(setCheckoutItems(cart));
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  if (loading)
    return (
      <>
        <LoadingPage />
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
                {paginatedItems.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <div className="item-img">
                      <img
                        src={`${BASE_URL}${item.variantId?.image}`}
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
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      «
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      »
                    </button>
                  </div>
                )}
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
                <button className="checkout-btn" onClick={handleCheckout}>Thanh toán</button>
                <button className="clear-btn" onClick={handleClearCart}>
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
