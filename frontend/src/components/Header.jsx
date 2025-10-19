import React, { useState, useEffect, useRef } from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CartAPI } from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cart, setCart] = useState([]);
  const dropdownRef = useRef(null);

  const fetchCart = async () => {
    try {
      const data = await CartAPI.getMyCart();
      setCart(data?.cartItems || []);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
    };

    if (showCartDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCartDropdown]);

  const removeItem = async (id) => {
    try {
      await CartAPI.removeCartItem(id);
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi xoá sản phẩm:", error);
    }
  };

  const handleSubmit = () => navigate("/login");
  const handleClick = () => navigate("/products");
  const handleCartClick = () => {
    fetchCart();
    setShowCartDropdown(!showCartDropdown);
  };
  const handleViewCart = () => {
    setShowCartDropdown(false);
    navigate("/cart");
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.variantId?.price || 0) * (item.quantity || 0),
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <header className="header">
      <a href="/home" className="logo">
        <div className="logo-container">
          <div className="logo-page">
            <img src="/public/logo.jpg" alt="Logo" />
          </div>
        </div>
      </a>

      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm sản phẩm, danh mục..." />
        <i className="fa fa-search search-icon"></i>
      </div>

      <div className="header-right">
        <div className="consult">
          <i className="fa fa-headset"></i>
          <div className="consult-text">
            <span>Tư vấn mua hàng</span>
            <b>0387.873.303</b>
          </div>
        </div>

        <div className="icons">
          <div className="user-info"><div className="user-icon" onClick={handleSubmit}>
              <i className="fa fa-user"></i>
            </div>
            <span className="username">
              {currentUser ? currentUser.fullname : "Đăng nhập"}
            </span>
          </div>

          <div className="icon-group">
            <div className="icon" onClick={handleClick}>
              <i className="fa fa-store"></i>
            </div>

            <div className="icon cart-icon-wrapper" ref={dropdownRef}>
              <div onClick={handleCartClick} style={{ cursor: "pointer" }}>
                <i className="fa fa-shopping-bag"></i>
                {totalItems > 0 && <span className="badge">{totalItems}</span>}
              </div>

              {showCartDropdown && (
                <div className="cart-dropdown">
                  <div className="cart-dropdown-header">
                    <h3>Giỏ hàng của bạn</h3>
                    <span className="cart-count">{totalItems} sản phẩm</span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="cart-empty">
                      <i className="fa fa-shopping-bag empty-icon"></i>
                      <p>Giỏ hàng trống</p>
                    </div>
                  ) : (
                    <>
                      <div className="cart-dropdown-items">
                        {cart.map((item) => (
                          <div key={item._id} className="cart-dropdown-item">
                            <img
                              src={`http://localhost:8000${item.variantId?.image}`}
                              alt={item.variantId?.productId?.name}
                            />
                            <div className="item-info">
                              <p className="item-name">
                                {item.variantId?.productId?.name} -{" "}
                                {item.variantId?.nameDetail}
                              </p>
                              <div className="item-price-qty">
                                <span className="qty">{item.quantity} x</span>
                                <span className="price">
                                  {item.variantId?.price?.toLocaleString(
                                    "vi-VN"
                                  )}
                                  ₫
                                </span>
                              </div>
                            </div>
                            <div className="item-actions">
                              <div className="item-subtotal">
                                {(
                                  (item.variantId?.price || 0) *
                                  (item.quantity || 0)
                                ).toLocaleString("vi-VN")}
                                ₫
                              </div>
                              <button className="remove-item-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item._id);
                                }}
                                title="Xóa sản phẩm"
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="cart-dropdown-footer">
                        <div className="total-row">
                          <span>Tổng cộng:</span>
                          <span className="total-price">
                            {totalPrice.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                        <button
                          className="view-cart-btn"
                          onClick={handleViewCart}
                        >
                          Xem giỏ hàng
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;