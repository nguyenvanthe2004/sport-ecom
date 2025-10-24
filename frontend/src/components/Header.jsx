import React, { useState, useEffect, useRef } from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../redux/slices/cartSlice";
import { clearCurrentUser } from "../redux/slices/currentUser";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const cart = useSelector((state) => state.cart.items);

  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowCartDropdown(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCartClick = () => setShowCartDropdown(!showCartDropdown);
  const handleRemoveItem = (id) => dispatch(removeFromCart(id));
  const handleViewCart = () => {
    setShowCartDropdown(false);
    navigate("/cart");
  };

  const handleUserClick = () => {
    if (currentUser) setShowUserDropdown(!showUserDropdown);
    else navigate("/login");
  };

  const handleLogout = () => {
    dispatch(clearCurrentUser());
    setShowUserDropdown(false);
    navigate("/login");
  };

  const handleMyOrders = () => {
    setShowUserDropdown(false);
    navigate("/orders");
  };

  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const totalPrice = cart.reduce(
    (sum, i) => sum + (i.variantId?.price || 0) * (i.quantity || 0),
    0
  );

  return (
    <header className="header">
      <a href="/home" className="logo">
        <div className="logo-container">
          <div className="logo-page">
            <img src="/public/logo.jpg" alt="Logo" />
          </div>
        </div>
      </a>

      <div className="search-bars">
        <input type="text" placeholder="Tìm kiếm sản phẩm, danh mục..." />
        <i className="fa fa-search search-icons"></i>
      </div>

      <div className="header-right">
        <div className="consult">
          <i className="fa fa-headset"></i>
          <div className="consult-text">
            <span>Tư vấn mua hàng</span>
            <b>0387.873.303</b>
          </div>
        </div>

        {/* Nhóm icon cửa hàng + giỏ hàng */}
        <div className="icon-group">
          <div className="icon" onClick={() => navigate("/products")}>
            <i className="fa fa-store"></i>
          </div>

          <div className="icon cart-icon-wrapper" ref={dropdownRef}>
            <div onClick={handleCartClick} style={{ cursor: "pointer" }}>
              <i className="fa fa-shopping-bag"></i>
              {totalItems > 0 && <span className="badges">{totalItems}</span>}
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
                                {item.variantId?.price?.toLocaleString("vi-VN")}₫
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
                            <button
                              className="remove-item-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(item._id);
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

        {/* Icon người dùng — nằm ngoài cùng bên phải */}
        <div className="user-menu" ref={userMenuRef}>
          <div className="user-icon" onClick={handleUserClick}>
            <i className="fa fa-user"></i>
          </div>
          <span className="username">
            {currentUser ? currentUser.fullname : "Đăng nhập"}
          </span>

          {showUserDropdown && currentUser && (
            <div className="user-dropdown">
              <button onClick={handleMyOrders}>Đơn hàng của tôi</button>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
